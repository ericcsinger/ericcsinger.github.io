---
title: 'PowerShell: Find orphaned disks in Azure and their cost'
date: '2021-02-06T16:00:00+00:00'
status: publish
permalink: /PowerShell-Find-orphaned-disks-in-Azure-and-their-cost'
author: 'Eric C. Singer'
excerpt: ''
type: post
tag:
    - Azure
    - PowerShell
post_format: []
---

# PowerShell: Find orphaned disks in Azure and their cost

Version: 1.0.0

## Introduction:
Just wanted to get something super simple out there.  I was curious how many unattatched disks our Azure portal had and what it was costing us.  This little script will give us the basic answer to that question.

## The script
This will loop through all subscriptions and gather all disks with a status of "unattatched".  Then it will try to find out how much they cost.  Don't trust this blindly of course. The results can be parsed in the variable named "$All_Az_Disks_Unattached".  

```PowerShell
###################################################
#All Az Subscriptions
$All_Az_Subscriptions = Get-AzSubscription

###################################################
#Loop through each Az Subscription
$All_Az_Disks_Unattached = $null
$All_Az_Disks_Unattached = Foreach ($Az_Subscription in $All_Az_Subscriptions)
    {
    ###################################################
    #Set the context
    Write-Host "Working on subscription ""$($Az_Subscription.Name)"""
    Set-AzContext -SubscriptionObject $Az_Subscription | Out-Null

    ###################################################
    #Get all Az disks in this particular subscription and return the object
    Write-Host "Getting all disks in subscription ""$($Az_Subscription.Name)"""
    $All_Az_Disks_In_Subscription_Unattached = $null
    $All_Az_Disks_In_Subscription_Unattached = Get-AzDisk | Where-Object {$_.DiskState -eq "Unattached"}

    ###################################################
    #Get billing usage details if disks in this subscription aren't null
    If ($null -ne $All_Az_Disks_In_Subscription_Unattached)
        {
        Write-Host "We found a count of $($All_Az_Disks_In_Subscription_Unattached.Count) unattatched disks in subscription ""$($Az_Subscription.Name)""" -ForegroundColor Yellow
        ###################################################
        #Get az billing usage
        Write-Host "Getting usage details for all resources in this subscription"
        $All_Az_Consumption_Usage_Details = $null
        $All_Az_Consumption_Usage_Details = Get-AzConsumptionUsageDetail

        ###################################################
        #Loop through the consumption details
        Write-Host "Looping through all disks we found"
        Foreach ($Az_Disk_In_Subscription_Unattached in $All_Az_Disks_In_Subscription_Unattached)
            {
            Write-Host "Attempting to find a billing details mapped to our disk named ""$($Az_Disk_In_Subscription_Unattached.Name)"""
            $Az_Disk_Consumption_Usage_Details = $null
            $Az_Disk_Consumption_Usage_Details = $All_Az_Consumption_Usage_Details | Where-Object {$_.InstanceId -eq $Az_Disk_In_Subscription_Unattached.Id}

            ###################################################
            #Create a result object
            $Result = $null 
            $Result = New-Object PSObject -Property @{
                Disk_Object = $Az_Disk_In_Subscription_Unattached
                Billing_Object = $null
                Subscription_Name = $Az_Subscription.Name
                Subscription_ID = $Az_Subscription.Id
                Disk_Resource_Group_Name = $Az_Disk_In_Subscription_Unattached.ResourceGroupName
                Disk_Name = $Az_Disk_In_Subscription_Unattached.Name
                Disk_Cost_PreTaxCost = $null
                Disk_Cost_Currency = $null
                }

            If ($null -ne $Az_Disk_Consumption_Usage_Details)
                {
                ###################################################
                #Now let's return the details
                Write-Host "We found usage details for disk named ""$($Az_Disk_In_Subscription_Unattached.Name)"""

                $Result.Billing_Object = $Az_Disk_Consumption_Usage_Details
                $Result.Disk_Cost_PreTaxCost = $Az_Disk_Consumption_Usage_Details | Where-Object {$_.InstanceId -eq $Az_Disk_In_Subscription_Unattached.Id} | Measure-Object -Sum -Property Pretaxcost | Select-Object -ExpandProperty sum
                $Result.Disk_Cost_Currency = $Az_Disk_Consumption_Usage_Details | Select-Object -First 1 | Select-Object -ExpandProperty Currency
                }
            else 
                {
                Write-Host "We did NOT find usage details for disk named ""$($Az_Disk_In_Subscription_Unattached.Name)""" -ForegroundColor Yellow
                }
            
            ###################################################
            #Return result
            $Result
            }
        }
    else 
        {
        Write-Host "No unattatched disks in subscription ""$($Az_Subscription.Name)!""" -ForegroundColor Green
        }
    }

```
