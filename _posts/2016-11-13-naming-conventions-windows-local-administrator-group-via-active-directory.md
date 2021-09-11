---
title: 'Naming Conventions: Windows Local Administrator Group via Active Directory'
date: '2016-11-13T17:04:02+00:00'
status: publish
permalink: /naming-conventions-windows-local-administrator-group-via-active-directory
author: 'Eric Singer'
excerpt: ''
type: post
id: 411
category:
    - 'naming conventions'
tag:
    - 'naming conventions'
post_format: []
---
Introduction:
=============

One thing that always kind of sucked with windows servers (and its even worse with Linux) is dealing with how to manage local administrator rights. Now I realize a lot of you just add yourself to the domain admins and use that account (not a security best practices) to administer your servers, but what about everyone and everything else that might need local admin access? What I have for you here is how I not only created a new naming conventions, but also how I tackled managing local administrator access in windows domain environment.

What you need:
==============

1. This is dependent on active directory. If you’re dealing with non-domain systems, this post isn’t really for you.
2. You’re going to need a group policy object and your servers / desktops are going to need to support group policy preferences (2003/XP and above).

What you’ll want:
=================

1. More than likely a provisioning process that automates something which GPO/GPP can’t. For example, a simple PowerShell script that you run once the server is provisioned to finish the little things.

The naming convention:
======================

I use a pretty simple naming convention for local administrators. There are three main conventions I used which are below.

- \_asi\_lad\_%Server or Computer Name%
- \_asi\_lad\_All Servers in AD
- \_asi\_lad\_All Desktops in AD

Naming convention breakdown:
============================

1. The underscores are used as separators. At some point you may need to do queries with scripts, and knowing that an “\_” represents a separator will make it easy to know where to start looking for variables. For example, if you just looked in AD for something like \*ServerName\* you might get back more than one AD object, but if you look for \*\_lad\_Servername you’re only going to get back local administrator groups.
2. “ASI” in my case stands for Advertising Specialty Institute, which is an acronym for my company name. I used to work at the Pew Charitable Trusts and used “PCT” for them. I use a company name to start out everything because down the road, you never know who you’re going to merge with. While there is always a chance that ASI could merge with a company named “Advanced Internetworked Servers” or something like that, its not likely. Plus, if you’re running a sort of multi-tenancy, this allows you to keep different companies separate. It doesn’t need to be an acronym, nor does it need to be three letters, but it should be specific to a company. Heck, if a small GUID makes sense go for it, just keep in mind that 64 character limit with AD (yes I’ve hit it with group names).
3. “LAD” as you can guess stands for **L**ocal **Ad** Again, it doesn’t need to be three, but it should be consistent.
4. The final part 
  1. The server name is kind of obvious.
  2. All servers is kind of obvious
  3. All desktops is kind of obvious

You could of course take it much further than this if you want, it really depends on how granular you want to get. I try to keep things balanced. If your servers themselves have a good naming convention, you can likely already key off of that.

How it works:
=============

1. I created a GPO for my servers and a different one for my desktops. To be VERY clear, this GPO is not dedicated to this purpose. I try to use one GPO to rule them all as much as possible. So I add this to my GPO which applies to all servers and the one for all desktops for other things.
2. Create a computer GPP setting which adds the respective “\_company\_lad\_all server” and “\_company\_lad\_all desktops”. This gives you an easy way to drop a service account into a group that will gives them local admin access to all servers WITHOUT giving them domain admin rights. 
  1. As an aside, we also create a GPP that removes domain admins.
3. Now, for the servers specifically (we don’t do this for desktops) I create a server specific group (via a script) and add it to that server (via script). You now have an ability to add a user to the local admins without ever needing to login to that local server anymore.

Powershell Snippet for creating a group and adding it to the local admins:
==========================================================================

> \#Create and assign default local admin group
> 
> \#Parameters
> 
> $ServerName = “cmp-servername-01”
> 
> $GroupName = “\_lad\_cmp\_” + $ServerName
> 
> $OUPath = “OU=YourOUPath,DC=Domain,DC=Name”
> 
> $FQDN = “Domain.name”
> 
> \#Creating group
> 
> New-ADGroup -DisplayName $GroupName -GroupCategory “1” -GroupScope “1” -Name $GroupName -SamAccountName $GroupName -Path $OUPath
> 
> Start-Sleep -Seconds 15
> 
> \#Add Group to servers local administrators
> 
> $de = \[ADSI\]”WinNT://$ServerName/administrators,group”
> 
> $de.psbase.Invoke(“Add”,(\[ADSI\]”WinNT://$FQDN/$GroupName”).path)

Closing:
========

That’s it really. You can of course take it further, but this is a simple way to get a handle on your local administrators, and centrally manage them all from AD going forward. You also now have a naming convention which makes it easy to track them down and automate various tasks.

Index:
======

To see other naming conventions or posts about naming conventions, head over [here](http://www.ericcsinger.com/naming-conventions-intoduction/).