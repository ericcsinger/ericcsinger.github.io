---
title: 'PowerShell: Remove a failed domain controller'
date: '2020-11-26T20:00:00+00:00'
status: publish
permalink: /PowerShell-Remove-a-failed-domain-controller
author: 'Eric C. Singer'
excerpt: ''
type: post
tag:
    - Active Directory
    - PowerShell
post_format: []
---

# PowerShell: Remove a failed domain controller

Version: 1.0.1

## Introduction:
Let's face it, removing a domain controller via the GUI is easy, but sometimes you just want to know how to automate something.  In my research there was a lot of resources on how to cleanup using the GUI, or via NTDS.  Nothing about utilizing PowerShell.  

## Parameters
Let's start by estalishing some parameters

```PowerShell
#Array to hold roles of original DC
$All_Roles_To_Move = New-Object -TypeName "System.Collections.ArrayList"

#Name of the domain controller you'd like to cleanup.  This should be the NETBIOS name, not the FQDN
$AD_DC_Name_To_Remove = "Name-DC-Remove"

$AD_DC_Replacement_Name = "Enter the name of the DC to move any FSMO roles too"

#Name of your forrest domain name.  
$Forest_Fully_Qualified_Domain_Name = "Forest.com"

#The netbios name of your domain.  if it's the same, leave it null
$NETBIOS_Domain_Name = $null
```

## Getting some preliminary domain and forest information
First we need some data that we don't have at the moment, like the all the domain information.

```PowerShell
#Formulate the FQDN of the domain
If ($NULL -eq $NETBIOS_Domain_Name)
    {
    $Fully_Qualified_Domain_Name = $Forest_Domain_Name
    }
Else
    {
    $Fully_Qualified_Domain_Name = "Domain.$($Forest_Domain_Name)"
    }

#Formulate the FQDN of the former and new DC
$AD_DC_Name_To_Remove_Fully_Qualified_Domain_Name = "$($AD_DC_Name_To_Remove)$($Fully_Qualified_Domain_Name)"
$AD_DC_Replacement_Name_Fully_Qualified_Domain_Name = "$($AD_DC_Replacement_Name )$($Fully_Qualified_Domain_Name)"

#Getting the forest
$Forest = Get-ADForest -Identity $Forest_Domain_Name

#Getting the domain
$Forest_Domain = Get-ADDomain -Identity $Forest_Fully_Qualified_Domain_Name
$Domain = Get-ADDomain -Identity $Fully_Qualified_Domain_Name

#Get all AD sites
$All_AD_Sites = Get-ADReplicationSite -Filter "*"

#Get all DNS records
$All_DNS_Records = Get-DnsServerResourceRecord -ZoneName $Domain.DNSRoot -ComputerName $($AD_DC_Replacement_Name_Fully_Qualified_Domain_Name)
```


## Sieze Them!
Capture any roles that were once held by the original DC.

```PowerShell
#First let compile a list of all roles that need to be moved

If ($Forest.SchemaMaster -eq $AD_DC_Name_To_Remove_Fully_Qualified_Domain_Name)
    {
    $All_Roles_To_Move.Add("SchemaMaster") | out-null
    }

If ($Forest.DomainNamingMaster -eq $AD_DC_Name_To_Remove_Fully_Qualified_Domain_Name)
    {
    $All_Roles_To_Move.Add("DomainNamingMaster") | out-null
    }

If ($Domain.PDCEmulator -eq $AD_DC_Name_To_Remove_Fully_Qualified_Domain_Name)
    {
    $All_Roles_To_Move.Add("PDCEmulator") | out-null
    }

If ($Domain.RIDMaster -eq $AD_DC_Name_To_Remove_Fully_Qualified_Domain_Name)
    {
    $All_Roles_To_Move.Add("RIDMaster") | out-null
    }

If ($Domain.InfrastructureMaster -eq $AD_DC_Name_To_Remove_Fully_Qualified_Domain_Name)
    {
    $All_Roles_To_Move.Add("InfrastructureMaster") | out-null
    }

#Count all roles we need to move
$All_Roles_To_Move_Count = $All_Roles_To_Move | Measure-Object | select-object -expandproperty Count

#Determine if we have anything to move, and if so, move it.  Keep a note, this can take a while.  I think it needs to time out.
If ($All_Roles_To_Move_Count -gt 0)
    {
    Move-ADDirectoryServerOperationMasterRole -Identity $($AD_DC_Replacement_Name_Fully_Qualified_Domain_Name) -OperationMasterRole ($All_Roles_To_Move -join ",") -Force -PassThru
    }
```

## Cleanup our sites and NTDS
The DC lives in your sites... somewhere.  This will find it, and remove it.  This is also where we'll be using a simple onliner ntdsutil wrapped in PowerShell to formally cleanup the DC domain info.

