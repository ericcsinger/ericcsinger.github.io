---
title: 'Review: 5 years virtualizing Microsoft SQL Server'
date: '2017-11-27T15:56:13+00:00'
status: publish
permalink: /review-5-years-virtualizing-microsoft-sql-server
author: 'Eric Singer'
excerpt: ''
type: post
id: 526
category:
    - Uncategorized
tag:
    - review
    - SQL
    - vmware
post_format: []
---
Introduction:
=============

I know what you’re thinking, it’s 2017, why are you writing about virtualizing Microsoft SQL? Most are doing it after all. And even if they’re not, there’s this whole SQLaaS thing that’s starting to take off, so why would anyone care? Well I’m writing this as more of a reflection on virtualizing SQL. What works well, what doesn’t, what lessons I’ve learned, what I’m still learning, etc.

Like most things on the internet, I find that folks tend to share all the good, without sharing any of the bad (or vice versa). There’s also just a lot of folks out there saying they’ve done it, without quantifying how well it’s working. Sure, I’ve seen the cranky DBA say it’s the worst thing to happen, and I’ve seen the sysadmins say it’s the best thing that they ever did. I find both types of feedback to be mostly useless, as they’re all missing context and depth. This post is going to follow my typical review style, so I’ll outline things like the specs, the pros and cons, and share some general thoughts.

Background:
===========

When I first started at ASI, I was told we’d never virtualize SQL. It was the un-virtualizeable workload. That was roughly six and a half years ago. Fast forward to today, and we’ve been running a primarily virtualized SQL environment for close to five years. It took a bit of convincing on my side, but this is basically how I convinced ASI to virtualize SQL.

- Virtualizing SQL (and other big iron) was gaining a lot of popularity back in 2012
- I had just completed my first successful POC of virtualizing a lot of other workloads at ASI.
- We were running SQL on older physical systems and they were running adequately. The virtual hosts I was proposing were at the time two generations newer processor wise. Meaning, if it was running ok on this dinosaur HW, it should run even better on this newer processor, regardless of whether it was virtual or not.
- I did a ton of research, and a lot of political marketing / sales. Basically, compiling a list of things virtualization was going to fix in our current SQL environment. Best of all, I was able to point at my POC as proof of these things. For example, we had virtualized Exchange, and Exchange was a pretty big iron system that was running well. Many of the things I laid out as pros, I could point to Exchange as proof.

Basically, it was proposed as a win / win solution. It wasn’t that I didn’t share the cons of virtualizing SQL, it was that I wasn’t as familiar with the cons until after virtualizing SQL. This is going back to that whole lack of real-world feedback issue. I brought up things like there would be some performance overhead, troubleshooting would be more difficult, and some of the more well-known issues. But there was never a detailed list of gotcha’s. No one that I was aware of had virtualized BIG SQL servers in the real world and then shared their experience in great detail. Sure, I saw DBA’s complain a lot, but most of it was FUD (and still is).

Anyway, the point is, we did a 180, and went from not virtualizing any SQL, to virtualizing any and all SQL with the exception of one platform (more on that later).

The numbers and specs:
======================

Bare in mind, this was five years ago, these were big numbers back then.

- VMware cluster comprised of seven Dell r820’s
- - 32 total cores (quad socket 8 cores per)
  - 768GB of RAM
  - Quad 10gb networking
  - - Two for the storage network
      - Two for all other traffic
  - Fusion IO drive 2 card
  - Fusion IO Io Turbine cache acceleration.
  - VMware ESXi 5.x – 6.x (over time)
- Five Nimble cs460 SANs
- Dual Nexus 5596 10Gb switches
- Approximately 80 SQL servers (peak)
- - 20 – 30 of which were two node clusters
  - Started with Windows 2012 R1 + SQL 2012
  - Currently running Windows 2012 R2 + SQL 2014 and moving on to Windows 2016 + SQL 2017

To summarize, we have a dedicated VMware cluster for production SQL systems and another cluster (not detailed) for non-production workloads. It didn’t start out that way, more on that later.

Pros:
=====

No surprise, but there are a lot of advantages to virtualizing SQL that even after five years I still think holds true. Let’s dig into it.

