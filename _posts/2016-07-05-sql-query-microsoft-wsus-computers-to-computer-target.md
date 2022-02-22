---
title: 'SQL Query: Microsoft &#8211; WSUS &#8211; Computers to Computer Target'
date: '2016-07-05T16:54:36+00:00'
status: publish
permalink: /sql-query-microsoft-wsus-computers-to-computer-target
author: 'Eric Singer'
excerpt: ''
type: post
id: 321
category:
    - Uncategorized
tag:
    - SQL
    - T-SQL
    - wsus
post_format: []
---
This is a simple query you can use map your computers to their various targets in a nice easy to export table. I’d love to say the script is sexier than that, but its really not. You can find the sql query [here](https://github.com/ericcsinger/SQL/blob/master/Microsoft/Windows%20System%20Update%20Services%20(WSUS)/Computer%20to%20Computer%20Target/Computers%20to%20Computer%20Target.SQL).

There is only one section worth mentioning because it can change the way a computer is mapped to a computer target.

- - - - - -

> <div class="main-content"><div><div data-pjax-container="" id="js-repo-pjax-container"><div class="container new-discussion-timeline experiment-repo-nav"><div class="repository-content"><div class="file"><div class="blob-wrapper data type-sql"><table class="highlight tab-size js-file-line-container" data-tab-size="8"><tbody><tr><td class="blob-code blob-code-inner js-file-line" id="LC35"><span class="pl-k">Where</span> \[SUSDB\].\[dbo\].\[tbExpandedTargetInTargetGroup\].\[IsExplicitMember\] <span class="pl-k">=</span> <span class="pl-c1">1</span></td></tr></tbody></table>
> 
> </div></div></div></div></div></div></div>

<div class="container site-footer-container">- - - - - -

By default, my query returns the computer target location based on the child object. If you were to change that value from a 1 to a 0, it would show you the computers parent computer target instead. May or may not be of interest to you.

</div>