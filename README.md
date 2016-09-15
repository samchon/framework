# Samchon Framework

[![NPM](https://nodei.co/npm/samchon-framework.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/samchon-framework)

GitHub Repository: https://github.com/samchon/framework

## Introduction
#### Samchon Framework is
Samchon framework is an **OON**<sup id="a_oon">[1](#f_oon)</sup> framework; who can build network system within framework of **OOD**<sup id="a_ood">[2](#f_ood)</sup>, like *cloud system* and *distributed* & *parallel processing systems*, even how the system is enormously complicate.

Samchon Framework supports two languages; **C++** and **TypeScript/NodeJs**. Not only connecting to an external server, but also opening a server is also possible both in *C++* and *TypeScript/NodeJS*. In my case, I prefer to build a cloud server with *TypeScript & NodeJS* quickly. When the cloud server grows up and lots of traffic occurs, I let the cloud server to deliver heavy processes to Distributed systems built via *C++*.

[![Supported Languages Diagram](http://samchon.github.io/framework/images/accessory/language_diagram.png)](#interaction)

#### What can we do
  1. Build [Cloud Server](https://github.com/samchon/framework/wiki/Conception-Modules-Service)
  2. Integrate systems with standard ~
    - Message protocol: [Invoke](https://github.com/samchon/framework/wiki/Conception-Message_Protocol#invoke)
    - Data expression method: [Entity](https://github.com/samchon/framework/wiki/Conception-Message_Protocol#entity)
  3. Construct complicate network system
    - Like
      - Interaction with [External Systems](https://github.com/samchon/framework/wiki/Conception-External_System)
      - (Tree-structured) [Parallel Processing System](https://github.com/samchon/framework/wiki/Conception-Parallel_System)
      - (Tree-structured) [Distributed Processing System](https://github.com/samchon/framework/wiki/Conception-Distributed_System)
    - Easily within framework of OOD<sup>[2](#f_ood)</sup>, by considering a system as a object (class), via [Basic Components](https://github.com/samchon/framework/wiki/Conception-Modules-Basic_Components)
  4. Utilize libraries independent on operating systems
    - Enable to cross-compile

![Interaction Movie](http://samchon.github.io/framework/images/example/interaction/demo.gif?ver=2)


## References
#### API Documents
  - [C++ API Documents](http://samchon.github.io/framework/api/cpp)
  - [TypeScript API Documents](http://samchon.github.io/framework/api/ts)
  - ~~[Flex API Documents](http://samchon.github.io/framework/api/flex)~~

#### Architecture Designs
  - [C++ Class Diagram](http://samchon.github.io/framework/design/cpp_class_diagram.pdf)
  - [TypeScript Class Diagram](http://samchon.github.io/framework/design/ts_class_diagram.pdf)
  - [Sequence Diagram](http://samchon.github.io/framework/design/sequence_diagram.pdf)

#### Guide Documents
Samchon Framework provides guide documents in [Wiki Page](https://github.com/samchon/framework/wiki)

The contents in the guide documents are such below:
  1. [Outline](https://github.com/samchon/framework/wiki/Home)
  2. [C++](https://github.com/samchon/framework/wiki/CPP)
  3. [TypeScript](https://github.com/samchon/framework/wiki/TypeScript)
  4. [Example Projects](https://github.com/samchon/framework/wiki/Examples)


## License
#### BSD License
*Samchon Framework* follows [BSD-3-Clause](http://spdx.org/licenses/BSD-3-Clause) license.

#### Dependencies
- C++
  - [Boost.Asio](http://www.boost.org/doc/libs/1_61_0/doc/html/boost_asio.html)
  - [ODBC](https://support.microsoft.com/en-us/kb/110093)
- TypeScript
  - [TypeScript-STL](https://github.com/samchon/typescript-stl)
  - [WebSocket](https://github.com/theturtle32/WebSocket-Node)


## Installation
#### C++
Samchon Framework has two dependencies in C++, **Boost libraries** and **ODBC**.
  - Install **Boost libraries** and enroll path of the *Boost libraries* in **environment variable's PATH**.
  - Install **ODBC** and enroll path of the *ODBC* in **environment variable's PATH**.

After installation and configuration of those dependencies, download or fork this repository. And follow those steps:
  * Go to the path *./cpp/samchon*.
  * Compile all *cpp* files.

#### TypeScript (NodeJS)
Installing *Samchon-Framework* in **NodeJS** is very easy. Just install with **npm**.
```bash
# Install Samchon-Framework from NPM modules
npm install -g samchon-framework

# Fetch definition (header) file from TSD
# If TSD is not installed, then type "npm install -g tsd"
tsd install samchon-framework
```

When importing *Samchon Framework*, don't forget to referencing the header file ```samchon-framework.d.ts```
```typescript
/// <reference path="typings/samchon-framework/samchon-framework.d.ts" />
import samchon = require("samchon-framework");
```

##### TypeScript (Browser)
*Samchon Framework* follows **commonjs** module. Thus, you can't use ~~RequireJS~~. However, using **Browserify** is possible.

If you want to include directly without the *Browserify*, then you've to include **TypeScript-STL** first and Samchon-Framework laster.

```javascript
<head>
	<title> Samchon-Framework requires TypeScript-STL </title>
	<script src="include/typescript-stl.js"></script> <!-- MUST BE INCLUDED FIRST -->
	<script src="include/samchon-framework.js"></script> <!-- MUST BE INCLUDED AFTER TYPESCRIPT-STL -->
</head>
```

-------------------------------

<b id="f_oon">[[1]](#a_oon)</b> Object-Oriented Network <br />
<b id="f_ood">[[2]](#f_ood)</b> Object-Oriented Design
