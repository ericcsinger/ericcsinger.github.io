---
title: 'Powershell Module Release: ECS.WSUS v1.0.0'
date: '2019-03-02T21:21:30+00:00'
status: publish
permalink: /powershell-module-release-ecs-wsus-v1-0-0
author: 'Eric Singer'
excerpt: ''
type: post
id: 681
category:
    - Uncategorized
tag:
    - powershell
    - wsus
post_format: []
---
This is the initial release of my WSUS module. This is a module I put together to properly organize a lot of my one off WSUS functions.

I have found these functions useful for reporting n the status of computers in WSUS in mass. Querying the DB directly, while not recommended, is much faster than using the API, and you can get a lot more information out of it.

Functions released in this module:
----------------------------------

- Connect-ECSWSUSDatabase
- Get-ECSWSUSComputerTarget
- Get-ECSWSUSComputerTargetGroup
- Get-ECSWSUSComputerTargetInTargetGroup
- Get-ECSWSUSComputerTargetReport
- Get-ECSWSUSUpdate
- Test-ECSWSUSDatabaseConnected

You can learn more about the module [here](https://github.com/ericcsinger/ecs.wsus/wiki).