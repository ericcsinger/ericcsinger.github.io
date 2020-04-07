---
title: 'Backup Storage Part 5: Realization of a failure'
date: '2015-10-20T22:27:15+00:00'
status: publish
permalink: /backup-storage-part-5-realization-of-a-failure
author: 'Eric Singer'
excerpt: ''
type: post
id: 123
category:
    - Uncategorized
tag:
    - backup
    - 'storage spaces'
post_format: []
---
No one likes admitting they’re wrong, and I’m certainly no different. Being a mature person means being able to admit you’re wrong, even if it means doing it publicly, and that is what I’m about to do.

I’ve been writing this series slowly over the past few months, and during that time, I’ve noticed an increasing number of instances where my storage space virtual disks NTFS would go corrupt. Basically, I’d see Veeam errors writing to our repository, and when investigating, I would find files not deleting (old VBK’s). When trying to manually delete them, they would either throw some error, or they would act like they were deleted (they’d disappear), but then return only a second later. The only way to fix this (temporarily) was to do a check disk, which requires taking the disk offline. When you have a number of backup jobs going at anytime, this means something is going to crash, and it was my luck that it was always in middle of a 4TB+ VM.

Basically what I’m saying, that as of this date, I can no longer recommend NTFS running on Storage Spaces. At least not on bare metal HW. My best guess is we were suffering from bit rot, but who knows since storage spaces / NTFS can’t tell me otherwise, or at least I don’t know how to figure it out.

All that said, I suspect I wouldn’t have run into these issues had I been running ReFS. ReFS has online scrubbing, and its looking for things like failed CRC checks (and auto repairs them) . At this point, I’m burnt out on running storage spaces, so I’m not going to even attempt to try ReFS. Enough v1 product evals in prod for me :-).

Fortunately I knew this might not have worked out, so my back out plan is to take the same disks / JBODS and attach them to a few RAID cards. Not exactly thrilled about it, but hopefully it will bring a bit more consistency / reliability back to my backup environment. Long term I’m looking at getting a SAN implemented for this, but thats for a later time.

Its a shame as I really had high hopes for storage spaces, but like many MS products, I should have known better than to go with their v1 release. At least it was only backup’s and not prod…

Update (09/13/2016):
====================

I wanted to add it bit more information. At this point it’s theory, but just incase this article is or is not dissuading you from doing storage spaces, it’s worth noting some additional information.

We had two NTFS volumes, each being 100TB in size. One for Veeam and one for our SQL backup data. We never had problems with the SQL backup volume (probably luck), but the Veeam volume certainly had issues. Anyway, after tearing it all down, I was still bugged about the issue, kind of felt really disappointed about the whole thing. In some random google, I stumbled across [this](https://blog.workinghardinit.work/2012/10/22/windows-server-2012-64tb-volumes-and-the-new-check-disk-approach/) link going over some of NTFS’s practical maximums. In theory at least, we went over the tested (recommended) max volume size. Again, I’m not one to hide things and I fess up when I screw up. Some of the storage spaces issues may have been related to us exceeding the recommended size, and NTFS couldn’t proactively fix things in the background. I don’t know for sure, and I really don’t have the appetite to try it again. I know it sounds crazy to have a 100TB volume, but we had 80TB of data stored in there. In other words, most smaller companies don’t hit that size limit, but we have no problem at all exceeding that. If you’re wondering why we made such a large volume, it really boiled down to wanting to maximize both contiguous space as well as not wasting space. Storage spaces doesn’t let you thin provision storage when its clustered, so if we for example would have created five 20TB LUNS instead, the contiguous space would have been much smaller and ultimately more difficult to manage with Veeam. We don’t have that issue anymore with CommVault as it can deal with lots of smaller volumes with ease.

Anyway, while I would love to say MS shouldn’t let you format a volume larger than what they’ve tested (and they shouldn’t without at least a warning), ultimately the blame falls on me for not digging into this a bit more. Then again, try as I may, I’ve been unable to validate the information posted on the linked blog above. I don’t doubt the accuracy of the information, often I find fellow bloggers do a better job of explaining how to do something or conveying real world limits than the vendor.

Best of luck to you, if you do go forward with storage spaces, and if you do have questions, let me know, I worked with it in production for over a year, at a decent scale.