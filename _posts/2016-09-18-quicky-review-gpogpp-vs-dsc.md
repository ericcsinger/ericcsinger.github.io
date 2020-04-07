---
title: 'Quicky Review: GPO/GPP vs. DSC'
date: '2016-09-18T16:10:12+00:00'
status: publish
permalink: /quicky-review-gpogpp-vs-dsc
author: 'Eric Singer'
excerpt: ''
type: post
id: 390
category:
    - Uncategorized
tag:
    - automation
    - DSC
    - GPO
    - GPP
    - powershell
    - review
    - reviews
post_format: []
---
Introduction:
=============

If you’re not in a DevOps based shop, or living under a rock, you may not know that Microsoft has been working on a solution that by all accounts sounds like its poised to usurp GPO / GPP. The solution I’m talking about is Desired State Configuration, or DSC. According to all the marketing hype, DSC is the next best thing for IT since virtualization. If the vision comes to fruition, GPO and GPP will be a legacy solution. Enterprise mobility management will be used for desktops and DSC will be used for servers. Given that I currently manage 700 VM’s and about an equal number of desktops, I figured why not take it for a test drive. So I stood up a simplistic environment, and played around with it for a full week and my conclusion is this.

I can totally see why DSC is awesome for non-domain joined systems, but its absolutely not a good replacement in todays iteration for domain joined systems. Does that mean you should shun it since all your systems are domain joined? That depends on the size of your environment and how much you care about consistency and automation. Below are all my unorganized thoughts on the subject.

The points:
===========

DSC can do everything GPO can do, but the reverse is not true. At first that sounds like DSC is clearly a winner, but I say no. The reality is, GPO does what it was meant to do, and it does it well. To reproduce what you’ve already done in GPO while certainly doable, has the potential of making your life hell. Here are a few fun facts about DSC.

1. The DSC “agent” runs as local system. This means it only has local computer rights, and nothing else.
2. Every server that you want to manage with DSC, needs its own unique config file built. That means if you have 700 servers like me, and you want to manage them with DSC, they each are going to have a unique config file. Don’t get me wrong, you can create a standard config, and duplicated it “x” times, but none the less, its not like GPO where you just drop the computer in an OU and walk away. That being said, and to be fair, there’s no reason you couldn’t automate DSC config build process to do just that. 
  1. DSC has no concept of “inheritance / merging” like you’re used to with GPO. Each config must be built to encompass all of those things that GPO would normally handle in a very easy way. DSC does have config merges in the sense that you can have a partial config for say your OS team, your SQL team and maybe some other team. So they can “merge” configs, and work on them independently (awesome). However, if the DBA config and the OS config, conflict, errors are thrown, and someone has to figure it out. Maybe not a bad thing at all, but none the less, it’s a different mindset, and there is certainly potential for conflicts to occur.
3. A DSC configuration needs to store user credentials for a lot of different operations. It stores these credentials in a config file that hosted both on a pull server (SMB share / HTTPs site) and on the local host. What this means is you need a certificate to encrypt the config file and then of course for the agent to decrypt the config file. You thought managing certificates was a pain for a few exchange servers and some web sites? Ha! now every server and the the build server need certs. In the most ideal scenario, you’re using some sort of PKI infrastructure. This is just the start of the complexity. 
  1. You of course need to deploy said certificate to the DSC system before the DSC config file can be applied. In case you can’t figure it out by now, this is a boot strap solution you have to implement on your own if you don’t use GPO. You could use the same certificate and bake it into an image. That certainly makes your life easier, but its also going to make your life that much harder when it comes to replacing those certs on 700 systems. Not to mention, a paranoid security nut would argue how terrible that potentially is.
4. The DSC agent of course need to be configured before it knows what to do. You can “push” configurations, which does mitigate some of these issues, but the preferred method is “pull”. So that means you need to find a way (boot strap again) to configure your DSC agent so that it knows where to pull its config from, and what certificate thumbprint to use.

Based on the above point, you probably think DSC is a mess, and to some degree it is. However, a few other thoughts.

1. It’s a new solution, so it still needs time to mature. GPO has been in existence since 2000, and DSC, I’m going to guess, since maybe 2012. GPO is mature, and DSC is the new kid.
2. Remember when I wrote that DSC can do everything that GPO can do, but not the reverse? Well, lets dig into that. Let’s just say you still manage Exchange on premises, or more likely, you manage some IIS / SQL systems. DSC has the potential to make setting those up and administering them, significantly easier. DSC can manage not only the simple stuff that GPO does, but also way beyond that. For example, here are just a few things. 
  1. For exchange: 
      1. DSC could INSTALL exchange for you
      2. Configure all your connectors, including not only creating them, but defining all the “allowed to relay” and what not.
      3. Configure all your web settings (think removing the default domain\\username).
      4. Install and configure your exchange certificate in IIS
      5. Configure all your DAG relationships
      6. Setup your disks and folders
  2. For SQL 
      1. DSC could INSTALL sql for you.
      2. Configure your max member min memory
      3. Configure your TempDB requirements
      4. Setup all your SQL jobs and other default DB’s
  3. Pick another MS app, and there’s probably a series of DSC resources for it…
  4. DSC let’s you know when things are compliant, and it can automatically attempt to remediate them. It can even handle things like auto reboots if you want it to. GPO can’t do this. To the above point, what I like about DSC, is I’ll know if someone went in to my receive connector and added an unauthorized IP, and even better, DSC will whack it and set it back to what it should be.
  5. Part of me thinks that while DSC is cool, I wish Microsoft would just extend GPO to encompass the things that DSC does that GPO doesn’t. I know its because the goal is to start with non-domain joined systems, but none the less, GPO works well and honestly, I think most people would rather use GPO over DSC if both were equally capable.

Conclusion:
===========

Should you use DSC for domain joined systems? I think so, or at least I think it would be a great way to learn DSC. I currently look at DSC as being a great addition to GPO, not a replacement. My goal is going to be to use GPO to manage the DSC dependencies (like the certificates as one example) and then use DSC for specific systems where I need consistency, like our exchange, SQL and web servers. At this stage, unless you have a huge non-domain joined infrastructure, and you NEED to keep it that way, I wouldn’t use DSC to replace GPO.