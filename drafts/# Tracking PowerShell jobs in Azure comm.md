# Tracking PowerShell jobs in Azure commands

One of the things I've learned in admministring Azure, is singular tasks can take a long time.  When using the web GUI, it's not a big deal.  Simply fireup a new tab, while the task runs in the background.

However, what do you do when you're in PowerShell?  Something as simple as shutting down a VM, can sometimes take 5 - 15 minutes.  Your console is locked during that time.  You could fireup another Powershell session, but that's far more time consuming than opening a new tab.  You could also bundle all your modifacations and setups in an Azure Resource Manager Template, but that's far more complex (even if it's the right thing to do).

Some of you already know, a lot of Azure commands have a parameter called "AsJob".  It works great.  When you're exectuing a long running command and don't want to wait, simply add that tab on at the end.  The Azure command will automatically create a PowerShell job, and run that command in the background.  This allows your script to move on to the next action, or allows you the admin to move on to administering something else.

What's the problem them?  Well, I've discovered, that not all commands display any kind of useful information in the job name.  It's simpale "long running job" or something like that.  While it's great that you can parallize your tasks, there's no way of knowing which taks failed, or even which output is from which job.

This got me to thinking, because I really like using that parameter for certain tasks, but I wanted to be able to know the state of something in a more frinedly way.  The easy answer for me, was to create a PowerShell object and track job id so I could refreence it later.

The real question for me was, do I use a hash table or an array list?  Very recently, I've started messing around with hash tables.  Given the job id was an easy "key" and the description made a perfect "value", I figured a hash table would be a quick way to get what I needed with the least amount of code.

The simplicity of a hash table, is that I didn't need to mess with filtering or searching like I would in an array.  I would simply make the job id number the key, and the frinedly description the value.  This way, when looking up job number 24, all I had to do was a simple

```PowerShell
$Hash_Table.JobIDNumber
```

and I would get back the value.  In my case the value is a simple description, but if needed, you could easily create a custom object and store that as the value.

