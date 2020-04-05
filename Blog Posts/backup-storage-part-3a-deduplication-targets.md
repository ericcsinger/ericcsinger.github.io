---
title: 'Backup Storage Part 3a: Deduplication Targets'
date: '2015-06-02T21:08:31+00:00'
status: publish
permalink: /backup-storage-part-3a-deduplication-targets
author: 'Eric Singer'
excerpt: ''
type: post
id: 67
category:
    - Backup
    - Storage
tag:
    - backup
    - deduplication
    - storage
post_format: []
---
Deduplication and backup kind of go hand in hand, so we couldn’t evaluate backup storage and not check out this segment. We had two primary goals for a deduplication appliance.

1. Reduce racks space while enabling us to store more data. As you know in part 1, we had a lot of rack space being consumed. While we weren’t hurting for rack space in our primary DC, we were in our DR DC.
2. We were hoping that something like a deduplication target would finally enable us to get rid of tape and replicate our data to our DR site (instead of sneakernet).

For those of you not particularly versed in deduplicated storage, there are a few things to keep in mind.

- Backup deduplication and the deduplication you’ll find running on high performance storage arrays are a little different. Backup deduplication tends to use either variable or much smaller block size comparisons. An example, your primary array might be looking for 32k blocks that are the same, where as deduplication target might be looking for 4k blocks that are the same. Huge difference in the deduplication potential. The point is, just because you have deduplication baked into your primary array, does not mean its the same level of dedupliation that’s used in deduplication target.
- Deduplication targets normally also include compression as well. Again, its not the same level of compression found in your primary storage array, typically a more aggressive (CPU intensive) compression algorithm.
- Deduplication targets tend to be in-line dedpulication. Not all are, but the majority of the ones I looked at were. There are pros and cons to this that I’ll go into later.
- In all the appliances I’ve looked at, everyone of them had a primary access meathod of NFS/SMB. Some of them also offered VTL, but the standard deployment method is them acting as a file share.
- Not all deduplication targets offer whats referred to as global dedplication. Depending on the target, you may only deduplicate at the share level. This can make a big difference in your deduplication rates. A true global deduplication solution, will deduplicate data across the entire target, which is the most ideal.

Now I’d like to elaborate a bit on the pros and cons of in-line vs post process (post process) deduplication.

Pros of In-Line:

- As the name implies, data is instantly deduplicated as its being absorbed.
- You don’t need to worry about maintaining a buffer or landing zone space like post process appliances need.
- Once an appliance has seen the data (meaning its getting a deduplication hit) writes tend to be REALLY fast since its just metadata updates. In turn replication speed also goes through the roof.
- You can start replication almost instantly or in real time depending on the appliance. Post process can’t do this, because you need to wait for the data to be deduplicated.

Pros of Post Process:

- Data written isn’t deduplicated right away, which means if you’re doing say a tape backup right afterwards, or a DB verification, you’re not having to rehydrate the data. Basically they tend to deal with reads a lot better.
- Some of them actually cache the data (un-deduplicated) so that restores and other actions are fast (even days later).
- I know this probably sounds redundant, but random disk IO in general is much better on these devices. A good use case example would be doing a Veeam VM verification. So not only reads in general, but random writes.

Again, like most comparisons, you can draw the inverse of each devices pros to figure out its cons. Anyway, on to the devices we looked at.

There were three names that kept coming up in my research, EMC’s DataDomain, ExaGrid and Dell. Its not that they’re the only players in town, HP, Quantum, Seapaton, and a few others all had appliances. However, EMC and ExaGrid were well known, and we’re a Dell shop, so we stuck with evaluating these three devices.

**Dell DR series appliances (In-line):**

After doing a lot of research, discussions, demo’s the whole 9 yards. It became very clear that Dell wasn’t isn’t the same league as the other solutions we looked at. I’m not saying I wouldn’t recommend them, nor am I saying I wouldn’t reconsider them, but not yet, and not in its current iteration. That said, as of this writing, its clear Dell is investing in this platform, so its certainly worth keeping an eye on.

Below are the reasons we weren’t sold on their solution at the time of evaluation.

- At the time, they had a fairly limited set of certified backup solutions. We planned to dump SQL straight to these devices, and SQL wasn’t on the supported list.
- They often compared their performance to EMC, except, they were typical quoting their source side deduplicated protocol, vs. EMC’s raw (unoptimized) throughput. Meaning it wasn’t an apples to apples comparison. When you’re planning on transferring 100TB+ of data on a weekly basis and not everything can use source side deduplication, this makes a huge difference. At the time we were evaluating, Dell was comparing their DR4100 vs. a DD2500. The reality is, the Dell DR6100 is a better match for the DD2500. Regardless, we were looking at the DD4200, so we were way above what Dell could provide.
- They would only back a 10:1 deduplication ratio. Now this, I don’t have a problem with. I’d much rather a vendor be honest then claim I can fit the moon in my pocket.
- They didn’t do multi to multi replication. Not the end of the world, but also kind of a bummer. Once you pick a destination, that’s it.
- Their deduplication was at a share level, not global. If we wanted one share for our DBA’s and one for us, no shared deduplication.
- They didn’t support snapshots. Not the end of the world, but its 2015, snapshots have kind of been a thing for 10+ years now.
- Their source side deduplication protocol was only really suited to Dell products. Given that we weren’t planning on going all in with Dell’s backup suite, this was a negative for us.
- No one, and I mean no one was talking about them on the net. With EMC or ExaGrid, it wasn’t hard at all to find some comments, even if they were negative.
- They had a very limited amount of raw data (real usable capacity) that they could offer. This is a huge negative when you consider that splitting off a new appliance means you just lost half or more of your deduplication potential.
- There was no real analysis done to determine if they were even a good fit for our data.

