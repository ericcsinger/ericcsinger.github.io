---
title: 'Problem Solving: Chasing SQL&#8217;s Dump'
date: '2016-05-15T19:57:35+00:00'
status: publish
permalink: /problem-solving-chasing-sqls-dump
author: 'Eric Singer'
excerpt: ''
type: post
id: 252
category:
    - Backup
tag:
    - backup
    - commvault
    - JAMS
    - scripting
    - SQL
post_format: []
---
The Problem:
============

For years as an admin I’ve had to deal with SQL. At a former employer, our SQL environment / databases were small, and backup licensing was based on agents, not capacity. Fast forward to my current employer, we have a fairly decent sized SQL environment (60 – 70 servers), our backup’s are large , licensing is based on capacity, and we have a full time DBA crew that manage their own backup schedules, and prefer that backup’s are managed by them. What that means is dealing with a ton of dumps. Read into that as you want 🙂

When I started at my current employer, the SQL server backup architecture was kind of a mess. To being with, where were then was about 40 – 50 physical SQL servers. So when you’re picturing all of this, keep that in mind. Some of these issues don’t go hand in hand with physical design limitations, but some do.

- DAS was used for not only storage the SQL log, DB and index, but also backup’s. Sometimes if the SQL server was critical enough, we had dedicated disks for backups, but that wasn’t typical. This of course is a problem for many reasons. 
  - Performance for not only backup’s but the SQL service its self were limited often because they were sharing the same disks. So when a backup kicked off, SQL was reading from the same disks it was attempting to write to. This wasn’t as big of an issue for the few systems that had dedicated disks, but even there, sometimes they were sharing the same RAID card, which meant you’re still <span style="text-decoration: underline;">potentially</span> bottlenecking one for the other.
  - Capacity was spread across physical servers. Some systems had plenty of space and others barely had enough. Islands are never easy to manage.
  - If that SQL server went down, so did its most recent backup’s. TL backup’s were also stored here (shudders).
  - Being a dev shop meant doing environment refreshes. This meant creating and maintaining share / NTFS permissions across servers. This by its self isn’t inherently difficult if its thought out ahead of time, but it wasn’t (not my design).
  - We were migrating to a virtual environment, and that virtual environment would be potentially vMotioning from one host to another. DAS was a solution that wouldn’t work long term.
- The DBA’s managed their backup schedules so it required us all to basically estimate when the best time to pickup their DB’s. Sometimes we were too early and sometimes we could have started sooner.
- Adding to the above points if we had a failed backup over night, or a backup that ran long, it had an effect on SQL’s performance during production hours. This put us in a position of choosing between giving up on backing some data up, or having performance degradation.
- We didn’t know when they did full’s vs diffs. Which means, we might be storing thier DIFF files on what we considered “full” backup taps. By its self not an issue, except for the fact that we did monthly extended fulls. Meaning we kept the first full backup of each month for 90 days. If that file we’re keeping is a diff file, that’ doesn’t do us any good. However, you can see below, why it wasn’t as big of an issue in general.
- Finally, the the problem that I contended with besides all of these, is that because they were just keeping ALL files on disk in the same location, every time we did a full backup, we backed EVERYTHING up. Sometimes that was 2 weeks worth of data, TL’s, Diff’s and and Fulls. This meant we were storing their backup data multiple times over on both disk and tape.

I’m sure there’s more than a few of you out there with similar design issues. I’m going to lay out how I worked around some of the politics and budget limitation. I wouldn’t suggest this solution as a first choice, its really not the right way to tackle it, but it is a way that works well for us, and might for you. This solution of course isn’t limited to SQL. Really anything that uses a backup file scheme could fit right into this solution.

The solution:
=============

I spent days worth of my personal time while jogging, lifting, etc. just thinking about how to solve all these problems. Some of them were easy and some of them would be technically complex, but doable. I also spent hours with our DBA team collaborating on the rough solution I came up with, and honing it to work for both of us.

Here is basically what I came to the table with wanting to solve:

