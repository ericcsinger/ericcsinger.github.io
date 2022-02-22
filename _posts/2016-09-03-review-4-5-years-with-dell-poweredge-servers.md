---
title: 'Review: 4.5 years with Dell Poweredge Servers'
date: '2016-09-03T19:37:12+00:00'
status: publish
permalink: /review-4-5-years-with-dell-poweredge-servers
author: 'Eric Singer'
excerpt: ''
type: post
id: 375
category:
    - servers
tag:
    - dell
    - reviews
    - servers
post_format: []
---
Disclaimer:
===========

Typical stuff, these are my views not my employers, they’re opinions not facts (mostly at least), use your own best judgement, take my views with a quarry full of salt.

Introduction:
=============

When I started at my current employer, one of the things I wasn’t super keen on was having to deal with Dell hardware. I had some previous experience with Dell servers, none of which was good. My former employer was an HP shop that had converted from Dell, and early on in my SysAdmin gig, I had the misfortune of having to work with some of the older Dell servers (r850 as an example).

You’re probably thinking this means I’ll be going over why one vendor is better than the other? Nope, not at all. I don’t have the current experience with the HP ecosystem to draw any conclusions like that. I provided that information so that you the reader know that I write this all as a former HP fanboy. I hope you’ll find it objective and informative. I also hope that someone with some sway at Dell is reading this, so they can look for ways to improve their product platform.

Pros:
=====

As always, I like to start out with the pros of a solution.

- **Hardware lifecycle:** I find that Dell has a very good HW lifecycle. They’re very quick to release new servers after Intel releases a new chip. Maybe not a big deal for some, but for us, it’s a nice win. In turn I also find that Dell keeps their current and former server models around for a very respectable amount of time. If you’re in a situation where you’re trying to keep a cluster in a homogeneous HW configuration, this is advantageous.
- **Support:** For general HW issues I find Dell to have fantastic support. We use pro support for everything which I’m sure helps. When I say general HW support, I’m talking about getting hard drives, or memory replaced. To some degree I’ll even say troubleshooting more complex HW issues they tend to be pretty good at. When you get above the HW stack, I’ll chat about that a little bit later. It also worth mentioning that from what I can tell, support is 100% based in the US which is surprising but certainly appreciated.
- **HW Design / Build:** When you’re comparing Dell to something like a Supermicro server, it’s a night and day difference. I find that the overall build quality of Dell’s rackmount solutions are excellent. Internally, most things are easy to get to and replace. The cover is labeled well as are things like the memory which makes it easy to track down a problem DIMM. Outside the server, the cable management arms are nice (if you use them). Overall, the server is built sturdy, the edges are typically smooth (not sharp) and pretty much everything is tooless. I only have two gripes, which I’ll add here instead of duplicating it in the cons. I find their bezels to be somewhat useless. We’ve stopped using them because we’ve run into cases where its actually hard to get them off. Also, depending on your chassis config, the bezel blocks some idiot lights. Finally, and admittedly this is more of a personal preference, I HATE Dell’s rails. I think the theory is they’re supposed to be installed vertically starting in the rear, and then lay into the rails. The problem is the rails are just too damn flimsy when they’re extended (all rails are; this isn’t just Dell). I personally prefer the slide in style like found on the HP’s.
- **Purchasing configuration:** One thing I love with Dell is that each server is 100% customizable, or at least reasonably customizable. I’ve worked with other vendors where you were forced to use cookie cutter templates or wait a month+ for a custom build.
- **Price:** I can’t say they’re cheaper than every vendor out there, but I suspect if you compare them to HP, Cisco or Lenovo I find that they tend to be a more affordable solution. For us, we go Dell direct and we’re considered an enterprise customer. Your mileage may vary in this case of course.
- **Sales team:** I can’t typically say this about many vendors, but I generally love working with Dell’s sales team. They’re all very friendly and very responsive to requests. Its one of those things where its just nice to see a vendor meet what I’ll call minimum expectations. Dells sales team does this for sure and in many cases exceeds them.

And that is pretty much where the pros end.

Cons:
=====

Like I’ve said in previous reviews, its always easier to pick out the cons of a solution. Chalk it up to taking things for granted, loss of perspective, etc. I would say take some of these cons with a grain of salt, no vendor is perfect. Some of this stuff I’m not just outlining for your information, but also so that perhaps a product manager for Dell’s server solutions gets some much needed, unfiltered feedback. I say unfiltered, because as a customer, I honestly feel like this stuff never makes it up to the right people, or when it does, its watered down.

