---
title: 'Powershell Scripting: Installing SQL / Setting up AlwaysOn Availability Groups'
date: '2017-12-25T19:39:00+00:00'
status: publish
permalink: /powershell-scripting-installing-sql-setting-up-alwayson-availability-groups
author: 'Eric Singer'
excerpt: ''
type: post
id: 537
category:
    - Uncategorized
tag: []
post_format: []
---
Introduction:
=============

We setup a decent number of SQL servers every year. Most of the time we’re migrating to a newer OS + SQL combo, but sometimes it’s for a new product. As you may have read in my virtualizing SQL post, one of the pros to virtualizing SQL, was having this ability. Having seen the ameba affect virtualization created for other systems, I knew this would soon happen with SQL as well. As such, I started developing a bunch of script blocks to automate setting up SQL a few years ago. Over that time, I’ve added more and more functionality, with the finally feature being able to setup a SQL AAG via Powershell. The only thing I don’t have fully automated, is an AlwaysOn Failover Cluster, but that’s because we don’t deploy them typically.

What you’ll see in this post, is how we go from a bare OS, to a functional SQL server. Most of it via Powershell, some of it manual.

Also, if you’re reading this in an RSS tool, all my script text is going to be messed up unless you view it on the site. At the very bottom i’ve included a txt file of my script that you can download, which will probably be a lot easier to read.

Special Thanks:
===============

Before going too far ahead, I want to make a special call out to two folks that have helped me accomplish this as a SysAdmin (non-DBA). They didn’t go out of their way to help me specifically, but their blogs posts are gold.

Brent Ozar if you haven’t heard of him, is my go to blog for SQL. I’ve been following him for a long time (Quest days). While I can’t say I always agree with his philosophies on virtualizing SQL / SAN, when it comes to native SQL stuff, he (and his all-star team) are my go to source of info. I suspect if you’re googling anything SQL related, you’ve probably seen his blog show up in the top section of results. The one thing I’ve always relied on as a SysAdmin is his server setup checklist <https://www.brentozar.com/archive/2008/03/sql-server-2005-setup-checklist-part-1-before-the-install/> and here <https://www.brentozar.com/archive/2008/03/sql-server-2005-setup-checklist-part-2-after-the-install/>

Newer to my SQL blog roll, and the person’s blog post who ultimately helped me setup AlwaysOn Availability Group is Edwin M Sarmiento. I signed up for his failover clustering training, which if you’re new to clustering is worth checking out. Anyway, Googling for “setup AlwaysOn Availability Groups Powershell” led me to his post here <https://www.mssqltips.com/sqlservertip/2635/enable-sql-server-2012-alwayson-availability-groups-using-windows-powershell/>. What you’ll see in my post is a lot of copies from his post. I want to be clear, most of this is Edwins work, not mine (AAG wise). What you’ll see in my post, is I’ve modified his script commands to merge into my greater script and I also added some bits to make setting up a SQL 2017 AAG with seeding instead of the former backup / restore option.

Prerequisites:
==============

Like anything, you’ve got to have the prerequisites figured out before you start, so let’s go over what you want to figure out before you get to the scripting part.

1. We’re going to assume you already have two Windows servers deployed. 
  1. You’ll have your local administrator’s setups and all that good standard OS provisioning stuff that you’re all doing… right?
2. For clustered SQL servers only:
3. For clustered SQL servers only, you’ll want the following completed. 
  1. If you’ve never deployed a cluster before, you’ll want an OU in AD setup for your SQL clusters. It could be the same OU as your non-clustered SQL servers to, but I would at least make sure you have a dedicated OU in AD for SQL servers in general.
  2. You’ll want an active directory group to that will be used to delegate “manage computer” rights to for that SQL server OU.
  3. When you have that group created, you’ll want to make sure you delegate that AD group “full control” rights for computer objects only. You can accomplish this by running the delegation of rights wizard on the SQL server OU, and assigning those rights to the AD group you created. You’ll only need to do this once. Once it’s done, any SQL server you setup in this OU will have all the rights it needs.
  4. You’ll want to reserve at least two additional IP addresses besides what you have for the SQL nodes. One for the (CCR) Cluster Core Resource and one for the AAGL (AlwaysOn Availability Group Listener).
  5. You’ll need a good name for your CCR and AAGL, I’ll provide an example that I use further down.
  6. You’ll want a server dedicated for the use as a file share witness. You’ll want to make sure this server is as independent from the cluster nodes you’re setting up as possible. For use we have our file share on a separate VMware cluster and a completely separate SAN. 
      1. You’ll want to make sure there is a generic share already setup so it can be consumed by all your clusters.
  7. If you’re virtualizing SQL Clusters, here are my general recommendations. 
      1. Disable any auto-migration solutions (VMware’s DRS for example). You will have failovers, and no you won’t be able to prevent it despite what VMware tells you. 
            1. For VMware specifically, I set DRS for cluster nodes to partially automated. If you have a cluster of nothing but cluster nodes, just disable DRS. If you have a cluster of non-clustered and clustered nodes, set this on a per VM basis.
            2. If you do have DRS enabled, I recommend setting up anti-affinity rules for the cluster nodes. In a power on situation, this prevents VMware from powering on a two SQL nodes on the same host.
      2. Disable HA for clustered nodes. Again, if it’s a cluster dedicated, don’t waste your time with HA, and simply disable it. If it’s a mixed cluster, disable it on a per VM basis.
      3. DO NOT OVERSUBSCRIBE MEMORY. I’m not telling you to set reservations, I’m telling you to make sure there’s enough memory to back every running VM in that cluster. You shouldn’t need reservations because you’re not going to be dumb enough to oversubscribe memory. If you MUST mix SQL with generic VM’s, then 100% reserve the memory. In addition, there is a new advanced feature in ESXi 6.5 that allows you to pre-reserve all memory at the VM power on. My recommendation is use this. I’ve had SQL suffer from memory ballooning, it’s not pretty, avoid at all costs.
      4. I don’t recall the setting name off hand, but it’s in Frank’s new vSphere 6.5 deep dive book. Go pick it up, you’ll need it if you care about running SQL well in VMware.
      5. Do NOT enable hot add for memory or CPU in the VM. With VMware this disables virtual NUMA. You have a cluster, if you need to change resources around, failover and work on one node at a time.
4. Create new AD accounts. At a minimum, you’ll want one for the SQL agent and then one for all other SQL Services.
5. You’ll want to setup your backup share (if you don’t already) and make sure the Agent and Service accounts have access to that location.
6. You’ll want a GPO for your SQL servers OU that creates a firewall rule to allow port 1433 and 5022.
7. You’ll want to deploy all your disks / controllers for SQL. Since we use VMware at ASI, we have a very standard configuration. 
  1. OS + scratch / generic disk goes on controller 0 and SCSI port 0 and 1 respectively.
  2. DB + Index go on controller 1 and SCSI port 0 and 1 respectively.
  3. SQL Log goes on controller 2 and SCSI port 0
  4. TempLog and TempDB go on SCSI controller 0 and 1 respectively.
