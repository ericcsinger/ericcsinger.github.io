---
title: 'Thinking out loud: VMware, this is what I want from you'
date: '2017-08-20T20:10:29+00:00'
status: publish
permalink: /thinking-out-loud-vmware-this-is-what-i-want-from-you
author: 'Eric Singer'
excerpt: ''
type: post
id: 487
category:
    - Uncategorized
tag:
    - 'thinking out loud'
    - vmware
post_format: []
---
Warning:
========

This post is clicking in at 6k words. If you are looking for a quick read, this isn’t for you.

Disclaimer:
===========

Typical stuff, these are my personal views, not views of my employers. These are not facts, merely opinions and random thoughts I’m writing down.

Introduction:
=============

I don’t know about all of you, but for me, VMware has been an uninspiring company over the last couple of years. VMworld was a time when I used to get excited. It used to mean big new features were coming, and the platform would evolve in nice big steps. However, over the last 5 – 7 years, VMware has gotten progressively disappointing. My disappointment however is not limited to the products alone, but the company culture as well.

This post will not follow a review format like many of you are used to seeing, but instead, will be more of a pointed list of the areas I feel need improvement.

With that in mind, let it go on the record, that in my not so humble option, VMware is still the best damn virtualization solution. I bring these points up not to say that the product / company sucks, but rather to outline that in many ways, VMware has lost its mojo, and IMO some of these areas would be good steps in recovering that.

The products:
=============

The death of ESXi:
------------------

You know, there are a lot of folks out there that want to say the hypervisor is a commodity. Typically, those folks are either pitching or have switched to a non-VMware hypervisor. To me, they’re suffering from Stockholm’s syndrome. Here’s the deal, ESXi kicks so much ass as a hypervisor. If you try to compare Hyper-V, KVM, Xen or anything else to VMware’s full featured ESXi, there is no competition. I don’t give a crap about anything you will try to point out, you’re wrong, plain and simple. Any argument you make will get shot down in a pile of flames. Even if you come at me with the “product x is free” I’m still going to shoot you down.

With that out of the way, it’s a no wonder that everyone is chanting the hypervisor commodity myth. I mean, let’s be real here, what BIG innovation has been released to the general ESXi platform without some up charge? You can’t count vSAN because that’s a separate “product” (more on the quotes later). vVOLs you say? Yeah, that’s a nice feature, only took how long?

So, what else? How about the lack of trickle down and the elimination of Enterprise edition? There was a time in VMware’s history when features trickle down from Enterprise Plus &gt; Enterprise &gt; Standard. Usually it occurred each year, so by the time year three rolled around, that one feature in Enterprise Plus you were waiting for, finally got gifted to Standard edition. The last feature I recall this happening too, was the MPIO provider support, and that was ONLY so they could support vVOLS on Standard edition (TMK).

Here is my view on this subject, VMware is making the myth of a commoditized hypervisor a self-fulfilling prophecy. Not only is there a complete lack innovation, but there’s no trickle down occurring.

If you as a customer, have gone from receiving regular (significant) improvements as part of your maintenance agreement, to basically nothing year over year, why would you want to continue to invest in that product? Believe me, the thought has crossed my mind more than once.

From what I understand, VMware’s new business plan, is to make “products” like vSAN that depend on ESXi, but that aren’t included with the ESXi purchase. Thus, a new revenue stream for VMware and renewed dependence on ESXi. First glance says it working, at least sort of, but is it really doing as well as it could? While it sounds like a great business model, if you’re just comparing whether you’re black / red, what about the softer side of things? What is the customer perception of moving innovations to an al a carte model? For me, I wonder if they took the approach below, would it have had the same revenue impact they were looking for, while at the same time, also enabling a more positive customer perception? I think so…