- I wanted SQL dumping to a central location, no more local SQL backups.
- The DBA’s wanted to simplify permissions for all environments to make DB refreshing easier.
- I wanted to minimize or eliminate storing their backup data twice on disk.
- I wanted them to have direct access to our agreed upon retention without needing to involve us for most historical restores. Basically giving them self service recovery.
- I wanted to eliminate backing up more data then we needed
- I wanted to know for sure when they were done backing up and knowing what type of backup they performed.

Honestly we needed the fix, as the reality was we were moving towards a virtualizing our SQL infrastructure, and presenting local disk on SAN would be both expensive, but also incredibly complex to contend with for 60+ SQL servers.

How we did it:
--------------

Like I said, some of it was an easy fix, and some of it more complex, let’s break it down.

### The easy stuff:

#### Backup performance and centralization:

We bought an affordable backup storage solution. At the time of this writing it was and still is Microsoft Windows Storage Spaces. After making that mistake, we’re now moving on to what we hope is a more reliable and mostly more simplistic Quantum QXS (DotHill) SAN using all NL-SAS disks. Point being, instead of having SQL dump to local disk, we setup a fairly high performant file server cluster. This gave us both high availability, and with the HW we implemented, very high performance as well.

##### New problem we had to solve:

Having something centralized means you also have to think about the possibility of needing to move it at some point. Given that many processes would be written around this new network share, we needed to make sure we could move data around on the backend, update some pointers and things go on without needing to make massive changes. For that, we relied on DFS-N. We had the SQL systems point at DFS shares instead of pointing at the raw share. This is going to prove valuable as we move data very soon to the new SAN.

#### Reducing multiple disk copies and providing them direct access to historical backups:

The backup storage was sized to store ALL required standard retention, and we (SysAdmins) would continue managing extended retention using our backup solution. For the most part this now means the DBA’s had access to the data they needed 99% of the time. This solved the storing the data more than once on disk problem as we would no longer store their standard retention in CommVault, but instead rely on the SQL dumps they already are storing on disk (except extended retention). They still get copied to tape and sent off site in case you thought that wasn’t covered BTW.

#### Simplifying backup share permissions:

The DBA’s wanted to simplify permissions, so we worked together and basically came up with a fairly simple folder structure. We used the basic configuration below.

- SQL backup root 
  - PRD &lt;—- DFS root / direct file share 
      - example prd SQL server 1 folder
      - example prd SQL server 2 folder
      - etc.
  - STG &lt;—– DFS root / direct file share 
      - example stg SQL server 1 folder
      - etc.
  - etc.
- Active Directory security group wise we set it up so that all prod SQL servers are part of a “prod” active directory group, all stage are part of a “stage” active directory group, etc.
- The above AD groups were then assigned at the DFS root (Stg, prd, dev, uat) with the desired permissions.

With this configuration, its now as simple as dropping a SQL service account in one group, it and will now automatically fall into the correct environment level permissions. In some cases its more permissive then it should be (prod has access to any prod server for example), but it kept things simple, and in our case, I’m not sure the extra security of per server / per environment really would have been a big win.

### The harder stuff:

The only two remaining problems we had to solve was knowing what kind of backup the DBA’s did, and making sure we were not backing up more data than we needed. These were also the two most difficult problems to solve because there wasn’t native way to do it (other than agent based backup). We had two completely disjointed systems AND processes that we were trying to make work together. It took many miles of running for me to put all the pieces together and it took a number of meetings with the DBA’s to figure things out. The good news is, both problems were solved by aspects of a single solution. The bad news is, its a fairly complex process, but so far, its been very reliable. Here’s how we did it.

####  The DONE file:

Everything in the work flow is based on the presence of a simple file, what we refer to as the “done” file internally. This file is used throughout the work flow for various things, and its the key in keeping the whole process working correctly. Basically the workflow lives and dies by the DONE file. The DONE file was also the answer to our knowing what type of backup the DBA’s ran, so we could appropriately sync out backup type with them.

The DONE file follows a very rigid naming convention. All of our scripts depend on this, and frankly naming standard are just a recommend practice (that’s for another blog post).

Our naming standard is simple:

%FourDigitYear%%2DigitMonth%%2DigitDay%\_%24Hour%%Minute%%JobName(usually the sql instance)%\_%backuptype%.done

And here are a few examples:

