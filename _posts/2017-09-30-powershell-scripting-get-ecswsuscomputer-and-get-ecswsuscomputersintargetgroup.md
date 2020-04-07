---
title: 'Powershell Scripting: Get-ECSWSUSComputer and Get-ECSWSUSComputersInTargetGroup'
date: '2017-09-30T21:25:51+00:00'
status: publish
permalink: /powershell-scripting-get-ecswsuscomputer-and-get-ecswsuscomputersintargetgroup
author: 'Eric Singer'
excerpt: ''
type: post
id: 495
category:
    - Uncategorized
tag: []
post_format: []
---
Introduction:
=============

These two functions by themselves aren’t exactly sexy. Their main goal is to be used to feed my function Get-ECSWSUSComputerUpdatesStatusReport. Still, I can see some limited value to them outside of that use case.

One thing you’ll notice, is i’m hitting SQL directly instead of querying the WSUS APIs. I’m doing this, despite it not being recommended, because it’s infinitely faster and far more flexible that the APIs.

Dependencies:
=============

First and foremost, you need my Invoke-ECSSQLQuery function located [here](https://github.com/ericcsinger/Powershell/blob/master/Microsoft/SQL/Invoke-ECSSQLQuery/Invoke-ECSSQLQuery.ps1). This is going to mean a few things before you get going.

- You need to make sure the account you’re running these functions under has access to the WSUS database.
- You need to make sure the database server is setup so that you can make remote connections to it.
- If you’re in need of SQL auth instead of windows auth, you’ll need to adjust the Get-ECSWSUSComputer and Get-ECSWSUSComputersInTargetGroup so that the embedded calls to my invoke-ecssqlquery use SQL auth instead of windows.

Syntax examples:
================

First, if you’re reading this in Feedly or some other RSS reader, it’s not going to look right, you’ll need to hit my site if it looks like a bunch of garble.

```
<pre class="brush: powershell; title: ; notranslate" title="">

Get-ECSWSUSComputer -WSUSDataBaseServerName "Database Server Name" -WSUSDataBaseName "SUSDB or whatever you called it" -WSUSComputerName "ComputerName or Computer Name pattern" -SQLQueryTimeoutSeconds "Optional, enter time in seconds"

Get-ECSWSUSComputersInTargetGroup -WSUSDataBaseServerName "Database Server Name" -WSUSDataBaseName "SUSDB or whatever you called it" -WSUSComputerTargetGroupName "Computer target group name (wildcards supported)" -SQLQueryTimeoutSeconds "Optional, enter time in seconds"

```

Let me restate, you’re pointing at a SQL server. Sometimes that’s the same server as the WSUS server, or sometimes that’s an external DB. If you’re using an instanced SQL server, then for the database server name, you’d put “DatabaseServername\\InstanceName”

The ComputerName param (and TargetGroupName) support wildcards. You can use “\*” (and my function will convert it to proper SQL wildcard) or you can use “%”. Doesn’t matter how many you use, or where you put them.

Output:
=======

The output is the same no matter which function you run, with the one small exception being that I capture the computer target group name in the computer target group function.

```
<pre class="brush: powershell; title: ; notranslate" title="">

ComputerTargetId : 07504bcf-e736-4222-b13c-989c425b7c11
ParentServerId :
Name : The name of the computer
IPAddress : The Computers IP
LastSyncResult : Succeeded
LastSyncTime : 9/30/2017 4:11:33 PM
LastReportedStatusTime : 9/30/2017 4:20:16 PM
LastReportedInventoryTime :
ClientVersion : 10.0.14393.1670
OSArchitecture : AMD64
Make : Dell Inc.
Model : OptiPlex 990
BiosName : Default System BIOS
BiosVersion : A19
BiosReleaseDate : 8/26/2015 12:00:00 AM
OSMajorVersion : 10
OSMinorVersion : 0
OSBuildNumber : 14393
OSServicePackMajorNumber : 0
OSDefaultUILanguage : en-US

```

Again, this output is really designed to feed my next function,but you might find it useful to do things like confirm that all WSUS computers are registered that should be, or to simply check the last time they synced.

Closing:
========

Any questions or recommendations, feel free to fire away. Again, not a super sexy funtion, but I think you’ll like the next one coming up.