---
title: 'Powershell Scripting: Get-ECSWSUSComputerUpdatesStatusReport'
date: '2017-10-07T20:38:40+00:00'
status: publish
permalink: /powershell-scripting-get-ecswsuscomputerupdatesstatusreport
author: 'Eric Singer'
excerpt: ''
type: post
id: 501
category:
    - Uncategorized
tag:
    - powershell
    - T-SQL
    - wsus
post_format: []
---
Introduction:
=============

I hate the WSUS reports built into the console. They’re slow, and when it comes to doing something useful with the data, it’s basically impossible. That’s why I wrote this function.

I wanted an ability to gather data on a given WSUS computer(s), and work with it in Powershell. This function gives me the ability to write scripts for bulk reports, automate my patching process (checking that all updates are done), and in general, gives me the same data the standard WSUS report does, but at a MUCH faster rate.

You can find the function [here](https://github.com/ericcsinger/Powershell/blob/master/Microsoft/WSUS/Get-ECSWSUSComputerUpdatesStatusReport/Get-ECSWSUSComputerUpdatesStatusReport.ps1).

Dependencies:
=============

You’ll need my Invoke-ECSSQLQuery function located [here](https://github.com/ericcsinger/Powershell/blob/master/Microsoft/SQL/Invoke-ECSSQLQuery/Invoke-ECSSQLQuery.ps1). This is going to mean a few things before you get going.

- You need to make sure the account you’re running these functions under has access to the WSUS database.
- You need to make sure the database server is setup so that you can make remote connections to it.
- If you’re in need of SQL auth instead of windows auth, you’ll need to adjust the Get-ECSWSUSComputer and Get-ECSWSUSComputersInTargetGroup so that the embedded calls to my invoke-ecssqlquery use SQL auth instead of windows.

Secondly, this function doesn’t work without the “object” result of Get-ECSWSUSComputer or Get-ECSWSUSComputersInTargetGroup. That means you need to run one of these functions first to get a list of computer(s) that you want to run a report against. Store the results in an array. Like $AllWSUSComputers = …..

Syntax examples:
================

if you’re reading this in Feedly or some other RSS reader, it’s not going to look right, you’ll need to hit my site if it looks like a bunch of garble.

```
<pre class="brush: powershell; title: ; notranslate" title="">

$AllWSUSComputers =  Get-ECSWSUSComputer -WSUSDataBaseServerName "Database Server Name" -WSUSDataBaseName "SUSDB or whatever you called it" -WSUSComputerName "ComputerName or Computer Name pattern" -SQLQueryTimeoutSeconds "Optional, enter time in seconds"

Foreach ($WSUSComputer in $AllWSUSComputers)
     {
     Get-ECSWSUSComputerUpdatesStatusReport -WSUSDataBaseServerName "Database Server Name" -WSUSDataBaseName "SUSDB or whatever you called it" -WSUSComputerObject $WSUSComputer -SQLQueryTimeoutSeconds "Optional, enter time in seconds"
     }

```

Let me restate, you’re pointing at a SQL server. Sometimes that’s the same server as the WSUS server, or sometimes that’s an external DB. If you’re using an instanced SQL server, then for the database server name, you’d put “DatabaseServername\\InstanceName”

if you actually want to capture the results of the report command, my suggestion is to create an arraylist and add the results of the command into that array, or dump it to a JSON / XML file. If you’re only running it against one computer, there’s probably no need for a foreach loop.

Output:
=======

The output is the same not matter which function you run, with the one small exception being that I capture the computer target group name in the computer target group function.The

```
<pre class="brush: powershell; title: ; notranslate" title="">
Name : pc-2158.asinetwork.local
AllPossiableUpdatesInstalled : True
AllApprovedUpdatesInstalled : True
AllPossiableUpdatesNotInstalledCount : 0
AllApprovedUpdatesNotInstalledCount : 0
LastSyncResult : Succeeded
LastSyncTime : 09/30/2017 16:11:33
LastReportedStatusTime : 09/30/2017 16:20:16
LastReportedInventoryTime :
```

Again, this output is really designed to feed my next function,but you might find it useful to do things like confirm that all WSUS computers are registered that should be, or to simply check the last time they synced.

```
<pre class="brush: powershell; title: ; notranslate" title="">

$WSUSComputer | Select-Object -ExpandProperty UpdateStatusDetailed | Where-Object {$_.Action -eq "Install" -and $_.FriendlyState -ne "Installed"} | Select-Object DefaultTitle
```

That little snippet will show you all approved updates, that are not installed. The friendlystate is whether the update is installed or not. The action is whether the update is approved for install.

If we slightly modify the above command, we can show all updates that are not installed, but applicable by doing the following.

```
<pre class="brush: powershell; title: ; notranslate" title="">

$WSUSComputer | Select-Object -ExpandProperty UpdateStatusDetailed | Where-Object {$_.FriendlyState -ne "Installed"} | Select-Object DefaultTitle
```

<span style="color: #ff0000;">\*\*\*NOTE1: This report is only as good as the updates that you allow via WSUS. Meaning, if you don’t download SQL updates, SQL updates are not going to show up in this report.</span>

<span style="color: #ff0000;">\*\*\*NOTE2: This report only show non-declined updates. If you declined an update, it won’t show up here.</span>

<span style="color: #000000;">Closing:</span>
=============================================

I hope you find this useful. I alway found the default WSUS reporting to be underwhelming and slow. It’s not that it doesn’t work, but it’s really only good for singular computers. These functions can easily be used to get the status of a large swath of systems. Best of all, with it being a Powershell object, you can now also export it in any number of formats, my preference being JSON if I want a full report, or CSV if I just want the summary.

You can also find out how I did all my SQL calls by reviewing the embedded SQL Query in my function if you prefer the raw SQL code.