---
title: 'Review: 2.5 years with Nimble Storage'
date: '2015-11-21T21:27:56+00:00'
status: publish
permalink: /review-2-5-years-with-nimble-storage
author: 'Eric Singer'
excerpt: ''
type: post
id: 131
category:
    - Uncategorized
tag:
    - 'nimble storage'
    - review
    - storage
post_format: []
---
**Disclaimer:** I’m not getting paid for this review, nor have I been asked to do this by anyone. These views are my own, and not my employers, and they’re opinions not facts .

Intro:
======

To begin with, as you can tell, I’ve been running Nimble Storage for a few years at this point, and I felt like it was time to provide a review of both the good and bad. When I was looking at storage a few years ago, it was hard to find reviews of vendors, they were very short, non-informative, clearly paid for, or posts by obvious fan boys.

Ultimately Nimble won us over against the various storage lines listed below. Its not a super huge list as there was only so much time and budget that I had to work with . There were other vendors I was interested in but the cost would have been prohibitive, or the solution would have been too complex. At the time, Tintri and Tegile never showed up in my search results, but ultimately Tintri wouldn’t have worked (and still doesn’t) and Tegile is just not something I’m super impressed with.

- NetApp
- X-IO
- Equallogic
- Compellent
- Nutanix

After a lot of discussions and research, it basically boiled down to NetApp vs. Nimble Storage, with Nimble obviously winning us over. While I made the recommendation with a high degree of trepidation and even after a month with the storage, wondered if I totally made an expensive mistake, I’m happy to say, it was and is still is a great storage decision. I’m not going into why I chose Nimble over NetApp, perhaps some other time, for now this post is about Nimble, so let’s dig into it.

When I’m thinking about storage, the following are the high level area’s that I’m concerned about. This is going to be the basic outline of the review.

- Performance / Capacity ratios
- Ease of use
- Reliability
- Customer support
- Scaling
- Value
- Design
- Continued innovation

Finally, for your reference, we’re running 5 of their 460’s, which is between their cs300 and cs500 platforms and these are hybrid arrays.

Performance / Capacity Ratios
=============================

Good performance like a lot of things is in the eye of the beholder. When I think of what defines storage as being fast, its IOPS, throughput and latency. Depending on your workload, more of one than the other may be more important to you, or maybe you just need something that can do ok with all of those factors, but not awesome in any one area. To me, Nimble falls in the general purpose array, it doesn’t do any one thing great, but it does a lot of things very well.

Below you’ll find a break down of our workloads and capacity consumers.

**IO breakdown (estimates):**

- MS SQL (50% of our total IO) 
  - 75% OLTP
  - 25% OLAP
- MS Exchange (30% of total IO)
- Generic servers (15% of total IO)
- VDI (5% of total IO)

**Capacity consuming apps:**

- SQL (40TB after compression)
- File server (35TB after compression)
- Generic VM’s (16TB after compression)
- Exchange (8TB after compression)

**Compression? yeah, Nimble’s got compression…**

Nimble’s probably telling you that compression is better than dedupe, they even have all kinds of great marketing literature to back it up. The reality like anything is, it all depends. I will start by saying if you need a general purpose array, and can only get one or the other, there’s only one case where I would choose dedupe over compression, which is data sets mostly consisting of operating system and application installer data. The biggest example of that would be VDI, but basically where ever you find your data being mostly consistent of the same data over and over. Dedupe will always reduce better than compression in these cases. Everything else, you’re likely better off with compression. At this point, compression is pretty much a commodity, but if you’re still not a believer, below you can see my numbers. Basically, Nimble (and everyone else using compression) delivers on what they promise.

- **SQL:** Compresses very well, right now I’m averaging 3x. That said, there is a TON of white space in some of my SQL volumes. The reality is, I normally get a minimum of 1.5x and usually end up more along the 2x range.
- **Exchange 2007:** Well this isn’t quite as impressive, but anything is better than nothing, 1.3x is about what we’re looking at. Still not bad…
- **Generic VM’s:** We’re getting about 1.6x, so again, pretty darn good.
- **Windows File Servers:** For us its not entirely fair to just use the general average, we have a TON of media files that are pre-compressed. What I’ll say is our generic user / department file server gets about 1.6 – 1.8 reduction.

**Show me the performance…**

Ok, so great, we can store a lot of data, but how fast can we access it? In general, pretty darn fast…