- **Innovation:** Dell has absolutely ZERO innovation capabilities across their entire portfolio, and the Poweredge line is no exception. I’ve often joked that when Dell buys a company, that’s where they’re going die a slow non-innovative death. Look at what they’ve done with EQL, Compellent, Ocarina, and Quest. Seriously, the whole line up is a joke compared to what’s out and about now a day. I know this is supposed to be about Poweredge servers (and I’ll get to that) but if Dell keeps any of those storage products around post EMC merger, they’re fools. How does this apply to servers? Take a look at Cisco UCS and then take a look at Dell. Dells server solution is fine if you have say less than 50 or so servers and most of them are virtual hosts. The instant you start going above that, the more value there is in a solution like Cisco UCS. If I was still running a 100+ real server environment, no way I’d run Dell. Why do I categorize this under innovation? Because there is nothing coming out from Dell that I feel compelled to write about. There is no “wow” factor with Dell servers. When I first saw a UCS demo, THAT was a wow factor. I don’t like the Cisco architecture, but no one can say that they’re not innovative, and I’d totally jump in with Cisco if my environment was larger.
- **Central Management (physical servers):** Getting into a little bit more details of why I wouldn’t buy Dell if I had a larger shop. They have a half assed / practically non-existent server management solution. They have this POS called Dell Open Manage Essentials, that’s supposed to take care of pretty much everything one would need to take care of with a Dell server. The problem is it doesn’t do a whole lot and what it does do, it doesn’t do very well. 
  - **Monitoring:** OME only told us that there is a problem, but it wouldn’t tell you what the problem was. So we’d still have to log into each server to find out what the specific problem was. That wouldn’t have been a big deal, except 95% of the time it was something dumb like the drivers / FW being out of date (really, do we need a warning about that?).
  - **Remote FW and Driver updates:** This never worked, tried it a million times, and it would either only partially work, or not work at all. Installing things like drivers or new tools would just show “failed” with some cryptic reason. Manually download the same update, and run it manually, and it works fine.
  - **Server profiles:** I didn’t even try these because honestly nothing else worked well, and it looks like a PITA to configure. There is clearly no “vision” for how to make managing servers easy at Dell. I don’t mind doing some prep work here, but its not like we’re talking about standing up an OS + Application, we’re talking about a few server settings, some drac settings and icing on the cake would be configuring and managing the local RAID cards. I know its probably not fair to put it down, maybe it’s a diamond of a solution baked into a crappy product, but I doubt it.
- **Central Management (Vmware):** They actually do “ok” here, but its not great. When the solution works (hit or miss) it does work pretty well. Still I’m only using it to manage FW updates, and even with that it only works part of the time. There have been countless cases where I’ve needed to kill outstanding FW update jobs and soft reset the drac to shake things loose. There’s also times where I need to reboot the FW update appliance, and sometimes I have to reboot vCenter + do all the above, because who knows what the problem is.
- **Non-standard HW:** It’s beyond frustrating that I can’t say I want all Intel SSD of a specific model. Dell uses vague terms (low, mid or high write duty) to describe their SSD drives. There’s no way for me to know if I’m getting an SSD that can do 35k IOPS or 100k IOPS. With HDD’s its mostly a commodity, but with SSD’s, there are very much big pros and cons depending on which SSD you use. IMO, with HCI (however over rate the architecture is) becoming a hot new thing, having a standard SSD and HHD IMO is a must. You’re now building around local storage characteristics, and you need predictability.
- **SSD and HDD are stupid expensive:** Just a matter of opinion, but their prices are insane, especially for the SSD’s. I get that they might wear out prematurely, but then put some clause that they’re simply good for “x” writes are whatever.
- **DRACs:** There remote management cards have gotten better over the years, but they’re still nothing compared to iLO. They can still be somewhat unreliable and they’re only now starting to release an HTML5 interface instead of Java. Adding to that, as mentioned above, I’ve seen multiple cases where FW update stop working and its almost always the DRAC that’s the issue.
- **Documentation and downloads:** Dell is almost as bad as Microsoft when it comes to documentation and downloads. Things are just scattered all over the place and it lacks consistency. Yes, I can go to the drivers and downloads section for a server model, but there have been many times where I’ve seen Openmanage Systems Administrator (OSMA) latest version on say a Dell poweredge r730 page, but NOT on a poweredge r720.

With things like the Dell Openmanage vCenter appliance, I also find it hard to find the latest updates or to know where to download my serial keys. Documentation about the product is also difficult to find at times.

- **Standalone FW updates:** Dell has methods updating the HW for standalone system, but they’re all overly complex, or not refined. One method is booting of an SBU disk and then swapping CD’s (ISOs) to load your repo. It works (most of the time) but it’s a PITA. The other option is using their repository manager (another half-baked solution) to create a standalone FW update ISO that just blindly updates all HW that you’ve loaded a FW for. Neither solution is seamless or refined. I cringe every time I have to use either.
- **Support:** I know I marked this as a pro, but I wanted to elaborate a bit here on the cons of support. I know in many cases they’re probably not different than other vendors, but I’m so sick of hearing “we can’t do x or y until you’ve updated all your FW and drivers”. To me, I don’t care what vendor you are, this is lazy, kick the can troubleshooting. Its one thing if you can point to a release note in a FW or driver that describes the specific problem I’m having, but if you’re not even looking at the release notes, and blindly telling me to update component x,y and z, that’s just you being lazy. Here is normally what ends up happening anyway. I call you, you tell me to update x,y and z. I begrudgingly do it after debating with you, problem is NOT solved and now you’ve just pissed me off and wasted my time (and depending on the server, other teams time).

Conclusion:
===========

At the end of the day, I’m sure you’re thinking I hate Dell servers. I don’t, but they leave a lot to be desired. I look at Dell as a high end Supermicro server. I know I’ll get good support from them, a solid server and if I don’t buy their disks, a reasonably priced server. Because our environment is relatively small (35 servers or so), I can deal with their cons. If I had a larger physical server environment, I would probably lean more towards Cisco, but at this size and below its not worth the added cost or complexity of UCS. That being said, if cost was no option, or if Cisco were to offer their solution at a more affordable price, I don’t know why anyone would buy Dell.