1. First and foremost, VMware needs to make money. I know I just went through that whole diatribe above, but hear me out. This whole “per socket” model is dead. It’s just not a sustainable licensing model for anyone. Microsoft started with SQL and has finally moved Windows to a per core model. In my opinion, VMware needs to evolve its licensing model in two directions. 
  1. **Per VM:** There are cases, where you’re running monster VMs, and while you’re certainly taking advantage of VMware’s features, you’re not getting anywhere near the same vale add as someone who’s running 20, 30, 50, 100 VM’s per host. Allowing customers to allocate per VM licenses to single host or an entire cluster would be a fair model for those that aren’t using virtualization for the overcommit, but for the flexibility.
  2. **Per Core:** I know this is probably the one I’m going to get the most grief from, but let’s be real, YOU KNOW it’s fair. Let’s just pretend, VMware wasn’t the evil company that Microsoft is, and actually let you license as few as 2 cores at a time? For all of you VARs that have to support small businesses, or for all of you smaller business out there, how much likelier would you have just done a full blow ESXi implementation for your clients? Let’s just say VMware charged $165 per core for ESXi standard edition and your client had a quad core server. Would you think $659 would be a reasonable price? I get that number simply by taking VMware’s list price and dividing by 8 cores, which is exactly how Microsoft arrived at their trade-ins for SQL and Windows. NOW, let’s also say you’re a larger company like mine and you’re running enterprise plus. The new 48 core server I’m looking at would normally cost $11,238 at list for Enterprise Plus. However, if we take my new per core model, that server would now cost ($703 per core) $33,714. That’s approximately $22k that VMware is losing out on for just ONE server. I know what you’re thinking, Eric, why in the world would you want to pay more? I don’t, but I also don’t want a company that makes a kick ass product to stagnate, or worse crumble. I’ve invested in a platform, and I want that platform to evolve. In order for VMware to evolve, it needs capital.
2. Ok, now that we have the above out of the way, I want a hell of a lot more out of VMware for that kind of cash, so let’s dig into that. 
  1. vSAN should have never been a separate product. Including vSAN into that per core or per VM cost just like they do with Horizon, would add value into the platform. Let’s be real, not everyone is going to use every feature of VMware. I’m personally not a fan of vSAN, but that doesn’t mean I don’t think I should be entitled to it. This could easily be something that is split among Standard and Enterprise plus editions. 
      1. Yes, that also means the distributed switch would trickle down into Standard edition, which it should be by now.
  2. Similar to vSAN, NSX should really be the new distributed switch. I’m not sure exactly how to split it across the editions, but I think some form of NSX should be included with Standard, and the whole darn thing for Enterprise Plus.
  3. At this stage, I think it’s about time for Standard edition to really become the edition of the 80%. Meaning, 80% of the companies would have their needs met by Standard edition, and Enterprise plus is truly reserved for those that need the big bells and whistles. A few notable things I would like to trickle down to Standard Edition are as follows. 
      1. DRS (Storage and Host)
      2. Distributed Switch (as pointed out in 2ai)
      3. SIOC and NIOC
      4. NVIDIA Grid
3. As for Enterprise Plus, and Enterprise Plus with Ops manager, those two should merge and be sold at the same price as Enterprise plus. I would also like to see some more of the automation aspects from the cloud suite brought into the Enterprise Plus edition as well. I kind of view Enterprise Plus edition, as being an edition that focuses on all the automation goodies, that smaller companies don’t need.
4. IMO, selling vCenter as separate SKU is just silly. So as part of all of this, I would like to see vCenter simply included with your per core or per VM licenses. At the end of the day, a host can only be connected to one vCenter at a time anyway.
5. Include a log insight licenses for every ESXi host sold, strictly used for collecting and managing a hosts VMware logs, including the VM’s running on top of them. I don’t mean inside the OS, rather things like the vmware.log as an example.

Evolving the features:
----------------------

### vCenter changes:

I know I was a little tough on VMware in the intro, and while I still stand behind my assertion in their lack of innovation, what they’ve done with the VCSA, it’s pretty kick ass. I would say it’s long overdue, but at least it finally here. That said, there’s still a ton of things VMware could be doing better with vCenter.

