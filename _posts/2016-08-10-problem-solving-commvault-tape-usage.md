---
title: 'Problem Solving: CommVault tape usage'
date: '2016-08-10T23:52:51+00:00'
status: publish
permalink: /problem-solving-commvault-tape-usage
author: 'Eric Singer'
excerpt: ''
type: post
id: 355
category:
    - Uncategorized
tag:
    - automation
    - backup
    - commvault
    - JAMS
post_format: []
---
**Introduction:**
=================

I hate dealing with tapes, pretty much every aspect of them. The tracking of them is a PITA, having to physically manage them is a PITA, dealing with tape library issues is a PITA, dealing with tape encryption is a PITA, running out of tapes is a PITA, dealing with legal hold for tapes is a PITA, and I could keep going on with the many ways that tape just sucks. What makes matters worse is when you have to deal with MORE tapes.

Now that you know tapes are one of my personal seven levels of hell in IT, you’ll know why I put a bit of time into this solution. Anything I can do to reduce the number of tapes getting exported every day, ultimately leads to some reduction in the PITA scale of tapes.

**The issue:**
==============

To provide a better understanding of the issue at hand, for years I’ve been seeing way too many tapes being used by CV. We’d kick out tapes that had 5% or 10% consumption, and the number of tapes with that level of consumption varied based on what phase of our backup strategy we were in, and what day of the week it was. It could be anything as small as 4 partially filled tapes, to times where we had 10+ tapes that weren’t filled all the way up. If the consumed data should fit on 16 tapes, and we’re kicking out 26 tapes, that’s a problem IMO. I’m sure many of you out there have contended with this in CV specifically, and I’d bet those of you using other vendors products have run into this too. I’m going to first explain why the problem is occurring, and then I’ll go over how I’ve reduced most of the waste.

**The Why?**

In CV, we have storage policies, and short of going into an explanation of what they are for others not familiar with CV, just think of it as an island of backup data. That island of data doesn’t co-mingle with other islands of data on disk, and tape is no exclusion. What that means is when you backup data to a storage policy and want to copy it to tape, that data getting copied to tape will automatically reserve the entire tape being used. In turn, each storage policy then reserves its own unique tapes so that data does not co-mingle together. This means for every storage policy you have, you’re guaranteed at least one unique tape per storage policy at a minimum. Now, each storage policy can have a number of streams configured. To keep things simple, let’s just ignore multiplexing for now. When a storage policy has a stream limit of 1, that means only 1 tape drive will be used, when it has a stream policy of 4, that means 4 tape drives will be used. Now, as you copy data to tape, you normally have more than 1 streams worth of data, you probably have at least one for each client in your environment (and likely much more than that). This is a good thing, having more streams means we can run data copy operations in parallel. In the case of the 4 streams example, that means we can use 4 tape drives in parallel to copy data for the example storage policy. What this also means is depending on circumstances, we could end up with 4 tapes not being filled all the way as well. Streams are optimized for performance, NOT for improving tape utilization. Now, imagine you have more than one storage policy, let’s just say 4 storage polices, each being their own island, and each with a stream limit of 2. That means you could end up with up to 8 tapes not being fully utilized. I’m also ignoring for now that in CV, you can separate incremental and fulls to different storage policies which exacerbates the problem further (taking one island and making it two).

In our case, we have 4 storage policies and we had gone through a process of merging our Fulls and Incs into a single storage policy to consolidate tapes already. We have a total of 6 tape drives, which means if we just configured the storage policies to fight over the tape drives @6 streams each, we could end up in theory with 24 partially filled tapes. We’re smarter than that of course, so that wasn’t out problem. Our problem was finding the right balance between how many streams a storage policy needed to copy all its data in our window, and not making it so high that we ended up wasting tape. Pre-solution, we almost always had 4 – 6 tapes that were wasted, as in 100GB on a 2000GB tape. It was annoying and wasteful.

**Solution, problems again, improved solution:**
================================================

There are two main components to the solution.

- Scripting storage policy stream modification via task scheduler (MVP JAMS in our case).
- CommVault introducing Global Tape Policies in v11 
  - This allows tapes to be shared, no longer residing on an island as mentioned above. So storage policy 1, 2, 3 and 4 can all share the same tape. Way more efficient.

In our case, when we saw the global tape policy, it was like a halo of light and angels singing, going off in our head. This was it, our problems were FINALLY solved. After going through the very tedious task of migrating to this solution, we found that we were still using 4 – 6 tapes a day more than we needed. The problem was not that data was not co-mingling, it was. No, the problem was that we set the global tape policy to 6 streams, and every day, it was using 6 tape drives for backups. At first we tried to solve the problem by limiting the aux copy streams via a scheduled task in CV (start the job with 1 stream only as an example) but we had 4 storage polices, so that only reduced the tape usage to 4. The problem again was that each storage police was scheduled and run in parallel. So while we restricted any one storage policy, ultimately we were still letting more tape drives being used than needed and in turn more tapes than was needed. We had set 6 streams, because we wanted to make sure that our FULL jobs had enough tape drives to complete over the weekend.

At this stage, I came to the conclusion that we needed a way to dynamically control the streams for the global tape policy so that during the week days it was restricted to 1 tape drive (all we needed) and on the weekend, we could start out with 6 and slowly ramp back down to 1, and hopefully more fully fill our tapes. With a bit of research and some discussions with CV, I found out that they have a CLI option for controlling storage policy streams (found [https://documentation.commvault.com/commvault/v10/article?p=features/storage\_policies/storage\_policy\_xml\_edit.htm)](https://documentation.commvault.com/commvault/v10/article?p=features/storage_policies/storage_policy_xml_edit.htm)). Using my trusty scheduling tool, I setup a basic system where on Sunday @4PM we would set the streams to “1”, and then on Friday @4PM we would raise them to “6” and Saturday @7am we would drop them to “2”. This basically solved our problem, and I’m happy to say that on week days, tapes are filled as much as is possible (1 – 2 tapes depending on which client ran a full), and on the weekend, 2 – 4 tapes are still being used. I’m still tuning the whole thing, for the fulls (it’s a balance of utilization and performance), but its better than its ever been. Its also worth noting, we went back and modified our aux copy schedules and told them to use all available streams since we now choke point it at the global tape policy. This allows any storage policy to go as fast as possible (although potentially blocking other ones).

It’s a hack no doubt. IMO, CV should develop this concept in their storage policies. Basically creating a schedule window to dynamically control the queue depth. For now, this is working well.