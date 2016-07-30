# Interaction

![Interaction Movie](http://samchon.github.io/framework/images/example/interaction/demo.gif)

**Interaction** is an example implemented Tree-structured Distributed & Parallel Processing System
  - Source Code on GitHub
    - [C++](https://github.com/samchon/framework/tree/master/cpp/samchon/example/interaction)
    - [TypeScript](https://github.com/samchon/framework/tree/master/ts/examples/interaction)


## Outline
##### Purpose of Samchon Framework
Principle purpose of protocol module in **Samchon Framework** is to constructing complicate network system easily within framework of *Object Oriented Design*, like designing *classes in S/W*.

Furthermore, Samchon Framework provides a module which can be helpful for building a network system interacting with another external network system and master and slave modules that can realize (tree-structured) parallel (distributed) processing system.

##### Interaction is built for
Interaction is built for provoding a guidance of using *External System* and *Parallel Processing System* modules. Interaction demonstrates how to build complicate network system easily by considering each system as a class of a S/W, within framework of Object-Oriented Design.

##### You can learn
You can learn how to construct a network system interacting with external network system and build (tree-structured) parallel processing systems which are distributing tasks (processes) by segmentation size if you follow the example, interaction.


## System Roles
![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/interaction.png)

### Chief
Chief system manages Master systems. Chief system orders optimization processes to each Master system and get reported the optimization results from those Master systems.

### Master Systems
Master system gets order of optimization with its basic data from Chief system and shifts the responsibility of optimization process to its Slave systems. When the Slave systems report each optimization result, Master system aggregates and deducts the best solution between them, and report the result to the Chief system.

Note that, Master systems get orders from Chief system, however Master is not a client for the Chief system. It's already acts a role of server even for the Chief system.

  - TSP Solver Master
  - Packer Master

### Reporter
Reporter system prints optimization results on screen which are gotten from Chief system

Of course, the optimization results came from Chief system are came from Master systems and even the Master systems also got those optimization results from those own slave systems.

### Packer Mediator
Packer-Mediator system is placed on between Master and Slave systems. It can be a Slave system in Master side, and also can be a Master system for its Slave systems.

Packer-Mediator get orders from Packer-Master, distributes responsiblity of optimization process to its Slave systems. When the Slave systems report each optimization result, Packer-Mediator aggregates and deducts the best solution between them, and report the result to the Packer-Master.

### Slave Systems
Slave gets orders of optimization with its basic data, Slave calculates and find the best optimized solution and report the solution to its Master system

  - TSP #N
  - Packer #N


## Class Diagram
![Class Diagram](http://samchon.github.io/framework/images/design/ts_class_diagram/example_interaction.png)

Reading the class diagram with supported source code, you can find that each network system is represented by a class. Relationship between each system also being expressed by the classes' relationship accurately.

Network systems are correspond with S/W classes 1:1 conceptually. By just concentrating on system relationship and handling them as a S/W object, the extremely compicated network interaction system is easily implemented. It's the most powerful thing of Samchon Framework. Just place yourself on the conception; *within framework of OOD*.