5. If you have ever tried to setup a simplistic, but secure profile for some self-service VM management, you know that it’s nightmare. 99% of that problem is attributed to VMware’s very shitty ACL scheme. The way permission entitlements work is confusing, conflicting, and ultimately leads to having more access granted, so you can get things to work. It shouldn’t be this difficult to setup a small resource pool, a dedicated datastore and a dedicated network, and yet it is. I would love to see VMware duplicate the way Microsoft handles ACLS, because to be 100% honest, they’ve nailed it.
6. In general, the above point wouldn’t even be an issue, if VMware would just create a multi-tenancy ability. I’m not talking about wanting a “private cloud”. This isn’t a desire for more automation or the like, simply a built-in way, to securely carve up logical resources, and allocated them to others. I would LOVE to have an easy way for my Dev, QA and DBAs to all have access discrete buckets of resources.
7. So, I generally hate web clients, and nothing enforced that more than VMware. Don’t get me wrong, web clients can be great, but the vSphere web client is not. Here is what I would like to see, **if** you’re going to cram a web client down my throat. 
  1. Finish the HTML5, before ripping the c# away from us. The flash client is terrible.
  2. Whoever did the UI design for the c# client, mostly got it right the first time. The web client should be duplicated aspects of the c# client that worked well. Things like the right click menu, the color schemes and icons. I have no problem with seeing a UI evolve over time, but us old heads, like things where they were. The web clients feel like developers just moved shit around for no reason. The manage vs. monitor tab gets a big thumb up from me, but it’s after that where it starts to fall apart. Finding simple things like the storage paths, which used to be a simple right click on the datastore have moved to who knows where. Take a lesson from Windows 8 and 10, because those UI’s are a disaster. Moving shit around for the sake of moving it around is the wrong. Apples OS X UI is the right way to progress change.
8. The whole PSC + vCenter integration, feels half assed if you ask me. I think for a lot of admins, they have no clue why these roles should be separate, how to properly admin the PSC’s, and if shit break, good luck. It was like one day you only had vCenter, and the next thing you know, there’s this SSO thing that who knows what about, and then the PSC pops out of nowhere. It wasn’t a gradual migration, rather this huge burst of changes to authentication, permissions and certificate management. I would say there a better understanding of the PSC’s at this point, but it wasn’t executed in a good way. Ultimately though, I still think the PSC’s need some TLC. Here are a few things l’d like to see. 
  1. You guys need to make vCenter and the like smart enough to not need a load balancer in front of the PSC’s. When vCenter joins a PSC domain, it should become aware of all PSC’s that exist, and have automated failover.
  2. There should be PowerCLI for managing the PSC’s, and I mean EVERYTHING about them. Even the stuff where you might run for troubleshooting.
  3. There should be a really friendly UI that walks you through a few scenarios. 
      1. Removing a PSC cleanly.
      2. Removing an orphaned PSC controllers or other components (like vCenter).
      3. Putting a PSC into maintenance mode. (which means a maintenance mode should exist)
      4. Troubleshooting replication. 
            1. Show the status
            2. Let us force a replication
      5. Rolling back / restoring items, like users or certs.
      6. Re-linking a vCenter that’s orphaned, or even transferring a vCenter persona to a new vCenter environment.
      7. How about some really good health monitors? As in like single API / PowerCLI command type of stuff.
      8. Generating an overall status report.
9. Update manager, while an awesome feature, hasn’t seen much love over the years, and what I’d really like to see are as follows. 
  1. Let me remove an individual update, and provide an option to delete the patch on disk, or simply remove the update from the DB.
  2. Scan the local repo for orphaned patches (think in the above scenario where someone deletes a patch from update manager, without removing it from the file system).
  3. Add the dynamic ability baselines to all classifications of updates, not just updates themselves. Right now, we can’t create a dynamic extensions baseline.
  4. Give me PowerCLI admin abilities. I’d love to be able to use PowerClI to do all the things I can do in the GUI. Anything from uploading a patch, to creating baselines.
  5. Open the product up, so that vendors could integrate firmware remediation abilities.
  6. Have an ability to check the VMware HCL for updated VIBs, that are certified to work with the current firmware we’re running. This would make managing drivers in ESXi so much easier.
  7. Offer a query derived baseline. Meaning let us use things like a SQL query to determine what a baseline should be.
  8. Check if a VIB is applicable before installing it, or have an option for it. Things like, “hey, you don’t have this NIC, so you don’t need this driver”. I’ve seen drivers installed, that had nothing to do with the HW I had, actually cause outages.
10. There are still so many things that can’t be adminsterd using PowerCLI, at least not without digging into extension data or using methods. Keep building the portfolio of cmdlets. I want to be able to do everything in PowerCLI that I can in the GUI. Starting with the admin stuff, but also on top of that, doing vCenter type tasks like repointing or other troubleshooting tasks.
11. How about overhauled host profiles? 
  1. Provide a Microsoft GPO like function. Basically, present me a template that shows “not configured” for everything and explain what the default setting is. Then let me choose whatever values are supported then apply that vCenter wide, datacenter wide, folder / cluster wide or host specific. 
      1. Similar feature for VM settings.
      2. Support the concept of inheritance, blocking and over rides.
  2. Let me create a host independent profile, and perhaps support the concept of sub-profiles for cases where we have different hosts. Basically, let me start with a blank canvas and enable what I want to control through the profile.