- Default Instance of SQL 
  - 20150302\_2008\_ms-sql-02\_inc.done
  - 20150302\_2008\_ms-sql-02\_full.done
- Stg instance of SQL 
  - 20150302\_2008\_ms-sql-02stg\_inc.done
  - 20150302\_2008\_ms-sql-02stg\_inc.done

##### The backup folder structure:

Equally as important as the done file, is our folder structure. Again because this is a repeatable process, everything must follow a standard or the whole thing fall apart.

As you know we have a root folder structure that goes something like this ” \\\\ShareRoot\\Environment\\ServerName”. Inside the servername root I create four folders and I’ll explain their use next.

- .\\Servername\\DropOff
- .\\Servername\\Queue
- .\\Servername\\Pickup
- .\\Servername\\Recovery

**Dropoff:** This is where the DBA’s dump their backups initially. The backup’s sit here and wait for our process to begin.

**Queue:** This is a folder that we use to stage / queue the backup’s before the next phase. Again I’ll explain in greater detail. But the main point of this is to allow us to keep moving data outside of the Dropoff folder to a temp location in the queue folder. You’ll understand why in a bit.

**Pickup:** This is where our tape jobs are configured to look for data.

**Recovery:** This is the permanent resting place for the data until it reaches the end of its configured retention period.

###### Stage 1: SQL side

**Prerequisites:**

1. SQL needs a process that can check the Pickup folder for a done file, delete a done file and create a done file. Our DBA’s created a stored procedure with parameters to handle this, but you can tackle it however you want, so long as it can be executed in a SQL maintenance plan.
2. For each “job” in sql that you want to run, you’ll need to configure a “full” maintenance plan to run a full backup, and if you’re using SQL diffs, create an “inc” maintenance plan. In our case, to try and keep things a little simple, we limited a “job” to a single SQL instance.

**SQL maintenance plan work flow:**

Every step in this workflow will stop on an error, there is NO continuing or ignore.

1. First thing the plan does is check for the existence of a previous DONE file. 
  1. If a DONE file exists, its deleted and an email is sent out to the DBA’s and sysadmins informing them. This is because its likely that a previous process failed to run
  2. If a DONE file does not exist, we continue to the next step.
2. Run our backup, whether its a full or inc.
3. Once complete, we then create a new done file in the root of the PickupFolder directory. This will either have a “full” or “inc” in the name depending on which maintenance plan ran.
4. We purge backup’s in the Recovery folder that are past our retention period.

SQL side is complete. That’s all the DBA’s need to do. The rest is on us. From here you can see how they were able to tell us whether or not they ran a full via the done file. You can also glean a few things about the workflow.

1. We’re checking to see if the last backup didn’t process
2. We delete the done file before we start a new backup (you’ll read why in a sec).
3. We create a new DONE file once the backup’s are done
4. We don’t purge any backup’s until we know we had a successful backup.

###### Stage 1: SysAdmin side

Our stuff is MUCH harder, so do your best to follow along and let me know if you need me to clarify anything.

1. We need a stage 1 script created, and stage 1 script will do the following in sequential order. 
  1. Will need to know what job its looking for. In our case with JAMS, we named our JAMS jobs based on the same pattern as the done file. So when the job starts the script reads information from the running job and basically fills in all the parameters like the folder location, job name, etc.
  2. The script looks for the presence of ANY done file in the specific folder. 
      1. If no done file exists, it goes into a loop, and checks every 5 minutes (this minimizes slack time).
      2. If a done file does exists we… 
            1. If there are more than 1, we fail. As we don’t know for sure which file is correct. This is a fail safe
            2. If there is only one, we move on.
  3. Using the “\_” in the done file, we make sure that it follows all our standards. So for example, we check that the first split is a date, the second is a time, the third matches the job name in JAMS and the fourth is either an inc or full. A failure in any one of these, will cause the job to fail and we’ll get notified to manually look into it.
  4. Once we verify the done file is good to go, we now have all we need to start the migration process. So the next thing we do is use the date and time information, to create a sub-folder in the Queue folder.
  5. Now we use robocopy to mirror the folder structure to the .\\Queue\\Date\_Time
  6. Once that’s complete, we move all files EXCEPT the done file to the Date\_Time folder.
  7. Once that’s complete, we then move the done file into said folder.

