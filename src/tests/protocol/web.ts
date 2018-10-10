import { WebServer, WebAcceptor, WebConnector } from "../../protocol/web";
import { Calculator } from "../base/Calculator";
import { ICalculator } from "../base/ICalculator";

export async function test_web(): Promise<void>
{
	const PORT: number = 10919;

	//----
	// SERVER
	//----
	let server: WebServer = new WebServer();
	server.open(PORT, (acceptor: WebAcceptor) =>
	{
		acceptor.accept(); // ALLOW CONNECTION
		acceptor.listen(new Calculator()); // SET LISTENER
	});

	//----
	// CLIENT
	//----
	// DO CONNECT
	let connector: WebConnector = new WebConnector();
	await connector.connect(`ws://127.0.0.1:${PORT}/calculator`);

	// SET DRIVER AND TEST BY CALCULATOR PROCESS
	let driver: ICalculator = connector.getDriver();
	await ICalculator.main(driver);

	//----
	// CLOSES
	//----
	connector.close();
	server.close();
}