12. Let us manage ESXi local users / groups and permissions from vCenter its self. In fact, having the ability to automatically create local users / groups via a GPO like policy would be great.
13. I had an issue where a 3<sup>rd</sup> party plugin kept crashing my entire vSphere web client. Why in the world can a single plugin, crash my soon to be only admin interface? That’s a very bad design. Protect the admin interface, if you have to kill something, kill the plugins, and honestly, I’d much rather see you simply kill the troublesome plugin. Adding to that, actually have some meaningful troubleshooting abilities for plugins. Like “hey, I needed more memory, and there wasn’t enough”.
14. vCenter should serve as a proxy for all ESXi access. Meaning if I want to upload an ISO, or connect to a VM’s console, proxies those connections through vCenter. This allows me to keep ESXi more secure, while still allowing developers and other folks to have basic access to our VMware environment.
15. Despite its maturity, I think vMotion and DRS need some love too. 
  1. Resource pools basically get ripped apart during maintenance mode evacuations or moving VM’s (if you’re not careful). VMware should develop a similar wizard to what’s done when you move storage. That is, default to leaving a VM in a resource pool when we switch hosts, but ask if we’d like to switch it to a resource pool.
  2. I would love to see a setting or setting(s) where we can influence DRS decision a bit more in a heavily loaded cluster. For example, I’ve personally had vCenter move VM’s to hosts that didn’t have enough physical memory to back the allocated memory, and guess what happened? Ballooning like a kid’s birthday party. Allow us to have a tick box or something that prevents VM’s from moving to hosts that don’t have enough physical memory to back the allocated + overhead memory of the VM’s.
  3. Would love to see fault zones added to compute. For example, maybe I want my anti-affinity rules to not only be host aware, but fault zone aware as well. 
      1. Have a concept of dynamic fault zones based on host values / parameters. For example, the rack that a host happens to run in.
  4. Show me WHY you moved my VM’s around in the vMotion history.
16. How about a mobile app for basic administration and troubleshooting? I shouldn’t need a third party to make that happen. And for the record I know you have one, I want it to be good though. I shouldn’t need to add servers manually, just let me point at vCenter(s) and bring everything in.

### SDRS, vVOLS, vSAN and storage in general:

If I had to pick a weak spot of VMware, it would be storage. It’s not that its bad, it’s just that it seems slow to evolve. I get it, it’s super critical to your environment, but in the same tone, it’s super critical to my environment, and that means I need them to keep up with demand. Here is some example.

1. Add support for tape drives, and I mean GOOD support / GOOD performance. This way my tape server can finally be virtualized too without the need to do things like remote iSCSI, or SR-IOV. I know what some of you might be thinking, tape is dead. Wish it were true, but it’s not. What I really want to see VMware do, is have some sort of library certification process, and then enable the ability to present a physical library as a virtual one to my VM. Either that, or related to that, let me do things like raw device mappings of tape drives. Give me like a virtual SAS or fiber channel card, that can do a raw mapping of a table library. Even cooler, would be enabling me to have those libraries be part of a switch, and enabling vMotion too.
2. I still continue to sweat bullets about the amount of open storage I have on a given host, or at least when purchasing new hosts. It’s 2017, a period of time where data has been growing at incredible rates, and the default ESXi is still tuned for 32TB of open storage? I know that sounds like a lot, but it really isn’t. To make matters worse, the tuning parameters to enable more open storage (VMDK’s on VMFS) is buried in an advanced setting and not documented very well. If the memory requirements are negligible, ESXi should be tuned for the max open storage it can support. Beyond that, VMware should throw a warning if the amount of open storage exceeds the configured storage pointer cache. Why burry something so critical and make an admin dig through log messages to know what’s going on (after the fact mind you)? 
  1. Related to the above, why is ESX even limited to 128TB (pointer cache)? Don’t get me wrong, it’s a lot of storage, but it’s not like a wow factor. A PB of open storage would be a more reasonable maximum IMO. If it’s a matter of consuming more memory (and not performance) make that an admin choice.