The first thing I did when we got the arrays was fire up IOMeter, and tried trashing the array with a 100% random read 8k IO profile (500GB file), and you know what, the array sucked. I mean I was getting like 1,200 IOPS, really high latency and was utterly disappointed almost instantly. In hind sight, that test was unrealistic and unfair <span style="text-decoration: underline;">to some extent</span>. Nimble’s caching algorithm is based on random in, random out, and IOmeter was sequential in (ignored) and then attempting random out. For me, what was more bothersome at the time, and still is to some degree is it took FOREVER before the cache hit ratio got high enough that I was starting to get killer performance. Its actually pretty simple to figure out how long it would take a cold dataset like that to completely heat up, divide (524288000k/9600) or 15 hours. The 524288000 is 500GB converted to KB. The 9600 is 8k \* 1200IOPS to figure out the approximate throughput at 8k.

So you’re probably think all kinds of doom and gloom and how could I recommend Nimble with such a long theoretical warm up time? Well let’s dig into why:

- That’s a synthetic test and a worst case test. That’s 500GBs of 100% random, non-compressed data. If that data was compressed for example to 250GB, it would “only” take 7.5 hours to copy into cache.
- On average only 10% – 20% of you total dataset is actually hot. If that file was compressed to 250GB, worst case you’re probably looking at 50GB that’s hot, and more realistic 25GB.
- That was data that was written 100% sequential and then being read 100% random. Its not a normal data pattern.
- That time is how long it takes for 100% of the data to get a 100% cache hit. The reality is, its not too long before you’re starting to get cache hits and that 1,200 IOPS starts looking a lot higher (depending on your model).

There are a few example cases where that IO pattern is realistic:

- **TempDB:** When we were looking at Fusion IO cards , the primary workload that folks used them for in SQL was TempDB. TempDB can be such a varied workload that its really tough to tune for, unless you know your app. Having a sequential in, random out in TempDB is a very realistic scenario.
- **Storage Migrations:** Whether you use Hyper-V or VMware, when you migrate storage, that storage is going to be cold all over again with Nimble. Storage migrations tend to be sequential write.
- **Restoring backup data:** Most restores tend to be sequential in nature. With SQL, if you’re restoring a DB, that DB is going to be cold.

if you recall, I highlighted that my IOmeter test was unrealistic except in a few circumstances, and one of those realistic circumstances can be TempDB, and that’s a big “it depends”. But what if you did have such a circumstance? Well any good array should have some knobs to turn and Nimble is no different. Nimble now has two ways to solves this:

- **Cache Pinning:** This feature was released in NOS 2.3, basically volumes that are pinned run out of flash. You’ll never have a cache miss.
- **Aggressive caching:** Nimble had this from day one, and it was reserved for cases like this. Basically when this is turned on, (volume or performance policy granularity TMK), Nimble caches any IO coming in or going out. While it doesn’t guarantee 100% cache hit ratios, in the case of TempDB, its highly likely the data will have a very high cache hit ratio.

**Performance woes:**

That said, Nimble suffers the same issues that any hybrid array does, which is a cache miss will make it fall on its face, which is further amplified in Nimbles case by having a weak disk subsystem IMO. If you’re not seeing at least a 90% cache hit ratio, you’re going to start noticing pretty high latency . While their SW can do a lot to defy physics, random reads from disk is one area they can’t cheat. When they re-assure you that you’ll be just fine with 12 7k drives, they’re mostly right, but make sure you don’t skimp on your cache. When they size your array, they’ll likely suggest anywhere between 10% and 20% of your total data set size. Go with 20% of your data set size or higher, you’ll thank me. Also, if you plan to do pinning or anything like that, account for that on top of the 20%. When in doubt, add cache. Yes its more expensive, but its also still cheaper than buying NetApp, EMC, or any other overpriced dinosaur of an array.

The only other area where I don’t see screaming performance is situations where 50% sequential read + 50% sequential write is going on. Think of something like copying a table from one DB to another. I’m not saying its slow, in fact, its probably faster than most, but its not going to hit the numbers you see when its closer to 100% in either direction. Again, I suspect part of this has to do with the NL-SAS drives and only having 12 of them. Even with coalesced writes, they still have to commit at some point, which means, you have to stop reading data for that to happen, and since sequential data comes off disk by design, you end up with disk contention.

**Performance, the numbers…**

I touched on it above, but I’ll basically summarize what Nimble’s IO performance spec’s look like in my shop. Again, remember I’m running their slightly older cs460’s, if these were cs500’s or cs700’s all these numbers (except cache misses) would be much higher.

- Random Read: 
  - Cache hit: Smoking fast (60k IOPS)
  - Cache miss: dog slow (1.2k IOPS)
- Random Write: fast (36k IOPS)
- Sequential 
  - 100% read: smoking fast (2GBps)
  - 100% write: fast (800MBps – 1GBps)
  - 50%/50%: not bad, not great (500MBps)

