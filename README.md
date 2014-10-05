#Peirce Logic
Our idea is to create a cross-platform Existential Graph proof system for doing propositional logic proofs. We were suggested to tackle this type project by Professor [Bram van Heuveln] [bram].

Past attempts at software dealing with Existential Graphs have not proven to be very usable due to poor interface designs. One use for this software is in Introductory Logic classes in order to show other ways of doing proofs apart from traditional methods.

What are existensial graphs?
---
The following is a quick summary of what Existential Graphs are by Bram:
An Existential Graphs is an alternate logic proof system created by Charles Saunders Peirce. An interesting feature of Existential Graphs is that the nature of proofs in a subtly different way as compared to traditional systems. In traditional formal logic, a proof is a sequence of statements, that one writes after (or under) each other. However, in Existential Graphs, all of the inference rules of the system require one to either add or remove parts to or from a single graphical notation. Thus, a proof in Existential Graphs is the successive transformation of one graph, representing the given information, to another, representing the inferred information. Indeed, one transforms, rather than rewrites.
**Crudely put: a proof in Existential Graphs is a movie!**

Try it out
---
Our website is located on [appspot] [appspot]. Note that this site under currently being developed and may of the features may not be available yet.

Contributing
---
We're in the process of linting our code base, make sure you lint any code you commit!

```
git clone git@github.com:CurryBoy/Peirce-Logic.git
cd Peirce-Logic
npm install

# If you don't have grunt
npm install -g grunt-cli

# To run peirce logic on port localhost:8080
grunt

```

License
----
BSD

[bram]:http://homepages.rpi.edu/~heuveb/
[appspot]:http://peirce-logic.appspot.com/
