---
title: 'Problem Solving: WSUS failing for Windows 10 with error 8024401c'
date: '2017-06-13T16:49:54+00:00'
status: publish
permalink: /problem-solving-wsus-failing-for-windows-10-with-error-8024401c
author: 'Eric Singer'
excerpt: ''
type: post
id: 464
category:
    - Uncategorized
tag:
    - 'problem solving'
    - 'windows 10'
    - wsus
post_format: []
---
Hi Folks,

After updating WSUS to support Windows 10 newer update format, we noticed that our Windows 10 client weren’t working. The error they were getting was 8024401c whenever we checked for updates (post WSUS upgrade). Initially we thought it was related to the WSUS upgrade, but found out that most of our systems hadn’t been updating for a while. So we moved on to troubleshooting the client further. We found that the following GPO “**Do not connect to any Windows Update Internet locations”**  was not configured. After doing some digging we determined that this was put in place to prevent our clients from downloading updates from MS directly, which was originally happening. The weird thing to me was why were our clients going to MS anyway? We have WSUS, that is the point of WSUS? Disabling the setting resulted in us getting updates, but now they were coming from MS directly and not WSUS. Enabling **or** setting it to “not configured” resulted in the lovely error.

Example snippet of log file below.

*2017/06/13 10:08:31.2836183 676 10488 WebServices WS error: There was an error communicating with the endpoint at ‘http://%ServerName%/ClientWebService/client.asmx’.*  
*2017/06/13 10:08:31.2836186 676 10488 WebServices WS error: There was an error receiving the HTTP reply.*  
*2017/06/13 10:08:31.2836189 676 10488 WebServices WS error: The operation did not complete within the time allotted.*  
*2017/06/13 10:08:31.2836280 676 10488 WebServices WS error: The operation timed out*  
*2017/06/13 10:08:31.2836379 676 10488 WebServices Web service call failed with hr = 8024401c.*

After a ton of Google Fu, I stumbled on to this article https://blogs.technet.microsoft.com/windowsserver/2017/01/09/why-wsus-and-sccm-managed-clients-are-reaching-out-to-microsoft-online/ Before you start reading, make sure you’re relaxed and read through it carefully, because the answer is there, but you have make sure you’re not just skimming.

Here is the main section and highlighted points that you need to glean from that article.

- - - - - -

*<span style="color: #ff0000;">Ensure that the registry HKEY\_LOCAL\_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate doesn’t reflect any of these values.</span>*

- *<span style="color: #ff0000;">DeferFeatureUpdate</span>*
- *<span style="color: #ff0000;">DeferFeatureUpdatePeriodInDays</span>*
- *<span style="color: #ff0000;">DeferQualityUpdate</span>*
- *<span style="color: #ff0000;">DeferQualityUpdatePeriodInDays</span>*
- *<span style="color: #ff0000;">PauseFeatureUpdate</span>*
- *<span style="color: #ff0000;">PauseQualityUpdate</span>*
- *<span style="color: #ff0000;">DeferUpgrade</span>*
- *<span style="color: #ff0000;">ExcludeWUDriversInQualityUpdate</span>*

*What just happened here? Aren’t these update or upgrade deferral policies?*
----------------------------------------------------------------------------

*<span style="color: #ff0000;">Not in a managed environment. These policies are meant for [Windows Update for Business](https://blogs.msdn.microsoft.com/beanexpert/2015/11/15/windows-update-for-business-explained/) (WUfB).</span> Learn more about [Windows Update for Business](https://technet.microsoft.com/en-us/itpro/windows/manage/waas-manage-updates-wufb).*

*Windows Update for Business aka WUfB enables information technology administrators to keep the Windows 10 devices in their organization always up to date with the latest security defenses and Windows features **by directly connecting these systems to Windows Update service**.*

*<span style="color: #ff0000;">**We also recommend that you do not use these new settings with WSUS/SCCM.**</span>*

*<span style="color: #ff0000;">If you are already using an on-prem solution to manage Windows updates/upgrades, using the new WUfB settings will enable your clients to also reach out to Microsoft Update online to fetch update bypassing </span><span style="color: #ff0000;">your WSUS/SCCM end-point</span>.*

*<u>To manage updates, you have two solutions:</u>*

- *Use WSUS (or SCCM) and manage how and when you want to deploy updates and upgrades to Windows 10 computers in your environment (in your intranet).*
- *Use the new WUfB settings to manage how and when you want to deploy updates and upgrades to Windows 10 computers in your environment directly connecting to Windows Update.*

*<span style="color: #ff0000;">So, the moment any one of these policies are configured, even if these are set to be “disabled”, a new behavior known as Dual Scan is invoked in the Windows Update agent.</span>*

*When Dual Scan is engaged, the following change in client behavior occur:*

- *<span style="color: #ff0000;">Whenever Automatic Updates scans for updates against the WSUS or SCCM server, it also scans against Windows Update, or against Microsoft Update if the machine is configured to use Microsoft Update instead of Windows Update. It processes any updates it finds,</span> subject to the deferral/pausing policies mentioned above.*

*Some Windows Update GPOs that can be configured to better manage the Windows Update agent. I recommend you test them in your environment*

- - - - - -

After reading that, I went back in our GPO and did some more digging, since all our WSUS client settings are defined in GPO, turns out we have the “Do not include drivers with…” setting enabled. So ultimately it was this setting that led to the whole “Dual Scan” mode being enabled, which led to us downloading MS updates (needed to happen anyway), which led to us disabling that, which led to WSUS not being used at all. So after setting both settings to not configured and doing a lot of GPUpdates / restarting of the windows update services, eventually I went from getting that error, to everything being back to normal. That is, my client connecting to WSUS and downloading updates the right way.

Lessons learned besides not just randomly enabling WSUS settings, is that Microsoft in my not so humble opinion, needs to do a better job with the entire WSUS client control. This is just stupid behaviour to be blunt. What I would suggest that MS do is as follows.

1. For Pete’s sake, have a damn setting that controls whether we want updates via WSUS, WUFB, or neither. I mean it seems like such an obvious thing. Clearly implied settings conflict. If you have to write a damn article explaining all the gotcha’s you failed at building an user friendly solution.
2. Group settings that are Windows update for business specific in their own damn GPO folder **and** their own damn reg key. This way there’s no question these are for WUfB only. Similar to WSUS.
3. If WSUS is enabled, ignore WUfB settings and vice versa.

Anyway, hope that helps any other poor souls out there.