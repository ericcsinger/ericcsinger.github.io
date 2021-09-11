---
title: 'Review: 1.5 years with Veeam'
date: '2016-02-28T21:54:49+00:00'
status: publish
permalink: /review-1-5-years-with-veeam
author: 'Eric Singer'
excerpt: ''
type: post
id: 181
category:
    - Backup
tag: []
post_format: []
---
Disclaimer:
===========

These are my opinions, these are **not** facts. Take them with a grain of salt, and use your own judgement. These are also my personal views, not those of my employer.

Also, no one is paying me for this, no one asked me to write this. It’s not un-biased, but its also not a hired review.

Introduction:
=============

As you may know from reading my backup storage series, we were going from a backup migration of native CommVault to Veeam + CommVault. I wanted to put together my experience living with Veeam as an almost complete backup solution replacement for the last year and half. Again, I’m always looking for this type of stuff, but its always hard to find.

The environment:
================

We’re backing up approximately 80TB in total (after compression / dedupe) . That’s what CommVault is copying to tape once a week. Veeam probably makes up a good 50TB+ of that data set.

The types of VM’s we’re backing up are comprised of mostly file servers and generic servers. However, we do have almost 6TB of Exchange data and a smattering of small SQL servers.

Source infrastructure specs:
----------------------------

- 5 Nimble cs460 SAN’s
- 10g networking (Nexus 5596) with no over subscription
- 4 Dell r720 hosts with dual socket 12 core procs, and 768GB of RAM.

Backup infrastructure specs:
----------------------------

- Veeam Infrastructure (started with v6.5 and currently running v8): 
  - 1 Veeam server
  - 5 Veeam proxy servers
  - 3 VM’s with 8 vCPU’s and 32GB of vRAM
  - 1 Dell r710, dual socket 6 core 128GB of RAM
  - 1 Dell r720 , dual socket 8 core, 384GB of RAM
- Windows storage spaces SAN: 
  - Made up of the same two Dell proxies as above.
  - 80 4TB disks in a RAID 10 (verified 4GB per second read and 2GB per second write)
  - All 10g
- CommVault infrastructure: 
  - 1 VM running our CommCell
  - 1 Dell r710 attached to our Quantum tape library

All the infrastructure on this side was also connected the same Nexus 5596 @10Gb, and again no over subscription.

Context is everything, which is why I shared my specs.

What we liked pre-migration and still do:
=========================================

Let’s start with the pros that Veeam has to offer. Again, we chose Veeam because it was working well as a point solution (replication), so they came in with a good reputation.

- For the most part, Veeam is super easy to setup and configure. While I did read the manuals at times, many things were very intuitive to setup. There are area’s that are not, but I’ll get more into that later.
- I like that the backup files are all you need to recover out of. So long as you have the VBK you can recover your last full, and if you have the vibs and vrb, you can get all your restore points too. This in turn makes it very easy to move the Veeam backup data around, and import the data on other servers. There’s no database to restore, no super complex recovery process if all you need is the data.
- The proxy architecture for the most part scales out very well. There’s little configuration needed, and jobs basically just balance across the proxies on their own.
- VM restores are mostly intuitive (talking about an entire VM). And guest file recovery if you know when the file was deleted is also easy to do (just not always quick).
- I love that they have Powershell for <span style="text-decoration: underline;">almost</span> everything. It blows my mind that in 2016 there are vendors still lacking Powershell in a windows environment. I guess the idea is they provide API’s and that’s good enough. I disagree, but anyway, kudos to Veeam for having PS.
- We get backup and replication in the same product. The two are different, and while you can backup and then restore to achieve a replication type result, its easier to just say “hey, I want to replicate this here”.
- Its reasonably affordable (although their price is starting to get up there). Its backup, and its a tough win with management to get decent investment. Having something affordable is a big pro.
- Veeam is very quick to have product updates after a new ESXi release and I’ve found that they’re pretty stable afterwards too. It’s refreshing to see a vendor strive for supporting the latest and greatest as soon as possible.
- For the most part, the product is very solid / reliable. I can’t say I’ve see major issues that were on Veeam’s side. A few quirks here and there, but ultimately reliable. The copy jobs are probably the only gripe I have reliability wise.
- I like that they have application level recovery options baked into the product. Things like restoring individual email items, AD objects, etc.
- They try to stay on top of VMware issues related to backups, and come up with ways to work around them. During the whole CBT debacle, I think they did a great job of helping out their customers.

