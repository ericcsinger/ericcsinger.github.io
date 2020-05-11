# Does AD need a load balancer?

## Introduction
There are a lot of best practices that have been around for years when it comes to your Active Directory design.  One of the biggest things I've read over and over, is that Active Directory is natively redudant and doesn't need a load balancer.  

In my experience, I've found that statement to be true only in it's most purest sense.  Microsoft tends to live in this bubble of perfect circumstances.  In that bubble of perfect circumstances, where every vendor and every company implments reccomended practices.

I would contend that while your environment will probably work fine most of the time without a load balancer.  Having a load balancer in front of certain Active Directory services will simply make your life easier.

## What services benift?

### LDAP(s)
Here's the deal.  Microsoft would like you to tell every vendor that doesn't support LDAP redirection, refferals, whatever you want to call it, to get lost.  This is that whole bubble thing I was mentioning above.  We've all dealt with vendors that have implmented protocols in half baked ways. LDAP is one of those.  In a perfect world, you'd point your LDAP client at %Domain_Name% and it would know how to identify what site it's in, what LDAP servers are in that site, and ultimately if the LDAP servers are avaialble.  

What's more likely to happen, is you'll point your LDAP client at %Domain_Name% and you'll end up with a LDAP requests going to to a DC in a far away galaxy.  Setting up a load balancer is a great way to nip this in the bud.
