---
title: 'Powershell Scripting: Invoke-ECSSQLQuery'
date: '2016-07-04T19:13:41+00:00'
status: publish
permalink: /powershell-scripting-invoke-ecssqlquery
author: 'Eric Singer'
excerpt: ''
type: post
id: 317
category:
    - Uncategorized
tag:
    - powershell
    - SQL
post_format: []
---
Quick Powershell post for those of you that may on occasion want to retrieve data out of a SQL table via Powershell. I didn’t personally do most of the heavy lifting in this, I simply took some work that various folks out there did and put it into a repeatable function instead.

Firstly, head over to [here](https://github.com/ericcsinger/Powershell/tree/master/Microsoft/SQL/Invoke-ECSSQLQuery) to my GitHub if you want to grab it. I’ll be keeping it updated as change requests come in, or as I get new ideas, so make sure if you do use my function, that you check back in on occasion for new versions.

The two examples are below:

Syntax example for windows authentication:

> - - - - - -
> 
> Invoke-ECSSQLQuery -DatabaseServer “ServerNameonly or ServerName\\Instance” -DatabaseName “database” -SQLQuery “select column from table where column = ‘3’”
> 
> - - - - - -

Syntax example for SQL authentication:

- - - - - -

> Invoke-ECSSQLQuery -DatabaseServer “ServerNameOnly or ServerName\\Instance” -DatabaseName “database” -SQLUserID “SA” -SQLUserPassword “Password” -SQLQuery “select column from table where column = ‘3’”
> 
> - - - - - -

There is also an optional “timeout” parameter that can be used for really long running queries. By default its 30 seconds, you can set it as high as you want, or specify “0” if you don’t want any timeout.