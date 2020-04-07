---
title: 'PSA: VM Backup hot add mode with Nimble NOS 5.x on vVOLs'
date: '2018-08-12T22:49:52+00:00'
status: publish
permalink: /psa-vm-backup-hot-add-mode-with-nimble-nos-5-x-on-vvols
author: 'Eric Singer'
excerpt: ''
type: post
id: 632
category:
    - Uncategorized
tag: []
post_format: []
---
Just a quick pubic service announcement. If you’re on Nimble NOS 5.x and you use vVOL’s and you’re backing up VM’s with a vendor that uses the VDDK API’s, you might want to confirm your VM’s are in fact using hot add mode.

We discovered by happen stance, that after upgrading our Nimble SAN from 4.x to 5.x, that any VM that was on a vVOL on that particular NOS version started failing to attach disks during a backup. This causes the backup mode to revert to NBD. At this stage, it’s unclear if it’s a problem specific with Nimble, VMware or CommVault. What I can say is that I have a case open with both Nimble and CommVault and Nimble has been able to reproduce the issue with CommVault + NOS 5.x. Veeam or other backup vendors have not been tested. This problem does not appear for VM’s on VMFS (5.x at least).