```PowerShell
:All_AD_Sites Foreach ($AD_Site in $All_AD_Sites)
    {
    Write-Host "Working on site $($AD_Site.Name)"

    Write-Host "Checking if site $($AD_Site.Name) contains $($AD_DC_Name_To_Remove)"
    $DC_In_Site = $null
    $DC_In_Site = Get-ADObject -Identity "cn=$($AD_DC_Name_To_Remove),cn=servers,$($AD_Site.DistinguishedName)" -Partition "CN=Configuration,$($Forest_Domain.distinguishedName)" -Properties * -ErrorAction SilentlyContinue

    If ($null -ne $DC_In_Site)
        {
        Write-Host "Site $($AD_Site.Name) contains $($AD_DC_Name_To_Remove)" -ForegroundColor Cyan
        $StandardOut = New-TemporaryFile
        $ErrorOut = New-TemporaryFile
        
        Write-Host "Attempting to cleanup NTDS for $($AD_DC_Name_To_Remove)" -ForegroundColor Yellow
        $NTDS = $null
        $NTDS = Start-process -FilePath ntdsutil -argumentList """metadata cleanup"" ""remove selected server cn=$($AD_DC_Name_To_Remove),cn=servers,$($AD_Site.DistinguishedName)"" q q" -wait -nonewwindow -RedirectStandardOutput $StandardOut.FullName -RedirectStandardError $ErrorOut -PassThru

        Get-Content -Path $StandardOut -Raw
        Remove-Item -Path $StandardOut -Confirm:$false -Force

        If ($NTDS.ExitCode -gt 0)
            {
            Get-Content -Path $ErrorOut -Raw
            Remove-Item -Path $ErrorOut -Confirm:$false -Force
            Throw "NTDS exit code was $($NTDS.ExitCode)"
            }

        Write-Host "Cleaned up NTDS for $($AD_DC_Name_To_Remove)" -ForegroundColor Green


        Write-Host "Attempting to cleanup site object for $($AD_DC_Name_To_Remove)" -ForegroundColor Yellow
        $DC_In_Site = Get-ADObject -Identity "cn=$($AD_DC_Name_To_Remove),cn=servers,$($AD_Site.DistinguishedName)" -Partition "CN=Configuration,$($Forest_Domain.distinguishedName)" -Properties *
        $DC_In_Site | Remove-ADObject -Recursive -Confirm:$false
        Write-Host "Cleaned up site object for $($AD_DC_Name_To_Remove)" -ForegroundColor Green

        Write-Host "Attempting to cleanup other AD objects with this DC name" -ForegroundColor Yellow
        $All_AD_Objects = Get-ADObject -Filter "*" 
        Foreach ($AD_Object in $All_AD_Objects)
            {
            If ($AD_Object.DistinguishedName -like "*$($AD_DC_Name_To_Remove)*")
                {
                Write-Host "Attempting to remove AD object $($AD_Object.DistinguishedName)" -ForegroundColor Yellow
                $AD_Object | Remove-ADObject -Recursive -Confirm:$false 
                Write-Host "Removed AD object $($AD_Object.DistinguishedName)" -ForegroundColor Green
                }
            }
        break All_AD_Sites
        }    
    }
```

## Cleanup DNS
Now the last cleanup task I like to do is cleanup DNS.  You could let scavenging kick in if you'd like, that's your call. For right now, I only scan the primary DNS zone for this DC.  If you have NS records else where.  You can borrow this to make it happen.

```PowerShell
Write-Host "Cleanup DNS fore server $($AD_DC_Name_To_Remove)" -ForegroundColor Cyan

Foreach ($Record in $All_DNS_Records)
    {
    Switch ($Record.RecordType)
        {
        {$_ -eq "A"} 
            {
            If ($Record.HostName -like "*$($AD_DC_Name_To_Remove)*")
                {
                Write-Host "Removing DNS record" -ForegroundColor Yellow
                $Record 
                $Record | Remove-DnsServerResourceRecord -ZoneName $Domain.DNSRoot -ComputerName $($env:ComputerName) -Confirm:$false -Force
                }
            ;break
            }

        {$_ -eq "CNAME"} 
            {
            If ($Record.recorddata.HostNameAlias -like "*$($AD_DC_Name_To_Remove)*")
                {
                Write-Host "Removing DNS record" -ForegroundColor Yellow
                $Record 
                $Record | Remove-DnsServerResourceRecord -ZoneName $Domain.DNSRoot -ComputerName $($env:ComputerName) -Confirm:$false -Force
                }
            ;break
            }

        {$_ -eq "SRV"} 
            {
            If ($Record.recorddata.DomainName -like "*$($AD_DC_Name_To_Remove)*")
                {
                Write-Host "Removing DNS record" -ForegroundColor Yellow
                $Record 
                $Record | Remove-DnsServerResourceRecord -ZoneName $Domain.DNSRoot -ComputerName $($env:ComputerName) -Confirm:$false -Force
                }
            ;break
            }
        }
    }

```