And that completes stage 1. So now you’re probably wondering, why wouldn’t we just move that data straight to the pickup folder? A few reasons.

- When the backup to tape starts we want to make sure no new files are getting pumped into the pickup folder. You could say well just wait until the backup’s done before you move data along. I agree and we sort of do that, but we do it in a way that keeps the pickup folder empty. 
  - By moving the files to a queue folder, if our tape process is messed up (not running) we can keep moving data out of the pickup folder into a special holding area, all the while still being able to keep track of the various backup sets (each new job would have a different date\_timestamp folder in the queue folder). Our biggest concern is missing a full backup. Remember, if the SQL job see’s a done file, it deletes it. We really want to avoid that if possible.
  - We ALSO wanted to avoid a scenario where we were moving data into a queue folder while the second stage job tried to move data out of the queue folder. Again, buy have an individual queue folder for each job, this allows us to keep track of all the moving pieces and make sure that we’re not stepping on toes.

**Gotcha to watch out for with moving files:**

If you didn’t pick up on it, I mentioned that I used robocopy to mirror the directory structure, but I did NOT mention using it for moving the files. There’s a reason for that. Robocopy’s move parameter actually does a copy + delete. As you can imagine with a multi-TB backup, this process would take a while. I built a custom “move-files” function in powershell that does a similar thing, and in that function I use “move-file” cmdlet which is a simple pointer update. MUCH faster as you can imagine.

**Stage 2: SysAdmin Side**

We’re using JAMS to manage this, and with that, this stage does NOT run, unless stage 1 is complete. Keep that in mind if you’re trying to use your own work flow solution.

Ok so at this point our pickup directory may or may not be empty, doesn’t matter, what does matter is that we should have one or more jobs sitting in our .\\Queue\\xxx folder(s). What you need next is a script that does the following.

1. When it starts, it looks for any “DONE” file in the queue folder. Basically doing a recursive search. 
  1. If one or more files are found, we do a foreach loop for each done file found and…. 
      1. Mirror the directory structure using robocopy from queue\\date\_time to the PickupFolder 
            1. Then move the backup files to the Pickup folder
            2. Move the done file to the Pickup Folder
            3. We then confirm the queue \\date\_time is empty and delete it.
            4. <span style="color: #993300;">\*\*\*NOTE: Notice how we look for a DONE file first. This allows stage 1 to be populating a new Queue sub-folder while we’re working on this stage without inadvertently moving data that’s in use by another stage. This is why there’s a specific order to when we move the done file in each stage.</span>
  2. If NO done files are found, we assume maybe you’re recovering from a failed step and continue on to….
2. Now that all files (dumps and done) are in the pickup folder we…. 
  1. Look for all done files. if any of them are full, the job will be a full backup. if we find NO fulls, then its an inc.
  2. Kick of a backup using a CommVault scripts. Again parameters such as the path, client, subclient, etc. are all pulled from JAMS in our case or already present in CommVault. We use the information determined about the job type in step 2\\1 as for what we’ll execute. Again, this gives the DBA’s the power to control whether a full backup or an inc is going to tape.
  3. As the backup job is running, we’re constantly checking the status of the backup, about once a minute using a simple “while” statement. If the job fails, our JAMS solution will execute the job two more times before letting us know and killing the job.
  4. if the job succeeds, we move on to the next step
3. Now we follow the same moving procedure we used above, except this time, we have no queue\\date\_time folder to contend with. 
  1. Move the backup files from Pickup to the Recovery folder.
  2. Move the done files
  3. Check that the Pickup folder is empty 
      1. If yes, we delete and recreate it. Reason? Simple, its the easiest way to deal with a changing folder structure. if a DBA deletes a folder in the DropOff directory, we don’t want to continue propagating a stale object.
      2. If not we bomb the script and request manual intervention.
4. if all that works well, we just completed out backup process.

Issues?
=======

You didn’t think I was going to say it was perfect did you? Hey, I’m just as hard on myself as I am on vendors. So here is what sucks with the solution.

