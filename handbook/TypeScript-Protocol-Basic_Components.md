# Basic Components
**Basic Compoenents** are the smallest unit of network communication in this *Samchon Framework*. With **Basic Components**, you can construct any type of network system, even how the network system is enormously scaled and complicated, by just combinating the **Basic Components**.

All the system templates in this framework are also being implemented by utilization of the **Basic Components**.
  - [Service](TypeScript-Protocol-Service)
  - [External System](TypeScript-Protocol-External_System)
  - [Parallel System](TypeScript-Protocol-Parallel_System)
  - [Distributed System](TypeScript-Protocol-Distributed_System)

Note that, whatever the network system what you've to construct is, just concentrate on role of each system and attach matched *Basic Component* to the role, within framework of the *Object-Oriented Design*. Then construction of the network system will be much easier.
  - A system is server, then use [IServer](#iserver) or [IServerBase](#iserverdriver).
  - A system is a client conneting to an extenral server, then use [IServerConnector](#iserverconnector).
  - A server wants a handle clients have connected, then use [IClientDriver](#iclientdriver).

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
  - [IClientDriver](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iclientdriver.html)
    - [ClientDriver](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.clientdriver.html)
    - [WebClientDriver](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webclientdriver.html)
    - [SharedWorkerClientDriver](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerclientdriver.html)
  - [IServerConnector](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.iserverconnector.html)
    - [ServerConnector](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.serverconnector.html)
    - [WebServerConnector](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.webserverconnector.html)
    - [SharedWorkerServerConnector](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.sharedworkerserverconnector.html)

## IServer

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
import protocol = require("samchon-framework").protocol;

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

## Communicator
#### IClientDriver

#### IServerConnector

## IProtocol