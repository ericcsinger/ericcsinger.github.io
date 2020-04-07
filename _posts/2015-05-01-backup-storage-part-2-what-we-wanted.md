---
title: 'Backup Storage Part 2: What we wanted'
date: '2015-05-01T20:59:30+00:00'
status: publish
permalink: /backup-storage-part-2-what-we-wanted
author: 'Eric Singer'
excerpt: ''
type: post
id: 47
category:
    - Backup
    - Storage
tag: []
post_format: []
---
In part 1, I went over our legacy backup storage solution, and why it needed to change. This section, I’m going to outline what we were looking for in our next storage refresh.

Also, just to give you a little more context, while evaluating storage, were also looking at new backup solutions. CommVault, Veeam, EMC (Avamar and Networker), NetVault, Microsoft DPM, and a handful of cloud solutions. Point being, there were a lot of moving parts and a lot of things to consider. I’ll dive more into this in the coming sections, but wanted to let you know it was more than just a simple storage refresh.

The core of what we were seeking is outlined below.

1. **Capacity:** We wanted capacity, LOTS of capacity. 88TB’s of storage wasn’t cutting it.
2. **Scalability:** Just as important as capacity, and obviously related, we needed the ability to scale the capacity and performance. It didn’t always have to be easy, but we needed it to be doable.
3. **Performance:** We weren’t looking for 100K IOps, but we were looking for multiple GBps in throughput, that’s bytes with an uppercase B.
4. **Reliable/Resilient:** The storage needed to be reasonably reliable, we weren’t looking for five 9’s or anything crazy like that. However, we didn’t want to be down for a day at a time, so something with resiliency built in, or a really great on-site warranty was highly desired.
5. **Easy to use:** There are tons of solutions out there, but not all of them are easy to use.
6. **Affordable:** Again, there’s lots of solutions out there, but not all of them are affordable for backup storage.
7. **Enterprise support:** Sort of related to easy to use, but not the same, we needed something with a support contract. When the stuff hits the fan, we needed someone to fallback on.

At a deeper level, we also wanted to evaluate a few storage architectures. Each one, meets aspects of our core requirements.

1. **Deduplication Targets:** We weren’t as concerned about deduplications ability to store lots of redundant data on few disks (storage is cheap), but we were interested in the side effect of really efficient replication (in theory).
2. **Scale out storage:** What we were looking for out of this architecture was the ability to limitlessly scale.
3. **Cloud Storage**: We liked the idea of our backup’s being off site (get rid of tape). Also in theory it too was easy to scale (for us).
4. **Traditional SAN / NAS:** Not much worth explaining here, other than that this would be a reliable fallback if the other two architectures didn’t pan out.

With all that out there, it was clear we had a lot of conflicting criteria. We all know that something can’t be fast, reliable and affordable. It was apparent that some concessions would need to be made, but we hadn’t figured out what those were yet. However, after evaluating a lot of vendors and solutions, passing along quotes to management, things started to become much clearer towards the end. That, is something I’m going to go over in my upcoming sections. There is too much information to force it all in one upcoming section, so I’ll be breaking it out further.

-Eric