8. You’ll want a SQL config file created. I’ll touch on this briefly further down, but it’s basically an answer file for an unattended SQL install.

Once you’ve completed the above steps, reboot your SQL servers for the changes (GPO’s for example) and rights to take effect immediately. I like to reboot twice as sometimes

I know that’s a lot to take in, that’s a lot to comb through, but it’s all to make the deployment process smooth. Don’t skip ahead if you don’t have all this setup. I’ve deployed probably 150 SQL servers by now, and these prerequisites help it to go smooth.

Prepping the script:
====================

Any good script is parameters based. For the most part, you want to have all your possible variables defined at the top, so that the actual scripting is generic below. It makes it easier to customize for each environment.

Keep in mind, my “script” isn’t so much a script as a bunch of script blocks. You’re not going to simply copy and paste the whole thing and walk away. I’m not there yet 😊

Here is my parameters block. It’s broken into two main sections. Static parameters, which are parameters you’ll manually change by hand, and dynamic parameters which are the result of merging values or pulling data from the computer system.

Let’s break down what you’re going to be asked.

1. The first couple of sections go over a copying functions, ISO’s, and configuration files. You’ll need to provide a source and destination for these files. I like to copy them locally. You’ll see the K: drive mentioned in my examples as a destination.
2. You’ll need that SQL config file that we’ll talk about creating right now. 
  1. When I created mine, I walked through a SQL install, checked all the boxes I wanted, configured all the file paths, all the rights, etc. Before clicking install, there’s a location in the final page where you can grab a config file. Do that, once you have the config file, make the following changes. You can read more about it here <https://docs.microsoft.com/en-us/sql/database-engine/install-windows/install-sql-server-using-a-configuration-file> . 
      1. I change the refreences for your SQL agent account and SQL service accounts to something generic like below so we use a script to do a find / replace. In my script, these are the generic strings I use. 
            1. Change the SQL Agent account name to domain\\SQLAGENTACCOUNTTOCHANGE
            2. Change the SQL Service account name to

Domain\\ SQLSERVICEACCOUNTTOCHANG

3. You’ll want your SQL service account names and their domain names. They’ll be used for various things in our script, including the above example of updating your SQL answer file.
4. For the clustering bit, you’ll want all the names, IP’s etc. I also have test db names that we’ll use for setting up AAG’s. The last SQL server I deployed had four AAG’s, hence why there is four of everything. 
  1. You can see my generic naming convention below. I blogged about those too.
5. FSW (File share witness) is only needed if you are setting up a cluster. You’ll notice I like to use the cluster name (CCR) as the folder for storing the FSW config. You’ll also see I have different FSW depending on which cluster and which environment I’m setting up.
6. Similarly, I do the same for our backup share location. In this case, I’m using node 1 as the final folder name, but your needs may vary.
7. The rest are what I call dynamic parameters, they pull information either using previous parameters or they pull information from the system its self. There is only two things worth of note. I ask you to fill in the password for the service account and agent. This will allow us to install SQL unattended.

```
<pre class="brush: powershell; title: ; notranslate" title="">

#######################################################################################################

#Parameters



#File Path to local GPO function.

$LocalGPOFunctionName = "Add-ECSLocalGPOUserRightAssignment.ps1"

$LocalGPOFunctionFilePath = "\\a1-file-04\SysAdminStuff\SQL Servers\Functions" + "\" + $LocalGPOFunctionName



#File Path to SQL config file

$ConfigFileName = "ConfigurationFile_Template_2017plus.ini"

$ConfigFileSource = "\\a1-file-04\SysAdminStuff\SQL Servers\" + $ConfigFileName

$ConfigFileDestination = "K:\" + $ConfigFileName



#File path to SSMS

$SSMSFileName = "SSMS-Setup-ENU.exe"

$SSMSFileSource = "\\YOURDOMAINHERE.local\Servers\ISG Software\Microsoft\SQL Server Management Studio\17.4\" + $SSMSFileName

$SSMSFileDestination = "K:\" + $SSMSFileName



#File Path to SQL ISO of your choice

$ISOFileName = "SW_DVD9_NTRL_SQL_Svr_Ent_Core_2017_64Bit_English_OEM_VL_X21-56995.ISO"

$ISOFileSource = "\\YOURDOMAINHERE.local\Servers\ISG Software\Microsoft\SQL Enterprise 2017\" + $ISOFileName

$ISOFileDestination = "K:\" + $ISOFileName



#Service Account

$sqlserviceuserNoDomain = "usrsqlpc15svc"

$sqlserviceuser = "YOURDOMAINHERE\" + $sqlserviceuserNoDomain

$sqlagentuserNoDomain = "usrsqlpc15agt"

$sqlagentuser = "YOURDOMAINHERE\" + $sqlagentuserNoDomain





##Clustering

$node1 = "a1-sqlpcn1-15"

$node2 = "a1-sqlpcn2-15"

$clusterip = "192.168.1.19"

$ClusterCNO = "a1-sqlpc-15"

$DB1Name = "Test1"

$DB2Name = "Test2"

$DB3Name = "Test3"

$DB4Name = "Test4"

$SQLAAGEndPointName = "Hadr_endpoint"

$AAG1Name = "a1-sqlpcdg1-15"

$AAG2Name = "a1-sqlpcdg2-15"

$AAG3Name = "a1-sqlpcdg3-15"

$AAG4Name = "a1-sqlpcdg4-15"

$AAG1IP = "192.168.1.20/255.255.255.0"

$AAG2IP = "192.168.1.21/255.255.255.0"

$AAG3IP = "192.168.1.22/255.255.255.0"

$AAG4IP = "192.168.1.23/255.255.255.0"



#File Share Wittness



<# Note 1: FSW is only needed if you're setting up an AAG. Traditional failover clusters, don't need this, instead they need a quorum disk. This script does not cover that. Note 2: There are currently four different file share wittness locations. See below Odd numbered clusters (for example a1-sqluc-01, 03, 05, etc.) go here UAT = \\a1-fswus1-02\Clusters PRD = \\a1-fswps1-02\Clusters Even numbered clusters (for example a1-sqluc-02, 04, 06, etc.) go here UAT = \\a1-fswus2-02\Clusters PRD = \\a1-fswps2-02\Clusters #>

$filesharewitness = "\\a1-fswps1-02\Clusters\$($ClusterCNO)"



#Backup Share



<# This step is only needed if you're setting up an AAG, otherwise the DBA's will do this. Here are the following paths \\YOURDOMAINHERE.local\Backups\SQL Backups 2\DEV \\YOURDOMAINHERE.local\Backups\SQL Backups 2\PRD \\YOURDOMAINHERE.local\Backups\SQL Backups 2\STG \\YOURDOMAINHERE.local\Backups\SQL Backups 2\TST \\YOURDOMAINHERE.local\Backups\SQL Backups 2\UAT #>

$BackupSharePath = "\\YOURDOMAINHERE.local\Backups\SQL Backups 2\PRD\$($node1)"



#DB backup names

$TestDB1FullPath = $BackupSharePath + "\" + $DB1Name + ".bak"

$TestDB2FullPath = $BackupSharePath + "\" + $DB2Name + ".bak"

$TestDB3FullPath = $BackupSharePath + "\" + $DB3Name + ".bak"

$TestDB4FullPath = $BackupSharePath + "\" + $DB4Name + ".bak"

$TestLog1FullPath = $BackupSharePath + "\" + $DB1Name + ".log"

$TestLog2FullPath = $BackupSharePath + "\" + $DB2Name + ".log"

$TestLog3FullPath = $BackupSharePath + "\" + $DB3Name + ".log"

$TestLog4FullPath = $BackupSharePath + "\" + $DB4Name + ".log"





#AAG information



#Dynamic parameters



#These passwords will be used to automate the setup of SQL.

$sqlagentuserpassword = Read-Host -Prompt "Enter your SQL Agent Account Password Here"

While ($sqlagentuserpassword -eq $null -or $sqlagentuserpassword -eq "")

{

$sqlagentuserpassword = Read-Host -Prompt "Enter your SQL Agent Account Password Here"

}



$sqlserviceuserpassword = Read-Host -Prompt "Enter your SQL Service Account Password Here"

While ($sqlserviceuserpassword -eq $null -or $sqlserviceuserpassword -eq "")

{

$sqlserviceuserpassword = Read-Host -Prompt "Enter your SQL Service Account Password Here"

}



#Temp Directory

$TempDirectory = Get-childitem -Path env: | where-object {$_.name -eq "Temp"} | select-object -ExpandProperty value

$LocalGPOFunctionNameTempPath = $TempDirectory + "\" + $LocalGPOFunctionName



#ComputerName

$ComputerName = Get-childitem -path env: | where-object {$_.name -like "ComputerName"} | select-object -expandproperty value



#END Parameters

#######################################################################################################

```

