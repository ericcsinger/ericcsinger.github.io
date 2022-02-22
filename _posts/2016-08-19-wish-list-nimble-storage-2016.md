---
title: 'Wish list: Nimble Storage (2016)'
date: '2016-08-19T23:45:00+00:00'
status: publish
permalink: /wish-list-nimble-storage-2016
author: 'Eric Singer'
excerpt: ''
type: post
id: 358
category:
    - Storage
tag:
    - 'nimble storage'
    - 'wish list'
post_format: []
---
Introduction:
=============

These are just some random things that I would love to see implemented by Nimble Storage in their solution. I don’t actually expect most of this stuff to happen in a year, but it would be interesting to see how many do. Some are more realistic than others of course, but part of the fun in this is asking for some stuff that perhaps is a bit of a stretch.

Hardware:
=========

- **Better than 10G networking:** Given that we now have SSD’s becoming the storage of choice, its more than likely the networking which will bottleneck the SAN. I understand Nimble offers 4 10g links per controller, but this is less ideal than two 40g links. 40g is now available in all respectable server and switches, I see no reason why Nimble also shouldn’t offer the same.
- **Denser JBODs:** I think Nimble has decent capacity per rack unit, but they could do a lot better. Modern JBOD’s offer as high as 84 disks in 5u and 60 disks in 4u for 3.5 inch drives and 60 disks in 2u for 2.5 inch drives. I would love to see Nimble offer better density. Just like they do now with SSD cache, I see no reason why the JBOD needs to be filled at time of purchase. Make 15 disk packs available that are installable by customers, then simply add an “activate” option for the new disk span.
- **Cheap and Deep:** Nimble now has a great storage line for most tier 0 – 3 workloads, but I still feel they’re missing one additionally important tier, backup. Yes, you could use their hybrid arrays for backup, but at the current cost structure, and based on the problem I raised above (rack units), I don’t feel Nimbles CS series are a prudent use of resources for backup. Most backup data is already compressed, and random IO tends to not be a constraining factor. I’d love to see an array designed for high throughput sequential workloads, with lots of non-compressed usable capacity. Me personally, I’d even be ok if they offered a detuned CS series that disabled caching and compression to ensure the array is used for its designed purpose. What I’m NOT asking for is yet another dedupe target.
- **More scalable architecture**: Just my opinion, but I think the whole idea of keeping the controllers in the chassis while great for smaller workloads, doesn’t make as much sense for larger storage implementations. There is a reason EMC, NetApp and others have external controllers. It allows much greater expansion, and theoretically better performance. I get the idea of having a series that can go from the smallest to the largest, with a simple hot swappable controller, but with external controllers, that would be doable as well and, it would more than likely work for completely different generations. This would also allow more powerful controllers (quad socket as an example). If CPU’s are truly the bottleneck, then why limit the number of cores and sockets you have access to by using a chassis that restricts such things?
- **All NVMe array:** I know the tech is still new, but it would be awesome to see an NVMe array in the near future.

Hardware / Software:
====================

- **Storage Tiers:** Its either all flash or hybrid, but why not offer both under the same controller? Simply rate the controller based on peak IOPS, and then lets us pick what storage tier (s) we want to run underneath. Any spinning disk would go into a hybrid tier and any flash would go into a flash tier. I’m not even looking for automated tiering, just straight up manual tiers.

Software:
=========

- **Monitoring:** I would really like to have more metrics available via SNMP that are typical on other arrays. Queue depth, average IO size, per disk metrics, CPU, RAM, etc.
- **File Protocols:** Now that you have FC + iSCSI, why not add SMB + NFS as well? I would love to see Tintri like features in Nimble.
- **Replica destinations:** I’ve been asking for more than one destination for 4 years, so here it goes again. I would like to replicate a volume to more than one destination. If I have a traditional failover cluster, I want to replicate it locally and to DR via a snapshot. Right now, that’s not doable TMK.
- **Full Clones:** Linked clones are great for cases where you think you’re going to get rid of a volume after X period of time, but they really don’t make sense long term. I would love an option to create full clones, or even promote existing linked clones into full clones. Maybe I want to get rid of the parent volume and keep the clone, I can’t do that right now.
- **Full featured client agent:** I would LOVE to have the ability for a client to do the following actions. This would allow my DBA’s to do their own test / dev refreshes without me needing to delegate them access to the Nimble console.

- Initiate a new snapshot (either at a volume group level or an individual volume)
- Pick from a library of existing snapshots to mount
- Clone a volume and mount it automatically
- Delete a volume / snapshot / clone.
- Swap a volume group (this would be a great workflow feature for UAT refreshes).

- **Virtual Appliance GA’ed:** How about letting me have access to a crippled virtual appliance so I can test some things out that might be a little risky trying in prod. Everyone in IT knows its not a good practice to test in prod, and yet with storage, we have no choice but to do that.
- **Better Volume Management:** If there is one model that everyone should try and duplicate when it comes to management its Microsoft ACL propagation and inheritance structure. I’m tired of going into individual volumes to change things like ACLS. Even using volumes groups, while it helps, doesn’t eliminate the need. I would much rather group volumes in folders (or even better tags) and apply things like protection policies and ACLS globally, rather than contend with trying to script static entries. Additionally, being able to use tags IMO, is far smarter than say using folders. Folders are rigid, tags are flexible. Basically a tag can do everything a folder can do, but the reverse is not true.
- **Update Picker:** I like running the latest version of NOS, but for consistency sake, I also like having my SANs on the same revision. There have been times where we were in the middle of a series of SAN upgrades and you released a new minor version. When I go to download the NOS version on SAN I’m updating, it no longer matches the rev on the SAN’s I’ve already upgraded. So ultimately I end up having to call support and request the older rev, and manually download it.
- **Centralized Console:** It would be great if you guys came out with something like a vCenter server for Nimble. A central on premises console that I could use to do everything across all my SAN’s. This would mitigate the need to use groups for management reasons, and instead would allow me to manage all SAN. I could easily see this console being where things such as updates are pushed out, new volume ACL’s are created, performance monitoring is done, etc.
- **Aggressive Caching in GUI:** Offer an option right in the GUI to use default (random only), sequential and random, or pin to cache.
- **Web UI improvements:**
  - Switch to a nice and fast HTML5 console.
  - Show random / sequential and write / read in the time line graph, and show it as a stacked graph instead of a line graph.
  - Don’t show cache misses for sequential IO.
  - Show CPU usage
  - Show the top 5 volumes for real time, last minute, last 5 minutes, last 15 minutes, last hour and last day for the following metrics. 
      - Cache misses
      - Total IOPS
      - Total throughput
      - CPU usage
- **Use GUIDS not friendly names:** I would actually like to see Nimble switch to using a generic GUID for volume ID, and then have a simple friendly name that’s associated with it. There are times where I wanted to change my naming convention, but doing so, would require detaching the volume from the host that’s serving it.
- **Per Volume / Per host MPIO policy:** Right now it seems the entire array needs to be enabled for intelligent MPIO. I would actually like to see there be an additional option to only do this for certain initiator groups or certain volumes.
- **Snapshot browser:** I would love a tool that would allow us to open a snapshot through the management interface and browse for files to recover, rather than having to mount a snapshot to the OS. Even better would be if I could open a Vmware snapshot and then open a VMDK as well.