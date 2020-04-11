---
title: 'Deleting msExchActiveSyncDevice container after migrating to Office 365'
date: '2019-03-02T22:03:38+00:00'
status: publish
permalink: /deleting-msexchactivesyncdevice-container-after-migrating-to-office-365
author: 'Eric Singer'
excerpt: ''
type: post
id: 687
category:
    - Uncategorized
tag:
    - 'active directory'
    - exchange
    - 'office 365'
    - powershell
post_format: []
---
We migrated to Office 365 last year and were are in the process of cleaning up some items left behind. One of the many things we’ve needed to clean up is stale activesync devices. I wanted to share a very simplified example of the code I used to delete the container in case it helps anyone in the future.

```
<pre class="brush: powershell; title: ; notranslate" title="">
$UserNamePattern = "*singer*"


$AllActiveSyncDevices = Get-ADObject -filter { ObjectClass -like 'msExchActiveSyncDevice'} | Where-Object {$_.DistinguishedName -like $($UserNamePattern)} 
$ActivesyncContainer = Get-ADObject -filter { ObjectClass -like 'msExchActiveSyncDevices'} | Where-Object {$_.DistinguishedName -like $($UserNamePattern)} 

$ActivesyncContainer | Set-ADObject -ProtectedFromAccidentalDeletion:$false 
$AllActiveSyncDevices | Remove-ADObject -Confirm:$false
$ActivesyncContainer | Remove-ADObject -Confirm:$false
```

The essential steps we need to do are as follows:

- Find the user object based on their DN.
- If you migrated them to office 365, there should be no EAS devices in their AD account anymore.
- See if they have an msExchActiveSyncDevices container, and if there is anything in there.
- If there are objects, delete the individual child objects in msExchActiveSyncDevices container. These are the actual EAS devices. They have a class of msExchActiveSyncDevice.
- Set the container so that it is no longer protected from being deleted.
- Deleting the container.

In my original example, you can see I’m searching based on an arbitrary patter. In actuality, you want to find users based on their DN, not their username. Or rather if you DO want to find them based on their username, you’d want to so something like this.

```Powershell
$User = Get-aduser -Identity EnterTheUserNameHere
$AllActiveSyncDevices = Get-ADObject -filter { ObjectClass -like 'msExchActiveSyncDevice'} | Where-Object {$_.DistinguishedName -like "*$($User.DistinguishedName)"} 
$ActivesyncContainer = Get-ADObject -filter { ObjectClass -like 'msExchActiveSyncDevices'} | Where-Object {$_.DistinguishedName -like "*$($User.DistinguishedName)"}

$ActivesyncContainer | Set-ADObject -ProtectedFromAccidentalDeletion:$false 
$AllActiveSyncDevices | Remove-ADObject -Confirm:$false
$ActivesyncContainer | Remove-ADObject -Confirm:$false
```

Hope this helps!