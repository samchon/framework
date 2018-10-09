import { Communicator } from "../../protocol/Communicator";
import { Calculator, ICalculator } from "../base/Calculator";

export async function test_pseudo(): Promise<void>
{
	//----
	// SERVER & CLIENT
	//----
	// PRE-DECLARATIONS
	let server: Communicator<Calculator>;
	let client: Communicator;
	
	// CONSTRUCT SYSTEMS
	server = new Communicator(invoke => client.replyData(invoke), new Calculator());
	client = new Communicator(invoke => server.replyData(invoke));

	//----
	// INTERACTS
	//----
	// GET DRIVER
	let driver: ICalculator = client.getDriver<ICalculator>();

	// DO TEST
	ICalculator.main(driver);
}
