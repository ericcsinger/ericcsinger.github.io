---
title: 'Thinking out loud: DR is a business problem, not an IT problem.'
date: '2018-09-22T22:02:33+00:00'
status: draft
permalink: '/?p=643'
author: 'Eric Singer'
excerpt: ''
type: post
id: 643
category:
    - Uncategorized
tag: []
post_format: []
---
Before digging into the subject at hand, I want to start this post with a simple statement.

Every single problem a business has, is a business problem. It’s not an IT problem, it’s not an Accounting problem, it’s not a Customer Service problem, it’s a business problem. In the end, a business isn’t too much different than a human body. When my finger gets cut, it’s not a hand problem, when my toe gets stubbed, it’s not a foot problem, when I’m hungry, it’s not a stomach problem, it’s a body problem. Every part of my body is designed to better the whole unit. Yes, you delegate tasks and responsibilities to a given department, but the business lives and dies by each department working towards a common goal.

Disaster Recovery, is a first and foremost a business problem. Presuming that only IT is responsible to solve it, is potentially detrimental to your businesses recoverability. I can kind of see why someone might think it’s an IT problem. After all, we’re the ones you call when you need a new server, need more spaces, need a new account, want something new in general setup. We’re also the ones you call when something breaks, or when something is down, we’re the ones typically bringing it online. Naturally I can see how someone would say, “Well, aren’t you the one that should plan for a failure?” The answer is yes, but also no.

Let’s look at that second paragraph a bit. Except, instead of thinking of IT, let’s think of plumber. When you get a leak, you call the plumber, when you need a new faucet installed, you call the plumber, when you want to redo the bathroom, you call a plumber in. What about when your house is destroyed? Does your plumber setup your new home? The answer of course is no. Do you need a plumber to help setup your new home? Yes, yes you do.

Do you see where I’m going here? The plumber is a vital resource to keeping your home operating well, but the plumber alone is not responsible for the sustainability of your home. The plumber works as part of a team of other skilled workers to help upkeep and in worse case, help rebuild your home. IT, is part of a team. IT, even when it’s the service being sold, is not the business, the business is made up of many departments, as should your disaster recovery plan.

Let’s actually go back to the second paragraph again and look at it from another angle. Who, requested the new account? Who requested the additional space? Who needs the new server? The answer to all these question is usually someone other than IT. Think of it like this, does your average IT department need 8TB’s of file server storage space? Or is it the developer, accountant, picture or video designer, etc. These services are setup and managed by IT, but they’re for the purpose of serving other business units. Ultimately IT isn’t requesting more storage space because we want to say we have a petabyte rack (although, that IS pretty cool), we’re fulfilling a business request.

When looking at disaster recovery, it needs to be driven by the business as a whole, because ultimately disaster recovery is for the purpose of servicing the business. Again, IT doesn’t need to failover systems to a different site, or recover systems in another site, but the business does.

At this point we’ve established a business problem, and to some degree established why it sounds like a business problem, but let’s now go over why it is without question a problem for the business to solve.

Let’s go back to the plumber analogy. We’ve established that the plumber is important, and we’ve established that the plumber is part of a greater team, but we really haven’t provided some examples of what might happen if you leave the plumber in charge.

What if the plumber starts setting up a water heater, when your team really needs the main water line hooked up first? Or what if your plumber runs pipes in an area that the electrician needed to get to first? Maybe the plumber even sets something up, that you didn’t’ even care about in your home? How’s the plumber supposed to know if there’s no plan? Here’s another example, what if the plumber can’t even get the parts they need? Like, the parts are non-existent anymore? They were never told to keep spares around, and now that the house is gone, there’s no way to salvage those parts anymore? The plumber probably warned you, but that’s for a different blog post.

Like the plumber, IT doesn’t know, or shouldn’t be solely in charge of figuring out business dependencies, priorities, or recovery objectives. These things need to be figured out across all business units. IT is part of the business, but IT is not the business. Every department is part of the business. All the departments need to work together if any business what’s a healthy disaster recovery plan.

I didn’t go into things like, DR notifications, team collaboration during a DR, dealing with teams or critical personnel that may be incapacitated, etc. These (and many more) all need to be part of a DR plan as well, and again, these problems should be discussed and organized at the business level.

I could probably write a diatribe on disaster recovery planning. It’s huge subject to dive into, and it’s a problem that many businesses struggle with. I would go so far as saying, DR for many is a journey, not a destination. You’re never going to have a perfect DR plan. Look at Microsoft or AWS, multi-billion dollar companies, all the experts in the world at their disposal, and even they don’t have everything perfect. That’s not an excuse, or a reason to say if they can’t do it, why should we try. It’s to say that it’s going to take a lot of work, and a lot of resources if you truly value recoverability, and that you’re probably not going to get everything right. The first step you should take though, is getting a team together comprised of every business unit, so that as a business, you can solve this complex and important problem.

As a final note, this is just my opinion. I’m not an expert in DR, I’m not an MBA or any of the sort. I get a lot of time to think when I’m driving or doing other mundane tasks, and this is something I wanted to write about for a bit. Hope you found it helpful or enlightening.