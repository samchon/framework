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