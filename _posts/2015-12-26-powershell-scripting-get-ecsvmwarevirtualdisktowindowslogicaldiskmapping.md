---
title: 'Powershell Scripting: Get-ECSVMwareVirtualDiskToWindowsLogicalDiskMapping'
date: '2015-12-26T21:56:08+00:00'
status: publish
permalink: /powershell-scripting-get-ecsvmwarevirtualdisktowindowslogicaldiskmapping
author: 'Eric Singer'
excerpt: ''
type: post
id: 160
category:
    - Uncategorized
tag:
    - powershell
    - scripting
post_format: []
---
Building off my last function [Get-ECSPhysicalDiskToLogicalDiskMapping](https://github.com/ericcsinger/powershell_microsoft_windows_get-ecsphysicaldisktologicaldiskmapping): which took a windows physical disk and mapped it to a windows logical disk, this function will take a VMware virtual disk and map it to a windows logical disk.

This function has the following dependencies and assumptions:

- It depends on my windows physical to logical function and all its dependencies.
- It assumes your VM name matches your windows server name
- It assumes you’ve pre-loaded the VMware powershell snap-in.

The basic way the function works, is it starts by getting the windows physical to logical mapping and storing that in an array. This array houses two key peaces of information.

- The physical disk serial number
- The logical disk name (C:, D:, etc.)

Then we get a list of all of the VM’s disks, which of course has the same exact serial number, just formatted a little differently (which I convert in the function).

Finally, we’re going to map the windows physical disk serial number to the VMware virtual disk serial number, and add the VMware virtual disk name and the Windows Logical disk name (we don’t care about the windows physical disk, it was just used for the mapping) into the final array, and echo them out for your use.

See below for an example:

> Get-ECSVMwareVirtualDiskToWindowsLogicalDiskMapping -ComputerName “YourComputerName”
> 
> VMwareVirtualDisk WindowsLogicalDisk  
> —————– ——————  
> Hard disk 1 C:  
> Hard disk 2 K:  
> Hard disk 3 F:  
> Hard disk 4 N:  
> Hard disk 5 J:  
> Hard disk 6 V:  
> Hard disk 7 W:  
> Hard disk 8 G:

… and there you have it, a very quick way to figure out which vmware virtual disk houses your windows drive. You’ll find the most recent version of the function [here](https://github.com/ericcsinger/powershell_microsoft_windows_get-ecsvmwarevirtualdisktowindowslogicaldiskmapping).