import { ProcessConnector } from "../../protocol/worker/ProcessConnector";
import { ICalculator } from "../base/Calculator";

export async function test_process(): Promise<void>
{
	let connector: ProcessConnector = new ProcessConnector();
	connector.connect(__dirname + "/process-server");

	await ICalculator.main(connector.getDriver<ICalculator>());
	connector.close();
}