# Basic Components
**Basic Compoenents** are the smallest unit of network communication in this *Samchon Framework*. With **Basic Components**, you can construct any type of network system, even how the network system is enormously scaled and complicated, by just combinating the **Basic Components**.

All the system templates in this framework are also being implemented by utilization of the **Basic Components**.
  - [Service](TypeScript-Templates-Service)
  - [External System](TypeScript-Templates-External_System)
  - [Parallel System](TypeScript-Templates-Parallel_System)
  - [Distributed System](TypeScript-Templates-Distributed_System)

Note that, whatever the network system what you've to construct is, just concentrate on role of each system and attach matched **Basic Component** to the role, within framework of the **Object-Oriented Design**. Then construction of the network system will be much easier.
  - A system is server, then use [IServer](#iserver) or [IServerBase](#iserverdriver).
  - A server wants to handle a client has connected, then use [IClientDriver](#iclientdriver).
  - A system is a client conneting to an extenral server, then use [IServerConnector](#iserverconnector).

## References
#### Class Diagram
![Protocol - Basic Components](http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png)

#### API Documents
  - [IProtocol](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iprotocol.html)
  - [IServer](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iserver.html)
    - [IServerBase](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iserverbase.html)
      - [ServerBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.serverbase.html)
      - [WebServerBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webserverbase.html)
      - [SharedWorkerServerBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerserverbase.html)
    - [Server](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.server.html)
    - [WebServer](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webserver.html)
    - [SharedWorkerServer](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerserver.html)
  - [ICommunicator](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.icommunicator.html)
    - [CommunicatorBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.communicatorbase.html)
      - [Communicator](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.communicator.html)
      - [WebCommunicator](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webcommunicator.html)
      - [SharedWorkerCommunicator](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerservercommunicator.html)
    - [IClientDriver](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iclientdriver.html)
      - [ClientDriver](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.clientdriver.html)
      - [WebClientDriver](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webclientdriver.html)
      - [SharedWorkerClientDriver](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerclientdriver.html)
    - [IServerConnector](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iserverconnector.html)
      - [ServerConnector](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.serverconnector.html)
      - [WebServerConnector](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webserverconnector.html)
      - [SharedWorkerServerConnector](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerserverconnector.html)

#### Source Codes
  - [Server.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/Server.ts)
  - [Communicator.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/Communicator.ts)
    - [ClientDriver.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/ClientDriver.ts)
    - [ServerConnector.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/ServerConnector.ts)
  - [IProtocol.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/IProtocol.ts)


## IServer
```IServer``` is used to open a server. First, extends one of them, who are derived from the ```IServer```.
  - [Server](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.server.html)
  - [WebServer](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webserver.html)
  - [SharedWorkerServer](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerserver.html)

``` typescript
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

import samchon = require("samchon-framework");
import protocol = samchon.protocol;

class MyServer extends protocol.WebServer
{
	// OVERRIDE TO DEFINE WHAT TO DO WHEN A CLIENT HAS CONNECTED
	// 
	// @param driver A COMMUNICATOR WITH CONNECTED CLIENT
	public addCliet(driver: IClientDriver): void
	{
		// DO SOMETHING
	}
}
var server: MyServer = new MyServer();
server.open(54321); // OPEN SERVER
server.close(); // ALSO, CLOSING IS POSSIBLE
```

After inheritance, override ```IServer.addClient()``` method to defined what to do whenever a client has newly connected. To open the server, call ```IServer.open()``` method.

If you're under embarassed situation, unable to extends one of them (Server, WebServer and SharedWorkerServer) because your class already extended another one, then use [IServerBase](#iserverbase).

#### IServerBase
The easiest way to defning a server class is to extending one of them, who are derived from the ```IServer```.
  - [Server](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.server.html)
  - [WebServer](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webserver.html)
  - [SharedWorkerServer](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerserver.html)

However, it is impossible (that is, if the class is already extending another class), you can instead implement the ```IServer``` interface, create an ```IServerBase``` member, and wrtie simple hooks to route calls into the aggregated ```IServerBase```.

Those classes are derived from the ```IServerBase``` interface and specifying each network protocol.
  - [ServerBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.serverbase.html)
  - [WebServerBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webserverbase.html)
  - [SharedWorkerServerBase](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerserverbase.html)

Code under below is an example using the WebServerBase when extending WebServer is impossible. The example implemented IServer instead and hooked to aggregated WebServerBase.

``` typescript
/// <reference path="typings/samchon-framework/samchon-framework.d.ts" />

import samchon = require("samchon-framework");
import protocol = samchon.protocol;

class MySlaveServer extends protocol.external.ExternalSystem 
	implements IServer
{
	// TARGET TO HOOK
	private server_base: protocol.IServerBase;
	
	public constructor()
	{
		super();
		this.server_base = new protocol.WebServerBase();
	}
	
	/* ---------------------------------------------------
		HOOKINGS - METHODS OF ISERVER
	--------------------------------------------------- */
	public addClient(driver: protocol.IClientDriver): void
	{
		// WHAT TO DO WHEN A CLIENT HAS CONNECTED
		this.communicator = driver;
		driver.listen(this);
	}
	public open(port: number): void
	{
		this.server_base.open(port);
	}
	public close(): void
	{
		this.server_base.close();
	}
}
```

Also, many of modules even in *Samchon Framework* are using the strategy pattern because they've already extended another classes. Below classes are such things.

  - [ExternalClientArray](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.external.externalclientarray.html)
  - [MediatorServer](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.master.mediatorserver.html)
  - [SlaveServer](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.slave.slaveserver.html)

## ICommunicator
```ICommunicator``` takes full charge of network communication with external, conneted system. Type of the ICommunicator is specified to [IClientDriver](#iclientdriver) and [IServerConnector](#iserverconnector) whether the connected system is a server (that I've to connect) or a client (a client connected to my server)

Whenever ```ICommunicator``` network message has come from the connceted system, the network message will be converted to an [
](TypeScript-Protocol-Standard_Message#invoke) object and it will be shifted to the [ICommunicator.listener](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.communicatorbase.html#listener)'s [replyData()](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iprotocol.html#replydata) method.

``` typescript
interface ICommmunicator
{
	private socket: SomeSocketClass;

	// LISTENER LISTENS INVOKE MESSAGE BY IT'S IProtocol.replyData() METHOD
	protected listener: IProtocol;
	
	// YOU CAN DETECT DISCONNECTION BY ENROLLING FUNCTION POINTER TO HERE.
	public onClose: Function;
	
	public sendData(invoke: Invoke): void
	{
		this.socket.write(invoke);
	}
	public replyData(invoke: Invoke): void
	{
		// WHENEVER COMMUNICATOR GETS MESSAGE, THEN SHIFT IT TO LISTENER'S replyData() METHOD.
		this.listener.replyData(invoke);
	}
}
```

#### IClientDriver
```IClientDriver``` is a type of [ICommunicator](#icommunicator), specified for communication with external client, connected to this server. This ```IClientDriver``` is created in [IServer](#iserver) and delivered from [IServer.addClient()](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iserver.html#addclient). Those are derived classes from the ```IClientDriver```, being created by [IServer](#iserver) object.

Derived Type | Crated By
-------------|-----------
[ClientDriver](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.clientdriver.html) | [Server](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.server.html)
[WebClientDriver](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webclientdriver.html) | [Server](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.server.html)
[SharedWorkerClientDriver](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerclientdriver.html) | [Server](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.server.html)

When you got the IClientDriver object in the [IServer.addClient()](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iserver.html#addclient), then specify listener from [IClientDriver.listen()](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iclientdriver.html#listen) method.

``` typescript
/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

// IMPORTS
import std = require("typescript-stl");
import samchon = require("samchon-framework");

// SHORTCUTS
import library = samchon.library;
import protocol = samchon.protocol;

class CalculatorServer extends protocol.Server
{
	private clients: std.HashSet<CalculatorClient>;
	
	// WHEN A CLIENT HAS CONNECTED
	public addClient(driver: IClientDriver): void
	{
		let client: CalculatorClient = new CalculatorClient(this, driver);
		this.clients.insert(client);
	}
}

class CalculatorClient extends protocol.IProtocol
{
	// PARENT SERVER INSTANCE
	private server: CalculatorServer;

	// COMMUNICATOR, SENDS AND RECEIVES NETWORK MESSAGE WITH CONNECTED CLIENT
	private driver: protocol.IClientDriver;

	/////
	// CONSTRUCTORS
	/////
	public constructor(server: CalculatorServer, driver: protocol.IClientDriver)
	{
		this.server = server;
		this.driver = driver;

		// START LISTENING AND RESPOND CLOSING EVENT
		this.driver.listen(this); // INVOKE MESSAGE WILL COME TO HERE
		this.driver.onClose = this.destructor.bind(this); // DISCONNECTED HANDLER
	}
	public destructor(): void
	{
		// WHEN DISCONNECTED, THEN ERASE THIS OBJECT FROM CalculatorServer.clients.
		this.server["clients"].erase(this);
	}
	
	/////
	// INVOKE MESSAGE CHAIN
	/////
	public sendData(invoke: protocol.Invoke): void
	{
		// CALL ICommunicator.sendData(), WHO PHYSICALLY SEND NETWORK MESSAGE
		this.driver.sendData(invoke);
	}
	public replyData(invoke: protocol.Invoke): void
	{
		// FIND MATCHED MEMBER FUNCTION NAMED EQUAL TO THE invoke.getListener()
		invoke.apply(this);
	}
}

```

#### IServerConnector
```IServerConnector``` is a type of [ICommunicator](#icommunicator), specified for a client who connecting to an external server. Those are derived type from this interface ```IServerConnector```.

  - [ServerConnector](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.serverconnector.html)
  - [WebServerConnector](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webserverconnector.html)
  - [SharedWorkerServerConnector](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerserverconnector.html)

To utilize this ```IServerConnector```, create derived type with listener. [constructor(listener: IProtocol)](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.serverconnector.html#constructor). After creation, call [IServerConnector.connect()](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iserverconnector.html#connect) with specified ip address and port number.

``` typescript
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

import samchon = require("samchon-framework");
import protocol = samchon.protocol;

class CalculatorApplication implements protocol.IProtocol
{
	// COMMUNICATOR, SENDS AND RECEIVES NETWORK MESSAGE WITH SERVER
	private connector: protocol.IServerConnector;

	/////
	// CONSTRUCTORS
	/////
	public constructor()
	{
		// CONSTRUCT CONNECTOR AND
		this.connector = new protocol.ServerConnector(this);
		this.connector.onConnect = this.handleConnect.bind(this);

		// CONNECT TO CALCULATOR-SERVER
		this.connector.connect("127.0.0.1", 17823);
	}
	private handleConnect(): void
	{
		// DO SOMETHING
		...
	}
	
	/////
	// SEND & REPLY DATA
	/////
	public sendData(invoke: protocol.Invoke): void
	{
		// CALL ICommunicator.sendData(), WHO PHYSICALLY SEND NETWORK MESSAGE
		this.connector.sendData(invoke);
	}
	public replyData(invoke: protocol.Invoke): void
	{
		// FIND MATCHED MEMBER FUNCTION IN this OBJECT AND CALL IT.
		invoke.apply(this);
	}
```

## IProtocol
```IProtocol``` is an interface for [Invoke](TypeScript-Protocol-Standard_Message#invoke) message, which is standard message of network I/O in Samchon Framework, chain. The IProtocol interface is used to network drivers (Basic Components) and some related classes with the network drivers, which are in a relationship of *Chain of Responsibility* with those network drivers.

Implements ```IProtocol``` if the class sends and handles [Invoke](TypeScript-Protocol-Standard_Message#invoke) message. Looking around source codes of Samchon Framework, especially System Templates, you can find out that all the classes and modules handling [Invoke](TypeScript-Protocol-Standard_Message#invoke) message are always implementing the ```IProtocol```. Yes, ```IProtocol```, this is the main role you've to follow in Samchon Framework.

Below pseudo code represents [Service Module](TypeScript-Templates-Cloud_Service), who can build a cloud server. All the classes in the pseudo code are implementing the IProtocol because all of them are handling [Invoke](TypeScript-Protocol-Standard_Message#invoke) messages.

  - [Server](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.service.server.html): Represents a server literally.
  - [User](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.service.user.html): Represents an user being identified by its session id. User contains multiple Client objects.
    - In browser, an user can open multiple windows
      - User: A browser (like IE, Chrome and Safari)
      - Client: An internet browser window
  - [Client](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.service.client.html): Represents a browser window and it takes role of network commmunication.
  - [Service](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.service.service.html): Represents a service, domain logic.

![Service Module](http://samchon.github.io/framework/images/design/ts_class_diagram/templates_cloud_service.png)

``` typescript
/// <reference types="typescript-stl" />
/// <reference types="samchon-framework" />

// IMPORTS
import std = require("typescript-stl");
import samchon = require("samchon-framework");

// SHORTCUTS
import library = samchon.library;
import collection = samchon.collection;
import protocol = samchon.protocol;

namespace service
{
	export class Server extends protocol.WebServer implements IProtocol
	{
		// SERVER HAS MULTIPLE USER OBJECTS
		private session_map: std.HashMap<string, User>;
		
		/////
		// MESSAGE CHAIN
		/////
		public sendData(invoke: protocol.Invoke): void
		{
			// SEND INVOKE MESSAGE TO ALL USER OBJECTS
			for (let it = this.session_map.begin(); !it.equal_to(this.session_map.end()); it = it.next())
				it.second.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this); // HANDLE INVOKE MESSAGE BY ITSELF
		}
	}
	
	export class User extends 
		collection.HashMapCollection<number, Client> // USER HAS MULTIPLE CLIENT OBJECTS
		implements IProtocol
	{
		private server: Server; // USER REFRES SERVER
		
		/////
		// MESSAGE CHAIN
		/////
		public sendData(invoke: protocol.Invoke): void
		{
			// SEND INVOKE MESSAGE TO ALL CLIENT OBJECTS
			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
				it.second.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this); // HANDLE INOVKE MESSAGE BY ITSELF
			this.server.replyData(invoke); // OR VIA SERVER
		}
	}
	
	export class Client implements IProtocol
	{
		private user: User; // CLIENT REFERS USER
		private service: Service; // CLIENT HAS A SERVICE OBJECT
		
		private driver: WebClientDriver;
		
		/////
		// MESSAGE CHAIN
		/////
		public sendData(invoke: protocol.Invoke): void
		{
			// SEND INVOKE MESSAGE VIA driver: WebClientDriver
			this.driver.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this); // HANDLE INOVKE MEESAGE BY ITSELF
			this.user.replyData(invoke); // OR VIA USER

			if (this.service != null) // OR VIA SERVICE
				this.service.replyData(invoke);
		}
	}
	
	export class Service implements IProtocol
	{
		private client: Client; // SERVICE REFRES CLIENT
		
		/////
		// MESSAGE CHAIN
		/////
		public sendData(invoke: protocol.Invoke): void
		{
			// SEND INVOKE MESSAGE VIA CLIENT
			return this.client.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this); // HANDLE INVOKE MESSAGE BY ITSELF
		}
	}
```

## Example Code
#### System Templates
Learning and understanding **Basic Components** of *Samchon Framework*, reading source codes and designs of **System Templates**' modules will be very helpful.

Name | Source | Documents
----|----|---
Cloud Service | [protocol/service](https://github.com/samchon/framework/tree/master/ts/src/samchon/templates/service) | [API](http://samchon.github.io/framework/api/ts/modules/samchon.templates.service.html), [Guidance](TypeScript-Templates-Cloud_Service)
External System | [protocol/external](https://github.com/samchon/framework/tree/master/ts/src/samchon/templates/external) | [API](http://samchon.github.io/framework/api/ts/modules/samchon.templates.external.html), [Guidance](TypeScript-Templates-External_System)
Parallel System | [protocol/parallel](https://github.com/samchon/framework/tree/master/ts/src/samchon/templates/parallel) | [API](http://samchon.github.io/framework/api/ts/modules/samchon.templates.parallel.html), [Guidance](TypeScript-Templates-Parallel_System)
Distributed System | [protocol/distributed](https://github.com/samchon/framework/tree/master/ts/src/samchon/templates/distributed) | [API](http://samchon.github.io/framework/api/ts/modules/samchon.templates.distributed.html), [Guidance](TypeScript-Templates-Distributed_System)
Slave System | [protocol/slave](https://github.com/samchon/framework/tree/master/ts/src/samchon/templates/slave) | [API](http://samchon.github.io/framework/api/ts/modules/samchon.templates.slave.html), [Guidance](TypeScript-Templates-Slave_System)

#### Example Projects
  - [Calculator](Examples-Calculator)
  - [Chatting](Examples-Chatting)
  - [Interaction](Examples-Interaction)