**ExaGrid (Post process ):**

I heard pretty good things about ExaGrid after having a chat with a former EMC storage contact of mine. If EMC has one competitor in this space, it would be ExaGrid. Like Dell, we spent time chatting with them, researching what others said, and really just mulling on the whole solution. Its kind of hard to solely place them in the deduplicaiton segment as they’re also scale out storage to a degree, but I think this is a more appropriate spot for them.

Pros:

- The post process is a bit of a double edged sword. One of the pros that I outlined above, is that data is not deduplicated right away. This means we could use this device as our primary and archive backup storage.
- The storage scaled out linearly in both performance and capacity. I really like the idea of not having to forklift upgrade our unit if we grew out of it.
- They had what I’ll refer to as “backup specialists”. These were techs that were well versed in the backup software we’d be using with ExaGrid. In our case SQL and Veeam. Point being, if we had questions about maximizing our backup app with ExaGrid, they’d have folks that know not just ExaGrid but the application as well.
- The unit pricing wasn’t simply a “lets get’em in cheap and suck’em dry later”. Predictable (fair) pricing was part of who they are.

Cons:

- As I mentioned, post process was a bit of a double edged sword. One of the big negatives for us, was that their replication engine required waiting until a given file was fully deduplicated before it could begin. So not only did we have to wait say 8 hours for a 4TB file server backup, but then we had to wait potentially another 8 hours before replication could begin. Trying to keep any kind of RPO with that kind of variable is tough.
- While they “scale out” their nodes, they’re not true scale out storage IMO. 
  - Rather than pointing a backup target at a single share, and letting the storage figure everything out, we’d have to manually balance which backup’s go to which node. With the number of backup’s we were talking about and the number of nodes there could be, this sounded like too much of a hassle to me.
  - The landing zone space (un-deduplicated storage) was not scale out, and was instead pinned to the local node.
  - There is no node resiliency. Meaning if you lose one node, everything is down, or at least for that node. While I’m not in love with giving up two or three nodes for parity, at least having it as an option would be nice. IIRC (and could be wrong) this also affected the deduplication part of the storage cluster.
  - Individual nodes didn’t have the best throughput IMO. While its great that you can aggregate multiple nodes throughput, if I have a single 4TB backup, I need that to go as fast as possible and I can’t break that across multiple nodes.
- I didn’t like that the landing zone : deduplicaiton zone was manually managed on each node. This just seemed to me like something that should be automated.

**EMC DataDomain (Inline):**

All I can say is there’s no wonder they’re the leader in this segment. Just an absolutely awesome product overall. As many who know me, I’m not a huge EMC (Expensive Machine Company) fan in general, but there area few areas they do well and this is one of them.

Pros:

- Snapshots, file retention policies, ACL’s, they have all the basic file servers stuff you’d want and expect.
- Multi : Multi replication.
- Very high throughput of non-source (DDBoost) optimized data and even better when it is source optimized.
- Easy to use (based on demo) and intuitive interface.
- The ability to store huge amounts of data in a single unit. At time a head swap may be required, but have the ability to simply swap the head is nice.
- Source based optimization baked into a lot of non-EMC products, SQL and Veeam in our case.
- Archive storage as a secondary option for data not accessed frequently.
- End to end data integrity. These guys were the only ones that actually bragged about it. When I asked this question to others, they didn’t exactly instill faith in their data integrity.
- They actually analyzed all my backup data and gave me reasonably accurate predictions of what my dedupe rate would be and how much storage I’d need. All in all, I can’t speak highly enough about their whole sales process. Obviously everyone wants to win, but EMC’s process was very diplomatic, non-pushy and in general a good experience.

Cons:

- EMC provided some great initial pricing for their devices, but any upgrades would be cost prohibitive. That said, I at least appreciate that they were up front with the upgrade costs so we knew what we were getting into. If you go down this path yourself, my suggestion is buy a lot more storage than you need.
- They treat archive storage and backup storage differently and it needs to be manually separated. For the price you pay for a solution like this, I’d like to think they could auto tier the data.
- They license al a carte. Its not like there’s even a slew of options, I don’t get why they don’t make things all inclusive. Its easier for the customer and its easier for them.
- In general, the device is super expensive. Unless you plan on storing 6+ months of data on the device, I’d bet you could do better with large cheap disks, or even something like disk to tape tiering solution (SpectraLogic Black Pearl). Add to that, unless your data deduplicates well, you’ll also be paying through the nose for storage.
- Going off the above statement, if you’re only keeping a few weeks worth of data on disk, you can likely build a faster solution $ for $ than what’s offered by them.
- No cloud option for replication. I was specifically told they see AWS as competition, not as a partner. Maybe this will change in the future, but it wasn’t something we would have banked on.

All in all, the deduplication appliances were fun to evaluate. However, cutting to the chase, we ended up not going with any of these solutions. As for ROI, these devices are too specialized, and too expensive for what we were looking to accomplish. I think if you’re looking to get rid of tape (and your employer is on board), EMC DataDomain would be my first stop. Unfortunately, for our needs, tape was staying in the picture, which meant this storage type was not a good fit.

Next up, scale out storage…