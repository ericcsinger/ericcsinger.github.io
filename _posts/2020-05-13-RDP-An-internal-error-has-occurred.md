---
title: 'RDP: An internal error has occurred'
date: '2020-05-13T18:30:00+00:00'
status: publish
permalink: /RDP-An-internal-error-has-occurred
author: 'Eric C. Singer'
excerpt: ''
type: post
tag:
    - remote desktop
    - certificate
    - RDP
    - RDC
post_format: []
---

# RDP: An internal error has occurred

## Problem overview
One of my colleagues hit me up about an issue they were seeing when trying to RDP into a DC.  The error from RDP was "An internal error has occurred".  Totally useful right :-).

We could console in so that was a slight sigh of relief.

## Other symptoms
When I consoled into the system and look at the event logs, the following event entry was created after each RDP attempt.

```
Log Name:      System
Source:        Schannel
Date:          5/11/2020 12:11:39 PM
Event ID:      36870
Task Category: None
Level:         Error
Keywords:      
User:          SYSTEM
Computer:      Blah
Description:
A fatal error occurred when attempting to access the SSL server credential private key. The error code returned from the cryptographic module is 0x8009030D. The internal error state is 10001.
```

## The solution
Googling didn't return a lot, honestly there were so many random answers to each of these event logs.  Some blaming GPO, some totally unrelated to RDP.  

### Deleting the cert
I suspected some sort of certificate issue, so I went ahead and started my research on how to whack the remote desktop cert.  That's what lead me to this [article](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/troubleshoot/rdp-error-general-troubleshooting#check-the-status-of-the-rdp-self-signed-certificate).

### Rename
Of course, after deleting the cert, I was lucky enough NOT to have cert recreated when restarting RDP.  

New error in the system event log was:

```
Log Name:      System
Source:        Microsoft-Windows-TerminalServices-RemoteConnectionManager
Date:          5/11/2020 1:17:46 PM
Event ID:      1057
Task Category: None
Level:         Error
Keywords:      Classic
User:          N/A
Computer:      Blah
Description:
The RD Session Host Server has failed to create a new self signed certificate to be used for RD Session Host Server authentication on SSL connections. The relevant status code was Object already exists.
```

Off to Google again, since this seem to have bene a well-known error, the solution laid out [here](http://windowsrunbook.blogspot.com/2017/07/windows-2012-no-rdp.html), was the final solution.  

I don't want to take traffic away from this person, so follow the link to them for the solution.  I only needed to perform the rename action in that article.  After that, things started back up and were fine.