Setting up the disks:
=====================

The next section is all about setting up the disks, partitions, folder structure and finally permissions. Now this is likely going to be different in your environment, but I did want to show how I tackle it incase you are curious. We deploy all our VMware VM’s with a consistent disk configuration as I described above. This allows us to know which disk is used for what purpose and ultimately automate the whole setup.

The basic steps are as follows:

1. We find all disks that are offline. This is our standard procedure when we setup a server.
2. Powershell brings them online, and then we loop through them. 
  1. Based on which controller, and which SCSI port the disk is located on (using WMI to find out), we set it up in a specific way. 
      1. We set it up with a GPT partition.
      2. We setup the volume as NTFS, with a specific drive letter and cluster size depending on the type of volume. 
            1. Note, I NOW realize that we should be using a 64k cluster for all SQL files. I wrote this section almost five years ago based on the IO size. For consistency we’re doing this with existing SQL servers, but will be switching to a 64k cluster for all new systems.
      3. Once we have all the volumes setup, we then proceed to create our folder structure.
      4. Once the folders are in place, we assign the needed NTFS rights to the service accounts. SQL sets up the permissions for the default DB, Log and TempLog/DB, but nothing else. We have separate disks for index and we also occasionally use a G: drive to store additional DB’s. So my script provides similar rights. We also make sure to grant the SQL service accounts read only rights to each drive as well, and also grant it rights to our scratch / generic disk, K:

