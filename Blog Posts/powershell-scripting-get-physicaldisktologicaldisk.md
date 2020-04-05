---
title: 'Powershell Scripting: Get-ECSPhysicalDiskToLogicalDiskMapping'
date: '2015-12-20T16:50:39+00:00'
status: publish
permalink: /powershell-scripting-get-physicaldisktologicaldisk
author: 'Eric Singer'
excerpt: ''
type: post
id: 149
category:
    - Uncategorized
tag:
    - powershell
    - scripting
post_format: []
---
I figured it was about time to knock out something a little technical for a change, and I figured I’d start with this little function, which is part of a larger script that I’ll talk more about later.

There may be a time where you need to find the relationship between a physical disk drive and your logical drive. In my case, I had a colleague ask me if there was an easy way to match a VMware disk to a Window disk so he could extend the proper drive. After digging into it a bit, I determined it was possible, but it was going to take a little work. One of the prerequisites is to first find which drive letter belongs to which physical disk (from windows view).

For this post, I’m going to go over the prerequisite function I built to figure out this portion. In a later post(s) we’ll put the whole thing together. Rather than burying this into a larger overall script (which is the way it started), I broke it out and modularized it so that you may be able to use it for other purposes.

First, to get the latest version of the function, head on over to my GitHub project located [here](https://github.com/ericcsinger/powershell_microsoft_windows_get-physicaldisktologicaldisk). I’m going to be using GitHub for all my scripts, so if you want to stay up to date with anything I’m writing, that would be a good site to bookmark. I’m very new to Git, so bear with me as I learn.

To start, as you can tell by looking at the function, its pretty simple by in large. It’s 100% using WMI. A lot of this functionality existed in Windows 2012+, but I wanted something that would work with 2003+. Now that you know its based on WMI, there’s two important notes to bear in mind:

1. WMI does not require admin rights for local computers, but it does for remote. Keep this in mind if you’re planning to use this function for remote calls.
2. WMI also requires that you have the correct FW ports open for remote access. Again, I’m not going to dig into that. I’d suspect if you’re doing monitoring, or any kind of bulk administration, you probably already have those ports open.

Microsoft basically has the mapping in place within WMI, the only problem is you need to connect a few different layers to get from Physical to Logical mapping. In reading my function, you’ll see that I’m doing a number of nested foreach loops, and that’s the way I’m connecting things together. Basically it goes like this….

1. First we need to find the physical disk to partition mappings doing the following: WIN32\_DiskDrive property DeviceID is connected to Win32\_DiskDriveToDiskPartition property of Antecedent . <span style="color: #ff0000;">\*\*\*NOTE: the DeviceID needed to be formatted so that it matched the Actecedent by adding extra backslashes “\\”.</span>
2. Now we need to map the partition(s) on the physical disk to the logical disk(s) that exist doing the following: Win32\_DiskDriveToDiskPartition property Dependent is connected to Win32\_LogicalDiskToPartition property of Actecedent.
3. Now that we know what logical drives exist on the physical disk, we can use the following to grab all the info we want about the logical drive doing the following: Win32\_LogicalDiskToPartition property of Dependent maps to Win32\_LogicalDisk property of “\_path”.

That’s the basic method for connecting Physical Disk to Logical Disk. You can see that I use an array to store results, and I’ve picked a number of properties from the the physical disk and the logical disk that I needed. You could easily add other properties in that you want to serve your needs. And if you do… please contribute to the function.

As for how to use the function, its simple.

For local computer, simply run the function with no parameters.

> Get-ECSPhysicalDiskToLogicalDiskMapping  
> LogicalDiskSize : 1000198832128  
> PhysicalDiskController : 0  
> ComputerName : PC-2158  
> PhysicalDiskControllerPort : 1  
> LogicalDiskFreeSpace : 946930122752  
> PhysicalDiskNumber : 0  
> PhysicalDiskSize : 1000194048000  
> LogicalDiskLetter : E:  
> PhysicalDiskModel : Intel Raid 1 Volume  
> PhysicalDiskDiskSerialNumber : ARRAY
> 
> LogicalDiskSize : 255533772800  
> PhysicalDiskController : 0  
> ComputerName : PC-2158  
> PhysicalDiskControllerPort : 0  
> LogicalDiskFreeSpace : 185611300864  
> PhysicalDiskNumber : 1  
> PhysicalDiskSize : 256052966400  
> LogicalDiskLetter : C:  
> PhysicalDiskModel : Samsung SSD 840 PRO Series  
> PhysicalDiskDiskSerialNumber : S12RNEACC99205W

For a remote system simply specify the “-ComputerName” paramter

> Get-ECSPhysicalDiskToLogicalDiskMapping -ComputerName “pc-2158”  
> LogicalDiskSize : 1000198832128  
> PhysicalDiskController : 0  
> ComputerName : PC-2158  
> PhysicalDiskControllerPort : 1  
> LogicalDiskFreeSpace : 946930122752  
> PhysicalDiskNumber : 0  
> PhysicalDiskSize : 1000194048000  
> LogicalDiskLetter : E:  
> PhysicalDiskModel : Intel Raid 1 Volume  
> PhysicalDiskDiskSerialNumber : ARRAY
> 
> LogicalDiskSize : 255533772800  
> PhysicalDiskController : 0  
> ComputerName : PC-2158  
> PhysicalDiskControllerPort : 0  
> LogicalDiskFreeSpace : 185611976704  
> PhysicalDiskNumber : 1  
> PhysicalDiskSize : 256052966400  
> LogicalDiskLetter : C:  
> PhysicalDiskModel : Samsung SSD 840 PRO Series  
> PhysicalDiskDiskSerialNumber : S12RNEACC99205W

Hope that helps you down the road. Again, this is going to be part of a slightly larger script that will ultimately map a Windows Logical Disk to a VMware Virtual Disk to make finding which disk to expand easier.