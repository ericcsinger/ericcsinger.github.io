---
title: 'VMware DRS default memory load balancing'
date: '2018-01-14T22:47:37+00:00'
status: publish
permalink: /vmware-drs-default-memory-load-balancing
author: 'Eric Singer'
excerpt: ''
type: post
id: 556
category:
    - Uncategorized
tag:
    - drs
    - memory
    - vmware
post_format: []
---
In general, I find DRS does a fantastic job of keeping VM’s happy. However, in the past, I’ve seen a number of unexplained situations where hosts in a cluster run out of memory when a VM goes from idle, to busy all of a sudden. In fact, this happened three times to us in a dedicated cluster for our SQL VM’s. What was unexplained wasn’t how the host ran out of memory, that was pretty easy to track down. What was unexplained was why DRS didn’t move any of the VM’s. In this cluster we had a lot of VM’s with restrictive rules, but there were plenty of VM’s on this host that could have been easily relocated to prevent the over-committing of memory.

We were so perplexed by the situation that we called VMware support. We explained the situation to them, and asked what we could do to mitigate it from happening. I had the idea of using memory reservations, and that maybe DRS wouldn’t move VM’s to a host that didn’t have enough memory to back the configured vRAM. Turns out out memory reservations in VMware aren’t exactly “reservations” per se. They only reserve memory once it’s active. So even if you say “I want to reserve 100% of the configured memory” VMware doesn’t actually do that. It’s more of a “once I use it, I don’t give it back” functionality. As an aside, they have a new advanced setting in 6.5 that does pre-allocate the memory reservation. Given the confusion around memory reservations, I’d love to see that option exposed in the GUI with a brief comment about how it works.

Regardless, it wasn’t a mitigating solution recommended by support. In fact they suspected it would make things worse. Anyway, after looking through our logs, and chatting with their colleagues, the tech basically came to the conclusion that our cluster was overloaded and we needed more memory. At the time, I was a little skeptical, but I had to concede our cluster was pretty full. I didn’t think it was loaded so bad that DRS couldn’t shuffle things around, but we took the answer as is and came up with a different solution. We ended up disabling DRS since it was causing more issues than it was solving.

Fast forward to this week, we had a completely different cluster with a host on the verge of running out of memory. It was at 96% all the while other nodes were chilling at ~50-60%. Unlike the above scenario, there was TON of memory to balance things out, and there weren’t super restrictive DRS rules either. I was poking around DRS, as I recall there being some DRS enhancements in 6.5. I noticed this one setting. “Load balance based on consumed memory instead of active memory”. And so the light bulb went off. I Googled the setting to make sure I understood what it meant and came across this [article](https://blogs.vmware.com/vsphere/2016/05/load-balancing-vsphere-clusters-with-drs.html). It did exactly what I thought it was going to, which honestly made me wonder why it’s not the default. I ALSO noticed in this article that we probably could have influenced DRS in our SQL cluster to mitigate the overcommit. A bit of a bummer, but life goes on.

In closing, I think this will be our default tweak whenever we setup a new cluster. Within a few minute of enabling that feature, I watched our host that was consuming 96% of it’s memory, vacated a number of VM’s and things looked a lot healthier. I’m not suggesting that you should do this, but I might suggest that you consider it if you’re the type of shop that doesn’t like to overcommit memory.