```
<pre class="brush: powershell; title: ; notranslate" title="">

#######################################################################################################

#Setting up the physical disks



#Get all offline disks, should be any disks you've created

$OfflineDisks = Get-Disk | Where-Object {$_.OperationalStatus -eq "Offline"}



#Set Disk online

$OfflineDisks | Set-Disk -IsOffline:$false



#Disable read only

$OfflineDisks | Set-Disk -IsReadOnly:$false



#Initialize Disks

$OfflineDisks | Initialize-Disk -PartitionStyle GPT



#loop through all disks and configure based on thier location. This location is based on VMware controller card and controller port locations. In VMware you should have the following SCSI configs

#0:0 = C: = OS = disk 1

#0:1 = K: = Misc = disk 2

#1:0 = F: = UserDB1 = disk 3

#1:1 = N: = Index1 = disk 4

#2:0 = J: = UserLog1 = disk 5

#3:0 = V: = TempLog = disk 6

#3:1 = W: = TempDB = disk 7



#Microsoft in their infinite wisdom, continues to change f'ing property values around, so below is the server 2016 specific scsi id



Foreach ($disk in $OfflineDisks)

{

#This will give us the view of which SCSI card and port we're in.

#Note: property "SCSIPort" actually equals SCSI card in WMI, and "SCSITargetId" equals the SCSI port for the card





$WMIDiskInformation = get-wmiobject -Class win32_diskdrive | where-object {$_.DeviceID -like "*$($disk.number)"}





if ($WMIDiskInformation.SCSIPort -eq 2 -and $WMIDiskInformation.SCSITargetId -eq 1)

{

echo "K:"

$disk | New-Partition -UseMaximumSize

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Format-Volume -FileSystem NTFS -AllocationUnitSize 4096 -NewFileSystemLabel "Misc" -Confirm:$false

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Set-Partition -NewDriveLetter k

}



Elseif ($WMIDiskInformation.SCSIPort -eq 3 -and $WMIDiskInformation.SCSITargetId -eq 0)

{

echo "V:"

$disk | New-Partition -UseMaximumSize

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Format-Volume -FileSystem NTFS -AllocationUnitSize 4096 -NewFileSystemLabel "TempLog" -Confirm:$false

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Set-Partition -NewDriveLetter V

}

Elseif ($WMIDiskInformation.SCSIPort -eq 3 -and $WMIDiskInformation.SCSITargetId -eq 1)

{

echo "w:"

$disk | New-Partition -UseMaximumSize

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Format-Volume -FileSystem NTFS -AllocationUnitSize 8192 -NewFileSystemLabel "TempDB" -Confirm:$false

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Set-Partition -NewDriveLetter w

}

Elseif ($WMIDiskInformation.SCSIPort -eq 4 -and $WMIDiskInformation.SCSITargetId -eq 0)

{

echo "F:"

$disk | New-Partition -UseMaximumSize

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Format-Volume -FileSystem NTFS -AllocationUnitSize 8192 -NewFileSystemLabel "UserDB1" -Confirm:$false

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Set-Partition -NewDriveLetter f

}

Elseif ($WMIDiskInformation.SCSIPort -eq 4 -and $WMIDiskInformation.SCSITargetId -eq 1)

{

echo "N:"

$disk | New-Partition -UseMaximumSize

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Format-Volume -FileSystem NTFS -AllocationUnitSize 8192 -NewFileSystemLabel "Index1" -Confirm:$false

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Set-Partition -NewDriveLetter n

}

Elseif ($WMIDiskInformation.SCSIPort -eq 5 -and $WMIDiskInformation.SCSITargetId -eq 0)

{

echo "J:"

$disk | New-Partition -UseMaximumSize

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Format-Volume -FileSystem NTFS -AllocationUnitSize 4096 -NewFileSystemLabel "UserLog1" -Confirm:$false

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Set-Partition -NewDriveLetter j

}

Elseif ($WMIDiskInformation.SCSIPort -eq 4 -and $WMIDiskInformation.SCSITargetId -eq 2)

{

echo "G:"

$disk | New-Partition -UseMaximumSize

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Format-Volume -FileSystem NTFS -AllocationUnitSize 8192 -NewFileSystemLabel "UserDB2" -Confirm:$false

$disk | Get-Partition | Where-Object {$_.type -eq "Basic"} | Set-Partition -NewDriveLetter G

}

}



#END Setting up the physical disks

#######################################################################################################



#######################################################################################################

#Setting up the folder paths and permissions



# Note 1: If you have more than the standard F, J, K, N, V and W drives, you'll need to mananually setup the folder structure and permsissions

# Note 2: As part of the SQL install, SQL will configure the modify permissions for the default DB, Log, TempLog and TempDB folders, which is why I don't configure them.

# NOte 3: Keep an eye on the folder permissions, you shouldn't see a lot of errors, if you do, something went wrong.

# Note 4: These are based on default disk locations and default disk requests. if you get a request for a G: drive for example, we don't have that scripted at the moment.



#Create Folder Stucture



#F: Drive

If ((Test-Path "F:\MSSQLDB\Data") -eq $false)

{

New-Item -Path "F:\MSSQLDB\Data" -ItemType Container

}

If ((Test-Path "F:\OLAP\Data") -eq $false)

{

New-Item -Path "F:\OLAP\Data" -ItemType Container

}



#J: Drive

If ((Test-Path "J:\MSSQLDB\Log") -eq $false)

{

New-Item -Path "J:\MSSQLDB\Log" -ItemType Container

}

If ((Test-Path "J:\OLAP\Log") -eq $false)

{

New-Item -Path "J:\OLAP\Log" -ItemType Container

}



#K: Drive

If ((Test-Path "K:\Config") -eq $false)

{

New-Item -Path "K:\Config" -ItemType Container

}

If ((Test-Path "K:\MSSQL") -eq $false)

{

New-Item -Path "K:\MSSQL" -ItemType Container

}

If ((Test-Path "K:\MSSQLDB") -eq $false)

{

New-Item -Path "K:\MSSQLDB" -ItemType Container

}

If ((Test-Path "K:\OLAP\config") -eq $false)

{

New-Item -Path "K:\OLAP\config" -ItemType Container

}

If ((Test-Path "K:\Support") -eq $false)

{

New-Item -Path "K:\Support" -ItemType Container

}



#N: Drive

If ((Test-Path "N:\MSSQLDB\Index") -eq $false)

{

New-Item -Path "N:\MSSQLDB\Index" -ItemType Container

}



#V: Drive

If ((Test-Path "V:\MSSQLDB\Log") -eq $false)

{

New-Item -Path "V:\MSSQLDB\Log" -ItemType Container

}



#W: Drive

If ((Test-Path "W:\MSSQLDB\Data") -eq $false)

{

New-Item -Path "W:\MSSQLDB\Data" -ItemType Container

}

If ((Test-Path "W:\OLAP\Temp") -eq $false)

{

New-Item -Path "W:\OLAP\Temp" -ItemType Container

}



#Adding a catch for the G: drive

$GDRive = Get-PSDrive | Where-Object {$_.root -like "G:*"}



If ($GDRive -ne $null)

{

If ((Test-Path "G:\MSSQLDB\Data") -eq $false)

{

New-Item -Path "G:\MSSQLDB\Data" -ItemType Container

}

If ((Test-Path "G:\OLAP\Data") -eq $false)

{

New-Item -Path "G:\OLAP\Data" -ItemType Container

}



}



#Set Permissions



#F: Drive

Start-Process -FilePath "icacls.exe" -ArgumentList "f:\ /remove Everyone /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "f:\ /remove ""Creator Owner"" /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "f:\ /remove BUILTIN\Users /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "f: /grant:rx ""$sqlserviceuser"":(OI)(CI)(RX) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "f: /grant:rx ""$sqlagentuser"":(OI)(CI)(RX) /C" -NoNewWindow -Wait



#J: Drive

Start-Process -FilePath "icacls.exe" -ArgumentList "j:\ /remove Everyone /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "j:\ /remove ""Creator Owner"" /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "j:\ /remove BUILTIN\Users /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "j: /grant:rx ""$sqlserviceuser"":(OI)(CI)(RX) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "j: /grant:rx ""$sqlagentuser"":(OI)(CI)(RX) /C" -NoNewWindow -Wait



#K: Drive

Start-Process -FilePath "icacls.exe" -ArgumentList "k:\ /remove Everyone /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "k:\ /remove ""Creator Owner"" /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "k:\ /remove BUILTIN\Users /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "k: /grant:rx ""$sqlserviceuser"":(OI)(CI)(M) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "k: /grant:rx ""$sqlagentuser"":(OI)(CI)(M) /C" -NoNewWindow -Wait



#N: Drive

Start-Process -FilePath "icacls.exe" -ArgumentList "n:\ /remove Everyone /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "n:\ /remove ""Creator Owner"" /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "n:\ /remove BUILTIN\Users /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "n: /grant:rx ""$sqlserviceuser"":(OI)(CI)(RX) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "n: /grant:rx ""$sqlagentuser"":(OI)(CI)(RX) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "N:\MSSQLDB\Index /grant:rx ""$sqlserviceuser"":(OI)(CI)(F) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "N:\MSSQLDB\Index /grant:rx ""$sqlagentuser"":(OI)(CI)(F) /C" -NoNewWindow -Wait



#V: Drive

Start-Process -FilePath "icacls.exe" -ArgumentList "v:\ /remove Everyone /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "v:\ /remove ""Creator Owner"" /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "v:\ /remove BUILTIN\Users /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "v: /grant:rx ""$sqlserviceuser"":(OI)(CI)(RX) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "v: /grant:rx ""$sqlagentuser"":(OI)(CI)(RX) /C" -NoNewWindow -Wait



#W: Drive

Start-Process -FilePath "icacls.exe" -ArgumentList "w:\ /remove Everyone /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "w:\ /remove ""Creator Owner"" /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "w:\ /remove BUILTIN\Users /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "w: /grant:rx ""$sqlserviceuser"":(OI)(CI)(RX) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "w: /grant:rx ""$sqlagentuser"":(OI)(CI)(RX) /C" -NoNewWindow -Wait



#Adding a catch for the G: drive

If ($GDRive -ne $null)

{

Start-Process -FilePath "icacls.exe" -ArgumentList "g:\ /remove Everyone /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "g:\ /remove ""Creator Owner"" /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "g:\ /remove BUILTIN\Users /T" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "g: /grant:rx ""$sqlserviceuser"":(OI)(CI)(RX) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "g: /grant:rx ""$sqlagentuser"":(OI)(CI)(RX) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "g:\MSSQLDB\Data /grant:rx ""$sqlserviceuser"":(OI)(CI)(F) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "g:\MSSQLDB\Data /grant:rx ""$sqlagentuser"":(OI)(CI)(F) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "g:\OLAP\DATA /grant:rx ""$sqlserviceuser"":(OI)(CI)(F) /C" -NoNewWindow -Wait

Start-Process -FilePath "icacls.exe" -ArgumentList "g:\OLAP\DATA /grant:rx ""$sqlagentuser"":(OI)(CI)(F) /C" -NoNewWindow -Wait

}



#END Setting up the folder paths and permissions

#######################################################################################################

```