- The ability to expand resources with minimal disruption. I’m not talking about anything hot-add here, simply the fact that you can add resources. In essence, give you the ability to right size each SQL server.
- Through virtualization, you can run any number of OS + SQL version combinations that you need. Previously there was all kinds of instance stacking, OS + SQL version lag. With virtualization if we want a specific OS + SQL combo, we spool up a new VM and away we go.
- Virtualization made it easy for us to have a proper dev, stage, UAT and finally production environment for all systems. Before these would have been instances on existing SQL servers.
- Physical hardware maintenance is mostly non-disruptive. By being able to easily move workloads (scheduled) to different physical hosts, we’re able to perform maintenance without risking data loss. There’s also the added benefit that there’s basically no firmware or driver updates (other than VMware tools / version) to apply in the OS its self. This make maintenance a lot easier for the SQL server its self.
- Related to the above, hardware upgrades are as easy as a shutdown / power on. There’s no need to re-install and re-configure SQL on a new system.
- We were able to build SQL VM’s for specific purposes rather than trying to co-mingle a bunch of databases on the same SQL server. Some might say six of one and half a dozen of another, but I disagree. By making a specific SQL server virtual, it enabled us to migrate that workload to any number of virtual hosts.
- With enterprise licensing, we could build as many SQL systems as we wanted within the confines of resources.
- Migrating SQL data from one storage location to another was easy, but I won’t go so far as saying non-disruptive. Doing that on a physical SQL server, requires moving the data files manually. With VMware, we just moved the virtual disk.
- Better physical host utilization. This is a double-edged sword, but we’ve been able to more fully utilize our physical HW than before. When you consider how much SQL licensing costs, that’s a pretty big deal.
- Redundancy for older OS versions. Before Windows 2012, there was no official support for NIC teaming. You could do it, but Microsoft wouldn’t support it. With VMware, we had both NIC redundancy and host redundancy. In a non-clustered SQL server, VMware’s HA could kick in as a backup for host failures.

Pretty much, all the standard pros you’d expect from a virtual environment, and a few SQL specific ones.

Cons:
=====

This is a tough one to admit, but there are a TON of cons to virtualizing SQL if a sysadmin has to deal with it at scale.

- Troubleshooting just got tougher with a SQL. VMware will now always be suspect for any and all issues. Some of it is justified, a lot of it not. Still, trying to prove it’s not a VMware issue is tough. You’re no longer simply looking at the OS stats, now you have to review the VM host stats, check for things like co-stop, wait, busy, etc. Were there any noisy neighbors, anything in the VMware logs, etc.
- Things behave have differently in a virtual world. In a physical world, “stuns” or “waits” don’t happen. This is related to the above, but basically, for every simplicity that virtualization adds, it at least matches it with an equal or greater complexity.
- The politics, OH the politics of a virtual SQL environment. If you don’t’ have a great relationship with your SQL team, I would say, don’t virtualize SQL. It’s just not worth the pain and agony you’re going to go through. It will only increase finger pointing.
- DBA’s in charge of sizing VM’s on a virtual host you’re in charge of supporting. This is related to politics, but basically now that DBA’s know they can expand resources, you can bet your hind end your VM’s will get bigger and almost never shrink (we’ve gotten some resources back, so kudos to our DBA’s). It doesn’t matter if you explain NUMA concerns, co-stop, etc. It’s nothing more than “I want more CPU” or “I want more memory”. Then a week later, when you have VM’s stepping on each other’s toes, it will be finger pointing back at you again. I think what’s mostly happening here, is the DBA’s are focused on the individual server performance, whereas its difficult to convey the multi-server impact.
- vMotion (host or storage) will cause interruptions. In a SQL cluster, you will have failovers. At least that’s my experience. Despite what VMware puts on their matrix, DON’T plan on using DRS. Even if you can get the VM’s to migrate without a failover, the applications accessing SQL will slow down. At least if your SQL VM’s are a decent size. This was probably the number one disappointment with our SQL environment.
- - Once you can’t rely on DRS, managing VM’s across different hosts becomes a nightmare. You’ll either end up in CPU overload, or memory ballooning. I’ve never seen memory ballooning before virtualizing SQL, and that’s the last application you want to see ballooning and swapping.
  - Since you can’t vmotion VM’s to rebalance the cluster without causing disruptions (save for maybe non-clustered VMs) just keep piling on the struggle.
