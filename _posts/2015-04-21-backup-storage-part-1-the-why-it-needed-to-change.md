---
title: 'Backup Storage Part 1: Why it needed to change'
date: '2015-04-21T16:46:46+00:00'
status: publish
permalink: /backup-storage-part-1-the-why-it-needed-to-change
author: 'Eric Singer'
excerpt: ''
type: post
id: 29
category:
    - Backup
    - Storage
tag: []
post_format: []
---
Introduction:
=============

This is going to be a multi-part series where I walk you through the whole process we took in evaluating, implementing and living with a new backup storage solution. While its not a perfect solution, given the parameters we had to work within, I think we ended up with some very decent storage.

Backup Storage Part 1: The “Why” it needed to change
====================================================

Last year my team and I began a project to overhaul our backup solution and part of that solution involved researching some new storage options. At the time, we ran what most folks would on a budget, which is simply a server, with some local DAS. It was a Dell 2900 (IIRC) with 6 MD1000’s and 1 MD1200. The solution was originally designed to manage about 10TB of data, and really was never expected to handle what ultimately ended up being much greater than that. The solution was less than ideal for a lot of reasons that I’m sharing below.

- It wasn’t just a storage unit, it also ran all the backup server (CommVault) on top of it, and our tape drives were locally attached as well. Basically a single box to handle a lot of data and ALL aspects of managing it.
- The whole solution was a single point of failure and many of its sub-components were singe points of failure.
- This solution was 7 years old, and had been grown organically, one JBOD at a time. This had a few pitfalls: 
  - JBODs were daisy chained off each other. Which meant that while you added more capacity, and spindles, the throughput was ultimately limited to 12Gbps for each chain (SAS x4 3G). We only had two chains for the md1000’s and one chain / JBOD for the md1200.
  - The JBODs were carved up into independent LUN’s, which from CommVaults view was fine (awesome SW), but it left potential IOPS on the table. So as we added JBODS the IOPS didn’t linearly increase per say. Sure the “aggregate” IOPS increased, but a single job, is now as limited to the speed of a 15 disk RAID 6. Instead of the potential of say a 60 disk RAID 60.
- The disks at the time were fast (for SATA drives that is) but compared to modern NL-SAS drives, much lower throughput capability and density.
- The PCI bus and the FSB (this server still had a FSB) was overwhelmed. Remember, this was doing tape AND disk copies. I know a lot of less seasoned folks don’t think its easy to overwhelmed a PCI bus, but that’s not actually true (more on that later) even more so when you’re PCI bus is version 1.x.
- This solution consumed a TON or rack space, each JBOD was 3U and we had 7 of them (md1200 was 2U). And each drive was only 1TB, so best case with 15 disk RAID 6, we were looking at 13TB usable By today’s standards, this TB per RU is terrible even for tier 1 storage, let alone backup.
- We were using a RAID 6 instead of 10. I know what some of you are thinking, its backup, so why would you use RAID 10? Backup’s are probably every much as disk intensive as your production workloads and likely more so. On top of that, we force them to do all their work in what’s typically a very constrained window of time. RAID 6 while great for sequential / random reads, does horribly at writes in comparison to a RAID 10 (I’m exuding fancy file systems like CASL for this generalization). Unless you’re running one backup at a time, you’re likely throwing tons of parallel writes at this storage. And while each stream may be sequential in nature, the aggregation of them is random in appearance to the storage. At the end of the day, disk is cheap, and cheap disk (NL-SAS) is even cheaper so splurge on RAID 10. 
  - This was also compounded by the point I made above about one LUN per JBOD
- It was locked into what IMO is a less than ideal Dell (LSI) RAID card. Again, I know what some of you are thinking. “HW” RAID is SO much better than SW RAID. Its a common and pervasive myth. EMC, NetApp, HP, IBM, etc. are all simple x86 servers with a really fancy SW RAID. SW RAID is fine, so long as the SW that’s doing the RAID is good. In fact, SW RAID is not only fine, in many cases, it’s FAR better than a HW RAID card. Now, I’m not saying LSI sucks at RAID, they’re fine cards, but SW has come a long way, and I really see them as the preferred solution over HW RAID. I’m not going to go into the WHY’s in this post, but if you’re curious, do some research of your own, until I have time to write another “vs” article.
- Using Dell, HP, IBM, etc for bulk storage is EXPENSIVE compared to what I’ll call 2nd tier solutions. Think of this as somewhere in-between Dell and home brewing your own solution. 
  - Add on to this, manufactures only want you running “their” disks in “their” JBODs. Which means not only are you stuck paying a lot for a false sense of security, you’re also incredibly limited to what options you have for your storage.
- All the HW was approaching EOL.

There’s probably a few more reason why this solution was no longer ideal, but you get the point. The reality is, our backup solution was changing, and it was a perfect time to re-think our storage. In part 2, we’ll get into what we thought we wanted, what we needed, and what we had budget for.