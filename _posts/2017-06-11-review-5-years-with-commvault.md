---
title: 'Review: 5 years with CommVault'
date: '2017-06-11T19:39:36+00:00'
status: publish
permalink: /review-5-years-with-commvault
author: 'Eric Singer'
excerpt: ''
type: post
id: 455
category:
    - Backup
tag:
    - backup
    - commvault
    - reviews
post_format: []
---
Introduction:
=============

Backup and recovery is a rather dry topic, but it’s an important one. After all, what’s more critical to your company than their data? You can have the best products in the world, but if disaster strikes and you don’t have a good solution in place, it can make your recovery painful or even impossible. Still, many companies shirk investment in this segment. The good solutions (like the one I’m about to discuss) cost a pretty penny, and that’s capital that needs to be balanced with technology that makes or saves your company money. Still, insurance (and that’s what backup is) is something that’s typically on the back of companies minds.

Finding the right product in this segment can be a challenge, not only because every vendor tries to convince you that they’ve cracked the nut, but because it seems like all the good solutions are expensive. Like many, our budget was initially constrained. We had an old investment in CV (CommVault), but had not reinvested in it over the years, and needed a new solution. We initially chose a more affordable Veeam + Windows Storage Spaces to handle our backup duties. It was a terrible mistake, but you know, sometimes you have to fail to learn, and so we did.

After putting up with Veeam for a year, we threw in the towel and and went back to CV with open arms. Our timing was also great too, as Veeam had put a serious hurt on their business and some of their licensing changed, to accommodate that. We ultimately ended up with much better pricing than when we last looked at CV, and on top of that, we actually found their virtualization backup to be more affordable and in many ways more feature rich. CV isn’t perfect as I’ll outline below, but they’re pretty much as close as you can get to perfection for a product that is the swiss army knife of backup.

CommVault Terms:
================

For those of you not super familiar with CV, you’ll find the following terms useful for understanding what I’m talking about. There are a lot more components in CV, but these are the fundamental ones.

- **MA (Media Agent):** Simply put, it’s a data mover. It copies data to disk, tape, cloud, etc.
- **Agent:** A client that is installed to backup an application or OS.
- **VSA (Virtual Server Agent):** A client specially designed to for virtualization backup.
- **CC (CommCell):** The central server that manages all the jobs, history, reporting, configuration, etc. This is the brains of the whole operation.

Our Environment:
================

- We have five MA’s. 
  - Two virtual MA’s that backup to a Quantum QXS SAN (DotHill). This was done because we were reusing an old pair of VMhost and have a few other non-CV backup components running on these hosts. 
      - The SAN has something like two pools of 80 disks. Not as fast as we’d like, but more than fast enough. The QXS (DotHill) was our replacement for Storage Spaces. Overall, better than Storage Spaces, but a lot of room for improvement. The details of that are for another review.
  - Two physical MA’s with DAS, each MA has 80 disks in a RAID 60, yeah it rips from a disk performance perspective J. Multiple GBps
  - One physical MA that’s attached to our tape library.
- We have five VSA’s, I’ll go more into this, but we’re not using five because I want to.
- We have one CC, although we’ll be rolling out a second for resiliency and failover soon.
- We have a number of agents 
  - Several MS Exchange
  - Several MS Active Directory
  - Several Linux
  - The rest are file server / OS image agents.
- In total, we have about a PB of total backup capacity between our SAN and DAS, but not all of that is consumed by CV (most is though).
- We only use compression right now, no dedupe.
- We only use active fulls (real fulls) not synthetics

Pros:
=====

- **Backup:**
  - CV can backup practically anything, and also has a number of application specific agents as well. You can backup your entire enterprise with their solution. I would contend with CV, there are very few cases that you’d need point tools anymore. Desktops, servers, virtualization, various applications and NAS devices are all systems that can be backed up by CV. Honestly, it’s hard to find a solution that is as comprehensive as them. That being said, I can imagine you’re wondering if they do it all, can they do it well? I would say mostly. I have some deltas to go over a little farther down, but they do a lot and a lot well. It’s one of the reasons the solution was (and still is) expensive.
  - I went from having to babysit backup’s with Veeam, to having a solution that I almost never had to think about anymore (other than swapping tapes). There were some initial pains at first as we learned CV’s way of doing virtualization backup, but we quickly got to a stable state.
