# External System
Module *External System* provides interfaces for interaction with external network systems.

## References
### Conceptual Diagram
![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/external_system.png)

### Class Diagram
![Protocol - External System](http://samchon.github.io/framework/images/design/ts_class_diagram/templates_external_system.png)

### API Documents
  - [**ExternalSystemArray**](http://samchon.github.io/framework/api/ts/classes/samchon.templates.external.externalsystemarray.html)
    - *Derived classes*
      - [ExternalClientArray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.external.externalclientarray.html)
      - [ExternalServerArray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.external.externalserverarray.html)
      - [ExternalServerClientArray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.external.externalserverclientarray.html)
    - *Interfaces*
      - [IExternalClientArray](http://samchon.github.io/framework/api/ts/interfaces/samchon.templates.external.iexternalclientarray.html)
      - [IExternalServerArray](http://samchon.github.io/framework/api/ts/interfaces/samchon.templates.external.iexternalserverarray.html)
  - [**ExternalSystem**](http://samchon.github.io/framework/api/ts/classes/samchon.templates.external.externalsystem.html)
    - [IExternalServer](http://samchon.github.io/framework/api/ts/interfaces/samchon.templates.external.iexternalserver.htm)
    - [ExternalServer](http://samchon.github.io/framework/api/ts/classes/samchon.templates.external.externalserver.html)
  - [**ExternalSystemRole**](http://samchon.github.io/framework/api/ts/classes/samchon.templates.external.externalsystemrole.html)

### Source Codes
  - [**ExternalSystemArray.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/external/ExternalSystemArray.ts)
    - [ExternalClientArray.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/external/ExternalClientArray.ts)
    - [ExternalServerArray.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/external/ExternalServerArray.ts)
    - [ExternalServerClientArray.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/external/ExternalServerClientArray.ts)
  - [**ExternalSystem.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/external/ExternalSystem.ts)
    - [ExternalServer.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/external/ExternalServer.ts)
  - [**ExternalSystemRole.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/external/ExternalSystemRole.ts)

## Basic Classes
### ExternalSystemArray
An array and manager of external system drivers, [ExternalSystem](#externalsystem) objects.

**ExternalSystemArray** is an abstract class contains and manages external system drivers, [ExternalSystem](#externalsystem) objects. Within framework of network, then **ExternalSystemArray** represents your system and [ExternalSystem](#externalsystem) objects represent external system connected with yours. 

You can specify this **ExternalSystemArray** object to be *a server accepting external client*s or *a client connecting to external servers*. Even *both of them* is also possible.

  - [ExternalClientArray](#externalclientarray): A server accepting external clients
  - [ExternalServerArray](#externalserverarray): A client connecting to external servers
  - [ExternalServerClientArray](#externalserverclientarray): Both of them; Accepts external clients and connects to external servers at the same time.

### ExternalSystem
An external system driver.

The **ExternalSystem** class represents an external system, connected and interact with this sytem. **ExternalSystem** also takes full charge of network communication with the external system has connected. However, handling [Invoke messages](TypeScript-Protocol-Standard_Message#invoke) in **ExternalSystem** is not recommended. Replied [Invoke message](TypeScript-Protocol-Standard_Message#invoke) from the external system is shifted to and processed in children elements of this class, [ExternalSystemRole](#externalsystemrole) objects.

```typescript
namespace samchon.protocol.external
{
	class ExternalSystem 
		extends protocol.EntityDeque<ExternalSystemRole> 
		implements protocol.IProtocol
	{
		// EXTERNAL_SYSTEM HAS COMMUNICATOR
		private communicator_: protocol.ICommunicator;
		
		public replyData(invoke: protocol.Invoke): void
		{
			// HANDLING REPLIED MESSAGE, IT IS NOT HANDLED IN EXTERNAL_SYSTEM
			// THE INVOKE MESSAGE WILL SHIFTED TO EXTERNAL_SYSTEM_ROLE OBJECTS
			// AND THEY WILL PROCESS THE INVOKE MESSAGE
			for (let i: number = 0; i < this.size(); i++)
				this.at(i).replyData(invoke);
		}
	}
}
```

### ExternalSystemRole
A role belonged to an external system.

The **ExternalSystemRole** class represents a role, what to do. Extends this class and defines methods handling [Invoke message](TypeScript-Protocol-Standard_Message#invoke), which are related the specified role, what to do.

**ExternalSystemRole** can be a *Logical Proxy* for an [ExternalSystem](#externalsystem) which is containing the **ExternalSystemRole**. Of course, the **ExternalSystemRole** is belonged to an [ExternalSystem](#externalsystem). However, if you access an **ExternalSystemRole** from an [ExternalSystemArray](#externalsystemarray) directly, not passing by a belonged [ExternalSystem](#externalsystem), and send an [Invoke message](TypeScript-Protocol-Standard_Message#invoke) even you're not knowing which [ExternalSystem](#externalsystem) is related in, the **ExternalSystemRole** acted a role of proxy.

With the *Logical Proxy*, you can only concentrate on **ExternalSystemRole** itself, what to do with [Invoke messages](TypeScript-Protocol-Standard_Message#invoke), irrespective of the **ExternalSystemRole** is belonged to which [ExternalSystem](#externalsystem) object. Those pattern is called *Proxy Pattern*.

```typescript
/// <reference types="samchon-framework.d.ts" />

import samchon = require("samchon-framework");
import protocol = samchon.protocol;
import external = samchon.templates,external;

//--------
// MANAGER OF EXTERNAL FILE SERVERS' DRIVERS
//--------
var file_servers: external.ExternalSystemArray;

var png_data: Uint8Array; // DATA TO SAVE
var invoke: protocol.Invoke = new protocol.Invoke("save", "my_picture", "png", png_data); 
	// MESSAGE TO SEND

//--------
// YOU CAN SEND AN INVOKE MESSAGE WITHOUT SPECIFYING TARGET SYSTEM
// THE ExternalSystemRole OBJECT WILL ACT A ROLE NAMED "PROXY"
//--------
file_servers.getRole("image").sendData(invoke);
```

#### Proxy Pattern
The [ExternalSystemArray](##externalsystemarray) class can use the *Proxy Pattern*. In framework within developer, which external system is being connected or which external system can do something, it's not important. Only interested in developer's perspective is which can be done. Another word: 
  - Developer doesn't interested in which [ExternalSystemRole](#externalsystemrole) is belonged to which [ExternalSystem](##externalsystem).
  - Developers, they're only interested in the [ExternalSystemRole](##externalsystemrole) exists or not.

By using the *logical proxy*, developer doesn't need to know which [ExternalSystemRole](#externalsystemrole) is belonged to which [ExternalSystem](#externalsystem). Just access to an [ExternalSystemRole](#externalsystemrole) via [ExternalSystemArray](#externalsystemarray). Sending and replying [Invoke messages](TypeScript-Protocol-Standard_Message#invoke), process them in the [ExternalSystemRole](#externalsystemrole) object. The [ExternalSystemRole](##externalsystemrole) objects will [subrogate Invoke message I/O](TypeScript-Protocol-Basic_Components#iprotocol) instead of related [ExternalSystem](#externalsystem) object.

###### ExternalSystemArray has accessors to ExternalSystemRole objects.
``` typescript
namespace samchon.protocol.external
{
	abstract class ExternalSystemArray 
		extends protocol.EntityDequeCollection<ExternalSystem> 
		implements protocol.IProtocol
	{
		// ACCESSORS TO EXTENRAL_SYSTEM_ROLE OBJECTS
		public hasRole(name: string): boolean;
		public getRole(name: string): ExternalSystemRole;
	}
}
```

###### ExternalSystemRole can subrogate Invoke message I/O.
``` typescript
namespace samchon.protocol.external
{
	abstract class ExternalSystemRole implements protocol.IProtocol
	{
		// LINKED WITH EXTENRAL_SYSTEM OBJECT.
		private system: ExternalSystem;

		public sendData(invoke: protocol.Invoke): void
		{
			// YOU CAN SEND INVOKE MESSAGE 
			// VIA THIS EXTENRAL_SYSTEM_ROLE OBJECT
			this.system.sendData(invoke);
		}

		// ExternalSystem.replyData() SHIFTS INVOKE MESSAGE TO 
		// THIS EXTENRAL_SYSTEM_ROLE OBJECT.
		public abstract replyData(invoke: protocol.Invoke): void;
	}
}
```

###### An example sending [Invoke message](TypeScript-Protocol-Standard_Message#invoke) via Proxy Pattern.
```typescript
/// <reference types="samchon-framework.d.ts" />

import samchon = require("samchon-framework");
import protocol = samchon.protocol;
import external = samchon.templates,external;

//--------
// MANAGER OF EXTERNAL FILE SERVERS' DRIVERS
//--------
var file_servers: external.ExternalSystemArray;

var png_data: Uint8Array; // DATA TO SAVE
var invoke: protocol.Invoke = new protocol.Invoke("save", "my_picture", "png", png_data); 
	// MESSAGE TO SEND

//--------
// YOU CAN SEND AN INVOKE MESSAGE WITHOUT SPECIFYING TARGET SYSTEM
// THE ExternalSystemRole OBJECT WILL ACT A ROLE NAMED "PROXY"
//--------
file_servers.getRole("image").sendData(invoke);
```

## Derived Classes
### ExternalSystemArray
You can specify an [ExternalSystemArray](#externalsystemarray) object to be:
  - [ExternalClientArray](#externalclientarray): A server accepting *exterenal clients*.
  - [ExternalServerArray](#externalserverarray): A client connecting to *external servers*.
  - [ExternalServerClientArray](#externalserverclientarray): Being *a server accepting external clients* and being *a client connecting to external servers* at the same time.

##### ExternalClientArray
You can specify an [ExternalSystemArray](#externalsystemarray) object to be *a server accepting external clients*. Just extends **ExternalClientArray** and override two methods; [createServerBase()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalclientarray.html#createserverbase) and [createExternalClient()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalclientarray.html#createexternalclient). 

Do you remember that; the easiest way to defining a server is to extending [protocol.Server](TypeScript-Protocol-Basic_Components#iserver). However, if extending [protocol.Server](TypeScript-Protocol-Basic_Components#iserver) is impossible becuase the target class already extended another one, then you can use [protocol.IServerBase](TypeScript-Protocol-Basic_Components#iserverbase) object with implementing [protocol.IServer](TypeScript-Protocol-Basic_Components#iserver). [ExternalClientArray.createServerBase()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalclientarray.html#createserverbase) is a factory method creating the [protocol.IServerBase](TypeScript-Protocol-Basic_Components#iserverbase) object. Override the [ExternalClientArray.createServerBase()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalclientarray.html#createexternalclient) method and return one of them considering which protocol is used in the server:
  - [ServerBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.serverbase.html)
  - [WebServerBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webserverbase.html)
  - [SharedWorkerServerBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerserverbase.html)

[ExternalClientArray.createExternalClient()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalclientarray.html#createexternalclient) is a factory method creating [ExternalSystem](#externalsystem) object. This is called by [IServer.addClient()](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iserver.html#addclient) whenever an external client has connected. Override the [creatExternalClient()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalclientarray.html#createexternalclient) method and return specified type of [ExternalSystem](#externalsystem).

###### IExternalClientArray
The easiest way to defining an [ExternalSystemArray](#externalsystemarray) class **opening a server and accept external clients** is to extending the [**ExternalClientArray**](#externalclientarray) class. However, if you can't specify your derived [ExternalSystemArray](#externalsystemarray) to be server, client or both of them, then make an abstract class extending [ExternalSystemArray](#externalsystemarray) (Now, I name it *BaseSystemArray*). When you need a *BaseSystemArray* class **opening a server and accepting external clients**, make a new class to extening the *BaseSystemArray* and implements **IExternalClientArray** (Name it **BaseClientArray**). Fill the **BaseClientArray** following below code: 

```typescript
namespace samchon.templates.external
{
	export interface IExternalClientArray 
		extends ExternalSystemArray, IServer
	{
	}
	
	export abstract class ExternalClientArray
		extends ExternalSystemArray
		implements IExternalClientArray
	{
		private server_base: IServerBase = null;
		
		//--------
		// METHODS TO OVERRIDE
		//--------
		// FACTORY METHOD CREATING SERVER_BASE OBJECT
		// RETURN ONE OF THEM FOLLOWING SPECIFIED PROTOCOL
		// 	- ServerBase
		// 	- WebServerBase
		// 	- SharedWorkerServerBase
		protected abstract createServerBase(): IServerBase;
		
		// FACTORY METHOD CREATING EXTERNAL_SYSTEM OBJECT
		protected abstract createExternalClient(driver: IClientDriver): ExternalSystem;
		
		//--------
		// METHODS OF ISERVER -> HOOK TO SERVER_BASE OBJECT
		//--------
		public open(port: number): void
		{
			this.server_base = this.createServerBase();
			this.server_base.open(port);
		}
		public close(): vcid
		{
			this.server_base.close();
		}
		public addClient(driver: IClientDriver): void
		{
			let system: ExternalSystem = this.createExternalClient(driver);
			this.push_back(system);
		}
	}
}
```

##### ExternalServerArray
You can specify an [ExternalSystemArray](#externalsystemarray) object to be *a client connecting to external servers*. Just extends **ExternalServerArray** and override only a method; [createChild()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalserverarray.html#createchild) who makes child [IExternalServer](#iexternalserver) object via [XML](TypeScript-Library-XML).

If you already read [Entity](TypeScript-Protocol-Standard_Message#entity) module, then you may know that; [IEntityGroup.createChild()](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.ientitycollection.html#createchild) is a factory method creating a child object via [XML](TypeScript-Library-XML) message called by [IEntityGroup.construct()](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.ientitycollection.html#construct). *A client connecting to external servers*; the word means that my system (**ExternalServerArray**) knows ip addresses and port numbers to connect. They are already being specified. Thus storing the ip addresses and port nubmers to an [XML](TypeScript-Library-XML) document construct **ExternalServerArray** from the [XML](TypeScript-Library-XML) message is possible.

```typescript
/// <reference path="typings/samchon-framework/samchon-framework.d.ts" />

import samchon = require("samchon-framework");
import library = samchon.library;
import protocol = samchon.protocol;
import external = samchon.templates.external;

class FileServerArray extends external.ExternalServerArray
{
	public createChild(xml: library.XML): protocol.external.ExternalServer
	{
		let name: string = xml.getProperty("name");
		
		if (name == "document")
			return DocumentServer(this);
		else if (name == "image")
			reutrn ImageServer(this);
		else if (name == "video")
			return VideoServer(this);
		else
			return null;
	}
}

// AN XML MESSAGE STORING ADDRESSES OF EXTERNAL SERVERS TO CONNECT
var xml: library.XML = new library.XML
(
	"<systemArray>\n" +
	"	<system name='document' ip='192.168.0.202' port='17112' />\n" +
	"	<system name='image' ip='192.168.0.203' port='17112' />\n" +
	"	<system name='document' ip='192.168.0.204' port='17112' />\n" +
	"</systemArray>"
);

// CREATE EXTERENAL_SERVER_ARRAY
var file_servers: FileServerArray = new FileServerArray();

// CONSTRUCT EXTERNAL_SERVER OBJECTS VIA THE XML MESSAGE
file_servers.construct(xml);

// START CONNECTION
file_servers.connect();
```

###### IExternalServerArray
The easiest way to defining an [ExternalSystemArray](#externalsystemarray) class who is **a client connecting to external servers** is to extending the [**ExternalServerArray**](#externalserverarray) class. However, if you can't specify your derived [ExternalSystemArray](#externalsystemarray) to be server, client or both of them, then make an abstract class extending [ExternalSystemArray](#externalsystemarray) (Now, I name it *BaseSystemArray*). When you need a *BaseSystemArray* class to be **a client connecting to external servers**, make a new class to extening the *BaseSystemArray* and implements **IExternalServerArray** (Name it **BaseServerArray**). Fill the **BaseServerArray** following below code: 

```typescript
namespace samchon.protocol.external
{
	export interface IExternalServerArray
		extends ExternalSystemArray
	{
		// MAY CALL CHILDREN IExternalServer.connect() METHODS
		connect(): void;
	}
	
	export abstract class ExternalServerArray
		extends ExternalSystemArray
	{
		// VERY SIMPLE. JUST CALL CHILDREN IExternalServer.connect()
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				(this.at(i) as IExternalServer).connect();
		}
	}
}
```

##### ExternalServerClientArray
You can specify an [ExternalSystemArray](#externalsystemarray) object to be *a server accepting external clients* and *a client connecting to external servers* at the same timee by just extending **ExternalServerClientArray**. Extending the **ExternalServerClientArray**, you can take functions of [ExternalServerArray](#externalserverarray) and [ExternalClientArray](#externalclientarray). Repeat again; **ExternalServerClientArray** can do what [ExternalServerArray](#externalserverarray) and [ExternalClientArray](#externalclientarray) at the same time. Thus, **ExternalServerClientArray** needs to override methods from [ExternalServerArray](#externalserverarray) and [ExternalClientArray](externalclientarray), too. Override those methods:
  - [**createServerBase**()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalserverclientarray.html#createserverbase)
    - From [ExternalClientArray](#externalclientarray)
    - Factory method creating [IServerBase](TypeScript-Protocol-Basic_Components#iserverbase) object, who makes this **ExternalServerClientArray** to be a server.
    - Craete one of them below considering which protocol is used:
      - [ServerBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.serverbase.html)
      - [WebServerBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webserverbase.html)
      - [SharedWorkerServerBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerserverbase.html)
  - [**createExternalClient**()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalserverclientarray.html#createexternalclient)
    - From [ExternalClientArray](#externalclientarray)
    - Factory method creating [ExternalSystem](#externalsystem) object whenever an external client has connected.
  - [**createExternalServer**()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalserverclientarray.html#createexternalserver)
    - From [ExternalServerArray](#externalserverarray)
    - Factory method creating [IExternalServer](#iexternalserver) object
    - Called by [IEntityGroup.createChild()](http://samchon.github.io/framework/api/ts/modules/samchon.protocol.ientitygroup.html#createchild) with XML message.

```typescript
/// <reference types="samchon-framework" />

import samchon = require("samchon-framework");
import protocol = samchon.protocol;

class MyExternalServerClientArray 
	extends protocol.external.ExternalServerClientArray
{
	//--------
	// METHODS OF EXTERNAL_CLIENT_ARRAY
	//--------
	protected createServerBase(): protocol.IServerBase
	{
		return new protocol.WebServerBase(this);
	}
	protected createExternalClient(driver: protocol.IClientDriver): protocol.external.ExternalSystem
	{
		return new MyExternalClient(this, driver);
	}
	
	//--------
	// METHOD OF EXTERNAL_SERVER_ARRAY
	//--------
	protected createExternalServer(): protocol.external.IExternalServer
	{
		return new MyExternalServer(this);
	}
}
```

###### IExternalServerClientArray
As I've mentioned in IExternalClientArrat and IExternalServerArray, the easiest way to defining an [ExternalSystemArray](#externalsystemarray) class **opening a server and accept external clients and connecting to external servers at the same time** is to extending the [**ExternalServerClientArray**](#externalserverclientarray) class. However, if you can't specify your derived [ExternalSystemArray](#externalsystemarray) to be server, client or both of them, then make an abstract class extending [ExternalSystemArray](#externalsystemarray) (Now, I name it *BaseSystemArray*). When you need a *BaseSystemArray* class **opening a server and accepting external clients and connecting to external servers at the same time**, make a new class to extening the *BaseSystemArray* and implements [**IExternalClientArray**](#iexternalclientarray) and [**IExternalServerArray**](#iexternalserverarray) (Name it **BaseServerClientArray**). Fill the **BaseServerClientArray** following below codes: 

If you already made a class implementing [IExternalClientArray](#iexternalclientarray), then extends the class and just implements [IExternalServerArray](#iexternalserverarray) additionally. Of course, filling methods of the [IExternalServerArray](#iexternalserverarray) is required.

```typescript
namespace samchon.protocol.external
{
	export abstract class ExternalServerClientArray
		extends ExternalClientArray // a server accepting external clients
		implements IExternalServerArray // a client connecting to external servers
	{
		//--------
		// A METHOD TO OVERRIDE
		//--------
		// FACTORY METHOD CREATING EXTERNAL_SERVER OBJECT VIA XML
		protected createExternalServer(xml: library.XML): IExternalServer;
	
		//--------
		// METHODS OF EXTERNAL_SERVER_ARRAY
		//--------
		// SHIFT FACTORY METHOD TO CREATE_EXTERNAL_SERVER
		public createChild(xml: library.XML): IExternalServer
		{
			return this.createExternalServer(xml);
		}
		
		// WHEN CHILD IS A TYPE OF IExternalServer,
		// THEN CALL IExternalServer.connect()
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i)["connect"] != undefined)
					(this.at(i) as IExternalServer).connect();
		}
	}
}
```

Otherwise, you haven't made a class implementing the [IExternalClientArray](#iexternalclientarray) interface, then extends [ExternalSystemArray](#externalsystemarray) and implements two interfaces, [IExternalClientArray](#iexternalclientarray) and [IExternalServerArray](#iexternalserverarray). Make such class referencing below code:

```typescript
namespace samchon.protocol.external
{
	export abstract class ExternalServerClientArray
		extends ExternalSystemArray
		implements IExternalClientArray, IExternalServerArray
	{
		private server_base: IServerBase = null;
		
		//--------
		// METHODS TO OVERRIDE
		//--------
		// FACTORY METHOD CREATING SERVER_BASE OBJECT
		// RETURN ONE OF THEM FOLLOWING SPECIFIED PROTOCOL
		// 	- ServerBase
		// 	- WebServerBase
		// 	- SharedWorkerServerBase
		protected abstract createServerBase(): IServerBase;
		
		// FACTORY METHOD CREATING EXTERNAL_SYSTEM OBJECT
		protected abstract createExternalClient(driver: IClientDriver): ExternalSystem;
		
		// FACTORY METHOD CREATING EXTERNAL_SERVER OBJECT VIA XML
		protected createExternalServer(xml: library.XML): IExternalServer;
		
		//--------
		// METHODS OF ISERVER -> HOOK TO SERVER_BASE OBJECT
		//--------
		public open(port: number): void
		{
			this.server_base = this.createServerBase();
			this.server_base.open(port);
		}
		public close(): vcid
		{
			this.server_base.close();
		}
		public addClient(driver: IClientDriver): void
		{
			let system: ExternalSystem = this.createExternalClient(driver);
			this.push_back(system);
		}
		
		//--------
		// METHODS OF EXTERNAL_SERVER_ARRAY
		//--------
		// SHIFT FACTORY METHOD TO CREATE_EXTERNAL_SERVER
		public createChild(xml: library.XML): IExternalServer
		{
			return this.createExternalServer(xml);
		}
		
		// WHEN CHILD IS A TYPE OF IExternalServer,
		// THEN CALL IExternalServer.connect()
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i)["connect"] != undefined)
					(this.at(i) as IExternalServer).connect();
		}
	}
}
```

### ExternalSystem
You can specify an [ExternalSystem](#externalsystem) to be:
  - [ExternalClient](#externalclient): external system is a client connecting to my server.
  - [ExternalServer](#externalserver): external system is a server that I connect.

##### ExternalClient
You want to make an ExternalSystem class who handles external client connecting to my server, then just extends the ExternalSystem class and initialize with ```super.constructor(systemArray: protocol.external.SystemArray, driver: protocol.IClientDriver)```. The IClientDriver object, it comes from ExternalSystemArray.createExternalClient().

```typescript
/// <reference types="samchon-framework" />

import samchon = require("samchon-framework");
import protocol = samchon.protocol;

class MyExternalClientArray
	extends protocol.external.ExternalClientArray
{
	protected createServerBase(): protocol.IServerBase
	{
		return new protocol.WebServerBase(this);
	}
	protected createExternalClient(driver: protocol.IClientDriver): protocol.external.ExternalSystem
	{
		return new MyExternalClient(this, driver);
	}
}

class MyExternalClient
	extends protocol.external.ExternalSystem
{
	public constructor(systemArray: MyExternalClientArray, driver: protocol.IClientDriver)
	{
		super(systemArray, driver);
		
		this.push
		(
			new MyExternalClientRole1(this),
			new MyExternalClientRole2(this),
			new MyExternalClientRole3(this)
		);
	}
}
```	

##### ExternalServer
You can specify an [ExternalSystem](#externalsystem) object who connects to external server. Just extends **ExternalServer** and overrides two methods; [createServerConnector()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalserver.html#createserverconnector) and [createChild()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalserver.html#createchild).

The [createServerConnector()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalserver.html#createserverconnector) is a factory method creating [IServerConnector](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iserverconnector.html) object. Return one of them considering which protocol is used in the external server.
  - [ServerConnector](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.serverconnector.html)
  - [WebServerConector](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webserverconnector.html)
  - [SharedWorkerServerConnector](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerserverconnector.html)

The [createChild()](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalserver.html#createchild) is a factory method creating child ExternalSystemRole object from XML object. Extends **ExternalServer** class following below code:

```typescript
/// <reference types="samchon-framework" />

import samchon = require("samchon-framework");
import library = samchon.library;
import protocol = samchon.protocol;

class MyExternalServerArray exnteds protocol.external.ExternalServerArray
{
	public createChild(xml: library.XML): protocol.external.IExternalServer
	{
		return new MyExternalServer(this);
	}
}

class MyExternalServer extends protocol.external.ExternalServer
{
	// FACTORY METHOD CREATING SERVER_CONNECTOR OBJECT
	// RETURN ONE OF THEM FOLLOWING SPECIFIED PROTOCOL
	// 	- ServerConnector
	// 	- WebServereConnector
	// 	- SharedWorkerServeerConnector
	protected createServerConnector(): protocol.IServerConnector
	{
		return new protocol.WebServerConnector(this);
	}
	
	// FACTORY METHOD CREATING EXTERNAL_SYSTEM_ROLE OBJECT
	// THIS IS CALLED BY IEntityGroup.construct() WITH XML MESSAGE
	public createChild(xml: library.XML): protocol.external.ExternalSystemRole
	{
		let name: string = xml.getProperty("name");
		
		if (name == "role1")
			return new MyExternalClientRole1(this);
		else if (name == "role2")
			return new MyExternalClientRole2(this);
		else if (name == "role3")
			return new MyExternalClientRole3(this);
		else
			return null;
	}
}
```

###### IExternalServer
The easiest way to defining an [*ExternalSystem*](#externalsystem) class who connects to external server is to extending the **ExternalServer** class. However, if you can't specify your derived [*ExternalSystem*](#externalsystem) is interacting with **an external server that I connect** or an external client connecting to my system, then make an abstract class extending [*ExternalSystem*](#externalsystem) (Nowm I am it *BaseSystem*). When you need a *BaseSystem* class who **connects to external server**, make a new class extending the *BaseSystem* and implements **IExternalServer**. Fill the **BaseServer** following below code:

```typescript
namespace samchon.protocol.external
{
	export interface IExternalServer
		extends ExternalSystem
	{
		// CALLED BY IExternalServerArray.connect()
		connect(): void;
	}
	
	export abstract class ExternalServer
		extends ExternalSystem
		implements IExternalServer
	{
		// IP ADDRESS AND PORT NUMBER TO CONNECT
		protected ip: string = "";
		protected port: number = 0;
	
		//--------
		// METHODS OF IEXTERNAL_SERVER
		//--------
		// FACTORY METHOD CREATING SERVER_CONNECTOR OBJECT
		// RETURN ONE OF THEM FOLLOWING SPECIFIED PROTOCOL
		// 	- ServerConnector
		// 	- WebServereConnector
		// 	- SharedWorkerServeerConnector
		protected abstract createServerConnector(): IServerConnector;
	
		public connect(): void
		{
			// CREATE SERVER_CONNECTOR VIA FACTORY METHOD
			this.communicator = this.createServerConnector();
			
			// AND CONNECT
			(this.communicator as ServerConnector).connect(this.ip, this.port);
		}
	}
}
```


## Derived Modules
### Parallel System
![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/external_vs_parallel.png)

Parallel System Module, it is extended from this *External System Module*.

On top of the External System Module who indendently separates each role to each system exclusively, Parallel Sysetm module also can do parallel processing. Parallel System Module separates a process to number of pieces and distributes the pieces to its slave systems. The slave systems process the pieces all together.

[**Go to the Parallel System Module**](TypeScript-Protocol-Parallel_System)

### Distributed System
![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/external_vs_distributed.png)

Distributed System Moudle, it is extended from the Parallel System Module.

On top of External System Moudle and Parallel System Module, Distributed System Module's system doesn't monopolize a role. The role can be shared in multiple systems. When developer requests to process belonged to a role, then DistributedSystemArray will deliver the role to the most idle slave system.

[**Go to the Distributed System Module**](TypeScript-Protocol-Distributed_System)

### Slave System

[**Go to the Slave System Module**](TypeScript-Protocol-Slave_System)

## Example Project
### Derived Modules
The [Derived Modules](#derived-modules) can be very helpful for understanding how to utilize and specify type of classes in this External System module.

Name | Source | Documents
----|----|---
Parallel System | [templates/parallel](https://github.com/samchon/framework/tree/master/ts/src/samchon/templates/parallel) | [API](http://samchon.github.io/framework/api/ts/modules/samchon.templates.parallel.html), [Guidance](TypeScript-Templates-Parallel_System)
Distributed System | [templates/distributed](https://github.com/samchon/framework/tree/master/ts/src/samchon/templates/distributed) | [API](http://samchon.github.io/framework/api/ts/modules/samchon.templates.distributed.html), [Guidance](TypeScript-Templates-Distributed_System)
Slave System | [templates/slave](https://github.com/samchon/framework/tree/master/ts/src/samchon/templates/slave) | [API](http://samchon.github.io/framework/api/ts/modules/samchon.templates.slave.html), [Guidance](TypeScript-Templates-Slave_System)

### Interaction
![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/interaction.png)

**Interaction** is an example implemented *Tree-structured Distributed & Parallel Processing System*. The Interaction provides ultimate guidance; how to use *External System* and its derived modules.

[**Go to the Interaction**](Examples-Interaction)