At this stage, we have all our disks setup and ready to go. Next we want to grant the SQL service accounts the “perform volume maintenance tasks” right. I don’t have my function published yet, still working on honing it a bit more. However, you can easily do this step manually, or until I release the function, which should be soon. I did however want to show the code.

```
<pre class="brush: powershell; title: ; notranslate" title="">


<h6>#################################################################################################</h6>


#Add SQL service account and agent to perform volume maintenance tasks local GPO



#NOTE: You can find this setting buried in Computer\Windows\Security\Local Policies\User Rights Assignment



#Copy our function to the temp directory

Copy-item -Path $LocalGPOFunctionFilePath -Destination $TempDirectory -Force -Confirm:$false



#Function Name to load



#Import function

. $LocalGPOFunctionNameTempPath



#Add the service account

Add-ECSLocalGPOUserRightAssignment -UserOrGroup $sqlserviceuser -UserRightAssignment "SeManageVolumePrivilege"



#Add the agent account

Add-ECSLocalGPOUserRightAssignment -UserOrGroup $sqlagentuser -UserRightAssignment "SeManageVolumePrivilege"



#END Add SQL service account and agent to perform volume maitanance tasks local GPO

#######################################################################################################

```

Time to install SQL. Basic steps are as follows:

1. We copy the SQL ISO to the K: drive
2. We copy the SQL config file template to the K: drive
3. We copy the SSMS to the K: drive
4. We modify the config file template to update our service accounts to the correct names for this SQL server.
5. We mount the ISO and capture the drive letter used (it’s automatically selected).
6. We install SQL using a few parameters. If it works correctly, you should see the progress without having to answer any questions.
7. Similarly, we install SSMS. You again should see progress, but not have to answer any questions.

```
<pre class="brush: powershell; title: ; notranslate" title="">

#######################################################################################################

#Install SQL



#Copy the ISO to

Copy-item -Path $ISOFileSource -Destination $ISOFileDestination -Force -Confirm:$false



#Copy the SQL config file

Copy-item -path $ConfigFileSource -Destination $ConfigFileDestination -Force -Container:$false



#Copy the SSMS to the K:

Copy-item -path $SSMSFileSource -Destination $SSMSFileDestination -Force -Container:$false



#Modfiy the config file to update it for our SQL accounts

$ConfigFileContent = (Get-content -Path $ConfigFileDestination).Replace("YOURDOMAINHERE\SQLSERVICEACCOUNTTOCHANGE",$sqlserviceuser) | set-content -Path $ConfigFileDestination

$ConfigFileContent = (Get-content -Path $ConfigFileDestination).Replace("YOURDOMAINHERE\SQLAGENTACCOUNTTOCHANGE",$sqlagentuser) | set-content -Path $ConfigFileDestination



#Mount the ISO

$mountResult = Mount-DiskImage $ISOFileDestination -PassThru

$ISOVolume = $mountResult | Get-Volume



#Define the SQL install path

$SQLInstallPath = $($isovolume.driveletter) + ":\setup.exe"



#Install SQL

Start-Process -FilePath $SQLInstallPath -ArgumentList "/SQLSVCPASSWORD=""$sqlserviceuserpassword"" /AGTSVCPASSWORD=""$sqlagentuserpassword"" /ISSVCPASSWORD=""$sqlserviceuserpassword"" /ASSVCPASSWORD=""$sqlserviceuserpassword"" /ConfigurationFile=$($ConfigFileDestination) /IAcceptSQLServerLicenseTerms" -NoNewWindow -Wait



#Install SSSMS

Start-Process -FilePath $SSMSFileDestination -ArgumentList "/passive /norestart" -NoNewWindow -Wait



#END Install SQL

#######################################################################################################

```

Now let’s make sure we register the SPN’s for our DBA’s. You should probably do this as a best practice too.

```
<pre class="brush: powershell; title: ; notranslate" title="">

#######################################################################################################

#Register SPNs



Start-process -FilePath setspn -ArgumentList "-A MSSQLSvc/$($ComputerName).YOURDOMAINHERE.local:1433 $($sqlserviceuserNoDomain) " -NoNewWindow -Wait -PassThru

Start-process -FilePath setspn -ArgumentList "-A MSSQLSvc/$($ComputerName).YOURDOMAINHERE.local $($sqlserviceuserNoDomain) " -NoNewWindow -Wait -PassThru



#END Register SPNs

#######################################################################################################

```

We need SQL Servers Powershell cmdlets, BUT SQL always installs and outdated version, plus your stuck waiting on CU’s for newer PS modules. Forget that, let’s pull them straight from the Powershell gallery where they’re kept up to data more frequently.

\*\*\*Note: I banged my head on setting powershell command errors because I didn’t have the latest versions, so another reason to keep us the PS gallery version. Bugs are fixed.

Make sure you say “Y” to the questions asked about importing this modules.

```
<pre class="brush: powershell; title: ; notranslate" title=""></strong>

#######################################################################################################

#Auto Load SQL PS Module



#The included SQL module isn't kept up to date, so we're going to install the latest module from MS git

Install-Module sqlserver -AllowClobber



#Import the module

Import-Module sqlserver -DisableNameChecking



#End Auto Load SQL PS Module

#######################################################################################################

```

You should now have all sorts of great SQL PS commands. At this stage, we’re going to finish setting up a generic SQL server (non-clustered). There are a few things we do.

1. We enable SQL contained DB’s
2. We configure the max memory / min memory based on Brent Ozars generic recommendations. 
  1. The only time I’ve had an issue with this, is when I’ve had 4GB or less of memory. Pretty obvious why.

```
<pre class="brush: powershell; title: ; notranslate" title=""></strong>

#######################################################################################################

#Configure SQL, all SQL servers



#SQL Object

$SQLObject = New-Object Microsoft.SqlServer.Management.Smo.Server



#Getting the server information

$server = New-Object Microsoft.SqlServer.Management.Smo.Server $env:ComputerName



#Configure SQL Memory

$MaxMemory = $($server.PhysicalMemory) - 4096

$MinMemory = $($server.PhysicalMemory) / 2



Invoke-Sqlcmd -Database Master -Query "EXEC sp_configure'Show Advanced Options',1;RECONFIGURE;"

Invoke-Sqlcmd -Database Master -Query "EXEC sp_configure'max server memory (MB)',$MaxMemory;RECONFIGURE;"

Invoke-Sqlcmd -Database Master -Query "EXEC sp_configure'min server memory (MB)',$MinMemory;RECONFIGURE;"



#End Configure SQL, all SQL servers

#######################################################################################################

```

Now at this point you should have a generic SQL server setup and ready to patch / hand off. If you want to setup an AAG, continue following along.

To get the AAG setup, we need a cluster first. So let’s install the clustering feature on both nodes.

