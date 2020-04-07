---
title: 'Thinking out loud: CLI vs. GUI, a pointless debate'
date: '2015-04-11T21:57:39+00:00'
status: publish
permalink: /thinking-out-loud-cli-vs-gui-a-pointless-debate
author: 'Eric Singer'
excerpt: ''
type: post
id: 16
category:
    - 'thinking out loud'
tag: []
post_format: []
---
I see this come up occasionally and I really don’t get why its always an “x is better than y”. A lot of times folks are talking about what works best for them in <span style="text-decoration: underline;">their</span> world, and for all intents and purposes stating that if its best for them, its best for all. I’d like to challenge this reasoning and also challenge the notion that both a CLI and GUI have their place.

**The GUI: It’s pretty and functional**

I’m not sure where all this hate on GUI’s comes from, but I can tell you that it stereotypically comes from either the \*NIX or network engineer crowds. Thinking about a GUI from <span style="text-decoration: underline;">their</span> point of view, I can completely understand why they’re not huge fans of a GUI. The folks in these crowds spend most of their day buried in a CLI, for the simple reason that no GOOD GUI exists for most of what they’re doing. KDE? GNOME? some crappy web interface (this ones a toss up on depending on who’s interface)? I wouldn’t want to live day in and day out with half of the GUI’s they’re using either. So what’s the problem with their GUI’s?

- In my admittedly limited experience with Linux GUI’s, most of them offer limited functionally. They can do the basics, but when you really want to get in and configure something, it almost always leads to firing up a console. If everything in your ecosystem relies on you ending up in the CLI, pretty soon, you’re going to skip the GUI. Even with Apple’s OS-X I’ve found this to be the case. I wanted to change my mouse wheel’s scrolling direction, that required going into the CLI (seriously).
- Their GUI’s are not always intuitive, and honestly this is supposed to be one of the value adds of a good GUI.
- Their GUI’s sometimes implement sloppy / bad configurations. One area I recall hearing this a lot with is the Cisco ASA, but i’m sure this occurs on more solutions than Cisco’s firewalls.
- Not so much a problem of their GUI, but there’s just a negative stigma with anyone in these crowds using a GUI. To paraphrase, if use a GUI, you’re not a good/real admin (load of crap BTW).
- Again, not so much a problem of the GUI, but likely do to the above statement, there really isn’t a lot of “how to’s” for using a GUI. You ultimately end up firing up the CLI, because that’s the way things are documented.
- A lot of GUI’s don’t do bulk or automated administration well. I think this is pretty true across the board. That said, I have used purpose built automation tools, but they were for very specific use cases. 98% of the time, I go to a CLI for automation / bulk tasks.
- Depending on the task you’re doing, GUI’s can be slower IF you’re familiar with the CLI (commands and proper syntax).

Clearly there’s a lot of cons for the GUI, but I think a lot of them tend to pertain more to \*NIX and network engineers. its not that a GUI by nature is bad, its just that <span style="text-decoration: underline;">their</span> GUI is bad. Incase you haven’t guessed, I’m a Windows admin, and with that, I enjoy an OS that was specifically designed with a great GUI in mind (even windows 8 / 2012). This is really the key, if the GUI is good, then your desire to use a GUI instead of the CLI will be increased. We went over what the problems are with a GUI, so why not go over what’s good about a GOOD GUI?

- They’re easy and intuitive to use.
- They present data in a way thats easier to analyze visually. This is important and I really think its overlooked a lot of times. Sure you CAN analyze data in the CLI, but the term “a picture is worth a thousand words” isn’t a hollow phrase.
- When they’re designed well, single task items (non-bulk) are quick and easy. its debatable whether a CLI is quicker and there are A LOT of factors that go into that.
- GUI’s by nature allow multi-tasking. Now I get that you can technically have multiple putty windows open (thats a GUI BTW), but its not quit the same as an application interactively speaking.
- They’re pretty. I know that’s not exactly a great reason, but let’s all be honest, a pretty GUI is a lot nicer than a cold dark CLI.
- Options and parameters tend to be fully displayed making it easier to see all the possible options and requirements. (I know Powershell ISE now offers this, very sweet.)
- Some newer GUI’s like MS’s SQL and Exchange management consoles even show you the CLI commands so you can use it as a foundation for scripts. Meaning, GUI’s can help you to learn the CLI.
- Certain highly complex tasks are simplified by using a GUI. Things that may have taken multiple commands or digging deep into an object can be accomplished with a few clicks.

**The CLI: Lean, mean automation machine**

Like I said, I’m a Windows guy, but at the same time, I have a healthy appreciation and love for the CLI. I’m lazy by nature, and HATE routine tasks. Speaking of hate, I see a lot of windows admins dolling out their equal amount of hate on the CLI, or more specifically being forced into Powershell. I get it, after all, it wasn’t until Powershell came out, that Microsoft actually had a decent CLI / Scripting language. There was vbscript, it worked, but man was it a lot of work (and not really interactive). None the less, Powershell has been out for what’s got to be close to ten years now and there’s still pushback from some of the windows crowd. There’s no need for the resistance (its futile), your life will be better with a CLI, AND the GUI you know and love. So let’s go into why you’re still not using a CLI, and why its all a bunch of nonsense.. Also, this is going to be targeted at windows admins mostly and windows admins that are still avoiding the CLI. Its kind of redundant to go over the pros / cons of CLI because they’re mostly the inverse of what I mentioned about a GUI.

- *Its a PITA to learn and a GUI is easy, or at least that’s what you tell yourself.* The reality, Powershell is EASY to use and learn.
- *You don’t have time to learn how to script. After all, you could spend 30 minutes clicking, or spend 4 hours trying to write a script.* Sure, the first time you attempt to write a new script, it might take you 16 hours, but the second script might take you 4 hours, and the third script might take you 5 minutes. The more you familiarize yourself with all the syntax, commands, functions, methods, etc. the easier it will be to solve the next problem.
- *You’re afraid that your script might purge 500 mailboxes in a single key tap.* This is absolutely a possibility, and you know what, mistakes happen (even GOOD admins make really dumb mistakes). But that’s why you start out small, and learn how to target. That’s also why you have backup’s 🙂
- *Your afraid, you’ll automate yourself out of a job.* That’s not likely to happen. Someone still needs to maintain the automation logic (its never perfect, OR things change), and it frees you up to do more interesting (fun) things.
- Once you learn one CLI, a lot of its transferable to other CLI’s. For me, going from Powershell to T-SQL was actually pretty easy. I’m not a pro with T-SQL, but a lot of the concepts were similar. I also found that as I learned how to do things in T-SQL, it helped me with other problems in Powershell (see how that works). I don’t have a lot of experience with \*NIX CLI’s, but I’d be willing to bet I could figure it out.

I probably did a bad job of being non-biased, but I really did try. I truly see a place for both administration methods in IT and I hope you do to.