- **Deployment / Scalability:**
  - CommCell has a great deployment model that works well in single office locations all the way to globally distributed implementations. They’re able to accomplish all of this with a single pane of glass, which a number of vendors can’t claim to do.
  - Besides the size of the deployment, you’re not forced into using Windows only for most components of CV. A lot of the roles outlined above run on Linux or Windows.
  - CV is software based, and best of all, its an application that runs on an OS which you’re already comfortable with (Linux / Windows). Because of this, the HW that you deploy the solution on is really only limited by minimum specs, budget and your imagination. You can build a powerful and affordable solution on simple DAS, or you can go crazy and run on NVMe / all flash SANs. It also works in the cloud because again, it’s just SW inside a generic OS. I can’t tell you how many backup solutions I looked at that had zero cloud deployment capabilities.
  - There are so many knobs to turn in this solution, it’s pretty tough to run into a situation that you can’t tune for (there are a few though). Most of the out of box defaults are fine, but you’ll get the best performance when you dig in an optimize. Some find this overwhelming and I’ll chat more about that in the cons, but with CV’s great support and reading their documentation, it’s not as bad as it sounds. Ultimately the tuneablity is an incredible strength of this solution. I’ve been able to increase backup throughput from a few hundred MBps to a few GBps simply by changing the IO size that CV uses.
- **Support:** 
  - Overall, they have fantastic support. Like any vendors support, it can vary and CV is no different. Still, I can count on my hand the number of times support was painful, and even of those times, ultimately we got the issue resolved.
  - For the most part, support knows the application they’re backing up pretty well. I had a VMware backup issue that we ran into with Veeam and continued with CV. CV while not being able to directly solve the problem, provided significantly more data for me to hand off to VMware, which ultimately led to us finding a known issue. CV analyzed the VMware logs best they could and found the relevant entries that they suspected were the issue. Veeam, was useless.
  - Getting CV issues fixed is something else that’s great about CV. No vendor is perfect, that’s what hotfixes and service packs are for. CV, has an amazing escalation process. I went from a bug, to a hotfix that resolved the issue in under two weeks.
  - My experience with their supports response time is fantastic. I rarely find a time where I don’t hear from them for a few hours. They’re also not afraid to simply call you and work on the problem real time. I don’t mind email responses for simple questions, but when you’re running into a problem, sometimes you just want someone to call you and hash it out in real time. I also like that most of the time you get the tech’s direct number if you need to call them.
- **Feature requests:** A little hit or miss, but feature requests tend to get taken seriously with CV, especially if it’s something pretty simple.
- **Value:** This one is a mixed bag. Thanks to Veeam eating their lunch, virtualization backup with CV has never been a better value. I could be wrong, but I actually think virtualization backup in CV rings in at a significantly lower price than Veeam. I would say at least 50% of our backup’s are virtualization. It’s our default backup method unless there is a compelling reason to use agents. This is ultimately what made CV an affordable backup solution for us. We were able to leverage their virtualization backup for most of our stuff, and utilize agents for the few things that really needed to be backed up at a file level or application level. The virtualization backup entitles you to all their premium features, which is why I think it’s a huge value add. That being said, I have some stuff to touch on in the cons with regards to the value.
- **Retention Management:** Their retention management is a little tricky to get your head around, but it’s ultimately the right way to do retention. Their retention is based on a policy, not based on the number of recovery point. You configure things like how many days of fulls you want and how many cycles you need. I can take a bazillion one off backup’s and not have to worry about my recovery history being prematurely purged.
- **Copy management:** They manage copies of data like a champ. Mix it with the above point, and you have all kinds of copies with different retentions, different locations, and it all works rock solid. You have control over what data get’s copied. So your source data might have all your VM’s and you only want a second copy of select VM’s, not problem for them. Maybe you want dedupe on some, compression on other, some on tape, some on disk, some on cloud, again, no issue at all.
- **Ahead of the curve:** CV seems to be the most forward thinking when it comes to backup / recovery destinations and sources. They had our Nimble SAN’s certified for backup LONG before our previous vendor. They support all kinds of cloud destinations, the ability to recover VM’s from physical to virtual, virtual to cloud, etc. This goes back to the holistic approach that I brought up. They do a very good job of wrapping everything up, and creating a flexible ecosystem to work with. You typically don’t need point solutions with them.
- **Storage Management:** I love their disk pools, and the way they store their backup data. First and foremost, it’s tunable, so if you want 512MB files to whatever size files, it’s an option. They shard the data across disks, etc. Frankly the way they store data is a no brainer. They also move jobs / data pretty easily from one disk to another which is great. This type of flexability is not only helpful for things like making it easier to fit your data on disparate storage, but also in ensuring your backup’s can easily be copied to unreliable destinations. Having to recopy a 512MB file is a lot better than having to recopy an 8TB file. CV can take that 8TB file if you want, and break it up into various sized (default is 2GB).
- **Policies:** Most of the way things are defined, are defined using policies. Schedules, retention, copies, etc. Not everything, but most things. This makes it easy to establish standards for how things should act, and it also makes it easier to change thing.
- **CLI:** They have a ton of capability with their CLI / API. Almost anything can be executed or configured. I actually developed a number of external work flows which call their CLI and it works well.
- **Tape Management:**
  - They handle tapes like a librarian, minus the dewy decimal system. Seriously though, I haven’t worked with a solution that makes handling tapes as easy as they do.
  - If you happen to use Iron Mountain, they have integration for that too.
  - They’re pretty darn efficient with tape usage as well, which is mostly thanks to their “global copy” concept. We still have some white space issues, but it makes sense why
  - They are very good at controlling tape drive and parallel job management. This allows you to balance how many tape drives are used for what jobs.
