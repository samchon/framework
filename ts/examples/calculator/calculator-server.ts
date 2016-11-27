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

	public eraseClient(val: CalculatorClient): void
	{
		this.clients.erase(val);
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
		for (let it = this.clients.begin(); !it.equals(this.clients.end()); it = it.next())
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
		this.server.eraseClient(this);
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