- SQL VMware hosts are EXPENSIVE at least when you’re running a good number of big VM’s like we are. We actually maxed out our quad socket servers from a power perspective. Even if we wanted to do something like add memory it’s not an option. And when you want to talk about swapping in new hosts, it’s not some cheap 30k host, no it’s a host that probably costs close to 110k if not more. Adding to that, you’re now tasked with trying to determine if you should stay with the same number of CPU cores, or try to make a case for more CPU cores, which now add SQL licensing costs.

I could probably keep going on, but the point is virtualizing SQL isn’t all sunshine and roses like it is for other workloads.

Lessons learned:
================

I’m thankful to have had this opportunity, because it’s enabled me to experience first-hand what it’s like virtualizing SQL in a shop where SQL is respectably large and critical. In this time, I’ve learned a number of things.

- DRS + SQL clusters = no go. Maybe it works for you and your puny 4 vCPU / 16GB VM, but for one of our vm’s with 24 vCPU and 228GB of RAM, you will cause failovers. And no DBA wants a failover.
- - Actually DRS + any Windows cluster = no go, but that’s for another post.
- If I had to do it over again, I would have gotten Dell r920’s instead of 820’s. While both were quad socket, I didn’t realize or appreciate the scalability difference between the 4600 and 8600 series xeons. If I was building this today, I would go after hosts that are super dense. Rather than relying on a scale out technique, I’d shoot for a scale up approach. Most ideal would be something like the HPe SuperDome, but even getting a new M series Xeons with 128GB DIMMS would be a wise choice. In essence, build a virtual platform just like you would a physical one So if you normally would have had three really big hosts, do the same in VMware.
- Accept the fact that SQL VM’s are going to be larger than you think they should be. Some of this being fair is SysAdmins think they understand SQL, and we don’t. There’s a lot more to SQL than CPU utilization. For example, I’ve seen SQL queries that only used 25% of every CPU core they were running on, but the more vCPUs we allocated to the VM, the faster that query ran. It was the oddest thing I had ever seen, but it also wasn’t the only application I’ve seen like this. Likely, a disk bottleneck issue, or at least that’s my guess.
- Just give SQL memory and be done with it. When we virtualized our first SQL cluster, the one thing we noticed was the disk IO on our SAN (and FusionIO card) was pretty impressive. At first, it’s pretty cool to see 80k IOPS from a real workload, but then when you hear the DBA’s saying, “it’s slow” and you realize that if every SQL server you add needs this kind of disk IO, you’re going to run out of IOPS in no time. We added something like 64GB of more memory to those nodes, and the disk IO went from 80k to 3k and the performance from the DBA’s perspective was back to what they expected. There’s no replacement for memory.
- Virtualizing SQL is complex. While it CAN be as simple as what you’re used to doing, once you start adding clustering, and managing a lot of monster VM’s on the same cluster, it’s a different kind of experience than you’re used to. To me, it’s worth investing in VMware log insight for your SQL environment to make it easier to troubleshoot things. I would also add ops manager as another potential value add. At least these are things I’m thinking of pushing for.
- Keep your environment as simple as possible. We started out with Fusion IO cards + Fusion IO caching software. All that did was create a lot of headache, and once we increased the RAM in SQL, the disk bottleneck went away (mostly). I could totally see using an Intel NVMe (or 3dxpoint) card for something like TempDB. However, I would put the virtual disk on the drive directly, not use any sort of caching solution.
- I would have broken our seven node cluster up into two or three two node clusters. This goes back to treating them like they’re physical servers. Again, scaling up, much better, but if you’re going to use more, but smaller hosts, treat them like they’re physical.
- - We kind of do this now. Node 1’s on odd hosts, node 2’s on even hosts
- We found that we ultimately didn’t need Vmware’s enterprise plus. We couldn’t vmotion, or use DRS, and the distributed switch was of little value, so we converted everything to standard edition. Now, I have no clue what would happen if we wanted Ops Manager. It used to be a la carte, but I’m not so sure anymore.
- We originally had non-prod and prod on the same cluster. We eventually moved all of non-prod off. This provided a little more breathing room, and now we have two out of seven hosts free to use for maintenance. Before, they were partially consumed with non-prod SQL VM’s.
- We made the mistake of starting with virtualizing big SQL severs and learning about Microsoft clustering + AlwaysOn Availability Groups at the same time. Not recommended J. I don’t think it would have been easy to learn the lessons we did, even if it was difficult.
- Just because VMware says something will work, doesn’t mean it will. I quadruple checked their clustering matrix and recommended practices guides. We were doing everything they recommended and our clusters still failed over.
- Big VM’s don’t behave the same way as little VM’s. I know it sounds like a no duh, but it’s really not something you think about. This is especially true when it comes to vMotion or even trying to balance resources (manually) on different hosts. You never realize how much you really appreciate DRS.
- I’ve learned to absolutely despise Microsoft clustering when it’s virtualized. It just doesn’t behave well. I think MS clustering is built for a physical world, where there are certain assumptions about how the host will react. For the record, our physical SQL cluster is rock solid. All our issues typically circle back to virtualization.
- - BTW, yes, we’ve tried tuning the subnet failover thresholds, no it doesn’t work, and no I can’t tell you why.
- We’ve learned that VMware support just isn’t up to par, and that you’re really playing with fire if you’re virtualizing complex workloads like SQL. We can’t afford mission critical support, so maybe that’s what we need, but production support is basically useless if you need their help.
- Having access to Microsoft’s premier support would be very beneficial in this environment. It’s probably something we should have insisted on.