3. RDM’s via local RAID should be a generally supported ability. I know it CAN work in some cases, but it’s not a generally supported configuration. There are times where an RDM makes sense, and local RAID could very much be one of those cases. I should be able to carve up vDisks and present them to a VM directly.
4. How about better USB disk support? It’s more of a small business need, but a need none the less. In fact, I would say being even more generic, removable disks in general.
5. Why in the world is removing a disk/LUN such an involved task still? There should literally be a right click, delete disk, and then the whole work flow kicks off in the background. Needing to launch PowerCLI, do an unmount, detach process is just a PITA. There shouldn’t even need to be an order of operations. I mean, in windows I can just rip the disk out and no issues occur (presuming nothings on the disk of course). I don’t mind VMware making some noise about a disk being removed, but then make it an easy process to say “yeah, that disk is dead, whack it from your memory”.
6. Pretty much everything on my vSAN / what’s missing in HCI posts has gone unimplemented in vSAN. You can check that out [here](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwiS9uWzoKDVAhXLGz4KHbP7Cu8QFggoMAA&url=http%3A%2F%2Fwww.ericcsinger.com%2Fvmware-vsan-in-my-environment-not-yet%2F&usg=AFQjCNGbs48Wj_vTDTMlzqurhF-bklJU_g) and [here](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjNxMzfoKDVAhXHbT4KHbsGA9UQFggoMAA&url=http%3A%2F%2Fwww.ericcsinger.com%2Fthinking-out-loud-hyper-converged-storages-missing-link%2F&usg=AFQjCNFvywz4Yl-DontZ4). That said, they have added a few things like parity and compression / dedupe, but that’s nothing in the grand scheme of things. 
  1. What I really wished vSAN was / is, is a non-hyperconverged storage solution. As in, I wish I could install vSAN as a standalone solution on storage, and use it as a generic SAN for anything, without needing to share it with compute. Hedvig storage has the right idea. Don’t know what I’m talking about, go check them out [here](http://www.hedviginc.com/). Just imagine what vSAN could do with all that potential CPU power, if it didn’t have to hold its self-back for the sake of the VM’s. And yes, THIS would be worth of a separate product SKU.
7. **SDRS:**
  1. I wish VMware would let you create fault zones with SDRS. This way when I create VM anti-affinity rules and specific different fault zones, I’d sleep better at night knowing my two domain controllers weren’t running on the same SAN, BUT, that they could move wherever they needed to.
  2. It would be really great to see SDRS have the ability to balance VM’s across ANY storage type. And have expanded use to local storage as well. For example, I would love to see vVOLs have SDRS in front of it. So, my VM’s could still float from SAN to SAN, even if they’re a vVOL. For the local storage bit, what if I have a few generic local non-san luns. I could still see there being value in pooling that storage from an automation standpoint.
  3. I would love to see a DRS integration for non-shared storage DRS. I know it would be REALLY expensive to move VM’s around. But in the case of things like web servers, where shared storage isn’t needed, and vSAN just adds complexity, I could see this being a huge win. If nothing else, it would make putting a host into maintenance mode a lot easier.
  4. Let me have affinity rules in standard edition of VMware. This way I can at least be warned that I have two VM’s comingling on the same host that shouldn’t be.
8. vFlash (or whatever it’s called) 
  1. It would be nice to see VMware actually continue to innovate this. For example. 
      1. Support for multiple flash drives per host and LARGE flash drives per host.
      2. Cache a data store instead of a single VM. This way the cache is used more efficiently. Or make it part of a storage policy / profile.
      3. Do away with static capacity amounts per VMDK. In essence offer a dynamic cache ability based on the frequency of the data access patterns.
      4. I would also suggest write caching, but let’s get decent read caching first.

### ESXi itself:

The largest stagnation in the platform has been ESXi its self. You can’t count vSAN or NSX if you’re going to sell it as a separate product. Here are some areas I would like to see improved.

- I would love to see the installation wizard ask more questions early on, so that when they’re all answered, my host is closer to being provisioned. I understand that’s what the host deploy is for, but that’s likely overkill for a lot of customers. 
  - ASK me for my network settings and verify they work.
  - ASK me if I want to join vCenter and if so, where I want the host located
  - ASK me if I want to provision this host straight to a distributed switch so I don’t need to go through the hassle of migrating to one later.
- Let the free edition be joined to vCenter. This way we can at least move a vm (shutdown) from one host to another, and also be able to keep them updated. I could see a great use case for this if developers want / need dedicated hosts, but we need to keep them patched. I’m not asking for you do anything, other than let us patch them, move vm, and be able to monitor their basic health of the host. Keep all the other limits in place.
- Give us an option to NEVER overcommit memory. I’d rather see a VM fail to power on, not migrate or anything if it’s going to risk memory swapping / ballooning.
- Make reservations an actual “reservation” If I say I want the whole VM’s memory reserved, pre-reserve the whole memory space for that VM, regardless of whether the VM is using it.
- Support for virtualizing other types of HW, like SSL offload cards and presenting them to VMs. I suspect this would also involve support from the card vendors of course, but it would still be a useful thing to see. For example, SSL offloading in our virtual F5’s.
- I want to see EVERYTHING that can done in an ESX CLI and other troubleshooting / config tools also be available in PowerCLI.
- Have a pre-canned command I can run to report on all hardware, its drivers, firmware and modules.
- I think it would be kind of slick to run ESXi as a container. Perhaps I want to carve up a single physical ESXi host, into a couple of smaller ESXi hosts and use the same license. Again, developers would be a potentially great use case for this.
- I would like to see an ability to export and import and ESXi image to another physical server. Simple use case would be migrating a server from one host to another. Maybe even have a wizard for remapping resources such as the NICS, and the log location. I’m not talking about a host backup, more like a host migration wizard.
- Actually, get ESXi joining to an Active Directory working reliably.
- How about showing us active NFC connections, how much memory they’re consuming and the last time they were used. While we’re at it, how about supporting MORE NFC connections.
- Create a new kernel for NFC and cold migration traffic with a related friendly name.
- Help us detect performance issues easier with top. Meaning, if there are particular metrics that have crossed well known thresholds, maybe raise an event or something in the logs. Related though, perhaps offing a GUI (or PowerCLI) related option for creating / scheduling an ESXTOP trace and storing the results in a CSV.

Evolving the company:
=====================

Documentation:
--------------

Look, almost everyone hates being stuck with documenting things, or at least I do. However, it’s something that everyone relies on, and when done well, it’s very useful. I get that VMware is large and complex, so I have to imagine documentation is a tough job. Still, I think they need to do better at it. Here is what I see that’s not working well.

- KB articles aren’t kept up to date as new ESXi versions are released. Is that limitation still applicable? I don’t know, the documentation doesn’t tell me.
- There is a lack of examples on changing a particular setting. For example, they may show a native ESXCLI method, while completely leaving out PowerCLI and the GUI.
- There is a profound lack of good documentation on designing and tuning ESXi for more extreme situation. Things like dealing with very large VM’s, designing for high IOPS or high throughput, large memory and vCPU VM’s. I don’t know, maybe the thought is you should engage professional services (or buy a book), but that seems overkill to me.
- Tuning and optimizing for specific application workloads. For example, Microsoft Clustering on top of VMware. Yeah they have a doc, but no it’s not good. Most of their testing is under best case scenarios, small VM’s, minimal load, empty ESXi servers, etc. It’s time for VMware to start building documentation based on reality. To use a lazy excuse like “everyone’s environment is different” doesn’t absolve even an attempt at more realistic simulations. For example, I would love to see them test a 24 vCPU, 384GB of vRAM VM with other similarlay sized VM’s on the same host, under some decent load. I think they’d find, vMotion causes a lot of headaches at that scale.
- Related to above, I find their documentation a little untrustworthy when they say “x” is supported. Supported in what way? Is vMotion not supposed to cause a failover, or do you simply mean, the vMotion operation will complete? Even still, there are SO many conflicting sub-notes it’s just confusing to know what restrictions exist and what doesn’t. It’s almost like the writer doesn’t understand the application they’re documenting.

Support:
--------

If there is one thing that has taken a complete downward spiral, it’s support. Like, the VMware execs basically decided customers don’t need good support and decided to outsource it to the cheapest entity out there. Let me be perfectly clear, VMware support sucks, big time, and I’m talking about production support just to be clear. Sure, I occasionally get in touch with someone that knows the product well, communicates clearly, and actually corresponds within a reasonable time, but that’s a rarity. Here are just a few examples of areas that they drop the ball in.

- Many times, they don’t contact you within your time zone. Meaning, if I work 9 – 5 and I’m EST, I might get a call at 5 or 6, or an email at 4am.
- Instead of coordinating a time with you, they just randomly call and hope you’re there, otherwise its “hey, get back to me when you’re ready”, which is followed by another 24-hour delay (typically). Sometimes attempts to coordinate a time with them works, other times it doesn’t.
- I have seen plenty of times where they say they’ll get back to you the next day, and a week or more goes by.
- Re-Opening cases, has led to me needing to work with a completely different tech. A tech that didn’t bother reading the former case notes, or contacting the original owner to get the back story. In essence, I might as well have opened a completely new case.
- Communication is hit or miss. Sometimes, they communicate well, other times, there’s a huge breakdown. It’s not so much understanding words, but an inability to understand tone, the severity of the situation, or other related factors.
- Being trained in products that have been out for months. I remember when I called about some issues with a PSC appliance 6 MONTHS after vSphere 6 was released, and the tech didn’t have a clue on how the PSC’s worked. I had to explain to him the basics, it was a miserable experience.
- Having a desire to actually figure out an issue, or really solve a problem. It’s like they read from a book, and if the answer isn’t there, they don’t know how to think beyond that.

While we’re still on the support topic, this whole notion of business critical and mission critical support is a little messed up. I guess VMware basically wants us to fund the salary of an entire TAM or something like that, which is bluntly stupid. It doesn’t matter if I’m a company with one socket of Enterprise Plus, or a company with 100 sockets, we apparently all pay the same price. I don’t entirely have a problem with pay a little extra to get access to better support, but then it should be something that’s an upgrade to my production support per socket, not a flat fee. Again, it should be based around fair consumption.

Sales:
------

You know when I hear from my sales team, when they want to sell me something. They don’t call to check-in and see if I’m happy. They’re not calling to go over the latest features included with products I own to make sure I’m maximizing value, none of that happens. All that kind of stuff is reactive at best. It’s ME reaching out to learn about something new, or ME reaching out to let them know support is really dropping the ball. I spend a TON of money on VMware, I’d like to see some better customer service out of my reps. I have vendors that reach out to me all the time, just to make sure things are going ok. A little effort like that, goes a long way in keeping a relationship healthy.

Website:
--------

I want to pull my hair out with your website. Finding things is so tough, because your marketing team is so obsessed with big stupid graphics, and trying to shove everything and anything down my throat. You’re a company that sells lean and mean software, and your website should follow the same tone. Everything is all over the place with your site. Also, it’s 2017, having a proper mobile optimized site would be nice too.

Finally, you guys run blogs, but one thing I’ve noticed is you stop allowing new comments after “x” time. Why do you do this? I might need further clarification on a topic that was written, even if it’s years ago.

Cloud and innovation:
---------------------

This one is a tough area, I’m not sure what to say, other than I hope you’re not the next Novell. You guys had a pretty spectacular fail at cloud, and I could probably go into a lot of reasons, and most of them wouldn’t be related to Microsoft or AWS being too big to beat. I suspect part of it was you guys got fat, lazy and way too cocksure. It’s ok, it happens to a lot of companies, and professionals alike. While it’s hard for me to forsee someone wanting to consume a serverless platform from you guys, I wouldn’t find it hard to believe that someone might want to consume a better IaaS platform than what’s offered by Microsoft or AWS. While they have great automation, their fundamental platform still leaves a lot to be desired. That to me, is an area that you guys could still capture. I could foresee a great use case for a virtual colocation + all the IaaS scalability and automation abilities. I still have to shutdown an Azure VM for what feels like every operation, need I say more?

Closing:
========

Look I could probably keep going on, and one may wonder why stop, I’m already at 6,000 plus words. I will say kudos to you, if you’ve actually read this far and didn’t simply skip down. However, the point of this post wasn’t to tear down VMware, nor was it to go after writing my longest post ever. I needed to vent a little bit, and wanted VMware to know that I’m frustrated with them and what they could do to fix that. I suspect a lot of my view points aren’t shared by all, but in turn, I’m sure some are. VMware was the first tech company that I was truly inspired by. To me, they exemplified what a tech company should strive to be, and somewhere along the way, they lost it. Here’s to hoping VMware will be with us for the long haul, and that what’s going on now, is simply a bump in the road.