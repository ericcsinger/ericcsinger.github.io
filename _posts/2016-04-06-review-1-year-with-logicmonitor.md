---
title: 'Review: 1 year with LogicMonitor'
date: '2016-04-06T21:53:04+00:00'
status: publish
permalink: /review-1-year-with-logicmonitor
author: 'Eric Singer'
excerpt: ''
type: post
id: 216
category:
    - monitoring
tag:
    - LogicMonitor
    - Monitoring
post_format: []
---
Disclaimer:
===========

This is unsolicited feedback. These are my own opinions and not those of my employer.

Terminology:
============

I know I’ve been lacking this in some of my other blogs posts, so here’s a stab at trying to make sure you have a rough idea of what certain words mean.

- **LM**: Acronym I user for LogicMonitor
- **Collector**: Its a windows or linux box that grabs the data you want monitored from your other servers. Its an agent that sits on a server and allows LM to either remotely poll other servers, or locally collect data.
- **Datasource**: This is a term used to describe a “monitor”. As an example, if I wanted to monitor a windows logical disk perfmon counter, that would be a datasource. If I have a script that checks for the status of an exchange database, that would be a datasource.
- **Instance**: A term used to describe a very specific item that’s monitored by a datasource. For example, going back to the logical disk datasource. If you had a C: E: and F: drive, each drive is an individual instance. Some datasources are designed to collect multiple instances (like the example) others like “ping” are not.
- **Device:** Anything that you’re monitoring. This is what LM license. A few examples, a windows server, linux server, switch. pdu, etc.

Introduction:
=============

If we’re all honest, I think we can all agree that monitoring solutions suck. Its a little crass I know, but I think its a fitting word for this software class as a whole. Backup and monitoring are the two areas I always here folks say “they all suck, this one just sucks a little less”. And that is really why we chose LogicMonitor. Its not that I’m blown away with it as a solution, but it sucks a lot less then the other options out there. So you could say from my view they’e the best, or you could say they’re the least worst. Either way, we chose them over a number of other vendors, including the all so popular SolarWinds.

For us, we were coming from absolutely nothing (just some scripts and freebie tools) to try and monitor a 700+ device environment. It was a huge undertaking to say the least. We really didn’t have anything to compare anyone too. I had some personal experience with What’s Up! and Solarwinds, but that was it and it was in a much smaller environment with much simpler needs.

Who we evaluated:
=================

Just going to provide a quick list of everyone we evaluated. Ultimately the choice boiled down to Solarwinds vs. LogicMonitor for us.

- Passlers PRTG
- IPSwitchs Whats up
- ScienceLogic
- Solarwinds
- LogicMonitor
- Microsoft Systems Center Ops Manager

Not the most comprehensive list of monitoring solutions, but we went after the well known ones, and we stayed way from the more complex and / or expensive ones. Nagios as an example is one we skipped due to the complexity. I’ve got about 500 other things to do with my time, and troubleshooting an opensource monitoring solution isn’t one of them.

Pre-sales:
==========

Besides the fact that I liked the way LogicMonitor functioned better than other solutions, it was ultimately the pre-sales experience that sold us on them. Its not that LM did anything that I wouldn’t normally expect out of a decent company. As an example.

1. Highly responsive to any questions and comments
2. Had their better / best pre-sales engineer at our disposal
3. Walked us through the product and actually was able to answer odd ball questions.
4. Helped get us setup and worked with both our network team and my team individually to evaluate point cases.
5. Helped us setup custom monitors.
6. Worked with us on pricing
7. Didn’t badger us, knowing that we were still evaluating other solutions.
8. Specific to monitoring, didn’t tell us to reach out to a community for support.
9. They were very gracious with extending our trial multiple times. We got held up with other issues, or needed more time to test something and they were very easy going about it.

Surprisingly LogicMonitor was one of the last vendors we evaluated. Mostly due to the fact that I had never heard of them, and it took a bit of creative searching to find them. I didn’t even really want to look for them if we’re being honest. Product wise, I thought I wanted Solarwinds. Really, the only reason I went looking was Solarwinds pre-sales was so horrible. And when I say horrible, I’m not exaggerating. Just to give a few examples.