Conclusion:
===========

Do I recommend virtualizing SQL? I would say it depends, but mostly yes. There are certainly days where I want to go back to physical, but then I think about all the things I would miss with our virtual environment. And I’m sure if you asked our DBA’s, they too would admit to missing some of the pros as well. Here are my final thoughts.

I would say if you’re a shop that has a lot of smaller SQL servers, and they’re non-clustered, virtualization is a no-brainer. When SQL is small, and non-clustered, it mostly behaves about the same as other VM’s. We never have issues with our dev or stage systems, and they’re all on the smaller side and they’re all non-clustered. Even with our UAT environment, we almost never have issues, even though they are clustered.

For us, it seems to be the combination of a clustered and large SQL server where things start getting sketchy. I don’t want to make it sound like we’re dealing with failovers all the time. We’ve worked through most of our issues, and for the most part, things are stable. We occasionally have random failovers, which is incredibly frustrating for all parties, but they’re rare now a day.

My suggestion is, if you do want to virtualize large clustered SQL systems, treat them like they’re physical. Here are a few rough recommendations:

- Avoid heavy CPU oversubscription. Shoot for something like less than 3:1, and more ideal being less than 2:1
- Size your VM’s so they fit in a NUMA node. That would have been impossible back in the day, but now a day, we could probably do this. Maybe some of you though, this will still be an issue. Our largest VM’s (so far) are only 24 vCPU, so we can fit in a single NUMA node on newer HW.
- Don’t cluster in VMware period. No HA, no DRS. Keep your hosts standalone and manage your SQL VM’s just like you would if they were physical. Meaning, plan the VMware host to accommodate the SQL VM(s).
- Don’t intermix non-SQL VM’s with these systems. We didn’t do this, but I wanted to point it out.
- Plan on a physical host that can scale up its memory if needed.
- When doing VMware host maintenance, failover your SQL listeners / clusters before migrating the VMs.
- - BTW, it’s typically faster to shutdown a VM then vMotion it while powered on at the sizes we’re dealing with.

Finally, I wanted to close by pointing out, that performance was never an issue in our environment. In fact, things got faster when we moved to the newer HW + SAN. One of the biggest concerns I used to see with virtualizing SQL was performance, and yet it was everything else that no one mentioned that ended up being the issues.

Hope this helps someone else who hasn’t taken the plunge yet or is struggling themselves.