---
title: 'Naming Conventions: Server Names'
date: '2017-01-28T21:38:09+00:00'
status: publish
permalink: /naming-conventions-server-names
author: 'Eric Singer'
excerpt: ''
type: post
id: 426
category:
    - Uncategorized
tag: []
post_format: []
---
Introduction:
=============

One of the things I’m struggling with, is how to balance the number of posts per naming convention. It would be easy in some ways to use a single post per server type, but it would also be overly redundant in many ways. I originally wrote a dedicated post to SQL server naming conventions, and realized that the logic behind its name is ultimately a similar logic for other server names. With that said, I’ve decided to create a consolidated post for server names. I’ll rehash the overall structure used for the SQL naming convention, and show you how its reusable for other servers.

Limitations:
============

To begin with, 15 characters is a length limitation I would always suggest maintaining. The only exception is in the following circumstances. If you’re building a server that isn’t Windows, and will NEVER need to join a Windows domain, then and only then can you make names longer than 15. Microsoft in their perpetual need to maintain excessive backwards compatibility, still hasn’t dropped NetBIOS out of its architecture. Even if you build a Microsoft domain, 100% running on DNS resolution, they still truncate names for backwards compatibility. I wish they would provide a naming resolution compatibility mode that would in essence switch the domain from NetBIOS supported to DNS only, but that’s a whole different blog post.

My naming conventions are designed to scale for smaller to mid-sized companies. If you’re dealing with 10s of thousands of servers, this naming convention won’t scale to your needs. My names are designed to give you a hint of what the server does. When you’re at the 10s of thousands size, you need a whole new way of dealing with server names.

Other stuff:
============

I used to really get hung up on server numbering. What I mean by that, is if I was running a smaller shop with say two domain controllers. Let’s call them DC1 and DC2 for simplicity. I would want to keep those names every time I did a major upgrade. Ultimately it led to a lot of shuffling, and a lot of time spent for something that was ultimately cosmetic and not important. Point being, if you are or were like me, learn to let it go. Sometimes you will have a DC3 and a DC4 when there are no DC1 and no DC2.

When you’re dealing with systems that need to connect to other systems by name, learn that CNAME records can be your best friend. I strongly suggest to avoid pointing things directly at a server name, if whatever you’re pointing is mostly a generic service. For example, its very common to have many things pointing at your DC’s for LDAP lookups. Rather than doing something like pointing at DC1 and DC2, create a CNAME record for something like “ldap1.domain.com” and “ldap2.domain.com”. Then when you change your DC’s, you only have two records to change.

It’s expensive, but load balancers can also help with renaming / moving things. They help because of their ability to create a “virtual IP” and redirect that traffic to any real IP as needed. In the case of DNS, it would enable you to move your DNS functionality to a new server without having to change the IP you have configured across all your systems.

My naming convention basics:
============================

There are a few basics planned into my naming conventions. These basics make it easier to organize servers, and ultimately find / figure out what a server’s purpose is. Obviously with a 15-character limit, there are going to be a lot of abbreviations. In my opinion, so long as you’re consistent, even vague abbreviations will eventually be memorable or make sense.

Hyphens:
========

I use hyphens to separate may of the naming conventions purposes. I know its potentially wasting very precious characters, but at our scale, we can mostly afford to do it, in exchange for making it easier to programmatically find servers. You don’t need to use hyphens, I do it because its easier for me to script with. Plus, they make for a consistent separator. Ultimately though, consistency as I stated above, is what’s important.

Location variable:
==================

I prefer to start all names with either a location variable. At two completely different companies, I inherited naming conventions that used their company’s acronym for their primary site, and DR for their disaster recovery site servers. There are two problems with using something this descriptive.

1. I’ve worked for a company that flipped the location of their DR and primary site. It meant for a very confusing period of time where some servers might have said “DR” but were actually now in the primary headquarters, and vice versa.
2. If you’re company has more than one office or more than one DR site, the naming convention kind of falls apart.

The main goal for the server location should be generic, but consistent. Using something like AA1, is just as likely to suffer from the issue above in point 1, **but** it does solve the issue of problem 2. If you have multiple locations, you just keep incrementing the number. So AA2, AA3 ….AA9, and then increment the letter to AB1. It leaves a TON of room for different / unique locations. Heck, maybe you don’t even need the double letter. Math isn’t my strength, but if my calculations are correct even something like one letter + one number = 234 locations, and that assumes you never use the number “0”, in which case it would be 260 locations.

Application:
============

I like to use something short (as in 3 letters or less) to tell me something about the application or purpose of the server. For example, I might use “SQL” for a SQL Database Server, or RMQ for a Rabbit MQ server, or EXM for an Exchange Mailbox server. It can get a little tricky of course, after all you have MySQL and MSSQL, but maybe that doesn’t matter. After all, a SQL DB is a SQL DB. The reason I keep it three letters or shorter (on average) is to leave room for a clustering naming conventions (coming up). Of course if you’re not limited by the 15 characters, you can get a lot more verbose, but at least for those of us in windows shops, that’s tough.