- **Documentation:** They document everything, and for good reason, there is a lot their product does. This includes things like advanced features and most of the special tuning knobs as well. It’s not always perfect, but it’s typically very good.
- **Recovery:**
  - File level recovery from tape for VM backups, without having to recover the whole file, need I say more. That means if I need one file off an 8TB backup VMDK, I don’t have to restore 8TB first.
  - Most application level backup’s offer some level of item level recovery. It’s not always straight forward, or quick, but its usually possible.
  - They’re smart with how they restore data. You can pick where you want the data recovered from (location and copy), and if it does need tapes, it tells you exactly what tapes you need. No more throwing every single tape in and hoping that’s all you need.

Cons:
=====

- **Backup:**
  - **Virtualization:**
      - Their VMware backup in many ways isn’t as tunable as it should be. There are places where they don’t have stream limits where they really need them. For example, they lack a stream limit on a the vCenter host, the ESXi host or even the VSA doing the backup. It’s honestly a little strange as CV seems to offer a never-ending number of stream controls for other areas of their product. I bring this up as probably my number one issue with their VMware backup. This led us to have the most initial problems with their solution. I would still say this is a glaring hole in their virtualization backup. I just looked up their CV11 SP7 and nothing has changed with regards to this, which is disappointing to say the least. This is one area that I think Veeam handles much better than them.
      - The performance of NBD (management network only) based backup is bluntly terrible. The only way we could get really good performance out of their product was to switch to hot add. Typically speaking I hate hot add for Vmware backup. It takes forever to mount disks, and it makes the setup of VM backup more complicated than it needs to be. Not to mention if you do have an issue during the backup process (like vCenter dying) the cleanup of the backup is horrible.
      - They don’t pre-tune VSA for hot add. Things like disabling initialize disk in windows and what not.
      - Their inline compression throughput was also atrocious at first. We had to switch the algorithm used which fixed the issue, but it required a non-gui tweak to achieve and me asking if there was anything else they could do. It was actually timely that the new algorithm had been released as experimental in the release we just upgraded to.
      - Their default VM dispatch to me is less than ideal. Instead of balancing VM’s in a least load method across the VSA’s, they pick the VSA closest to the VM or datastore. I needed to go in and disable all of this.
  - **Deployment / Scalability:**
      - While I applaud their flexibility, the one area that I think still needs work is their dedupe. To me, they really need to focus on building a DataDomain level of solution that can scale to petabytes of logical data in a single media agent, and right now they can’t scale that big. It seems like you need to have a bunch of mid sized buckets which is better than nothing, but still not as ideal as it should be.
      - Deployment for CV newbies is not straight forward. You’ll definitely need professional services to get most of the initial setup done, at least until you have time to familiarize yourself with it. You’ll also need training so that you actually know how to care for and grow the solution. I think CV could do a better job with perhaps implementing a more express setup just to get things up, and maybe even have a couple of into / how to videos to jump start the setup. It’s complicated, because of it’s power, but I don’t think it needs to be. The knobs and tuning should be there to customize the solution to a person’s environment, but there should be an easy button that suites most folks out of the box.
  - **Support:** In general I love their support, but there are times where I’m pretty confident the folks doing the support, don’t have at scale experience with the product. There are times when I’ve tried explaining the scaling issue we were having, and they couldn’t wrap their heads around the issue. They also tend to get wrapped up in the “this is the way it works” and not in the “this is the way it SHOULD work”. Which again I think comes back to the experience with product at scale. This would tend to happen more when I was trying to explain why I setup something in a particular way, and a way that didn’t match their norm. For example, VM backups, they like to pile everything into subclients. For more than a number of reasons I’m not going to go into in this blog post, that doesn’t work for us, and frankly it shouldn’t work for most folks. I was able to punch holes in why their design philosophy was off, but they were stuck on “this is the way it is”. The good news is you can typically escalate over short sited techs like this and get to someone who can think outside the box.
  - **Value:** This is a tough one. On one hand, I want good support and a feature rich product, but on the other hand, the cost of agent based backup is frankly stupid expensive. When the cost of my backup product costs more per TB than my SAN, that’s an issue. It’s one of the primary reasons we push towards VM based backup’s as its honestly the only way we could afford their product. Even with huge discounts, the cost per TB is insane with their solution. In some cases, I would almost rather have a per agent cost rather than a per TB cost. I could see how that could get out of control, but I think there are cases where each licensing model works better for each company. If I had thousands of servers, I could see where the per TB model might make more sense. This is one of the reasons we don’t backup SQL direct with CV, it just costs too much per TB. It’s cheaper for us to use a (still too expensive) file based agent to pick up SQL dump files.
  - **Storage Management:** Once data is stored on its medium, moving it off isn’t easy. If you have a mountpoint that needs to be vacated, you need to either aux copy data to a new storage copy, manually move the data to another mountpoint, or wait till it ages out. They really should have an option in their storage pool to simply right click the mountpoint and say “vacate”. This operation would then move all data/jobs to whatever mountpoints are left in the whole pool. Similar to VMwares SDRS. I would actually like to see this ability at a MA level as well too.
  - **CLI:** I’ll knock any vendor that doesn’t have a Powershell module and CV is one of those vendors. Again, glad that you have API’s, but in an enterprise where Windows rules the house, Powershell should be standard CLI option.
  - **Tape Management:** As much as I think they do it better than anyone else, they could still improve the white space issue. I almost think they need a tapering off setting. Perhaps maybe even a preemptive analysis of the optimal number of tapes and tape drives before the start of each new aux copy, and re-analyze that each time you detect more data that needs to be copied to tape. This way it could balance copy performance with tape utilization. Maybe even define a range of streams that can be used.
  - **Documentation:** As great as their documentation is, it needs someone to really organize it better. Taking into account the differences in CV versions. I realize it’s probably a monumental task, but it can be really hard to find the right document to the right version of what you’re looking for. I’ve also found times where certain features are documented in older CV version docs, but not in newer ones (but they do exist). I guess you could argue at least they have so much documentation that it’s just hard to find the right one, vs. not having any doc at all. When in doubt though, I contact support and they can generally point me in the right direction, or they’ll just answer the question.
  - **Recovery:**
      - Item level recovery that’s application based really needs a lot of work. One thing I’ll give Veeam is they seems to have a far more feature rich and intuitive application item level recovery solution than CV. 
            - Restoring exchange at an item level is slow and involved (lots of components to install). I honestly still haven’t gotten it working.
            - AD item level recovery is incredibly basic and honestly needs a ton of work.
            - Linux requires a separate appliance, which IMO it shouldn’t. If Linux admins can write tools to read NTFS, why can’t a backup vendor write a Windows tool that can natively mount and ready EXT3/4, ZFS, XFS, UFS, etc.
      - P2P, V2V / P2V leaves a lot to be desired. If you plan to use this method, make sure you have an ISO that already works. Otherwise you’ll be scrambling to recover bare metal when you need to.

Conclusion:
===========

Despite CommVaults cons, I still think it’s the best solution out there. It’s not perfect in every category, and that’s a typical problem with most do it all solution, but it’s pretty damn good at most. It’s an expensive solution, and its complicated, but if you can afford it, and invest the time in learning it, I think you’ll fall in love with it, at least as much as one can with a backup tool.