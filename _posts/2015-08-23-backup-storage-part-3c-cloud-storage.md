---
title: 'Backup Storage Part 3c: Cloud Storage'
date: '2015-08-23T15:33:43+00:00'
status: publish
permalink: /backup-storage-part-3c-cloud-storage
author: 'Eric Singer'
excerpt: ''
type: post
id: 91
category:
    - Uncategorized
tag:
    - backup
    - cloud
    - storage
post_format: []
---
Anyone who’s heard the word “cloud” as it pertains to technology knows its a fairly nebulous term. About the only thing people seem to grasp is that its means “not in my datacenter or home”. When we talk about “cloud storage” the term is still fuzzy, but at least we know it has something to do with storage. For this post, I’m going to be writing about two specific types of storage outlined below.

- **Online / Realtime storage:** This is just a name I’m going to use to describe the type of storage that you’d normally run cloud hosted VMs on. I like to think of it as cloud SAN. This type of storage is great for primary backup storage, both because of its performance capability and always being online. However, do to its price, it may not be the most prudent cloud storage option for long term retention or for secondary copies.
- **Nearline or Archive storage:** This storage is a kind of like tape (and depending on the vendor may be tape). You don’t write or read to this storage directly, and instead use either a virtual appliance, or some form of API / SW. Archive and nearline storage are great options for secondary storage or for hosting secondary copies of your backups. Other than how you interact with the storage, the only downside tends to be the potential of longer recovery times.

With two great options, what’s not to love? You have the perfect mix of short term, fast storage for your more recent backups, and your cheap and deep storage for your secondary and extended retention copies.

Initially it sounded great, until we started digging deeper into it. Ultimately we ended up having to pass on the solution for a number of reasons below.

1. **Cost:**
  1. Let’s face it, unless you’re one of the lucky few, like us you have a tough enough time getting budget for things that might actually make your company more productive. Trying to get your company to invest heavily in something they might never need to use, or rarely need to use is not likely to happen.
  2. This ones a toss up, but if your company prefers capex over opex, cloud is not going to be an easy battle for you. In our case, capex is preferred, which gave cloud storage a big black eye.
  3. The storage is only one small piece of the cost of cloud options. 
      1. Your network pipe is probably not big enough for all the data you need to send. This mostly depends on your backup solution as a whole (software optimized backups with dedupe and compression may help), but I suspect you don’t have enough to send your weekly full, let alone try to recover a weekly full. So on top of the never ending cost of cloud storage, you’re going to need to add a more expensive pipe to get the data there, and maybe even pull the data back.
      2. Potentially in addition to the network, or maybe instead of the network, you’ll need to invest in a cloud gateway or some other backup data optimizing software. Either way, you’re going to be investing even more capex on top of your increasing opex.
2. **DR:** Our new DR plan wasn’t finalized yet, which made it really difficult to pick a solution that we weren’t sure would make sense in two years. For example, if we move our DR solution to the cloud, some of the considerations in point 1 go away, as we’ll be running our secondary site in the cloud anyway. However, if we decided to stay in a colocation unit, while the cloud technically speaking could still work, it wouldn’t make sense to send our data to the cloud compared to just sending it to our DR site.
3. **Speed:** While point 1/3/1 (Network) if invested in correctly shouldn’t pose a bottleneck, its tough to argue against copying our data to tape from a performance perspective. We easily saturate 5 LTO6 tape drives in parallel (off our new backup storage solution to be discussed in an upcoming post). There’s no way that it would be cost effective to get that same level of performance out of cloud storage.
4. **Integration:** While more and more backup vendors are integrating cloud storage API’s, they’re not always free, and they’re not always good. Veeam as an example, had a cloud solution for their product, but it was terribly inefficient (as I recall). There was no backup optimization to the cloud. Veeam was simply copying files for you to the cloud. Its simple, but not efficient. This also goes back to point 1/3/2. We could have worked around this limitation with different backup SW, or cloud gateways, but again, we’re talking about adding cost to an already limited budget.

At the end of the day, I really wanted cloud, but financially speaking it doesn’t make much sense to backup to the cloud. While the price of the storage its self is quiet reasonable, the cost of the pipe or SW to get the data there is what kills the solution. I’m not saying it doesn’t make sense for others, but for us, our data was too big and the the cost would have been too high.

Factors that would change my view are below:

1. if ISP’s prices were dropping at the same rates as cloud vendors, I could see this making cloud more affordable.
2. If the cloud providers themselves started offering deduplication targets as part of their storage offering I think this would make a big difference. Perhaps instead of charging what we physically consume (per GB) they could instead charge what we logically consume. This way they still win, and so do we.