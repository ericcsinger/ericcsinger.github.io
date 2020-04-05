---
title: 'VMware vSAN in my environment? not yet&#8230;'
date: '2015-05-19T17:52:21+00:00'
status: publish
permalink: /vmware-vsan-in-my-environment-not-yet
author: 'Eric Singer'
excerpt: ''
type: post
id: 58
category:
    - Uncategorized
tag: []
post_format: []
---
When VMware first announced vSAN, the premiss of the solution was just pure awesomeness. After all, VMware has the best hypervisor (fact, not opinion), they’re in the process of honing what I think will be a Cisco butt kicking software defined network solution. Basically vSAN was the only missing piece to building a software defined datacenter. However, like NSX, I just don’t think vSAN is at a point where they can replace my tried and true shared storage solution. Thats not a knock against HyperConvergence (although I have my reservations with the architecture as a whole), rather VMware’s current implementation.

Before getting into my the current reservations with vSAN , I wanted to highlight one awesome feature I love about vSAN. Its not the kernel integration, its not that its from VMware, no its simply that its a truly software only solution. I really dig this part of vSAN. There are plenty of things I don’t like about vSAN, but this is one area they did right and that I wish other vendors would follow. Seriously, its 2015 and we STILL buy our storage / network as appliances. It sucks IMO, and I’m sick of being tethered to some vendors crappy HW platform (I’m looking at you Nimble Storage). With vSAN, so long as the SW doesn’t get in the way (and it does to a degree), you can build a solution on your terms. Want an all Intel platform? Go for it! Want FusionIO (SanDisk)? Go for it! Want 6TB drives? Go for it! Want the latest 18 core procs from Intel? Go for it! Do you want Dell, HP, IBM, Cisco, Quanta, or Supermicro servers? Take your pick… It is the way solutions in this day an age should be, or at least have an option to be.

Cons of vSAN in my opinion are plentiful.

- **Lack of tiers:** One very simple thing VMware could do that would ease with my adoption of their solution, is allow me to have two different tiers of storage. One that’s all flash and one that’s hybrid. This way my file serves can go in a hybrid pool, and my SQL servers can go into the all flash. I’m not even looking for automation, just static / manual tiers.
- **In-line compression:** I would love to have a deduplicated + compression solution, but if VMware simply offered in-line compression, that would make a world of difference in making those expensive flash drives go a little farther. Not to mention the potential throughput improvements.
- **Disk groups:** This is one area I just don’t get. Why do I need to have disk groups? The architecture, from my view, just seems unneeded. Here is what I WISH vSAN actually looked like: 
  - Disks come in three classifications: 
      - Write Cache: I want a dedicated write cache, mixing read / write cache on the same device is wasteful. Now I need to run a massive / expensive cache drive. It needs to be massive (hybrid design) so that it can actually have enough capacity to cache my working set. it also needs to be expensive because it needs to deliver good write performance and have decent write endurance. Just imagine what vSAN’s write performance would be if I could use a NVRAM based write cache.
      - Read Cache: No need to hash this out, but I’d want a dedicated read cache.
      - Data Disk: Pretty self explanatory, and this could be either SSD or HDD.
  - Let me pool these devices rather than “grouping” them. Create one simple rule, you get 35 disks per host, do with them as you please.
  - Let me create sub-vSAN’s out of this pool of data, AND let me make decisions like “this vSAN only runs on hosts 1 -5, and this other vSAN runs on hosts 6 – 10”. I would love to institute some form of true separation for environments that have multiple nodes. For example, to exchange servers, I’d like to make sure the disks are never on the same hosts storage, ever, even the redundant parts. Maybe this feature already exists. I’d still want hosts to be able to float to any compute node (so long as they’re not on the same node). This is also where I could see a vSAN being created for hybrid pools AND SSD only pools.
  - I know its probably complex and CPU intensive, but at least provide a parity based option. Copies are great for resiliency, but man do they consume a lot of capacity. Then again, see my point about in-line compression.
- **Replication at the vSAN level:** Don’t make me fire some appliance up for this feature, this should be baked into the code and as simple as “right click the VM and pick a replica destination”. Obviously you’d want groups and polices, and all that good stuff, but you get my point.
- **Standalone option:** I would actually consider vSAN (now) if it wasn’t converged. I know that must sound like blasphemy, but I’d really love an option to build a scale out storage solution that anything could use, including VMware. Having it converged is a really cool option, but I’d also like the opposite.
- **Easier to setup:** Its not that it looks hard, but when you have third parties or enthusiasts creating tools to make your product easier to setup, to me its clear you dropped the ball.
- **Real world benchmarks / configurations:** This is one area where if you going to offer a software only solution, you need to work a little harder. You can’t hide behind the “oh everyone’s environment is different.” or the “your mileage may vary”. On top of that, when your marketing states that you do 45k IOPS in a hybrid configuration and then your marketing engineer releases a blog article showing you doing 80k IOPS http://blogs.vmware.com/storage/2015/03/17/double-vsan-performance/ it tells me that VMware 100% what its own limits are, and that’s a problem. I’m not saying they need to lab out every single possible scenario, but put together a few examples for each vSAN type (hybrid or all flash). I realize Dell, HP, and the various other partners are partly to blame here, but then again, its not entirely in their best interest for vSAN to succeed.

Overall, I think vSAN is cool, but its not at a point where its truly an enterprise solution.