1. Sales guy pinged me almost every other day asking me when I was going to buy.
2. Sales guy offered me this “Great Deal!” if I signed on the dotted line by COB Friday (it was Thursday when they sent the message). 
  1. Sales guy told me I would never get said deal again
3. Sales demo was done by sales guy, without a pre-sales engineer on the call. Sales guy couldn’t answer technical questions.
4. It took days to get in touch with a pre-sales engineer for any and all questions we had. It wasn’t like we fired off an email and we’d get a response in a few hours, it was days. Then if we needed to jump on a call, again it was days.
5. When we did jump on a call, most recommendations for monitors were “go check out our community database, I’m sure we’ve got something that meets your needs”. Not “let me go look into that…”
6. They told me features existed in base level products, that ultimately required a different (more expensive) add on.
7. We were NOT allowed to access generic tech support to evaluate them. That was a big red flag for us.

So really, LM (LogicMonitor) just seemed like a breath of fresh air after dealing with Solarwinds. Like I said, its not that LM did anything above and beyond. The reality, they just acted like the way you’d expect from a tier 1 solution provider, and that’s a good thing.

The product its self:
=====================

All in all, its a great product. It still has a LONG ways to go, but the good news is they’re on the agile model and it shows. There are improvements and changes coming out all the time. To get into the specifics, let’s start with what I like.

Pros:
-----

1. They have a huge list of pre-built monitors, way larger then Solarwinds or any other vendor we evaluated. Granted Solarwinds has a ton of community driven monitors, but LogicMonitor has a much larger database of monitors they built and supported. This is a huge plus, because we didn’t want to spend the next year developing and tweaking our own monitors.
2. The basics of getting monitoring setup are easy and intuitive. Define some credentials, setup some collectors, and BOOM! you’re off and monitoring.
3. The monitors themselves are mostly comprehensive. They all have a great set of pre-defined thresholds based on a vendors recommended practices.
4. Building custom monitors (scripts, WMI) are fairly easy. I had developed multiple Powershell monitors in a couple of days.
5. Building dashboards is easy, and reasonably intuitive
6. There’s pretty much no limit to what you can monitor. If it can be polled in some way, it can be monitored.
7. They support a lot of out the box collection methods 
  1. Powershell, VBS, CMD, Pearl, Groovy, and other scripts
  2. SNMP
  3. WMI
  4. Perfmon
  5. JDBC
  6. JSON API
  7. Generic HTTP gets
  8. etc.
8. There is only 1 license to worry about. What ever monitor you assign to that device, doesn’t cost any extra. 
  1. Again, its licensed by device, not by object. So a switch with 96 ports, only counts as one device.
9. They keep reasonably good documentation on the monitors, although its been slacking off a bit as their database increases.
10. They have multiple alert methods, including email, sms, phone, slack, pagerduty etc.
11. They have a good set of integration with other third parties, like Slack, pagerduty, onelogin, and various other vendors.
12. Other than the collector (poller) everything is hosted in the cloud. So you do have some work to get things setup, but ultimately the hard work is take care of by them.
13. They’re constantly implementing new features and upgrades. Its slowly getting community driven too, which is a good / bad thing.
14. Because its web driven I can login from anywhere to check out what’s going on. They also have a phone app, which still needs some work, but hey, its a nice option.
15. If you happen to be an MSP, it looks like they have some nice features around that.
16. Notification are quick and reliable
17. If they don’t have a datasource, and you don’t have time to create one, you have two options. 
  1. You can pay them, and it will get high priority.
  2. You can wait, get put into a queue, but ultimately you won’t have to do much and they’ll take care of it for you.
18. The new GUI is based on HTML 5, and as far as web consoles go, its very fast / snappy.
19. They have a feature called “dynamic groups” which is pretty cool. You can group devices based on a query. The query can contain anything from the list of properties on the device. So I might group all “physical” servers by looking for “poweredge” in the model as an example, or all production sql servers based on a naming pattern.
20. Its rudimentary, but they do have built in external monitoring (global monitoring) of simple things like ping, web checks, etc. Best of all, so far its unlimited.
21. They can mix and match discovery and collection methods. So if you want to for example use a script to find all dell servers with a drac, you can then use their built in “ping” to do the actual monitoring. Meaning, just because you use a script for the discovery of a device / instance, doesn’t mean you need to use a script for the collection.
22. They’re SaaS, so its pay as you go.

