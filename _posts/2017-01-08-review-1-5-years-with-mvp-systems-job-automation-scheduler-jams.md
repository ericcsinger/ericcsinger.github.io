---
title: 'Review: 1.5 years with MVP Systems Job Automation Scheduler (JAMS)'
date: '2017-01-08T21:20:27+00:00'
status: publish
permalink: /review-1-5-years-with-mvp-systems-job-automation-scheduler-jams
author: 'Eric Singer'
excerpt: ''
type: post
id: 422
category:
    - Uncategorized
tag:
    - 'centralized job management'
    - cron
    - JAMS
    - 'task scheduler'
post_format: []
---
Introduction:
=============

I wrote a really quick review [here](http://wp.me/p62gzE-1W) about MVP systems JAMS product about 1 year or so ago (maybe a little less). At the time, I was in search of a solution that could help me glue together several disjointed systems in a workflow. Specifically, we were trying to integrate Veeam and CommVault backup’s together. Veeam was of course doing the VM backup’s, and CommVault was copying the Veeam files to tape. We’ve since moved on from Veeam, but JAMS has continued to be a vital part of our infrastructure.

What is JAMS?
=============

The simple answer is it’s a centralized task scheduler, the long answer is its not only that, but a whole lot more. This is a solution that replaces cron, windows task scheduler, SQL agent jobs, or pretty much anything else that you would normally use to schedule and execute something.

What makes up a JAMS solution?
==============================

There are four main components.

- **The JAMS server:** This is clusterable component that schedules, queues and executes any jobs or workflows.
- **The JAMS client:** This is the administration GUI. Kind of self-explanatory, but this is where you would configure all of the settings for the various jobs, and server settings. 
  - For windows, this also includes a Powershell module for CLI administration. Pretty sure they have a generic API, but I never bothered to look since PS was available.
- **The JAMS agent:** This is a component that is installed on a system where you want to execute jobs. All kinds of OS’s supported.
- **Microsoft SQL server:** Check with MVP systems if other DB’s are supported, but we’re a MS shop, and SQL is on their list. This is used to store the job history, job status, and pretty much the entire server configuration. If this goes down, you have big issues to deal with J. And yes, a clustered SQL server IS supported.

All in all, the infrastructure is pretty simple to understand and for smaller use cases, these roles can all be installed on the same system.

History:
========

I didn’t start out with JAMS, in fact, they were nowhere in sight when the initial problem came to fruition. I figured this would be a relatively trivial Powershell solution, and started down the path of trying to write a quick workflow. Building the logic for the workflow was actually pretty easy, but what I kept running into was the good ‘ol Kerberos double hop condition. Never heard about it? Read about it [here](https://blogs.technet.microsoft.com/askds/2008/06/13/understanding-kerberos-double-hop/). In order to centralize the solution, I basically tried to build my own poor mans centralized task scheduler. In order to keep it central, I was utilizing “invoke-command” to execute scripts on our Veeam server and our CommVault server. With Veeam, our database was stored on a different server, so when my “invoke-command” executed against Veeam, my credentials were never passed along to the SQL server. I was able to work around it by using CredSSP, but it wasn’t reliable. Sometimes it would work, and sometimes I guess it would timeout or something similar (don’t really remember to be honest). Then there was the issue with CommVault. See they used old fashion EXE’s to start jobs (we were on v8) from the command line. The commands I needed to run had to be executed in sequential order. Anyone who has worked with Powershell’s “start-process” via invoke-command, knows that the “-wait” parameter is ignored. I don’t recall the reason, but it was lame on MS part. Ultimately, it was this that was the deal breaker, and so started the search for some sort of centralized task scheduler.  
We ultimately landed on a cheap’o but well known solution called “VisualCron”. I’ve got nothing against the solution, but after working with it for a few days, not only was it very hacked together, but it wasn’t the most user friendly solution. So the search continued and we ultimately stumbled across JAMS. It took a lot of creative searching to find them, but I’m glad we did. After installing the trial, we knew it was the solution we were looking for, and the rest as they say, is history.

The pros:
=========

- **Easy solution:** Pretty easy to install the solution and understand the components. Unlike some other solutions we’ve installed, JAMS takes care of installing any pre-requisites and also has an easy to understand architecture.
- **You get tech support:** Normally not something to write home about, but we leveraged their support quite a bit at first, and they were normally helpful. As simple as JAMS is, it can do a lot of stuff, and that’s where support can (and is) a huge help. I remember one part of a solution where were trying to pass a variable from one job to another. Called up support, and sure enough, JAMS could do it and they showed us how. How about bulk creating a bunch of jobs via PS? Yep, support had an example of that too.
- **The GUI:** This is one where I have pros and cons. We’re in the pros section, so that’s what I’ll focus on here. 
  - I’ve never worked with a GUI that was capable of bulk edits, but JAMS is and it rocks. Just imagine wanting to change the start time on 60 jobs. You could write a script to do it, or you could highlight the 60 jobs in a folder, right click and basically change the value of one field (time) to another value. Then BAM! It goes and changes the time for all highlighted jobs. Pretty much any column you can add to the GUI has this functionality and it rocks.
  - Easy to see all jobs scheduled to run, running or failed in one view.
  - It keeps a detailed log of each job execution. If you write output to the host (think write-host in PowerShell or REM in batch), that output gets logged to a file and stored for historical purposes. So as long as your script has verbose output, you’ll know exactly what happened in your job.
  - Sort of related to the above, it keeps a history of all executed jobs and their final status. It also tracks things like when it ran, how long it ran, how many resources it consumed, etc.
  - They have some pretty neat dashboards (once you figure them out). There are a few cool built in ones (like projected schedule) too.
  - Last but not least, it’s a pretty easy GUI to use. I won’t say it doesn’t have any learning curve, but I think the learning curve is really more related to the solution than the client its self.
- **Scripting engines:** The agent can execute all kinds of scripts. 
  - Powershell
  - Batch
  - Bash
  - SSH
  - T-SQL
  -
- **Agent OS Support:** The agent can be installed on different OS’s, so this isn’t a 100% windows only solution.
- **Workflows (setups):** You can build “setups” (workflows) that tie jobs together. The jobs themselves can run on completely different systems. In our case, we had a setup which had a “job” that ran on a veeam server and a different job that ran on the CV server. The Setup was configured to wait until the first job completed with a success before moving on.
- **Job Queueing:** It supports queueing jobs. Probably not an issue for many folks, but we used to limit the number of tape backup’s running in parallel. What’s great is each “job” in jams can share a queue or have different queues. This allows a Setup to execute the first job (as an example) and if needed, the second job will queue. We typically had 50 setups running in parallel, but only 4 tape jobs that were allowed to run in parallel. JAMS would execute all 50 setups in parallel, but when it came time to run the tape portion of a setup, the tape jobs would go into a queue and trickle out as others completed (or failed). This didn’t stop the first jobs (the backup its self) from completing, so it ultimately kept things moving at a great pace.
- **PowerShell:** Being able to admin JAMS through PS is a huge win in my book. You can create, modify and delete, jobs, setups, queues, etc. Everything in the GUI can be done in PS. It’s sad in 2017 that I even have to list this as a pro of a solution. None the less, it’s not as common as it should be, and it’s a win for JAMS.
- **Different Licensing:** With a lot of solutions, there’s only one licensing strategy. I found that JAMS had several, and they do so to accommodate differing needs and purposes.
- **Sales team:** The sales team I worked with was friendly, knowledgeable and not pushy in any kind of way. Additionally, what I think is worth noting, is while it felt like we were shopping for a Ferrari, they understood we were on a Corvette budget, and worked with us to find a licensing model (and some pricing breaks) to let us drive home in a solution we really wanted.

The cons:
=========

- **Price:** I’m not saying it’s overpriced, all I’m saying is its not cheap. I would love to use this solution for my whole environment, but it’s not cheap to do that. I’m not saying they won’t work with you (they will), but to scale the solution, you will be digging deeper in your wallet.
- **The GUI:** I think the GUI has some great design characteristics, but I also think it has some flaws too. 
  - They recently updated the GUI look. I’m personally not a fan. It’s a matter of opinion of course, but I find it harder to see what I need to see now.
  - I don’t like the way they separate jobs from setups. I wish they just used a different icon, or a value in a field to separate them. There are plenty of times I click on a folder and forgot that I’m in the “setup view” when I’m looking for a job.
  - They don’t support right click for certain job management features. I intuitively want to right click in the jobs window and select “new job” or something related, but that’s not the way the GUI is designed.
  - When you bulk submit jobs, they ask you if you want to, for each job. That means if you selected 25 jobs, you’re clicking “submit” 25 times afterwards.
- **Their security design:** I found that their security model didn’t work quite like one might think. I remember working with a tech to do something simple like let our DBA’s manage jobs (execute and read) and something as simple as that required what seemed like a million hoops to jump through. Ultimately IIRC (it’s been a while) we ended up needing to grant them more rights than I would have wanted in order to accomplish what seemed like a trivial task. I gave up on it because I didn’t want to create a solution that going to be too complex to manage.
- **Overlapping job detection:** I remember when I first started with their solution, we had run into a few cases where jobs (or setups) were overlapping on themselves. Meaning Job A from Monday night was still running and Tuesday nights job started up and started running. When I asked support about this, they handed me a script that would nuke the Tuesday job, but ultimately didn’t solve my issue of needing Tuesday’s job to just wait. I ultimately ended up writing a pre-check job that would detect if any of the same jobs were running and if so, to go into a loop where it checks every minute, waiting for the previous job to complete. What sucks about this and the script they gave me, is every job I launch that has a pre-check job, this ends up burning my job count. To me, this just seems like something that should be built into the solution.
- **Maintenance Mode:** They don’t seem to have a maintenance mode option. What I mean by that, is being able to put JAMS into a paused state. I think you can stop a service on the windows hosts, but honestly that’s a hack. They should just have a maintenance mode option built right into the GUI. I could see something like having a few options like, queue any new jobs that start, or let existing jobs finish, but queue anything new, or don’t let any jobs start at all. Bonus points if this could be done at a folder level.

Conclusion:
===========

Ultimately after living with JAMS for almost 1.5 years, I think they really rock as a solution. I can’t say I have any experience with any other enterprise job scheduling solutions, but my overall experience with JAMS has been a pleasure. No solution is perfect, and theirs is no exception, but the great news is they have a solution that is ultimately awesome, with a few negatives, which is a far cry from other vendor’s solutions I’ve used. My suggestion is if you’re looking for something to replace SQL jobs, task scheduler, cron or any other isolated solution, to give them a look, I think you’ll be pleased.