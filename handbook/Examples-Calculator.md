# Calculator

## calculator-server.ts
```typescript
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
	// CONTAINER OF CalculatorClient OBJECTS
	private clients: std.HashSet<CalculatorClient>;

	/* ------------------------------------------------------------------
		CONSTRUCTORS
	------------------------------------------------------------------ */
	public constructor()
	{
		super();

		this.clients = new std.HashSet<CalculatorClient>();
	}
	public addClient(driver: protocol.IClientDriver): void
	{
		// WHEN A CLIENT HAS CONNECTED, THEN AN CalculatorClient OBJECT 
		// AND ENROLL THE NEWLY CREATED CalucatorClient OBJECT TO MEMBER clients.
		let client: CalculatorClient = new CalculatorClient(this, driver);
		this.clients.insert(client);
	}

	/* ------------------------------------------------------------------
		INVOKE MESSAGE CHAIN
	------------------------------------------------------------------ */
	/////
	// SEND & REPLY DATA
	/////
	public sendData(invoke: protocol.Invoke): void
	{
		// ALL sendData() METHOD IN CalculatorClient OBJECTS ARE CALLED
		for (let it = this.clients.begin(); !it.equal_to(this.clients.end()); it = it.next())
			it.value.sendData(invoke);
	}
	public replyData(invoke: protocol.Invoke): void
	{
		// FIND MATCHED MEMBER FUNCTION NAMED EQUAL TO THE invoke.getListener()
		invoke.apply(this);
	}

	/////
	// METHODS CALLED BY invoke.apply(this) in replyData().
	/////
	private computeMultiply(x: number, y: number): void
	{
		// CALL CalculatorApplication.printMultiply
		this.sendData(new protocol.Invoke("printMultiply", x, y, x * y));
	}
	private computeDivide(x: number, y: number): void
	{
		// CALL CalculatorApplication.printDivide
		this.sendData(new protocol.Invoke("printDivide", x, y, x / y));
	}
}
```

``` typescript
class CalculatorClient implements protocol.IProtocol
{
	// PARENT SERVER INSTANCE
	private server: CalculatorServer;

	// COMMUNICATOR, SENDS AND RECEIVES NETWORK MESSAGE WITH CONNECTED CLIENT
	private driver: protocol.IClientDriver;

	/* ------------------------------------------------------------------
		CONSTRUCTORS
	------------------------------------------------------------------ */
	public constructor(server: CalculatorServer, driver: protocol.IClientDriver)
	{
		this.server = server;
		this.driver = driver;

		// START LISTENING AND RESPOND CLOSING EVENT
		this.driver.listen(this);
		this.driver.onClose = this.destructor.bind(this);
	}
	public destructor(): void
	{
		// WHEN DISCONNECTED, THEN ERASE THIS OBJECT FROM CalculatorServer.clients.
		this.server["clients"].erase(this);
	}

	/* ------------------------------------------------------------------
		INVOKE MESSAGE CHAIN
	------------------------------------------------------------------ */
	/////
	// SEND & REPLY DATA
	/////
	public sendData(invoke: protocol.Invoke): void
	{
		// CALL Communicator.sendData(), WHO PHYSICALLY SEND NETWORK MESSAGE
		this.driver.sendData(invoke);
	}
	public replyData(invoke: protocol.Invoke): void
	{
		console.log(invoke.toXML().toString() + "\n\n");

		// FIND MATCHED MEMBER FUNCTION NAMED EQUAL TO THE invoke.getListener()
		invoke.apply(this);

		// THE REPLIED INVOKE MESSAGE IS ALSO SHIFTED TO ITS SERVER OBJECT
		this.server.replyData(invoke);
	}

	/////
	// METHODS CALLED BY invoke.apply(this) in replyData().
	/////
	private computePlus(x: number, y: number): void
	{
		// CALL CalculatorApplication.printSum
		this.sendData(new protocol.Invoke("printPlus", x, y, x + y));
	}
	private computeMinus(x: number, y: number): void
	{
		// CALL CalculatorApplication.printMinus
		this.sendData(new protocol.Invoke("printMinus", x, y, x - y));
	}
}

var server: CalculatorServer = new CalculatorServer();
server.open(17823);
```

## calculator-application.ts
``` typescript
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

// IMPORT
import samchon = require("samchon-framework");

// SHORTCUTS
import library = samchon.library;
import protocol = samchon.protocol;

class CalculatorApplication implements protocol.IProtocol
{
	// COMMUNICATOR, SENDS AND RECEIVES NETWORK MESSAGE WITH SERVER
	private connector: protocol.IServerConnector;

	/* ------------------------------------------------------------------
		CONSTRUCTORS
	------------------------------------------------------------------ */
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
		// CALL CalculatorClient.computeSum
		this.sendData(new protocol.Invoke("computePlus", Math.random(), Math.random()));

		// CALL CalculatorClient.computeMinus
		this.sendData(new protocol.Invoke("computeMinus", Math.random(), Math.random()));

		// CALL CalculatorServer.computeMultiply
		this.sendData(new protocol.Invoke("computeMultiply", Math.random(), Math.random()));

		// CALL CalculatorServer.computeDivide
		this.sendData(new protocol.Invoke("computeDivide", Math.random(), Math.random()));
	}

	/* ------------------------------------------------------------------
		INVOKE MESSAGE CHAIN
	------------------------------------------------------------------ */
	/////
	// SEND & REPLY DATA
	/////
	public sendData(invoke: protocol.Invoke): void
	{
		this.connector.sendData(invoke);
	}
	public replyData(invoke: protocol.Invoke): void
	{
		invoke.apply(this);
	}

	/////
	// METHODS CALLED BY invoke.apply(this) in replyData().
	/////
	private printPlus(x: number, y: number, ret: number): void
	{
		console.log(library.StringUtil.substitute("{1} + {2} = {3}", x, y, ret));
	}
	private printMinus(x: number, y: number, ret: number): void
	{
		console.log(library.StringUtil.substitute("{1} - {2} = {3}", x, y, ret));
	}
	private printMultiply(x: number, y: number, ret: number): void
	{
		console.log(library.StringUtil.substitute("{1} x {2} = {3}", x, y, ret));
	}
	private printDivide(x: number, y: number, ret: number): void
	{
		console.log(library.StringUtil.substitute("{1} / {2} = {3}", x, y, ret));
	}
}

new CalculatorApplication();
```