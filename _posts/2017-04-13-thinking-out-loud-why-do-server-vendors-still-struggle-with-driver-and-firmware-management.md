---
title: 'Thinking out loud: Why do server vendors still struggle with driver and firmware management?'
date: '2017-04-13T23:49:38+00:00'
status: publish
permalink: /thinking-out-loud-why-do-server-vendors-still-struggle-with-driver-and-firmware-management
author: 'Eric Singer'
excerpt: ''
type: post
id: 447
category:
    - Uncategorized
tag:
    - dell
    - servers
    - 'thinking out loud'
    - vmware
post_format: []
---
History:
========

Let me give you a little back story before digging into the meat of this post. My team and I make a very concerted effort to keep our servers firmware and drivers updated. We’ve gone so far as to purchase software from Dell, implement a process on how firmware / drivers are to be updated, and ensuring that its routinely done every quarter. We do this because in general it’s a best practice, but also because we’ve run into too many occasions where troubleshooting with a vendor stops (if it ever starts) very quickly if the drivers / firmware isn’t recent. In essence, we’re doing our best to be diligent and proactive with keeping our servers healthy, secure and updated.

Late last year we ran into two issues, both of which are related to drivers / firmware.

1. A Broadcom NIC causing a purple screen of death (PSOD) in ESXi. This was a server that was freshly rebuilt and all drivers (or so we thought) and firmware updated. Turns out the driver we were running was more than two years old and the PSOD we were having was a resolved issue in a newer driver.
2. An Intel x710 quad port 10Gb NIC causing packets to black hole for certain VM’s on the same vLAN. Again, these were new hosts that were patched, firmware updated and in theory up to date. This issue is what really triggered us to start evaluating other server vendors and their solutions.

Of those two issues above, only one was solved with a simple driver update, and the other, we just gave up on and switched to a different NIC (x520).

The Issue:
==========

If you can’t see where this post is going already, let me lay it out. Server vendors still can’t properly manage their own drivers, firmware and vendor specific software. I know what you’re thinking, you have tools that the vendor provided, you’re using them and you’re fine. I hate to be the bearer of bad news, but I doubt it. We just got done a rigorous evaluation of Dell, HP and Cisco. None of them have a <u>complete solution</u>. Don’t get me wrong, some of them are getting there, but no one has the problem solved. If you’re wondering what the specific problems are, see the bullets below.

- Server vendors would like that you keep your firmware, drivers and tools up to date.
- OS vendors (and sometimes server vendors) require that the driver and firmware have a certified pairing. It is NOT good enough to simply have the latest driver and the latest firmware. This of course may vary slightly depending on which server and OS vendor. VMware though as an example, absolutely has driver and firmware paring that’s required. 
  - This driver and firmware pairing is typically worked out between the server and OS vendor.
  - VMware has a strict HCL for this use case, and TMK, MS has an HCL, although they’re a little more forgiving when it comes to the pairing. I can’t speak about Linux, Solaris or other OS’s.

Think about this, when was the last time you did the following?

- Retrieved an inventory of all your hardware firmware revisions **and** driver revisions. 
  - Do you even know how to do this? Probably not as easy as you think.
- Logged into your OS vendors HCL and one hardware item at a time, checked if you are running the latest driver and firmware, and that the pairing is also certified. 
  - With VMware, you can use the device vendor ID, device ID and sub vendor ID to find the specific hardware in question on their HCL. Just remember its hex values.

I bet you’re either relying on the following.

- VMware update manager, and vendor provided depots (if they exist).
- Vendor supplied firmware management solutions. 
  - Some **may** have driver management for select OS, but no one does it all.
- Vendor custom ISOs / install discs.

I’m going to suspect if you go and check your VMware HCL, you’re out compliance in one way or another, or something is woefully out of date.

Solution:
=========

Let’s share a pipe for a second and dream about what it **should** look like.

Server Vendor:
--------------

- It should be a central console.
- It should handle downloading all firmware, drivers and vendor specific tools.
- It should use a concept of baselines. A baseline being defined as. 
  - OS and server model specific.
  - Based on a release date. The baseline should define an approved pairing of drivers, firmware and vendor tools for a given month, quarter or however often the server vendor feels the need to establish a new baseline.
  - The baseline should support the concept of cumulative updates / hotfixes.
- It should support grouping servers, and applying baselines to the server groups.
- It should support compliance checking for the baselines. Not simply deploying the drivers and firmware and assuming everything is ok. This would let you know if an admin went rouge and manually updated or downgraded firmware / drivers or tools.
- It should support rolling back drivers, firmware or tools if it is determined to be too far ahead.
- Provide very verbose information as to why an update process failed.
- Bonus points 
  - Support a multi-site architecture. Meaning be able to have a cached copy of the repo and a local server to perform the actual update and auditing process.
  - Auto discover servers

OS Vendor:
----------

- Should provide a comprehensive API 
  - Look up hardware and driver pairings.
  - Enable the download of the driver or firmware directly would be nice.

Conclusion:
===========

Coming back to reality a bit, what can you do? Use the tools you have to the best of your ability, script what you can, and manually deal with the gaps. That said, I’m working on the auditing part of the problem, at least with VMware. Hope to have blog post about it and a new GitHub commit in the coming month or so, stay tuned.

Oh, one final thing you can do, start bugging your server vendor sales team about the issue. If enough people raise the issue, it will get the attention it desperately needs.