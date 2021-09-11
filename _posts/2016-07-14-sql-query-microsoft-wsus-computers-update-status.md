---
title: 'SQL Query: Microsoft – WSUS – Computers Update Status'
date: '2016-07-14T21:43:51+00:00'
status: publish
permalink: /sql-query-microsoft-wsus-computers-update-status
author: 'Eric Singer'
excerpt: ''
type: post
id: 324
category:
    - Uncategorized
tag:
    - SQL
    - T-SQL
    - wsus
post_format: []
---
Sometimes the WSUS console, just doesn’t give you the info you need, or it doesn’t provide it in a format you want. This query is for one of those examples. This query can be used in multiple ways to show the update status of a computer, computers or computer in a computer target. For me, I wanted to see the update status, without worrying about what non-applicable updates were installed. I also, didn’t care about updates that I didn’t approve, which was another reason I wrote this query.

First off, the query is located [here](https://github.com/ericcsinger/SQL/blob/master/Microsoft/Windows%20System%20Update%20Services%20(WSUS)/Computer%20Update%20Status/Computer%20Update%20Status.sql) on my GitHub page. As time allows, I plan to update the read me on that section with more filters as I confirm how accurate they are and what value they may have.

All of the magic in this query is in the “where statement”. That will determine which updates you’re concerned about, which computers, which computer target groups, etc.

To begin with, even with lots of specifics in the “where statement”, this is a heavy query. I would suggest starting with a report about your PC or a specific PC, before using this to run a full report. It can easily take in excess of 30 minutes to an hour to run this report if you do NOT use any filters, and you have a reasonably large WSUS environment. It’s also worth noting, in my own messing around, I’ve easily run out of memory / temp db space (over 25GB of tempdb). It has the potential to beat the crap out of your SQL DB server, so proceed with caution. My WSUS DB is on a fairly fast shared SQL server, so your mileage may vary.

Let’s go over a few way’s to filter data. First, the computer name column would be best served by using a wildcard (“%” not “\*”) at the end of the computer name. Unless you’re going to use the FQDN of the computer name. In other words, use ‘computername%” or ‘computername.domain.com’

Right now, I’m only showing updates that are approved to be installed. That is accomplished by the Where Action = ‘Install’ statement.

The “state” column is one that can quickly let you get down to the the update status you care about. In the case of the one below, we’re showing the update status for a computer called “computername”, but not showing non-applicable updates.

- - - - - -

> Where Action = ‘Install’ and \[SUSDB\].\[PUBLIC\_VIEWS\].\[vComputerTarget\].\[Name\] like ‘computername%’ and **state != 1**

- - - - - -

if we only wanted to see which updates were not installed, all we’d need to do is the following. By adding “state !=4” we’re saying only show updates that are applicable, and not currently installed.

- - - - - -

> Where Action = ‘Install’ and \[SUSDB\].\[PUBLIC\_VIEWS\].\[vComputerTarget\].\[Name\] like ‘computername%’ and state != 1 and **state != 4**

- - - - - -

If you want to see the complete update status of a computer, excluding only the non-applicable updates, this will do the trick. That said, its a BIG query and take a long time. As in, go get some coffee, chat with your buds and maybe play a round of golf. You might run out of memory too with this query depending on your SQL server. In case you didn’t notice, I took out the “where Action = ‘Install'”. As in show me any update that’s applicable, with any status, and any approval setting.

- - - - - -

> Where **<del>‘Install’ and</del>** \[SUSDB\].\[PUBLIC\_VIEWS\].\[vComputerTarget\].\[Name\] like ‘pc-2158%’ and state != 1

- - - - - -

Play around your self and I think you’ll see it’s pretty amazing all the different reports your can create. I would love to say the WSUS DB was easy to read / figure out, but IMO, its probably one of the more challenging DB’s I’ve figured out. There are sometimes multiple joins needed in order to link together data that you’d think would have been in a flat table. I suspect that, combined with missing indexes is part of the reason the DB is so slow. I wish MS would simplify this DB, but I’m sure there’as a reason its designed the way it is.