---
title: 'Thinking out loud: Hyper converged storages missing link'
date: '2016-08-23T23:52:39+00:00'
status: publish
permalink: /thinking-out-loud-hyper-converged-storages-missing-link
author: 'Eric Singer'
excerpt: ''
type: post
id: 371
category:
    - Uncategorized
tag:
    - HCI
    - 'hyper converged infrastucture'
    - storage
    - 'thinking out loud'
post_format: []
---
Introduction:
=============

In general, I’m not a huge fan of hyper converged infrastructure. To me, its more “hype” than substance at the moment. It was born out of web scale infrastructure like Google, Facebook, etc. and IMO, that is still the area where it’s better suited. The only enterprise layer where I see HCI being a good fit is VDI, other than that, almost every other enterprise workload would be better suited on new school shared storage. I could probably go into a ton of reasons why I personally see shared storage still being the preferred architecture for enterprises, but instead I’ll focus on one area that if adopted might change my view (slightly). You see, there is a balance between the best and good enough. Shared storage IMO is the best, but HCI could be good enough.

**What’s missing?**
===================

What is the missing link (pun intended)? IMO, its external / independent DAS. Can’t see where this is going? Follow along on why I think external DAS will make hyper converged storage good enough for almost anyone’s environment.

**Scaling Deep:** Right now the average server tops out at 24 2.5” drives and less for 3.5” drives. In a lot of larger shops, that would mean running more hosts in order to meet your storage requirements, and that will come at the cost of paying for more CPU, memory and licensing then you should have to. Just imagine a typical 1ru r630 + a 2u **60** drive JBOD! That’s a lot more storage that you can fit under a single host, and it would only consume one more rack unit than a typical r730. Add to this, theoretically speaking, the number of drives you could add to a single host would go beyond a single JBOD. A quad port SAS HBA could have four 60 drive enclosures attached, and that’s a single HBA.

**Storage independence:** Having the storage outside the server also makes that storage infinitely more flexible. This is even true when you’re building vendor homogeneous solutions. Take Dell for example. Typically speaking their enclosures are movable between different server generations. Currently with the storage stuck in the chassis, it gets really messy (support wise) and in many cases not doable, to move the storage from one chassis to another, especially if you’re talking about going from an older generation server to a newer generation.

Adding to this, depending on your confidence, white boxing also allows you to cut a server vendor out of the costliest part of the solution, which is the disks themselves. Going with an enclosure from someone like RAID inc. or DataOn, Quanta QCT, Seagate, etc. Add in a generic LSI (sorry Avago, oh sorry again, Broadcom) HBA, and now you have a solution that is likely good enough supportability wise. JBODs tend to be pretty dumb and reliable, which just leaves the LSI card (well known established vendor) and your SSD / HDD.

Why do you want to move the storage anyway? Simple, I’d bet a nice steak dinner that you want to upgrade or replace your compute long before you need to replace your storage. If you’re simply replacing your compute (not adding a new node but swapping it) then moving a SAS card + DAS is far more efficient than rebuying the storage, or moving the internal storage into a new host (remember warranty gets messy). Simply vacate the host like you would with internal storage, shutdown, rip the hba out, swap server, put existing HBA back in, done.

If you’re adding a new host, depending on your storage, you may have the option of buying another enclosure and spreading the disks you have evenly across all hosts again. So if for example, you had 50 disks in 4 hosts (total 200 disks) and you add a fifth host. One option could be you simply remove 10 disks from each current node and place them in the new node. Your only additional cost was JBOD enclosure, and you now continue to keep your current investment in disks (with flash, that would be the expensive part).

**Mix and match 3.5 / 2.5 drives:** Right now with internal storage, you are either running a 3.5” chassis, which doesn’t hold a lot of drives, but CAN support 2.5” drives with a sled. Or you are running a 2.5” chassis which guarantees no 3.5” drives. External DAS could mean one of two options:

1. Use a denser 3.5” JBOD (say 60 disks) and use 2.5” sleds when you need to.
2. Use one JBOD for 3.5” drives and a different one for 2.5” drives.

Again it comes down to flexibility.

**Performance upgrades:** Now this is a big “it depends”. Hypothetically if there were no SW imposed bottlenecks (which there are), one of your likely bottlenecks (with all flash at least) are going to be either how many drives you have per SAS lane, or how many drives you have per SAS card. For example, if your SAS card is PCIe 3.0 internally, but the PCIe bus is 4.0, there’s a chance you could upgrade your server to a newer / better storage controller card. More so, even if you were stuck on PCIe 3 (as an example). There would be nothing stopping you from slicing your JBOD in half, and using two HBA to double your throughput. Before you even go there, yes I do know the 730xd has an option for two RAID cards, glad you brought that up. Guess what, with external DAS, you’re only limited by your budget, the number of PCIe slots you have and the constrains of your HCI vendor. I for example could have 4 SAS cards, and 2 JBODs partially filled and each sliced in half. You don’t have that flexibility with internal storage.

With the case of white boxing your storage, this also means to the extent of the HCL, you can run what you want. So if you want to use all Intel dc3700’s, you can. Heck, they’re even starting to make JBOF (just a bunch of flash) enclosures for NVMe, which again, would be REALLY fast.

**Conclusion:**
===============

I say external DAS support is the missing link because it is what would allow HCI to offer similar scaling flexibility that exists in SAN/NAS. I still think the HCI industry is at least 3 – 5 years out from matching the performance, scalability and features we’ve come to expect in enterprise storage, but external storage support would knock a big hole in a large facet of the scalability win with SAN/NAS.