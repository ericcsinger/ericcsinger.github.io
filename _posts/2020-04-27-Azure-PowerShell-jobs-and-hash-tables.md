---
title: Azure, PowerShell jobs, and hash tables
date: '2020-04-27T18:30:00+00:00'
permalink: /Azure-PowerShell-jobs-and-hash-tables
author: 'Eric C. Singer'
type: post
---

# Azure, PowerShell jobs, and hash tables

## Introduction
One of the things I've learned in administering Azure, is singular tasks can take a long time.  When using the web GUI, it's not a big deal.  Start a new tab, while the task runs in the background.

What do you do when you're in PowerShell?  Something as simple as shutting down a VM, can sometimes take 5 - 15 minutes.  Your console is locked during that time.  You could start another Powershell session, but that's a pain.  There is of course Azure Resource Manager Templates, but they're complex for a lot of folks.

Some of you already know, a lot of Azure commands have a parameter called "AsJob".  It works great.  When you're executing a long running command and don't want to wait, add that parameter on at the end.  The Azure command will create a PowerShell job, and run that command in the background.  Thus allowing you, or your script, to move forward.

## The Problem

What's the problem then?  Well, I've discovered, that not all commands display any kind of useful information in the job name.  It's typically named something like "long running job".  The problem, is identifying what that job is.

## The Solution

How do we solve this then?  Well, I came up with the idea of creating a PowerShell object to store job details.

The real question for me was, do I use a hash table or an arraylist?  Very recently, I've started messing around with hash tables.  Given the job id was an easy "key" and the description made a perfect "value", I figured a hash table would best solution.

The simplicity of a hash table, is that I didn't need to mess with filtering or searching like I would in an array.  I would simply make the job id number the key, and the friendly description the value.  This way, when looking up job number 24, all I had to do was a simple...

```PowerShell
$Hash_Table.JobIDNumber
```

...and I would get back the value.  In my case the value is a simple description.   If needed, you could create a custom object and store that as the value.

>
> [Here](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_hash_tables?view=powershell-7) is a helpful link on working with PowerShell hash tables.
>

### How To

I always like to start my variables by null'ing them out.  Then I'll create a blank hash table, since we'll be adding to this as we loop through.  Null'ing out the hash table insures that you start with clean results.  I also like to clear out any jobs that may have run previously.  I keep my PowerShell console open for weeks at a time, so there's a lot of opportunity for stale jobs.

```PowerShell
#Clear any jobs
Get-Job | Remove-Job

#Clear the hash table
$Hash_Table = $NULL

#Create the blank hash table.  Technically this should mitigate the need for null'ing it out, but call me paranoid I guess.
$Hash_Table = @{}
```

Alright, we've got a clean hash table, now let's do a simple add to see how it works.

```PowerShell
#Adding a simple key / value pair
$Hash_Table.Add("MyKey", "My super helpful value")
```

When you hit the 'ol enter key, you're not going to see a responce of any sort.  However, if we do something like

```PowerShell
#See EVERYTHING in the hash table
$Hash_Table
```
...you will get back something that should look like this.

---

| Name | Value |
| ----------- | ----------- |
| MyKey | My super helpful value |

---

If we run the following...

```PowerShell
#See just the value for the MyKey entry
$Hash_Table.MyKey
```
...the value of "My super helpful value" will be returned

Now let's pull this into Azure so we can see how it would be of value (pun intended). 

```PowerShell
#Clear any jobs
Get-Job | Remove-Job

#Clear the hash table
$Hash_Table = $NULL

#Create the blank hash table.  Technically this should mitigate the need for null'ing it out, but call me paranoid I guess.
$Hash_Table = @{}

#Create a new Azure VM as a job
$Job = New-AzVM -ResourceGroupName $vm_resourcegroup_name -Location $vm_location -VM $vm -Zone $vm_zone -AsJob

#Add the result to a hash table
$Hash_Table.Add($Job.ID, "Deploying $($vm.name)")
```

Now if we want to check the status of the job, we can simple do something like this.

```PowerShell
#Get all jobs
$All_Jobs = Get-job

#Loop through each job you created
Foreach ($Job in $All_Jobs)
    {
    Write-host "Job ID: $($Job.ID) | Job Description: $($Hash_Table.$($Job.ID)) | Job State: $($Job.State)"
    }

```

And that in my simple example, returns the following.

```
Job ID: 3 | Job Description: Deploying blah blah blah | Job State: Completed
```

## Conclusion

You'll now be able to identify which job ID maps to which command and what the state is.  You can then use this hash table for further automation.

