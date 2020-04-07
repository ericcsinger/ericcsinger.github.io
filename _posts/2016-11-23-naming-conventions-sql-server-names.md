---
title: 'Naming Conventions: SQL Server Names'
date: '2016-11-23T00:46:14+00:00'
status: publish
permalink: /naming-conventions-sql-server-names
author: 'Eric Singer'
excerpt: ''
type: post
id: 418
category:
    - 'naming conventions'
tag:
    - 'naming conventions'
    - SQL
post_format: []
---
Introduction:
=============

If you’re working in a Windows environment like me, you have to deal with 15 character limitations (at least if you care about NETBIOS resolution). Honestly, really cramps my style, but these conventions were written with that limitation in mind. If you’re using this for a Linux based server running MySQL or PostgreSQL, you might be able to get a little more detailed.

Multi Environment / Cluster or standalone:
==========================================

At my employer ASI, we have to contend with multiple applications, multiple environments for each application and in a lot of cases clusters. Trying to come up with a name that works for them all can be tough, but I think I’ve got a few good ones depending on your use cases.

Here is an MSSQL server naming convention:
------------------------------------------

### Standalones:

- cmp-sqlps1-01
- cmp-sqlus1-01
- cmp-sqlss1-01
- cmp-sqlds1-01
- cmp-sqlps1-02
- cmp-sqlps2-02
- cmp-sqlus1-02

### Let’s break it down:

- cmp = company. Use whatever prefix you want, doesn’t need to be all letters and doesn’t need to be three, but I wouldn’t go beyond three.
- (\_) underscores = separators
- SQL = SQL server 
  - Next letter = environment 
      - P = Prod
      - U = UAT
      - S = Stage
      - D = Dev
  - Next letter = Clustered or standalone 
      - S = Standalone
      - C = Cluster \*\*\*More on this later
  - Following number = the number of SQL servers for this environment and application. If you have multiple stand alone servers for “app1” this allows you to accommodate them.
- The final number is a number to represent the application. Doesn’t matter what the number is, but once its assigned, your other environments should fall into the same number. I can look at the last number and quickly go “oh that’s app 20”. Ok, maybe not quickly, but its easy enough with a matrix.

You can quickly determine if the servers function, environment, is it a cluster and the apps.

### Clusters:

#### Cluster management resource name

- cmp-sqlpc-01
- cmp-sqluc-01

#### Cluster Node Name:

- cmp-sqlpcn1-01
- cmp-sqlpcn2-01
- cmp-sqlucn1-01
- cmp-sqlucn2-01

#### Cluster application resource name

##### SQL AAG Name / SQL Listener Name

- cmp-sqlpcdg1-01
- cmp-sqlpcdg2-01
- cmp-sqlucdg1-01
- cmp-sqlucdg2-01

##### SQL Traditional Failover Cluster Name

- cmp-sqlpcdi1-01
- cmp-sqlucdi1-01

#### Let’s break it down:

SQL clusters require a lot of computer accounts / names, and having a naming convention helps to keep them grouped and organized.

- CMP-SQLPC = we should already know this based on the previous explanation. This part tells me its a SQL production cluster. 
  - If it goes straight to the application number, that means this is the cluster management resource.
  - If it goes to N1 or N2 = that’s the node of that cluster. N1 = node 1, N2 = Node 2.
  - If it goes dg1 = Database Group 1, or SQL AAG1 and it belongs to this cluster.
  - If it goes DI1 = Database Instance 1, or SQL failover instance 1.
- The following number of course is the application we’re assigning.

Closing:
========

That’s pretty much it, short and sweet. It’s not designed to scale to massive levels, but I think it will work for most environments.

Index:
======

To see other naming conventions or posts about naming conventions, head over [here](http://www.ericcsinger.com/naming-conventions-intoduction/).