```
<pre class="brush: powershell; title: ; notranslate" title=""></strong>

#######################################################################################################

#Install Cluster feature



Install-WindowsFeature -Name Failover-Clustering –IncludeManagementTools



#END Install Cluster feature

#######################################################################################################

```

Now that we have the cluster installed, you only need to run this next step from NODE 1. Whenever there is a task going forward that only needs to be done on a singular node, I do it on node 1.

Here is what we’re doing.

1. We’re forming a cluster with the two nodes you’ve defined.
2. We’re setting up the FSW folder, assigning NTFS rights needed, and then modifying the cluster to use a FSW.
3. We’re setting the cluster same subnet threshold to 10. This is the new default, but wasn’t always the case. Up to you if you want that value.
4. Now the next step is to stop the cluster. Listen up here, this is important. As you’ll see in the code comment, you need to take the newly created CCR / CNO and add it to the same AD group you put the cluster nodes into. This way the cluster has rights to create SQL listeners. If you don’t do this, creating the SQL listeners will fail. Once you’ve done that. Wait like 15 seconds are so before proceeding to the next step.
5. Now we’re going to finally start up the cluster nodes. They should inherit the rights you assigned them in step 4.

```
<pre class="brush: powershell; title: ; notranslate" title="">

#######################################################################################################

#Setup and configure cluster (only one node)



#Configure cluster (only run once on eaither node)

New-Cluster –Name $ClusterCNO -Node $node1,$node2 –StaticAddress $clusterip -nostorage



#Configure file share witness folder

If ((Test-Path $filesharewitness) -eq $false)

{

New-Item -Path $filesharewitness -ItemType Container

}



#Set file share permissions

Start-Process -FilePath "icacls.exe" -ArgumentList """$filesharewitness"" /grant ""YOURDOMAINHERE\$ClusterCNO$"":(OI)(CI)(F) /C" -NoNewWindow -Wait



#Set quorum for the cluster

#Note 1: This is for AAG's only, if you are setting up a traditional cluster, you'll need to setup a disk based quorum

Set-ClusterQuorum –NodeAndFileShareMajority $filesharewitness



#Set Cluster Timeout to 10 seconds

(Get-cluster).SameSubnetThreshold=10



#Stop the cluster service so you can give it the correct AD rights

get-cluster -Name $ClusterCNO | Stop-Cluster -Force -Confirm:$false

#!!!!!!!!!!!!!Add the cluster CNO to the same AD group that you added the individual nodes to

#After assigning the rights, start the cluster service

Get-Service -Name ClusSvc -ComputerName $node1 | Start-Service

Get-Service -Name ClusSvc -ComputerName $node2 | Start-Service



#END Setup and configure cluster (only one node)

#######################################################################################################

```

Run this next step on both nodes again. This enabled the SQL AAG’s on both nodes.

```
<pre class="brush: powershell; title: ; notranslate" title="">

#######################################################################################################

#Enable SQL AAG, AAG only



#Enable SQL Always on (run on both nodes)



#NOTE: This may fail once, wait a minute, then try again.

Enable-SqlAlwaysOn -ServerInstance $($env:ComputerName) -Confirm:$false -NoServiceRestart:$false -Force:$true



#End Enable SQL AAG, AAG only

#######################################################################################################

```

Now, until mentioned otherwise, we’re back to only running these steps from a single node. Again, I’m going to run these from node 1. If you only have a need for one aag, then only run the “1”. If you need 2, then run the 1 + 2 sections. If you’re in IT, I probably shouldn’t need to explain this to you.

Also, just wanted to state again, most of these steps were copied from Edwins blog post, he gets most of the credit here not me. I fill in a few of the blanks that he didn’t, like backing up the DB’s, seeding settings, etc.

Here is what we’re doing.

1. We’re created some test DB’s that will be used by the AAG.
2. Now we make sure the backup share has our folder created. In my case, the service accounts have rights to this location already, because we took care of that in the prerequisites, and so did you… right?
3. In order to use the newly created DB, we need to back it up, so that’s what we do next.

```
<pre class="brush: powershell; title: ; notranslate" title="">

#######################################################################################################

#Prepare SQL for new AAG (only one node)



#Create a DB per listener. Typically two, but sometimes more / less



#DB1

$db = New-Object -TypeName Microsoft.SqlServer.Management.Smo.Database($SQLObject, $DB1Name)

$db.Create()



#DB2

$db = New-Object -TypeName Microsoft.SqlServer.Management.Smo.Database($SQLObject, $DB2Name)

$db.Create()



#DB3

$db = New-Object -TypeName Microsoft.SqlServer.Management.Smo.Database($SQLObject, $DB3Name)

$db.Create()



#DB4

$db = New-Object -TypeName Microsoft.SqlServer.Management.Smo.Database($SQLObject, $DB4Name)

$db.Create()



#Confirm, list databases in your current instance

$SQLObject.Databases | Select Name, Status, Owner, CreateDate



#Configure the backup share

If ((Test-Path $BackupSharePath) -eq $false)

{

New-Item -Path $BackupSharePath -ItemType Container

}





#Now we need to backup all of the newly created DB's

Backup-SqlDatabase -ServerInstance $($env:ComputerName) -database $DB1Name -BackupFile $TestDB1FullPath

Backup-SqlDatabase -ServerInstance $($env:ComputerName) -database $DB2Name -BackupFile $TestDB2FullPath

Backup-SqlDatabase -ServerInstance $($env:ComputerName) -database $DB3Name -BackupFile $TestDB3FullPath

Backup-SqlDatabase -ServerInstance $($env:ComputerName) -database $DB4Name -BackupFile $TestDB4FullPath



#END Prepare SQL for new AAG (only one node)

#######################################################################################################

```

Now, the next steps are where we setup the AAG’s. There are two main sections. One where you setup older AAG’s like SQL 2012 / 2014. This is commented out right now. The next section is for SQL 2017, where we’re utilizing SQL’s newer seeding technique, which I like a lot better.

Again, a lot of this was copied from Edwins post, I simply did things like use variables, and filled in blanks related to backing up / restoring, etc.

The basic steps that are similar for non-seeded AAG’s and seeded AAG’s.

1. We need to setup an endpoint for the AAG on each SQL node.
2. We need to start the endpoints
3. We need to create a SQL login for the SQL service accounts so they can connect to each other.
4. Then we need to grant them the needed rights.

Next, it depends on whether you’re doing a traditional AAG or a seeded AAG. I’m going to skip the traditional AAG, because Edwin already has a great blog post on that which I linked above. You can see my steps below, which include things like backing up / restoring that he leaves out, so just cross-reference if you need to.

As for seeding AAG setup, here is how it’s done.

1. We need to define our replica’s. The one parameter that’s different between Edwins post and mine is the seeding parameter.
2. Now we create the AAG (on node 1). The additional parameters we have here, are enabling support for DTC and database level health. These are new features.
3. Next we join the secondary node to the AAG(s).
4. Now here is where setting up a seeding DB really starts straying from a traditional. We need to grant the AAG its self-rights to “create DB”, and we need to do this on both nodes. \*\*\*you can continue running this command from one node though, we’re remotely executing these commands.
5. Now we add the DB you backed up to node 1 and it should automatically have replicated to node 2
6. Then we finally create the SQL listener and we’re done.

