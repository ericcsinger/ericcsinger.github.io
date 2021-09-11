---
title: 'Thinking out loud: Core vs. Socket Licensing'
date: '2015-04-05T16:05:51+00:00'
status: publish
permalink: /thinking-out-loud-core-vs-socket-licensing
author: 'Eric Singer'
excerpt: ''
type: post
id: 10
category:
    - licensing
    - 'thinking out loud'
tag: []
post_format: []
---
I recall when Microsoft changed their SQL licensing model from per socket to per core. It was not a well received model and it certainly wasn’t following the industry standard. I’d even say it ranked up there with VMware vRAM tax debacle. The big difference being that VMware reversed their licensing model. To this day, other than perhaps Oracle, I don’t know of any other product / manufacture using this model. And you know what, its a shame.

I bet you weren’t expecting that were you? No I don’t own stock in Microsoft, and yes I do like per socket (at times), but I honestly feel like in more cases than not, per core is a better licensing model for everyone.

I didn’t always feel this way, like most of you I was pretty ticked off when Microsoft changed to this model. After all, the cores per socket is getting denser and denser, and now when we’re finally start getting to an incredible amount of cores per socket, here’s Microsoft (and only Microsoft BTW) changing their model. Clearly it must be driven by greed.

No, I don’t think it’s greed, in fact I think its an evolutionary model that was needed for the good of us the consumers and for the manufactures. Let’s go into why I fell this way.

To start, I’m going to use my companies environment as an example. We have what I would personally consider a respectably sized environment.

In my production site, I currently have the following setup:

- 4 Dell R720’s with the v2 processors (dual socket, 12 cores per, 768GB of RAM) 
  - General purpose VM’s
- 10 Dell R720’s with the v1 processors (dual socket, 8 cores per, 384GB of RAM) 
  - Web infrastructure
- 7 Dell R820’s with v1 processors (quad socket, 8 cores per, 768GB of RAM) 
  - Microsoft SQL only

In my sister companies site we have the following setup:

- 3 Dell r710’s (dual socket, quad core, 256GB of RAM) 
  - Remote office setup

In my DR site, we have the following setup (there are more servers, they’re just not VMware yet).

- 4 Dell r710’s (dual socket, quad core, 256GB of RAM) 
  - DR servers (more to come).

As you can see, beefy hardware and pretty wide array of different configurations for different uses. All of these have a per socket licensing model, with the one caveat, that my SQL cluster is also licensed per core.

What got me thinking about this whole licensing model to begin with, is that I’d like to refresh my DR site, and take an opportunity to re-provision our prod site in a more holistic way. The biggest problem here is SQL because its per core, and everything else is per socket. Which really limits my options to the following:

1. Have two separate clusters, one for SQL and one for everything else. Then I can design my HW and licensing as it makes the most sense with SQL, and also maximize my VM’s per socket with my other cluster.
2. Take a density hit on the number of VM’s per socket, and run a single cluster with quad socket 8 core procs.
3. Have my SQL VM’s take a clock rate hit (ie make them slower) and adopt a dual socket 16 core setup.

So how does any of this have to do with this whole core vs. socket? It’s pretty simple actually, and if you don’t get it, go back and re-read my current setup, and go read the design questions I’m juggling with. Really think about it…

Let me highlight a few thing about my current infrastructure. I’m going to attack the principle of per socket, and why its a futile licensing model (even if you don’t run anything else that’s licensed per core).

Every server in the infrastructure I laid out above is licensed on a flat per socket model, regardless of the number of cores. That means my dual socket quad core procs, costs me the same amount to license as my dual socket 12 core procs. They’re doing less work, not able to support the same workloads, yet they cost me the same amount. Now, lets look at it from the manufactures view, at the time of pricing, my quad core proc was a pretty fair deal, but now as cores per socket have increased, their revenue potential decreases. Depending on which side you’re on, someone is losing out.

Here’s another example of how per socket isn’t fair for us. Remember my SQL hosts, quad socket 8 core? Remember how I was saying I was thinking about dual socket 16 core procs, but at the expense of a really slow clock rate. How is that fair for me? The reality is, I have the same number of cores, yet if I design my solution based on performance, it costs me twice as much in licensing, compared to a model that’s mostly about density.

I’d like to share a final example, of why I think per socket, isn’t relevant any longer. This should hit home a lot more with SMB’s and those that try to convince SMB to go virtual. We have a sister company that we manage, and they have all of about 20 servers. That doesn’t mean virtualaztion isn’t a good fit for them, and why should they be forced into using something less optimal like Hyper-V. Yet, a simple 3 host dual socket config for them, would cost an arm and a leg. The reason being, VMware is charging them the same price that they’d charge a large enterprise. You know what would level the playing field? Per core instead of per socket.

In my opinion, per core would be a win for both the consumers and manufacture. It provides the most flexibility, the most fair pricing, and it doesn’t force you into building your environment based on simply maximizing your licensing ROI (you do take application performance into consideration, right?)

Finally, if we were to adopt a per core model, there’s one thing I would insist that manufactures do to be fair. I’m calling Microsoft out on this, because I think its very underhanded of them put this in their EULA. Modern BIOS’s have the ability to limit the number of cores presented to the OS. You can effectively turn a 12 core proc into a quad core proc if you want. Microsoft, specifically doesn’t allow a company to use this feature, and still requires that all physical installed cores be licensed. This is so wrong on their part, its not fair, its not right, and the reality is, it just makes this model look worse than it really is. So with that being said, if a manufacture were to switch to this model, I’d implore that they utilize a few different options to allow me to buy more physical cores than i’m licensed for, but still be compliant.

1. Let me use BIOS feature to limit the number of cores present to the OS. Do you really think I’m going to shutdown all my servers before an audit and lower their cores? Really what good would that do? If my server needs 8 cores, it needs 8 cores, lowering it to 4 cores for the audit would likely have a devastating effect on my business more so then properly licensing the server.
2. Design your product so that with a simple license key, or license augmentation, you can logically go from “x” cores to “y” cores. Meaning you self restrict the number of physical cores used in a system. If I have a dual socket 12 core proc, and i’m only licensed for 8 cores, only utilize 8/24 cores. 
  1. Heck, take NUMA minimums into consideration. Meaning, if I have a quad socket, 4 cores at a minimum are required, and if I have a dual socket, 2 cores at a minimum are required.

What are your thoughts?