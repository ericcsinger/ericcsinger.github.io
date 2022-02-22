---
title: 'Microsoft's Biggest Security Failure'
date: '2021-02-21T16:00:00+00:00'
status: publish
permalink: /Microsofts-Biggest-Security-Failure
author: 'Eric C. Singer'
excerpt: ''
type: post
tag:
    - Microsoft
    - Windows
    - Security
post_format: []
---

# Microsoft's Biggest Security Failure

Version: 1.0.1

## Introduction

Look we all know the running joke is "Microsoft Security" is an oxymoron.  Over the years though, Microsoft has made large strides in improving security.  In fact, one could make a case that they have defined newer standards that others have lacked.

That said, I'd like to discuss an area that has left companies exposed for malicious intent.  Monitoring in a Microsoft Windows environment.

Finally, before continuing.   These are my opinions shaped from my own experience.  If you disagree, feel free to drop a comment at the bottom.

## The Issue

The current way to 100% monitor Microsoft Windows is to use an account with administrator rights.  I don't care where the account runs, whether it's local on the machine, or remote.  Administrator rights are what we all use.  

Now I'm not saying it's impossible to monitor Windows without admin rights.  What I am saying, is it's complex, and prone to error.  Let me elaborate.

A few years ago, I tried the steps outlined in the Microsoft article [here](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/delegate-wmi-access-to-domain-controllers/ba-p/259535).  It sort of worked, except I found that a lot of the things I was monitoring stopped working.  The more I digged, the more I found that even this alone was not enough.  Take the Microsoft clustering role.  That will have its own discrete set of permissions on WMI / Perfmon counters.  This lead to more scripting, to get things setup, and of course, no documentation.  This was only one role, of who knows how many roles where you might encounter this.

As it stands, without a ton of work, it's hard to know if you're actually monitoring everything.  Sure, you could use the steps outlined in the article as a starting point.  Then dig into each component that you want to monitor and verify you have the rights.  

There is another issue here, and that is that monitoring is a critical role in a lot of places.  It's also a role that rarely gets the attention it needs.  Kind of lick backups, DR and security.

Even worse, is that this same issue exists for domain controllers.  Except, there is no longer a concept of "local administrator".  To me, this is also a fundamental security flaw.  

## Who's to blame

Microsoft is 100% at fault here.  It might be easy for them to point back at the admins, but they've left us no reasonable alternative.  There are always going to be things you can do to reduce the security exposure running as a local admin (or system).  But you shouldn't have to.   It's still insecure and is fixing a symptom instead of solving the problem.  

One of the things I was waiting for when Microsoft released Windows 8 / Server 2012 was for them to fix this.  Then when Windows 10 / Server 2016 came out, again I hoped they would fix this.  Alas, nothing has changed since the dawn of Windows NT.

What can Microsoft do:
In my mind, there are a few things Microsoft could do.

- Build in a role that provides global read only access.  This need spans beyond monitoring, but would be complementary.  I would still consider this a powerful group that should be used minimally.

- Build in a read only role for each service type.  The idea being that you could create custom roles by making an object a member of multiple groups.  

- Provide a true lightweight API that can be be called and expanded on.  I know there is WMI / CIM, but it would be more ideal to have a web based api with JSON output.  Being able to expand this with custom scripts, would be another great way to keep things a bit more secure.  Right now, a lot of monitoring systems that are agent based, run as a service with SYSTEM rights.  Having something like an API designed and secured by Microsoft, would likely go a long way.  Even if something needs to run as a powerful account.  The API would restrict what calls could be made.  

Again, that API should be secured via built-in groups.  Then expanded with additional groups for custom stuff.

## Closing

Given how long this has been an issue for so many shops, it's time we all start pressuring Microsoft for a solution.  If Microsoft wants to take security seriously, this is a problem that needs to be solved.
