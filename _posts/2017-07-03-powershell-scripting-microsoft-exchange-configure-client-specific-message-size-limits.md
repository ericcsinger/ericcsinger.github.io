---
title: 'Powershell Scripting: Microsoft Exchange, Configure client-specific message size limits'
date: '2017-07-03T22:14:22+00:00'
status: publish
permalink: /powershell-scripting-microsoft-exchange-configure-client-specific-message-size-limits
author: 'Eric Singer'
excerpt: ''
type: post
id: 478
category:
    - Uncategorized
tag:
    - exchange
    - IIS
    - powershell
post_format: []
---
Introduction:
=============

If you don’t know by now, I’m a huge PowerShell fan. It’s my go to scripting language for anything related to Microsoft (and non-Microsoft) automation and administration. So when it came time to automating post exchange cumulative update setting, I was a bit surprised to see some of the code examples from Microsoft, not containing any PowerShell example. Surprised is probably the wrong word, how about annoyed? I mean, after all, this is not only the company that shoved this awesome scripting language down our throat, but also the very team that was the first one to have a comprehensive set of admin abilities via PowerShell. So if that’s the case, why in the world, don’t they have a single PS example for configuring client-specific message size limits?

Not to be discouraged, I said screw appcmd, I’m PS’ing this stuff, because it’s 2017 and PS / DSC is what we should be using. Here’s how I did it

The settings:
=============

If you’re looking for where the setting are that I’m speaking of / about, check out this link [here](https://technet.microsoft.com/en-us/library/hh529949(v=exchg.160).aspx). That’s how you do it in the “old school” way.

The new school way:
===================

My example below is for EWS, you need to adjust this if you want to also include EAS.

```
<pre class="brush: powershell; title: ; notranslate" title="">

     Write-Host "Attempting to set EWS settings"
    Write-Host "Starting with the backend ews custom bindings"
    $AllBackendEWSCustomBindingsWebConfigProperties = Get-WebConfigurationProperty -Filter "system.serviceModel/bindings/custombinding/*/httpsTransport" -PSPath "MACHINE/WEBROOT/APPHOST/Exchange Back End/ews" -Name maxReceivedMessageSize -ErrorAction Stop | Where-Object {$_.ItemXPath -like "*EWS*https*/httpstransport"} 
    Foreach ($BackendEWSCustomBinding in $AllBackendEWSCustomBindingsWebConfigProperties)
        {
        Set-WebConfigurationProperty -Filter $BackendEWSCustomBinding.ItemXPath -PSPath "MACHINE/WEBROOT/APPHOST/Exchange Back End/ews" -Name maxReceivedMessageSize -value 209715200 -ErrorAction Stop
        }
    Write-Host "Finished the backend ews custom bindings"
    
    Write-Host "Starting with the backend ews web http bindings"
    $AllBackendEWwebwebHttpBindingWebConfigProperties = Get-WebConfigurationProperty -Filter "system.serviceModel/bindings/webHttpBinding/*" -PSPath "MACHINE/WEBROOT/APPHOST/Exchange Back End/ews" -Name maxReceivedMessageSize -ErrorAction Stop | Where-Object {$_.ItemXPath -like "*EWS*"} 
    Foreach ($BackendEWSHTTPmBinding in $AllBackendEWwebwebHttpBindingWebConfigProperties)
        {
        Set-WebConfigurationProperty -Filter $BackendEWSHTTPmBinding.ItemXPath -PSPath "MACHINE/WEBROOT/APPHOST/Exchange Back End/ews" -Name maxReceivedMessageSize -value 209715200 -ErrorAction Stop
        }
    Write-Host "Finished the backend ews web http bindings"

    Write-Host "Starting with the back end ews request filtering"
    Set-WebConfigurationProperty -Filter "/system.webServer/security/requestFiltering/requestLimits" -PSPath "MACHINE/WEBROOT/APPHOST/Exchange Back End/ews" -Name maxAllowedContentLength -value 209715200 -ErrorAction Stop
    Write-Host "Finished the back end ews request filtering"

    Write-Host "Starting with the front end ews request filtering"
    Set-WebConfigurationProperty -Filter "/system.webServer/security/requestFiltering/requestLimits" -PSPath "MACHINE/WEBROOT/APPHOST/Default Web Site/EWS" -Name maxAllowedContentLength -value 209715200 -ErrorAction Stop
    Write-Host "Finished the front end ews request filtering" 

```

Is it technically better than appcmd? Yes, of course, what did you think I was going to say? It’s PS, of course it’s better than CMD.

As for how it works, I mean it’s pretty obvious, I don’t think there’s any good reason to go into a break down. I took what MS did with AppCMD and just changed it to PS, with a foreach loop in the beginning to have even a little less code 🙂

You should be able to take this, and easily adapt it to other IIS based web.config settings. My Get-WebConfigurationProperty in the very beginning, is a great way to explore any web.config via the IIS cmdlets.

Anyway, hope this helps someone.

<span style="color: #ff0000;">\*\*\*Update 07/29/2017:</span>

<span style="color: #ff0000;">So we did our exchange 2013 cu15 upgrade, and everything went well with the script, except for one snag. My former script had an incorrect filter that added an “https” binding to an “http” path. EWS didn’t like that very much (as we found out the hard way). Anyway, should be fixed now. I updated the script. Just so you know which line was affected you can see the before and after below. Basically my original filter grabbed both the http and https transports. I guess technically each web property has the potential for both. My new filter goes after only https EWS configs + https transports.</span>

```
<pre class="brush: powershell; title: ; notranslate" title="">

#I changed this:

$AllBackendEWSCustomBindingsWebConfigProperties = Get-WebConfigurationProperty -Filter "system.serviceModel/bindings/custombinding/*/httpsTransport" -PSPath "MACHINE/WEBROOT/APPHOST/Exchange Back End/ews" -Name maxReceivedMessageSize -ErrorAction Stop | Where-Object {$_.ItemXPath -like "*EWS*"}

#To this

$AllBackendEWSCustomBindingsWebConfigProperties = Get-WebConfigurationProperty -Filter "system.serviceModel/bindings/custombinding/*/httpsTransport" -PSPath "MACHINE/WEBROOT/APPHOST/Exchange Back End/ews" -Name maxReceivedMessageSize -ErrorAction Stop | Where-Object {$_.ItemXPath -like "*EWS*https*/httpstransport"}

```