Before I get into the Cons, I just want to be clear, that EVERY product has cons. I have yet to use a perfect product. The list may look large an ominous, but that’s frankly because its a lot easier to pick apart things you don’t like then to appreciate the things that work well. That said, I’m still not going to pull any punches. If there’s one tone I want to set with my blog, its not that I’m mean, but that I’m honest, even if it hurts. Again also keep the disclaimer in mind. These are my opinions.

Cons:
-----

1. Collection / Polling has a few issues IMO. Not deal breaker issues, just issues. 
  1. The collectors are not the most reliable solution I’ve used. We’ve run into dozens of cases where they get “overloaded” and we either need to restart them, or add more collectors to balance out the load. They will say at max 100 devices if its windows or VMware, IMO I find that to be overly generous, more like 40 – 50 if you’re lucky.
  2. They don’t scale up very well, which means you need a lot of collectors to manage your load reliably. (we run 10 for roughly 500 devices). They’ll tell you they can scale up, and maybe that’s true. But it involves a lot of work getting folks on their end that know all the settings to tweak and what not. 
      1. Update 03/01/2017: They’ve release a method for having collector “sizes”. I haven’t had a chance to validate it yet, but it looks like it enable the ability to scale up fairly well.
  3. The collection process is horribly inefficient IMO (but getting better). If you have a switch with 100 switch ports. At a minimum, you’re going to hit that switch 100 instances \* the number of multi instance datasources you have. For Windows boxes, a good example would be an individual WMI call per hard drive (instance), and per datasource. So Logical Disk counter + Physical disk counter would each equal unique polls \* the number of disks. If I have two disks per server, just to monitor Logical and Physical, I’m looking at 4 wmi calls just for that one device and those disks. 
      1. They have released a newer script collection process which now does one poll per datasource, which is the way it probably should have been all along. One poll per datasource per device. This doesn’t fix the other 99% of their data sources, but its a start.
  4. You never really know when the collectors are overloaded, until you login to the console and start seeing “no data” warnings and stuff like that. Then you contact them, they tell you its overloaded, but that may not even be true.
  5. Troubleshooting issues can be a bit of a pain. Their collectors return errors that sometimes could mean one of a number of possible issues. For example, specific to WMI, we’ve frequently been told “its clear you don’t have permissions set right based on our error” to in turn prove that’s not the problem. They then move on to “WMI must be broke” to which in turn we demonstrate that, that’s not the case, to finally realizing “oh, wmi is just timing out”. Instead of having very specific and granular error messages, it appears they use very generic messages and then expect the tech / you and me to just take a few guesses as to what might be going wrong.
2. They don’t appear to have any Powershell script datasources. There are just certain things that can only effectively be monitored by Powershell. Windows storage spaces at the time was one example. To this day, I still don’t see them having any PS datasources. They have a ton of datasources based on Groovy, which is fine for web and Linux, but really, they need to get some more Powershell experts on staff.
3. They lack instances, datasource and device aggregation based monitoring. What I mean by that is as an example, let’s say you have two PDU’s in a rack. Ultimately you want to know the aggregate power consumed in a rack not just by an individual PDU. That is not something they can do without some fancy scripting on your part.
4. They don’t support things like “sub-instances”. For example, if I have a database server, that will have databases, those databases will have files. They don’t support displaying and monitoring the data in such a way that i can “drill” down from the SQL server to an individual file in a DB. They CAN monitor individual files and individual DB’s, they just can aggregate them.
5. You need professional services for things that frankly you shouldn’t need. For example, if you want to bulk import a bunch of devices, you can’t do that on your own (at least not easily). There’s no GUI to import a CSV or a JSON file. I think at best we “might” have an API finally available that could be used, but even there, at least last time i checked, its not documented well. Either way, tools should be easy to use, and for importing devices, a GUI should not be a problem at all.
6. Setting up dashboards is easy, but tedious if you need to make multiple similar dashboards. If I have 20 web clusters as an example, I might want a dashboard for each one. There’s no easy way to create those dashboards other than simply cloning a template, and going through (painfully) one chart and one datapoint at a time and updating which device and label to use. Again, going back to point 5, perhaps something via the API’s could make this much easier. 
  1. Update 03/01/2017: I haven’t had a chance to validate their dashboard enhancements yet, but it looks like they’ve added functionality that would make creating dashboards a lot easier.
