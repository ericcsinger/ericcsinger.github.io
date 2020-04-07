---
title: 'Powershell Desired State Configuration (DSC) Part 1: What is a desired state?'
date: '2019-08-17T21:35:37+00:00'
status: draft
permalink: '/?p=746'
author: 'Eric Singer'
excerpt: ''
type: post
id: 746
category:
    - Uncategorized
tag:
    - automation
    - configuration
    - powershell
post_format: []
---
n a previous article (<https://www.ericcsinger.com/quicky-review-gpogpp-vs-dsc/>), I touched on some of the areas where it was great and where it was weak. I had only messed around with DSC for a week when I wrote that article. After having spent a year with it, I have a bit more experience and felt it was time to write a series on the topic. Since I’m only writing as I have time, I didn’t want to write the whole series in one shot and then release it.

I wanted to start the series by going over what we mean by a desired state before digging into Powershell DSC. This post will be applicable to most folks in IT and not only SysAdmins. I would contend almost every IT discipline could find this practice useful.

What is a desired state?
------------------------

Put, it’s how you want your system provisioned and maintained.   
Here are a few generic examples:

- MS SQL Server:
  - You want there to be an E: drive formatted with a 64k cluster size
  - You want two folders, one for data and one for log.
  - You want permissions set on those folders.
  - You want SQL installed and running with special credentials.
  - You want SQL’s settings x,y, z to always be a certain way.
  - You want to ensure no one is in the sysadmins role, except group y.
- Cisco Switch
  - You want to ensure certain vlans are always present
  
  
  - You want to ensure your enable password is always y
  
  
  - You want to ensure a certain ACL is the only ACL that exists for your management vlan.
  
  
  - You want to make sure your RADIUS servers are always x
  
  
  - You want to ensure ports 1 – 4 are always configured a certain way.
- Linux Redis Cache
  - You want to ensure a certain version of Redis is always present
  
  
  - You want to make sure a cached disk is always configured with XFS
  
  
  - You want to ensure a specific FW port is always open
  
  
  - You want to make sure only users x,y and z are in the SUDO users file.
  
  
  - You want to ensure the timezone is always UTC.

These are all contrived examples of a desired state. I’m going to use these examples in my explanations below.

A provisioning solution is not a desired state solution:
--------------------------------------------------------

I’ll be the first to raise my hand and say I didn’t see the point to a desired state at first. Or rather, I didn’t understand how it was different than my scripts. Below is an example of what makes something a provisioning solution or a desired state.

  
If I go into the Redis server and add a non-desired account into the SUDO users file. A desired configuration solution will remove non-desired users from the SUDO file. If you solution only doe a one time setup, that is not a desired state.

What are the basics of a desired state solution?
------------------------------------------------

### Code or Configuration:

A configuration is a culmination of individual settings. The configuration is as complex and as large as you want it to be. In my original example, each bullet point is a configuration. When you combine the individual configurations together, it is your desired configuration. A common analogy is the cook book. Each recipe is a different desired configuration for a given system. Each ingredient (configuration) is what’s used to make your desired configuration.

### Configuration data:

In good scripting, you want your code to stay static and data to change as needed. This is keeping your code separate from your data. The idea is simple, and a great way to make your desired state solution more scalable.

Let’s say you have a UAT and a Production environment.

#### Code:

` Format disk 0 with %DriveLetter%<br></br> Create folder %FolderName% on %DriveLetter%`

#### Configuration

`UAT<br></br> {<br></br> DriveLetter = E:<br></br> FolderName = “UAT Folder”<br></br> } `

`Production:<br></br> {<br></br> DriveLetter = F:<br></br> FolderName = “Prodution Folder”<br></br> }<br></br> `

I didn’t have to change my code, but I was still able to have a different configuration, depending on my environment.

### How is the code applied?

At least for Powershell DSC, the code is written in a way that three actions occur.

#### Get:

This is the ability for you as the admin, to query the current state of the system. Not so much to see whether it’s compliant, but to see what current configuration is. For example, if you had a SUDO users file. Running a Get statement, would read the SUDO users files and return back what it found. This is useful for troubleshooting and reporting.

#### Test:

This is how the desired state determines if your configuration is compliant. The module or script will run checks and report back the status. This is different from the “Get” action, as it’s used by the desire state solution itself. The test either passes or fails. If the test passes, you’re in a desired state. If the test fails, the solution moves on to the Set operation.

#### Set:

If the Test process failed, the Set action will kick in. This is where the desired state solution attempts to remediate the given configuration. In the above example, it may attempt to add users or remove users depending on what is the actual problem.

Closing thoughts:
-----------------

I hope you understand a little bit more about the concepts and practices of desired state. Remember the goal is to ensure your systems stay as you want. In the next part, we’ll start digging more into Powershell DSC and how it works.