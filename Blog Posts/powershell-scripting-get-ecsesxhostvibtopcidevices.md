---
title: 'Powershell Scripting: Get-ECSESXHostVIBToPCIDevices'
date: '2017-06-30T21:20:28+00:00'
status: publish
permalink: /powershell-scripting-get-ecsesxhostvibtopcidevices
author: 'Eric Singer'
excerpt: ''
type: post
id: 468
category:
    - Uncategorized
tag:
    - powershell
    - vmware
post_format: []
---
Introduction:
=============

If you remember a little bit ago, I said I was trying to work around the lack of driver management with vendors. This function is the start of a few tools you can use to potentially make your life a little easier.

VMware’s drivers are VIBS (but not all VIBS are drivers). So the key to knowing if you have the correct drivers is to find which VIB matches which PCI device. This function does that work for you.

How it works:
=============

First, I hate to be the bearer of bad news, but if you’re running ESXi 5.5 or below, this function isn’t going to work for you. It seems the names of the modules and vibs don’t line up via ESXCLI in 5.5, but they do in 6.0. So if you’re running 6.0 and above, you’re in luck,.

As for how it works, its actually pretty simple.

1. Get a list of all PCI devices
2. Get a list of all modules (which aren’t the same as VIBS).
3. Get a list of all VIBs.
4. Loop through each PCI device 
  1. See if we find a matching module 
      1. Take the module and see if we find a VIB that matches it.
5. Take the results of each loop, add it to an array
6. Spit out the array once the function is done running
7. Your results should be present.

How to execute it:
==================

Ok, to begin with, I’m not doing fancy pipelining or anything like that. Simply enter the name of the ESXi host as it is in vCenter and things will work just fine. There is support for verbose output if you want to see all the PCI devices, modules and vibs that are being looped through.

```
<pre class="brush: powershell; title: ; notranslate" title="">
Get-ECSESXHostVIBToPCIDevices -VMHostName "ServerNameAsItIsInvCenter"
```

If you want to do something like loop through a bunch of hosts in a cluster, that’s awesome, you can write that code :).

How to use the output:
======================

Ok great, so now you’ve got all this output, now what? Well, this is where we’re back to the tedious part of managing drivers.

1. Fire up the VMware HCL web site and go to the IO devices section
2. Now, there are three main columns from my output that you need to find the potential list of drivers. Yeah, even with an exact match, there maybe anywhere from 0 devices listed (take that as you’re running the latest) to having on or more hits. 
  1. PCIDeviceSubVendorID
  2. PCIDeviceVendorID
  3. PCIDeviceDeviceID
3. Those three columns are are all you need. Now a few notes with this. 
  1. if there are less than four characters, VMware will add leading zeros on their web drop down picker. For example, if my output shows “e3f”, on VMwares drop down picker, you want to look for “0e3f”.
  2. if you get a lot of results, what I suggest doing next, is seeing if the vendor matches your server vendor. If you find a server vendor match and there are still more than one result, see if its something like the difference between a dual port or single port card. If you don’t see your server vendor listed, see if the card vendor is listed. For example, in UCS servers, instead of seeing Cisco for a RAID controller, you would likely find a match for “Avago” or “Broadcom”. Yeah, it totally gets confusing with HW vendors buying each other LOL.
4. Once you find a match, the only thing left to do, is look at the output of column “ModuleVibVersion” in my script and see if you’re running the latest driver available, or if it at least is recent. Just keep in mind, if you update the driver, make sure the FW you’re running is also certified for that driver.

Where’s the code?
=================

Right [here](https://github.com/ericcsinger/Powershell/tree/master/VMware/Get-ECSESXHostVIBToPCIDevices)

What’s next / missing?
======================

Well, a few things:

1. I haven’t found a good way yet to loop through each PCI device and see its FW version. That’s a pretty critical bit of info as I’ve said before.
2. Even if i COULD find the firmware version for you, you’re still going to need to cross reference it against your server vendor. Without an API, this is also going to be a tedious process.
3. You need to manually check the HCL because in 2017, VMware still doesn’t have an API, let alone a restful one to do the query. If we had that, the next logical step would be to take this output and query an API to find a possible match(es). For now, you’ll need to do it manually. 
  1. Ideally, the same API would let you download a driver if you wanted.
4. VMware lacks an ability to add VIBS via PowerCLI or really manage baselines and what not. So again, VMware really dropping the ball here. This time it’s the “Update Manger” team.

Conclusion:
===========

Hope this helps a bit, it’s far from perfect, but I’ve used it a few times, and found a few NIC drivers and RAID controllers that had older drivers.