7. Their lack of AD integrate authentication is frustrating. Forcing us to use either MS SAML or some third party solution just seems unneeded. its a nice option for sure, but I’d much rather have an appliance that I run which enables AD auth.
8. <del>They lack a “poll now” feature which I loved in solarwinds. If I have a datasource (say CPU) set to poll every 5 minutes. I’m stuck waiting 5 minutes for that device to poll. 5 minutes can be a long time when you’re recovering from an outage.</del>
  1. Update 03/01/2017: They have now added the poll now feature.
9. <del>They roll up historical data way too fast on average. With in less than a day, our data went from per poll datapoint (say every minute), to 8 minute averages. I can understand if after a week that happened, but in less than a day, that’s just crazy. Now, last I heard, they were looking to move to a different platform which would resolve this (again they continue to innovate / improve), but its a painful issue to live with when you need it.</del>
  1. Update 10/04/2016: I forget the exact release (7.9 maybe?) but this is no longer an issue. What you collect is what you keep for your agreed upon retention.
10. They had this really simplistic, but slightly dated UI that they’re now abandoning for a newer GUI. In many ways I DO like the new GUI, but simple things like finding threshold overrides, or datasources disabled at a group level are now way harder than they need to be. It seems like the UI designers are spending too much time focusing on aesthetics vs. functionality.
11. I appreciate that they have tech support, but honestly I feel like they’re reading a script some times. Multiple cases where we’ve demonstrated that our device wasn’t having issues, and that its probably their collectors, they’ve come back and forced us to prove it time and time again. Even when we come armed with info like “i logged into the poller, and run this command to grab wmi info on remote problem system as the poller user”.
12. I’m not going to go into great detail here, only to say that I think their architecture could be a little more secure with some simple changes.
13. I HATE the way their datasources don’t have an “overrides” function. What I mean by that is they have system datasources (ones they provide) and sometimes you need to make tweaks to them. Well in a few months, they may have an update for that datasoruce you tweaked. When you run the update, it whacks all your settings. I wish they provided a read only datasource, and that we had an ability to “link” a new datasource that had our customization, which over rode their datasource. This would allow their new features and tweaks to roll in, but things that we’ve overridden, would remain in place.
14. When they build datasources, to put it bluntly, I think they cheap out on fully developing them. For example, if I have an IronPort Email Security Appliance. They may have a built in datasource, but it may not have all the available OID’s setup or even all the datapoints. I get that it means they might need to store more data on their end, but why not just bite the bullet and configure ALL MIBS as an example and all datapoints. Maybe even have an option where only whats truly needed (subjective definition BTW) is enabled by default, but the other options are available, and as simple as enabling them.
15. Going off of point 14, they don’t really seem to think like an admin of the thing they’re monitoring. Or more specifically, in many cases they’re not fully monitoring the health of an application, just monitoring counters that exists. Let me give you an example. With active directory, one of the things you want to monitor is DFS-R health. Simply monitoring a counters doesn’t always provide insight into whether something like this is healthy or functioning as it should. In my case, I wanted to know for a fact that replication was working in Active Directory, so I ended up having to write a Powershell script that regularly created / updated a health file (on each DC) and then monitored that a given health file was updated on all DC’s. Now to be fair to LM, they never claimed to be a full tilt applicaiton monitor **and** I was able to do said monitor with their product. Still, if LM were to say hire or consult with an Active Directory engineer, there would be things like this that they could probably glean, that would benefit all of their customers. You could also contend this is something that could be crowd sourced by the community, but TBH, I’d much rather see something provided by them, and supported by them.
16. <del>They still lack a comprehensive RestAPI. Adding to that, they lack Powershell cmdlets for administering their products. Again, I’m going to berate any vendor that doesn’t offer Powershell in 2016. IMO if you’re catering to a windows crowd, not offering Powershell is just foolish on your part. Again, why should 100’s to 1,000’s of your customers waste time figuring out your API’s to do common functions, when you could spend the time once, and 1,000’s of customers could benefit from your work. Not to mention now there would be a standard (searchable) CLI / help doc for how to do something.</del>
  1. Update 10/04/2016: As of 8.0, their API is pretty comprehensive if not complete. I haven’t had a chance to use their API, so I can’t speak to things like how user friendly it is, but it does exist now.