Again, its rough numbers, I’ve seen higher number in all the categories, and I’ve seen lower, but these are very realistic numbers I see.

Ease of use:
============

Honestly the simplest SAN I’ve ever used, or at least mostly. Carving up volumes, setting up snapshots and replication has all been super easy, and intuitive. While Nimble provided training, I would content its easy enough that you likely don’t need it. I’d even go so far as saying you’ll probably think you’re missing something.

Also, growing the HW has been simple as well. Adding a data shelf or cache shelf has been as simple as a few cables and clicking “activate” in the GUI.

Why do I say mostly? Well if you care about not wasting cache, and optimizing performance, you do need to adapt your environment a bit. Things like transaction logs vs DB, SQL vs Exchange, they all should have separate volume types. Depending on your SAN, this is either common place, or completely new. I came from an Equallogic shop, where all you did was carve up volumes. With Nimble you can do that too, but you’re not maximizing your investment, nor would you be maximizing your performance.

Troubleshooting performance can take a bit of storage knowledge in general (can’t fault Nimble for that per say) and also a good understanding of Nimble its self. That being said, I don’t think they do as good of a job as they could in presenting performance data in a way that would make it easier to pin down the problem. From the time I purchased Nimble till now, everything I’ve been requesting is being siloed in this tool they call “Infosite”, and the important data that you need to troubleshoot performance in many ways is still kept under lock and key by them, or is buried in a CLI. Yeah, you can see IOPS, latency, throughput and cache hits, but you need to do a lot of correlations. For example, they have a line graph showing total read / write IOPS, but they don’t tell you in the line graph whether it was random or sequential. So when you see high latency, you now need to correlate that with the cache hits and throughput to make a guess as to whether the latency was due to a cache miss, or if it was a high queue depth sequential workload. Add to that, you get no view of the CPU, average IO size, or other things that are helpful for troubleshooting performance. Finally, they role up the performance data so fast, that if you’re out to lunch and there was a performance problem, its hard to find, because the data is average way too quickly.

Reliability:
============

Besides disk failures (common place) we’ve had two controller failures. Probably not super normal, but none the less, not a big deal. Nimble failed over seamlessly, and replacing them was super simple.

Customer Support:
=================

I find that their claim of having engineers staffing support to be mostly true. By in large, their support is responsive, very knowledgeable and if they don’t know the answer, they find it out. Its not always perfect, but certainly better than other vendors I’ve worked with.

Scaling:
========

I think Nimble scales fantastically so long as you have the budget. At first when they didn’t have data or cache shelves, I would have said they have some limits, but now a days, with their scale in any direction, its hard not to say that they can’t adapt to your needs.

That said, there is one area where I’m personally very disappointed in their scaling, which is going up from an older generation to a newer generation controllers. In our case, running the cs460’s requires a disruptive upgrade to go to the cs500’s or cs700’s. They’ll tell me its non-disruptive if I move my volumes to a new pool, but that first assumes I have SAN groups, and second assumes I have the performance and capacity to do that. So I would say this is mostly true, but not always.

Value / Design:
===============

**The hard parts of Nimble…**

If we just take face value, and compare them based on performance and capacity to their competitors, they’re a great value. If you open up the black box though and start really looking at the HW you’re getting, you start to realize Nimble’s margins are made up in their HW. A few examples…

- Using Intel sc3500’s (or comparable) with SAS interposers instead of something like an STEC or HTST SAS based SSD.
- Supermicro HW instead of something rebranded from Dell or HP. The build quality of Supermicro just doesn’t compare to the others. Again, I’ve had two controller failures in 2 years.
- Crappy rail system. I know its kind of petty, but honestly they have some of the worst rails I’ve seen next to maybe Dell’s EQL 6550 series. Tooless kits have kind of been a thing for many years now, it would be nice to see Nimble work on this
- Lack of cable management, seriously, they have nothing…

Other things that bug me about their HW design…

Its tough to understand how to power off / on certain controllers without looking in the manual. Again, not something you’re going to be doing a lot, but still it could be better. Their indicator lights are also slightly mis-leading with a continual blinking amberish orangeish light on their chassis. The color is initially misleading that perhaps an issue is occurring.

While I like the convince of the twin controller chassis, and understand why they, and many other vendors use it. I’d really like to see a full sized dual 2u rack mount server chassis. Not because I like wasting space, but because I suspect it would actually allow them to build a faster array. Its only slightly more work to unrack a full sized server, and the reality is I’d trade that any day for better performance and scalability (more IO slots).