Environment:
============

This one is short and easy, I use a few letters to denote the environment of the server.

- P = Production
- S = Stage
- U = UAT
- D = Dev
- T = Test
- X = Sandbox

Clustered or Standalone:
========================

I like to denote if this is a clustered system or a standalone system. The standalone part of is pretty easy, I just use an “S”. Sometimes I’ll trail it with a number, like S1, or S2 to denote that the application isn’t clustered but that they’re related (you’ll see an example later).

For the cluster part, it gets a little more involved and varies a little bit based on the application. We start out with a simple “C” to denote clustered, but then I like to use another trailing letter / number as well. Let’s look at a few cluster examples.

- CN1 = Clustered Node 1
- CN2 = Clustered Node 2
- CDI1 = Clustered Database instance
- CDG1 = Clustered Database Group 1

Application group number:
=========================

This is the final number that really ties everything together. I use a simple “01”, “02” or whatever number really to tie all clustered nodes or even standalone (related) systems together.

Putting it all together:
========================

Here are a few practical examples to give you an idea of how it all goes together.

**Example 1:** A SQL environment to support the widgets application. This SQL environment will have a full development lifecycle environment and UAT will mirror Production exactly. We’ll be using SQL AAG’s.

1. Dev = a1-sqlds-01
2. Stage = a1-sqlss-01
3. UAT = 
  1. Nodes 
      1. A1-sqlucn1-01
      2. A1-sqlucn2-01
  2. Clustered Named Object (management) 
      1. A1-sqluc-01
      2. SQL AAG listener names 
            1. A1-sqlucdg1-01
            2. A1-sqlucdg2-01
      3. Prod = 
            1. Nodes 
                    1. A1-sqlpcn1-01
                    2. A1-sqlpcn2-01
            2. Clustered Named Object (management) 
                    1. A1-sqlpc-01

- SQL AAG listener names 
  1. A1-sqlpcdg1-01
  2. A1-sqlpcdg2-01

Notice how the last number glues everything together. Also notice how everything is built off a consistent naming standard. If we deployed a new application

**Example 2:** How about something simple like a domain controller environment for 3 sites? Let’s just say there will be a production environment and a test environment.

1. Test 
  1. Site a1 
      1. A1-dctcn1-01
      2. A1-dctcn2-01
  2. Site a2 
      1. A2-dctcn1-01
      2. A2-dctcn2-01
  3. Site a3 
      1. A3-dctcn1-01
      2. A3-dctcn2-01
  4. Production: 
      1. Site a1 
            1. A1-dcpcn1-01
            2. A1-dcpcn2-01
      2. Site a2 
            1. A2-dcpcn1-01
            2. A2-dcpcn2-01
      3. Site a3 
            1. A3-dcpcn1-01
            2. A3-dcpcn2-01

Again, notice how I use a single final number to glue an entire “purpose” together. If I built a second discrete domain, I would likely change the last number to “02” which would quickly tell me that the domain controller is part of a separate domain. Also notice how you can easily tell which node a DC is, which site a DC is in, and what its environment is.

**Example 3:**  A non-clustered exchange server environment that’s serving the same company.

1. Mailbox servers: 
  1. A1-exmps1-01
  2. A1-exmps2-01
2. CAS Nodes (load balanced) 
  1. A1-excpcn1-01
  2. A1-excpcn2-01
3. CAS VIP 
  1. A1-excpc-01\_vip

Here you can see how the standalone mailbox servers are working for the same purpose, but ultimately they’re not clustered together. With the CAS servers, you can see that they are in fact clustered and that we even created a VIP DNS name that helps you understand how everything is related.

Other examples:
===============

At this stage I’m just going to bullet a list of various options, I’ll use a single destination and a single application number since we’ve already gone over that.

### File Servers:

1. Clusters 
  1. Nodes 
      1. a1-fspcn1-01
      2. a1-fspcn2-01
  2. Cluster Resource 
      1. a1-fspc-01
  3. Clustered SMB share 
      1. a1-fspcsmb1-01
      2. a1-fspcsmb2-01
  4. Clustered NFS share 
      1. a1-fspcnfs1-01
      2. a1-fspcnfs1-01
2. Standalone 
  1. a1-fsps-01

### CommVault:

1. Comcell 
  1. a1-cvccps1-01
2. MediaAgent 
  1. a1-cvmaps1-01
  2. a1-cvmaps2-01
3. Virtual Server Agent (for dedicated VM’s) 
  1. a1-cvvsaps1-01
  2. a1-cvvsaps2-01

### DHCP:

1. Clusters <span style="color: #ff0000;">\*\*\*Note: because DHCP consumes 4 characters, I leave the “c” off the name. </span>
  1. a1-dhcppn1-01
  2. a2-dhcppn2-01
2. Standalone 
  1. a1-dhcpps1-01