```
<pre class="brush: powershell; title: ; notranslate" title="">
#######################################################################################################
#Setup the AAG (only one node)

#Create the endpoints for each SQL AAG replica
New-SqlHADREndpoint -Path "SQLSERVER:\SQL\$($node1)\Default" -Name $($SQLAAGEndPointName) -Port 5022 -EncryptionAlgorithm Aes -Encryption Required
New-SqlHADREndpoint -Path "SQLSERVER:\SQL\$($node2)\Default" -Name $($SQLAAGEndPointName) -Port 5022 -EncryptionAlgorithm Aes -Encryption Required

#Stare the endpoints for each AAG replica
Set-SqlHADREndpoint -Path "SQLSERVER:\SQL\$($node1)\Default\Endpoints\$($SQLAAGEndPointName)" -State Started
Set-SqlHADREndpoint -Path "SQLSERVER:\SQL\$($node2)\Default\Endpoints\$($SQLAAGEndPointName)" -State Started

#Create a SQL login for the SQL service account so each server can connect to each other.
$createLogin = “CREATE LOGIN [$($sqlserviceuser)] FROM WINDOWS;”
$grantConnectPermissions = “GRANT CONNECT ON ENDPOINT::$($SQLAAGEndPointName) TO [$($sqlserviceuser)];”
Invoke-SqlCmd -ServerInstance $($node1) -Query $createLogin
Invoke-SqlCmd -ServerInstance $($node1) -Query $grantConnectPermissions
Invoke-SqlCmd -ServerInstance $($node2) -Query $createLogin
Invoke-SqlCmd -ServerInstance $($node2) -Query $grantConnectPermissions

#Create replicas

##########This is for non-seeded AAG's (traditional backup / restore AAGs)

#Create the replicas
$primaryReplica = New-SqlAvailabilityReplica -Name $($node1) -EndpointUrl “TCP://$($node1).YOURDOMAINHERE.local:5022” -AvailabilityMode “SynchronousCommit” -FailoverMode 'Automatic' -AsTemplate -Version $SQLObject.version
$secondaryReplica = New-SqlAvailabilityReplica -Name $($node2) -EndpointUrl “TCP://$($node2).YOURDOMAINHERE.local:5022” -AvailabilityMode “SynchronousCommit” -FailoverMode 'Automatic' -AsTemplate -Version $SQLObject.version

#Buildthe AAG's
New-SqlAvailabilityGroup -InputObject $($node1) -Name $AAG1Name -AvailabilityReplica ($primaryReplica, $secondaryReplica) -Database $DB1Name -DtcSupportEnabled -DatabaseHealthTrigger -ClusterType Wsfc
New-SqlAvailabilityGroup -InputObject $($node1) -Name $AAG2Name -AvailabilityReplica ($primaryReplica, $secondaryReplica) -Database $DB2Name -DtcSupportEnabled -DatabaseHealthTrigger -ClusterType Wsfc
New-SqlAvailabilityGroup -InputObject $($node1) -Name $AAG3Name -AvailabilityReplica ($primaryReplica, $secondaryReplica) -Database $DB3Name -DtcSupportEnabled -DatabaseHealthTrigger -ClusterType Wsfc
New-SqlAvailabilityGroup -InputObject $($node1) -Name $AAG4Name -AvailabilityReplica ($primaryReplica, $secondaryReplica) -Database $DB4Name -DtcSupportEnabled -DatabaseHealthTrigger -ClusterType Wsfc

#Now we need to backup all db's (both full and log)
Backup-SqlDatabase -ServerInstance $($env:ComputerName) -database $DB1Name -BackupFile $TestDB1FullPath
Backup-SqlDatabase -ServerInstance $($env:ComputerName) -database $DB2Name -BackupFile $TestDB2FullPath
Backup-SqlDatabase -ServerInstance $($env:ComputerName) -database $DB3Name -BackupFile $TestDB3FullPath
Backup-SqlDatabase -ServerInstance $($env:ComputerName) -database $DB4Name -BackupFile $TestDB4FullPath

Backup-SqlDatabase -ServerInstance $($env:ComputerName) -database $DB1Name -BackupFile $TestLog1FullPath -BackupAction Log
Backup-SqlDatabase -ServerInstance $($env:ComputerName) -database $DB2Name -BackupFile $TestLog2FullPath -BackupAction Log
Backup-SqlDatabase -ServerInstance $($env:ComputerName) -database $DB3Name -BackupFile $TestLog3FullPath -BackupAction Log
Backup-SqlDatabase -ServerInstance $($env:ComputerName) -database $DB4Name -BackupFile $TestLog4FullPath -BackupAction Log

#Now we need to restore the DB's
Restore-SqlDatabase -Database $DB1Name -BackupFile $TestDB1FullPath -ServerInstance $($node2) -NoRecovery
Restore-SqlDatabase -Database $DB2Name -BackupFile $TestDB2FullPath -ServerInstance $($node2) -NoRecovery
Restore-SqlDatabase -Database $DB3Name -BackupFile $TestDB3FullPath -ServerInstance $($node2) -NoRecovery
Restore-SqlDatabase -Database $DB4Name -BackupFile $TestDB4FullPath -ServerInstance $($node2) -NoRecovery

Restore-SqlDatabase -Database $DB1Name -BackupFile $TestLog1FullPath -ServerInstance $($node2) -NoRecovery -RestoreAction 'Log'
Restore-SqlDatabase -Database $DB2Name -BackupFile $TestLog2FullPath -ServerInstance $($node2) -NoRecovery -RestoreAction 'Log'
Restore-SqlDatabase -Database $DB3Name -BackupFile $TestLog3FullPath -ServerInstance $($node2) -NoRecovery -RestoreAction 'Log'
Restore-SqlDatabase -Database $DB4Name -BackupFile $TestLog4FullPath -ServerInstance $($node2) -NoRecovery -RestoreAction 'Log'

#Now we need to join the secondary nodes copy of the DB to the AAG
Add-SqlAvailabilityDatabase -Path "SQLSERVER:\SQL\$($node2)\Default\AvailabilityGroups\$($AAG1Name)" -Database $DB1Name
Add-SqlAvailabilityDatabase -Path "SQLSERVER:\SQL\$($node2)\default\AvailabilityGroups\$($AAG2Name)" -Database $DB2Name
Add-SqlAvailabilityDatabase -Path "SQLSERVER:\SQL\$($node2)\default\AvailabilityGroups\$($AAG3Name)" -Database $DB3Name
Add-SqlAvailabilityDatabase -Path "SQLSERVER:\SQL\$($node2)\default\AvailabilityGroups\$($AAG4Name)" -Database $DB4Name

########## END This is for non-seeded AAG's (traditional backup / restore AAGs)

#This is for seeded DB's, which is what we're doing in SQL 2017+

#Create the replica's
$primaryReplica = New-SqlAvailabilityReplica -Name $($node1) -EndpointUrl “TCP://$($node1).YOURDOMAINHERE.local:5022” -AvailabilityMode “SynchronousCommit” -FailoverMode 'Automatic' -AsTemplate -Version $SQLObject.version -SeedingMode Automatic
$secondaryReplica = New-SqlAvailabilityReplica -Name $($node2) -EndpointUrl “TCP://$($node2).YOURDOMAINHERE.local:5022” -AvailabilityMode “SynchronousCommit” -FailoverMode 'Automatic' -AsTemplate -Version $SQLObject.version -SeedingMode Automatic

#Create the AAG
New-SqlAvailabilityGroup -InputObject $($node1) -Name $AAG1Name -AvailabilityReplica ($primaryReplica, $secondaryReplica) -DtcSupportEnabled -DatabaseHealthTrigger -ClusterType Wsfc
New-SqlAvailabilityGroup -InputObject $($node1) -Name $AAG2Name -AvailabilityReplica ($primaryReplica, $secondaryReplica) -DtcSupportEnabled -DatabaseHealthTrigger -ClusterType Wsfc
New-SqlAvailabilityGroup -InputObject $($node1) -Name $AAG3Name -AvailabilityReplica ($primaryReplica, $secondaryReplica) -DtcSupportEnabled -DatabaseHealthTrigger -ClusterType Wsfc
New-SqlAvailabilityGroup -InputObject $($node1) -Name $AAG4Name -AvailabilityReplica ($primaryReplica, $secondaryReplica) -DtcSupportEnabled -DatabaseHealthTrigger -ClusterType Wsfc

#Join secondary node to the AAG's
Join-SqlAvailabilityGroup -Path “SQLSERVER:\SQL\$($node2)\Default” -Name $AAG1Name
Join-SqlAvailabilityGroup -Path “SQLSERVER:\SQL\$($node2)\Default” -Name $AAG2Name
Join-SqlAvailabilityGroup -Path “SQLSERVER:\SQL\$($node2)\Default” -Name $AAG3Name
Join-SqlAvailabilityGroup -Path “SQLSERVER:\SQL\$($node2)\Default” -Name $AAG4Name

#Grant the AAG the rights to create a DB (only needed for seeding mode)
$AAG1CreateCommand = "ALTER AVAILABILITY GROUP [$($AAG1Name)] GRANT CREATE ANY DATABASE"
$AAG2CreateCommand = "ALTER AVAILABILITY GROUP [$($AAG2Name)] GRANT CREATE ANY DATABASE"
$AAG3CreateCommand = "ALTER AVAILABILITY GROUP [$($AAG3Name)] GRANT CREATE ANY DATABASE"
$AAG4CreateCommand = "ALTER AVAILABILITY GROUP [$($AAG4Name)] GRANT CREATE ANY DATABASE"

Invoke-SqlCmd -ServerInstance $($node1) -Query $AAG1CreateCommand
Invoke-SqlCmd -ServerInstance $($node2) -Query $AAG1CreateCommand

Invoke-SqlCmd -ServerInstance $($node1) -Query $AAG2CreateCommand
Invoke-SqlCmd -ServerInstance $($node2) -Query $AAG2CreateCommand

Invoke-SqlCmd -ServerInstance $($node1) -Query $AAG3CreateCommand
Invoke-SqlCmd -ServerInstance $($node2) -Query $AAG3CreateCommand

Invoke-SqlCmd -ServerInstance $($node1) -Query $AAG4CreateCommand
Invoke-SqlCmd -ServerInstance $($node2) -Query $AAG4CreateCommand

#Now we need to join the primary nodes copy of the DB to the AAG
Add-SqlAvailabilityDatabase -Path "SQLSERVER:\SQL\$($node1)\Default\AvailabilityGroups\$($AAG1Name)" -Database $DB1Name
Add-SqlAvailabilityDatabase -Path "SQLSERVER:\SQL\$($node1)\default\AvailabilityGroups\$($AAG2Name)" -Database $DB2Name
Add-SqlAvailabilityDatabase -Path "SQLSERVER:\SQL\$($node1)\default\AvailabilityGroups\$($AAG3Name)" -Database $DB3Name
Add-SqlAvailabilityDatabase -Path "SQLSERVER:\SQL\$($node1)\default\AvailabilityGroups\$($AAG4Name)" -Database $DB4Name

#Now we need to setup the listners (for both seeded and non-seeded AAG's)
New-SqlAvailabilityGroupListener -Name $($AAG1Name) -staticIP $AAG1IP -Port 1433 -Path "SQLSERVER:\SQL\$($node1)\DEFAULT\AvailabilityGroups\$($AAG1Name)"
New-SqlAvailabilityGroupListener -Name $($AAG2Name) -staticIP $AAG2IP -Port 1433 -Path "SQLSERVER:\SQL\$($node1)\DEFAULT\AvailabilityGroups\$($AAG2Name)"
New-SqlAvailabilityGroupListener -Name $($AAG3Name) -staticIP $AAG3IP -Port 1433 -Path "SQLSERVER:\SQL\$($node1)\DEFAULT\AvailabilityGroups\$($AAG3Name)"
New-SqlAvailabilityGroupListener -Name $($AAG4Name) -staticIP $AAG4IP -Port 1433 -Path "SQLSERVER:\SQL\$($node1)\DEFAULT\AvailabilityGroups\$($AAG4Name)"

#End Setup the AAG (only one node)
#######################################################################################################

```

