---
title: 'Problem Solving: VMware VM not reading VMDK serial number in OS'
date: '2018-03-19T12:52:31+00:00'
status: publish
permalink: /problem-solving-vmware-vm-not-reading-vmdk-serial-number-in-os
author: 'Eric Singer'
excerpt: ''
type: post
id: 565
category:
    - Uncategorized
tag:
    - powershell
    - vmware
post_format: []
---
I created a function while ago that utilizes the VMDK serial number to map which VMDK is used for a Windows volume. Starting with Windows 10 / Server 2016, I noticed that I could no longer see the serial number of a VMDK insides the OS. After reaching out to VMware, turned out to be a really simple fix.

First let me share the relevant KB:

https://kb.vmware.com/s/article/52815

I would suggest you make sure this setting is present on all VM’s. At least if you care about being able to see the VMDK disk serial number in the OS.

Here is a quick Powershell snippet to check if it exists and if it’s enabled.

```
<pre class="brush: powershell; title: ; notranslate" title="">
get-vm -name %YourVMName% | Get-AdvancedSetting | Where-Object {$_.name -eq "disk.EnableUUID"}
```

If that command returns no result or the value is false, you won’t see the disk serial number inside your OS.