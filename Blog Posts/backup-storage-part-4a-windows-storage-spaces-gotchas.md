---
title: 'Backup Storage Part 4a: Windows Storage Spaces Gotcha&#8217;s'
date: '2015-09-26T18:16:34+00:00'
status: publish
permalink: /backup-storage-part-4a-windows-storage-spaces-gotchas
author: 'Eric Singer'
excerpt: ''
type: post
id: 116
category:
    - Uncategorized
tag:
    - backup
    - storage
    - 'storage spaces'
    - windows
post_format: []
---
The pro and the con of a software defined storage is that its not a turn key solution. Not only do you have the power to customize your solution, you also have no choice but to design your solution. With Storage Spaces, we figured most of this stuff out before selecting it as our new backup storage solution. At the time, there was some documentation on storage spaces, but it was very much a learning process. Most “how to’s” were demonstrated inside labs, so I found some aspects of the documentation to be useless, but I was able to glean enough information, to at least know what to think about.

So to get started, if you end up here because you want to build a solution like this, I would encourage you to start with this FAQ’s that MS has put together. A lot of the questions I had were answered [here](http://social.technet.microsoft.com/wiki/contents/articles/11382.storage-spaces-frequently-asked-questions-faq.aspx).

I want to go over a number of gotcha’s with WSS before you take the plunge:

1. If you’re used to and demand a solution that notifies you automatically of HW failures, this solution may not be right for you. Don’t get me wrong, you can tell that things are going bad, but you’ll need to monitor them yourself. MS has written a health script, and I myself was also able to put together a very simple health script (I’ll post it once I get my GitHub page up).
2. WSS only polls HW health once every 30 minutes. You can’t change this. That means if you rip an power supply out of your enclosure it will take up to 30 minutes before the enclosure goes into an unhealthy state. I confirmed this with MS’s product manager.
3. Disk rebuilds are not automatic, nor are they what I would call intuitive. You shouldn’t just rip a disk out when its bad, plop a disk in and walk away. There is a process that must be followed in order to replace a failed disk. BTW, this process as of now, is all powershell based.
4. Do NOT cheap out on consumer grade HW. Stick to the MS HCL found [here](http://www.windowsservercatalog.com/results.aspx?&chtext=&cstext=&csttext=&chbtext=&bCatID=1642&cpID=0&avc=10&ava=0&avq=0&OR=1&PGS=25&ready=0). There have been a number of stability problems listed with WSS, and its almost always has to do with not sticking with the HCL and not WSS’s reliability.
5. This isn’t specific to WSS, but do not plan on mixing SATA and SAS drives on the same SAS backplane. Either go all SAS or go all SATA, avoid mixing. For HDD’s specifically, the cost is so negligible between SATA and SAS, I would personally recommend just sticking with SAS, unless you never plan to cluster. 
  1. Do NOT use SAS expanders either, again, stop cheaping out, this is your data we’re talking about here.
6. Do NOT plan on using parity based virtual disks, they’re horrible at writes, as in 90MBps tops. Use mirroring or nothing.
7. Do NOT plan on using dedicated hot spares, instead plan on reserving free space in your storage pool. This is one of many advantages to WSS. it uses free space and ALL disks to rebuild your data. 
  1. If you plan on using the “enclosure awareness”, you need to reserve a drives capacity of free space \* the number of enclosures you have. So if you have 4 enclosures and you’re using 4TB drives, you must reserve 16TB of space per storage pool spanned across those enclosures.
8. Plan on taking point 7, and also ensuring there’s at least 20% free space in your pool. I like to plan like this. 
  1. Subtract 20% right of the top of your raw capacity. So if you have 200TB raw, that’s 160TB.
  2. As mentioned in point 7\\1. If you plan to use enclosure awareness, subtract a drive for each enclosure, otherwise, subtract at least one drives worth of capacity. So in we had 4 enclosures and they had 4TB drives, that would be 160TB – 16TB = 144TB usable before mirroring.
9. I recommend thick provisioned disk, unless you’re going to be VERY diligent about monitoring your pools free space. Your storage pool will go OFFLINE if even one disk in the pool runs low on free space. Thick provisioning prevents this, as the space will only allocate what it can reserve.
10. Figure out your strip width (number of disks in a span) before building a virtual disk. Plan this carefully because it can’t be reversed. This has its own set of gotcha’s. 
  1. This determines the increments of disks you need to expand your pool. If you choose a 2 column mirror, that means you need 4 disks to grow the virtual disk.
  2. Enclosure awareness is also taken into account with columns.
  3. Performance is dependent on the number of columns. if you have 80 disk, and you create a 2 column mirrored virtual disk, you’ll only have the read performance of 4 disks, and write performance of 2 disks (even with 80 disks). You will however be able to grow at 4 disk increments. However, if you create a virtual disk with 38 columns, you’ll have the read performance of 76 disks, and the write performance of 38, but you’ll need 76 disks to grow the pool. So plan your balance of growth vs. performance.
11. Find a VAR that has WSS experience to purchase your HW through. Raid Inc. is who we used, but now other vendors such as Dell have also taken to selling WSS approved solutions. I still prefer Raid Inc due to pricing, but if you want the warm and fuzzies, its good to know you now can go to Dell.
12. Adding storage to an existing pool does not rebalance the data across the new disks. The only way to do this is to create a new virtual disk, move the data over, and remove the original virtual disk. 
  1. This is resolved in server 2016.

Those are most of the gotcha’s to consider. I know it looks big, but I’m pretty confident that every storage vendor you look at, has their own unique list of gotcha’s. Heck, a number of these are actually very similar to NetApp/ZFS, and other tier 1 storage solutions.

We’ll nerd out in my next post on what HW we ended up getting, what it basically looks like and why.