17. To say setting up, troubleshooting, and administering their alert / notification rules is a PITA is an understatement. There are things like making sure rules are properly prioritized based on static numbers (not dynamic). It works like an ACL. Adding to that, it seems like there’s only one target per device. Even thought a device can be a member of multiple groups, only one group can actually be used to configure notifications / alerts. For example, lets say you have a group called “windows” and a sub-group called “SQL”. And let’s just say for argument, you have a special SQL server called “specialSQL”. Now let’s say be default you want all windows admins to monitor all windows boxes. And you want DBA’s to get all SQL alerts (but windows admins still need the alerts too), but you also have a special team that needs alerts for specialSQL server. You need three alert groups setup with members as outlined below. So now just imagine a joint like us with 700 devices and 100 different folks that want different alerts for different systems? Yikes! And, just remember the beginning point, each one of these is a rule, with a different number, that needs to be configured correctly or one group may not end up getting a notification, ever. 
  1. One for Windows admins, which contains windows admins
  2. One for SQL servers which contains Windows admins + DBA’s
  3. One for Windows admins + DBA’s + special team.
18. There filters in many cases are “include” only and there’s no “exclude” option. For example, if I want a dashboard that shows all windows servers, but no SQL servers, not going to happen if the SQL server happens to have \*windows\* in its group name. The only way to work around that would be instead of using a wild card for group \*windows\*, we need to explicitly include \*Exchange\*, \*IIS\*, \*File\*, etc. Its a PITA 
  1. Update 10/04/2016: I would not go so far as saying this is resolved completely, but they do ofter some exclude capability now. It’s appears to only be one level deep though. As in, the above example i could exclude .\\windows\\SQL by excluding \*SQL\*, but I couldn’t exclude .\\windows\\test\\SQL with the same statement. Still kind of lame IMO. Frankly their operators and filter mechanism is over complicated.
19. Their datasources besides not always being documented well (or in many cases not at all) have absolutely no decent naming convention. Instead of doing something like “Vendor\_Product\_Datasource” they just randomly choose vendors, or product names and in many cases abbreviate them. For example, one datasource might be named “winos” and another “wincpu”?
20. Their threshold evaluation leaves a lot to be desired. They work based on the following operators “=,&lt;=,&gt;=,&lt;,&gt;,!=, etc.” Some devices have nice even number sequences where anything above 1 = warning until you get to 4 and then its an error. In those cases their thresholds work fine. However if you can something tricky like 0 = good, 1 = verybad, 2 = warning, 3 = maybe something you should look into, 4 = error. There’s no good way to target numbers that are all over the place with thier limitation. It would be nice to see them add query based evaluation instead. As in supporting “or” + “and” + grouping threshold conditons. Like (=1 or = 2) or (&gt;=7). I suspect it might take some extra CPU power to make that evaluation, but it would be worth it.
21. Having agent based collection would be a nice option for those of us that don’t like having to doll out admin rights to our collectors. We have a few cases where we installed the collector right on the server we wanted to monitor to avoid such things. Perhaps we could do that across the board, but I haven’t looked into it and honestly that would be a hack.
22. <del>They’re SaaS, so if you’re limited to a lot of their constraints (data retention as an example).</del>
  1. Update 10/04/2016: It looks like they now retain up to two years worth of data with certain contracts. Better than before, but still not a good fit for long term retention.
23. They’re not a replacement solution for all your deep web, application and network monitoring solutions. Yes they have NetFlow, but I suspect Scrutinizer does it much better.

Summary:
========

They’re not perfect as I eluded too, and believe me, I could probably keep going on with the cons (and pros, albeit harder). However, its about context, and in the context of other solutions, I really like LogicMonitor. They’re fairly new as a company and given everything they’ve been able to do so far, I honestly can’t wait to see what they’ve got on the horizon. I’ve found that most things I care about, I’ve been able to use LM to monitor. Even things that you normally wouldn’t monitor, like job status in 3rd party applications. They for the most part have been the one console I use to monitor everything. It took a bit of time to roll up all my outlying functions into them, but now we have a great single pain of glass. Give them a peak when you have some time.