I would like to see a more space conscious JBOD. Given that they over subscribe the SAS backplane anyway, they might as well do it while saving space. Unlike my controller argument, where more space would equal more performance, they’s offering a configuration that chews up more space, with no other value add, except maybe having front facing HDD’s. I have 60 bay JBODs for backup that fit in 4u. Would love to see that option for Nimble, that would be 4 times the amount of storage in about the same amount of space.

**Its time to talk about the softer side of Nimble….**

The web console, to be blunt is a POS. Its slow, buggy, unstable, and really, I hate using it. To be fair, I’m bigoted against web consoles in general, but if they’re done well, I can live with them. Is it usable, sure, but I certainly don’t like living in it. If I had a magic wand, I would actually do away with the web console on the SAN its self and instead, produce two things:

- A C# client that mimic’s the architecture of VMware. VMware honestly had the best management architecture I’ve seen (until they shoved the web console down my throat). There really is no need for a web site running on the SAN. The SAN should be locked down to CLI only, with the only web traffic being API calls. Give me a c# client that I can install on my desktop, and that can connect directly to the SAN or to my next idea below. I suspect, that Nimble could ultimately display a lot more useful information if this was the case, and things would work much faster.
- Give me a central console (like vCenter) to centrallly manage my arrays, I get that you want us to use infosite and while its gotten better, its still not good enough. I’m not saying do away with info site, but let me have a central, local, fast solution for my arrays. Heck, if you still want to do a web console option, this would be the perfect place to run it.

The other area I’m not a fan of right now, is their intelligent MPIO. I mean I like it, but I find its too restrictive. Being enabled on the entire array or nothing is just too extreme. I’d much rather see it at the volume level.

Finally, while I love the Windows connection manager, it still needs a lot of work.

- NCM should be forwards and backwards compatible, at least to some reasonable degree. Right now its expected that it matches the SAN’s FW version and that’s not realistic.
- NCM should be able to kick off on demand snaps (in guest) and offer a snapshot browser (meaning show me all snaps of the volume).
- If Nimble truly want to say they can replace my backup with their snapshots, then make accessing the data off them easier. For example, if I have a snap of a DB, I should be able to right click that DB, and say (mount a snapshot copy of this DB, with this name) and the Nimble goes off and runs some sort of workflow to make that happen. Or just let us browse the snaps data almost like a UNC share.

**The backup replacement myth…**

Nimble will tell you in some cases that they have a combined backup and primary storage solution. IMO, that’s a load of crap. Just because you take a snapshot, doesn’t mean you’ve backed up the data. Even if you replicate that data, it’s still not counting as a backup. To me, Nimble can say they’ve solved the backup dilemma with their solution when they can do the following:

- Replicate your data to more than one location
- Replicate your data to tape every day and send it offsite.
- Provide an easy straight forward way to restore data out of the snapshots.
- Truncate transaction logs after a successful backup.
- Provide a way of replicating the data to non-Nimble solution, so the data can be restored anywhere. Or provide something like a “Nimble backup / recovery in the cloud” product.

Continued Innovation:
=====================

I find Nimble’s innovation to be on the slow side, but steady, which is a good thing. I’d much rather have a vendor be slow to release something because they’re working on perfecting it. In the time I’ve been a customer, they’ve released the following features post purchase:

- Scale out
- Scale deep
- External flash expansion
- Cache Pinning
- Virtual Machine IOPS break down per volume
- Intelligent MPIO
- Cache Pinning
- QOS
- RestAPI
- RBAC
- Refreshed generation of SANS (faster)
- Larger and larger cache and disk shelves

Its not a huge list, but I also know what they’re currently working on, and all I can say is, yeah they’re pretty darn innovative.

Conclusion and final thoughts:
==============================

Nimble is honestly my favorite general purpose array right now. Coming from Equallogic, and having looked at much bigger / badder arrays, I honestly find them to be the best bang for the buck out there. They’re not without faults, but I don’t know an array out there that’s perfect. If you’re worried they’re not “mature enough”, I’ll tell you, you having nothing to fear.

That said, its almost 2016 and with flash prices being where they are now, I personally don’t see a very long life for hybrid array going forward, at least not as high performance mid-size to enterprise storage arrays. Flash is getting so cheap, its practically not worth the saving you get from a hybrid, compared to the guaranteed performance you get from an all flash. Hybrids were really filling a niche until all flash became more attainable, and that attainable day is here IMO. Nimble thankfully has announced that an AFA is in the works, and I think that’s a wise move on their part. If you have the time, I would honestly wait out your next SAN purchase until their AFA’s are out, I suspect, they’ll be worth the wait.