1. For the longest time, \*I\* was the only one that knew how to troubleshoot it. After a bit of trainings, and running into issues though, my team is mostly caught up on how to troubleshoot. Still, this is the issue with home brewed solutions, and ones entirely scripted, don’t help.
2. Related to the above, if I leave my employer, I’m sure the script could be modified to serve other needs, but its not easy, and I’m sure it would take a bit of reverse engineering. Don’t get me wrong, I commented the snot out of the script, but that doesn’t make it any easier to understand.
3. Its tough to extend. I know I said it could, but really, I don’t want to touch it unless I have to (other than parameters).
4. When we do UAT refreshes, we need to disable production jobs so the DBA’s have access to the production backups for as long as they need. its not the end of the world, but it requires us to now be involved at a low level with development refreshes, where as before that wasn’t any involvement on our side.
5. We’ve had times where full backup’s have been missed tape side. That doesn’t mean they didn’t get copied to tape, rather they were considered an “inc” instead of being considered a “full”. This could easily be fixed simply by having the SQL stored procedure checking if the done file that’s about to be deleted is a full backup and if so, to replace it with a new full DONE file, but that’s not the way it is now, and that depends on the DBA’s. Maybe in your case, you can account for that.
6. We’ve had cases where the DBA’s do a UAT refresh and copy a backup file to the recovery folder manually. When we go to move the data from the pickup folder to the recovery folder, our process bombs because it detects that the same file already exists. Not the end of the world for sure, easy enough to troubleshoot, but its not seamless. An additional workaround to this could be to do an md5 hash comparison. If the file is the same, just delete it out of the pickup directory and move on.
7. There are a lot of jobs to define and a lot of places to update. 
  1. In JAMS we have to create 2 jobs + a workflow that links them per SQL job
  2. in CommVault we have to define the sub-client and all its settings.
  3. On the backup share, 4 folders need to be created per job.

Closing thoughts:
=================

At first glance I know its REALLY convoluted looking. A Rube Goldberg for sure. However, when you really start digging into it, its not as bad as it seems. In essence, I’m mostly using the same workflow multiple times and simply changing the source / destination. There are places for example when I’m doing the actual backup, where there’s more than the generic process being used, but its pretty repetitive otherwise.

In our case, JAMS is a very critical peace of software to making this solution work. While you can do this without the software, it would be much harder for sure.

At this point, I have to imagine that you’re wondering if this is all worth it? Maybe not to companies with deep pockets. And being honest, this was actually one of those processes that I did in house and was frustrated that I had to do it. I mean really, who wants to go through this level of hassle right? Its funny, I thought THIS would be the process i was troubleshooting all the time, and NOT Veeam. However, this process for the most part has been incredibly stable and resilient. Not bragging, but its probably because I wrote the workflow. The operational overhead I invested saved a TON of capex. Backing up SQL natively with CommVault has a list price of 10k per TB, before compression. We have 45TB of SQL data AFTER compression. You do the math, and I’m pretty sure you’ll see why we took the path we did. Maybe you’ll say, that CommVault is too expensive, and to some degree that’s true, but even if you’re paying 1k per TB, if you’re being pessimistic and assuming that 45TB = 90TB before compression, I saved 90k + 20% maintenance each year, and CommVault doesn’t cost anywhere close to 1k per TB, so really, I saved a TON of bacon with the process.

Besides the cost factor, its also enabled us to have a real grip on what’s going happening with SQL backups. Before it was this black box that we had no real insight into. You could contend that’s a political issue, but then I suspect lots of companies have political issues. We now know that SQL ran a full backup 6 days ago. We now have our backup workflow perfectly coordinated. We’re not starting to early, and we’re kicking off with in 5 minutes of them being done, so we’re not dealing with slack time either. We’re making sure that our backup application + backup tape is being used in the most prudent way. Best of all, our DBA’s now have all their dump files available to them, their environment refreshes are reasonable easy, the backup storage is FAST, we have backup’s centralized and not stored with the server. All in all, the solution kicks ass in my not so humble opinion. Would I have loved to do CommVault natively? For sure, no doubt its ultimately the best solution, but this is a compromise that allowed us to continue using CommVault, save money and accomplish all our goals.