What we didn’t know about, didn’t think about, and just in general don’t like about Veeam:
==========================================================================================

1. It’s rare now a days to find good tech support and Veeam is no exclusion. I know I’m not alone in my view, if you google objectively, you’ll find tons of people going on about how you need to escalate as soon as humanly possible if you want any chance at getting decent support, and I find this to be true. Their level 1 support is fine for very simple things like “what’s the difference between a reverse and forwards incremental?” but beyond that, good luck getting any decent troubleshooting out of them. Even when you escalate to level 2, I contend that while they’re certainly better than level 1, it doesn’t inherently mean you’re dealing with the caliber of person you need to solve a tricky problem. The biggest problem I’ve seen so far with Veeam, is they only know their product well, and if it comes to troubleshooting anything related to backup in VMware, you’re stuck opening a case with VMware and trying to juggle two vendors pointing fingers. Me, I would have expected much deeper expertise out of Veeam when it comes to the hypervisor they’re trying to backup. Maybe they do have it, and I just haven’t been escalated enough, but having a level 2 person tell me they’re not super familiar with reading VMware logs is disappointing.
2. I honestly don’t feel like product suggestions are taken seriously unless they already align with something Veeam is working on. I’d also add, there’s no good way to really see what features have been suggested already and to get an idea of how popular they are. You’re basically stuck taking their word for it that a request is or is not a popular one. One prime example of this is their SAN snapshot integration. What a mess.
3. We knew tape was bad before we got into Veeam, up until v9 (which I haven’t looked at seriously yet), it didn’t get much better in the two revisions that we had. It was for this reason that we were stuck keeping CommVault around. Even with version 9, they’re sill not good enough to copy non-Veeam data to tape, which to me, is a big con of the product.
4. We have a love / hate relationship with their backup file format. On one hand its nice and easy to follow, each backup job is a single file each time it executes. So 1 full and 6 incs = 7 files. However, the con of this really starts to show when you have a server that’s say 8TB. That means the minimum contiguous allocation you can get away with is 8TB. Now just imagine you have 3 jobs like that, plus a bunch of smaller ones. What’s a better way you ask? File sparsing, and load balancing those file shards across multiple luns automatically (one of my favorite CommVault features). There are other issues with this file format too, even if they had to keep the shards in the same contiguous spaces, sharding would still have more pros then cons. For example, windows dedupe, works much better on smaller files. Try deduping an 8TB file vs. a 4GB file. One is not doable and other other is. Here’s another one. Try copying an 8TB file to tape without ever having a hiccup and needing to restart all over again.
5. They don’t have global dedupe, and even worse, they don’t even dedupe inside a given job execution. Each job execution is a unique dedupe container. All that great disk saving you think you’ll get, will only come if you stack tons of VM’s into a single job, which ends up leading to problem 4. Add to that, the only jobs that really see any kind of serious dedupe are fulls.
6. VM backup of clustered applications is just bad, and its made worse in Veeams case when they don’t have SAN snapshot support for your vendor. Excluding any specific application at the moment, to give you an idea of why its bad picture this scenario. You have a two node clustered application and you’re using a FSW for quorum. You’ve followed best practices and only backup the passive node. Windows patches roll around, and now you need to patch the active node, so you fail your cluster over to the passive node that you’re backing up. In this scenario, it becomes problematic for two reasons. 
  1. if you forget to disable your backup’s during the maint. window, there is a high degree of probability that your cluster will go offline. All it takes is a backup kicking off while your rebooting your other node. The stun of a clustered windows server causes the cluster service to hiccup a lot, and if the current node is hiccuping while your other node is offline, that’s not enough votes to satisfy quorum, and hence, your cluster is going down for the count.
  2. Take the above point, but now just imagine your secondary node is down for good. Maybe a windows patch tanked, maybe your san bombed out. Doesn’t matter. Now you’re stuck with a single node cluster, and one that needs a disruptive backup running (more important than ever now). It’s not a good place to be in.
