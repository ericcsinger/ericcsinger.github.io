# Azure, PowerShell jobs, and hash tables

One of the things I've learned in admministring Azure, is singular tasks can take a long time.  When using the web GUI, it's not a big deal.  Simply fireup a new tab, while the task runs in the background.

However, what do you do when you're in PowerShell?  Something as simple as shutting down a VM, can sometimes take 5 - 15 minutes.  Your console is locked during that time.  You could fireup another Powershell session, but that's far more time consuming than opening a new tab.  You could also bundle all your modifacations and setups in an Azure Resource Manager Template, but that's far more complex (even if it's the right thing to do).

Some of you already know, a lot of Azure commands have a parameter called "AsJob".  It works great.  When you're exectuing a long running command and don't want to wait, simply add that tab on at the end.  The Azure command will automatically create a PowerShell job, and run that command in the background.  This allows your script to move on to the next action, or allows you the admin to move on to administering something else.

What's the problem them?  Well, I've discovered, that not all commands display any kind of useful information in the job name.  It's simpale "long running job" or something like that.  While it's great that you can parallize your tasks, there's no way of knowing which taks failed, or even which output is from which job.

This got me to thinking, because I really like using that parameter for certain tasks, but I wanted to be able to know the state of something in a more frinedly way.  The easy answer for me, was to create a PowerShell object and track job id so I could refreence it later.

The real question for me was, do I use a hash table or an array list?  Very recently, I've started messing around with hash tables.  Given the job id was an easy "key" and the description made a perfect "value", I figured a hash table would be a quick way to get what I needed with the least amount of code.

The simplicity of a hash table, is that I didn't need to mess with filtering or searching like I would in an array.  I would simply make the job id number the key, and the frinedly description the value.  This way, when looking up job number 24, all I had to do was a simple...

```PowerShell
$Hash_Table.JobIDNumber
```

...and I would get back the value.  In my case the value is a simple description, but if needed, you could easily create a custom object and store that as the value.

Before getting too far a head, let me link the Microsoft article on working with hash tables right [here](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_hash_tables?view=powershell-7).  


I always like to start my variables by null'ing them out.  Then I'll create a blank hash table, since we'll be adding to this as we loop through.  Null'ing out the hash table insures that you start with clean results.  I also like to clear out any jobs that may have run previously.  I keep my PowerShell console open for weeks at a time, so there's a lot of opperunity for stale jobs.

```PowerShell
#Clear any jobs
Get-Job | Remove-Job

#Clear the hash table
$Hash_Table = $NULL

#Create the blank hash table.  Technically this should mitigate the need for null'ing it out, but call me paranoid I guess.
$Hash_Table = @{}
```

Alright, we've got a clean hash table, now let's do a simple add just to see how it works.

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

| Name | Value |
| ----------- | ----------- |
| MyKey | My super helpful value |

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
You'll now be able to easily identify which job ID maps to which command and what the state is.  You can then easily use this hash table for further automation.

