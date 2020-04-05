---
title: 'Backup Storage Part 3b: Scale Out Storage'
date: '2015-07-11T14:56:14+00:00'
status: publish
permalink: /backup-storage-part-3b-scale-out-storage
author: 'Eric Singer'
excerpt: ''
type: post
id: 80
category:
    - Uncategorized
tag: []
post_format: []
---
While evaluating EMC’s DataDomain solution, our EMC rep suggested we also take a look at their Isilon product. Not being a person to turn down a chance to check out new technology I happily obliged.

Before we get into my thoughts on Isilon, let’s go over a simplistic overview of what scale out storage is, and what makes it different from say an EMC VNX.

SANs like the EMC VNX are what I’ll refer to as more traditional storage. Typically they’re deployed with two controllers, and each controller shares access to one or more JBODs. Within this architecture, there are a few typical “limitations”. I’m putting limitations in quotes as in a lot cases most folks don’t run into these limitations when a system is properly designed.

1. A controller is really jut an x86 server and like any server it is only going to have so many PCI slots. Just like you would in any server you need to balance the use of those PCI slots. In most cases, you’re going to be balancing how many slots are used for host uplinks (targets) or use for storage connections (initiator).
2. While some high end SAN’s support true active / active (and more than two controllers BTW), your average configuration is going to have one controller active and the other one waiting to take over. Meaning, 50% of your controllers are doing nothing all day long. 
  1. Some people will divide their storage up, and have both controllers hosting LUNs. Meaning if there is 50 disks, 25 disks may be active on controller 1, and the remaining 25 will be active on controller 2. In the case of a two controller configuration, your net worst case performance will be that of a single controller.
3. When you max out the number of disks, CPU, or target/initiator ports that a SAN can host, you need to deploy another SAN. At this point, its likely you’re leaving some amount of resources on an island never to be utilized again. Maybe its free spaces, maybe its the CPU, no matter what, something is being left under-utilized. 
  1. This has a negative effect when we start talking about things like file shares. Now this means spreading your file system over non-related storage units, it can get messy quick.

This is the way most shops run, and honestly its not a bad thing. Having some extra of something isn’t always a negative, as long as its the right extra.

So how does scale out fit into all of this? What does any of this have to do with backup? Well first, lets start with the basics of scale out storage. There are few things to keep in mind.

1. Scale out no longer uses shared disk. There is instead 1 controller to 1 set of disks and this forms a node or a brick. You then connect multiple nodes together over a backbone network (think a private network used for node to node communication only). This forms a scale out cluster. Over the scale out cluster you typically have one file system, or rather one contiguous allocated amount of space.
2. The number of nodes in a cluster is mostly limited by the number of backbone connections that can be provisioned. In the case of a 48 port infiniband switch, that means you basically have room for 48 nodes in a single cluster.
3. Resiliency within the cluster is maintained by providing copies or parity at not only and individual disk level, but also a node level.
4. Typically (not always) scale out is accessed over SMB/NFS and not iSCSI or FC.

So what makes this architecture so great, and why did we look at it for backup? Well I’m going to highlight what we learned from speaking with EMC about Isilon.

First, what makes the architecture slick.

1. Theres a lot less waste (at scale) in this architecture. You don’t have pools of capacity spread across multiple SANs being unused. With scaleout, its one massive pool of storage. 
  1. A cluster is made up 3 or more like nodes
  2. Node can be divided up into tiers based on their performance. Each performance tier must have a minimum of three nodes to be added into a cluster.
2. To grow capacity, you simply add a node into the cluster. Depending on your resiliency scheme, you may end up adding 100% of the nodes capacity into the cluster. 
  1. One big win with scaleout that most traditional SAN’s don’t have, is when you do add capacity, the data in use is re-balanced across all nodes, thus ensuring every node is being evenly used.
3. Isilon offer some pretty slick management capabilities. For example, being able to control the resiliency settings at not only the cluster level but also down to the folder / file level. Maybe that archive you have doesn’t need the same resiliency as your active files. This same management capability also applies to performance polices. Your archive data can reside on slow spinning disk and your active data can reside on their 10k RPM tier.
4. Performance increases linearly as you add nodes.

So what makes this potentially great for backup?

1. The lack of wasted space means you’re able to suck 100% of the capacity from your storage (after parity). This means no space being wasted across luns or different SAN units. 100% space is allocated across these devices.
2. Due to the simplicity of adding nodes hot and thus adding capacity, if you start running out of space, there’s no need to do crazy things like expand luns, move data to new luns, migrated data within a storage pool so that its rebalanced. All this stuff goes away with scale out.
3. The amount of space in general supported by this solution should be able to hold a lot of your data for a long period of time.
4. Throughput is pretty good on this architecture and it only gets better as you add nodes.

All this said, no architecture is perfect and Isilon is no exception. There were a few negatives that ultimately led to us passing on it at the time of evaluation.

1. We planned to backup to the Isilon unit and then backup the Isilon unit to tape. The only way to do this (correctly) was to purchase their NDMP appliance. This wouldn’t have been an issue per say, except that the NDMP appliance IIRC has some pretty terrible backup throughput numbers. I don’t recall the exact numbers, but I want to say something like 200MBps. We are going to be backing up over 100TB of data, and 200MBps wasn’t going to cut it.
2. Isilon is cool and it has a hot price tag along with it. While I’m sure at scale the cost per GB would be decent, it just wasn’t something we could afford. You have to buy three nodes at a minimum and we’d only have one nodes capacity. it would have blown our storage budget and we would have ended up with a lot less capacity than other solutions.
3. Performance does scale as you add nodes, but it takes A LOT of nodes to equal the performance of some other solutions we were looking at. So again, at scale, this may have been a contender, but not at the levels we were thinking about.
4. They had no cloud solution, meaning I couldn’t replicate to an Isilon unit in AWS. This wasn’t a deal breaker but it wasn’t ideal either.
5. Like most EMC solutions, it was mired with all kinds of licensing features and various ways to nick and dime you to death. Half of the cool features we heard about were a la carte license features, each jacking the price up more and more.

All in all, a very cool solution that’s unfortunately too expensive, and too limiting for us. I think if we were contending with PB’s of data, this solution would be the only right way to tackle it, but in our case, a few hundred TB can easily be managed by plenty of other solutions.