7. So what about backing up standalone applications? Well at least with Exchange 2007, we’ve seen the following issues. 
  1. The snapshot removal process has caused the disk to go offline in windows. You could blame this on VMware, and to a degree its fair. Except that my entire backup solution is based on Veeam, and this is their only option to backup exchange.
  2. I’ve seen data get corrupt in exchange thanks to snapshot based backup’s. Again, its technically a VMware issue, but again Veeam relies on VMware.
  3. I’ve seen Veeam end a jobs with a success status, only to discover my transaction logs are **NOT** truncating. Looking in the event viewer, you’ll see “backup failed”, but not according to Veeam. Opened a case about this, and Veeam basically blamed Microsoft. Again, see point 1 about finger pointing with Veeam’s tech support.
  4. Backing up Exchange with Veeam is SLOW. We’ve actually noticed that it gets really good if we reseed a database, but over time, as changes occure, as fragmentation occur, the jobs just get slower and slower.
8. Veeam IMO lacks a healthy portfolio of supported SAN vendors for snapshot based backup. Take a look at Veeams list, and then go take a look at CommVaults list. That’s pretty much all I have to say abut that.
9. Their “sure backup” and “Lab’s” technology sounds great on paper, but if you have an even remotely complex network, trying to setup their NAT appliance is just a PITA. I’m not knocking it per say, its a nice feature, but its not something that’s simple or straight forward to setup in an enterprise environment IMO.
10. Kind of a no duh, but they only backup virtual machines. You can’t call your self an enterprise backup solution, if you can’t support a multitude of systems and services. Need to backup EMC Isilon? Not going to happen with Veeam.
11. This is anecdotal (as most of my views are), but I just find their backup solution to be slow. The product always blame my source for being the bottleneck, yet my sources is able to deliver far faster throughput then what they’re pulling. I might get say 120MBps when my SAN can deliver 1024MBps without breaking a sweat. It’s not a load issue either as we’ve kicked off jobs during low activity times. I don’t tend to see a high queue depth or a high latency, so I’m not sure what’s throttling it. SIOC isn’t kicking in either. Again, perhaps its just something about VMware based backup. Also worth noting that for the most part, the IO is sequential, so its not a random IO issue usually. Although FYI, snapshot commits are almost entirely random IO (at least for exchange).
12. Opening large backup jobs can be really slow. I have a few file servers that are 4TB+, and it can take a good minute, maybe two just to open the backup file. Now to be fair, we don’t index the file system in Veeam so I don’t know if that would help. Add to that, closing said backup file can also be slow.
13. I have no relationship with a sales rep. Maybe for some folks that’s a good thing, but for me, when I spend money with a vendor, I think there should be some correspondences. In the 3 years we’ve owned Veeam, the only time a sales person got in touch with me was because I was interested in looking at VeeamOne. Never to check in and see how things were going, or anything like that. Our environment probably isn’t large from a Veeam view, so I’m not expecting lunches, or monthly calls, but at least once a year would be reasonable. I have no idea who our sales rep is just to give you an idea of how out of touch they are. And I know most of my other vendors sales folks by first name.

I could probably keep going on, but I think that’s enough for now.

Conclusion:
===========

Veeam is a solution I **might** recommend if you’re a small shop, that’s 100% virtual with modest needs. If you’re a full scale enterprise, regardless of how virtualized you are, I would’t recommend Veeam at this stage, even with the v9 improvements.

I’ve certainly heard the stories of larger shops switching to Veeam. I suspect a lot of that was due to the expense of CommVault or EMC. I get it, backup is a hard line item to justify expenditures in. That’s why you see vendors like Veeam, Unitrends and other cheaper solutions filling the gap so well. Veeam in our case even looked like it might be a better solution. It was simple, and affordable. However, you soon realize that at scale, the solution doesn’t match the power of your tried and true “legacy” solution. Maybe that solution costs more in capex, but I suspect the opex of running that legacy solution far outweighs the capex you’re saving. In our case, thats an absolute truth.

I wouldn’t say run away from Veeam, but I would say think really hard before you ditch a tried and true enterprise application like CommVault, EMC Avamar, NetBackup, or Tivoli. If you know me and follow my blog, you know I do have love for the underdog / cutting edge solutions. This isn’t me looking down my nose at a newer player, this is me looking down my nose at an inferior solution.