Finally, we need to fix the SQL listeners so that it only registers one IP address per site, and test the cluster for Microsoft support. Again, you only need to run this from one node.

```
<pre class="brush: powershell; title: ; notranslate" title="">

#######################################################################################################

#Fix cluster setting and test cluster post AAG (only one node)



#Fix cluster multi-subnet SQL listner setting

$ClusterResource = Get-ClusterResource | Where-Object {$_.ResourceType -eq "network name" -and $_.ownergroup -ne "Cluster Group"}

$ClusterResource | Set-ClusterParameter -Create RegisterAllProvidersIP 0

$ClusterResource | ForEach-Object {Stop-ClusterResource -Name $_.Name}

Get-ClusterResource | Where-Object {$_.ResourceType -eq "SQL Server Availability Group"} | foreach-object {Start-ClusterResource -Name $_.Name}



#Finally test the cluster

Test-Cluster



#END Fix cluster setting and test cluster post AAG(only one node)

#######################################################################################################

```

Conclusion:
===========

That’s all I have. I know it’s a big post, I know it’s probably a little hard to follow along, but hopefully you’ve gleaned something from this. I’ve taken a SQL server setup from a day, down to only a few hours with this script. Most of that time BTW is waiting for SQL to install and completing the prep work. I know it’s a lot to take in, so if you have any questions, leave them in the comments.

Also, I hope to have that local GPO function published this week or at the latest January.

One last thing, I know the formatting is a bit hard to read on a blog. [SQL Powershell Setup](http://www.ericcsinger.com/wp-content/uploads/2017/12/SQL-Powershell-Setup.txt) I have the txt version of the PS script for you here.