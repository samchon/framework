import "./instances/web-server";

import { WebConnector } from "../../protocol/web";
import { ICalculator } from "../base/Calculator";

export async function _test_web(): Promise<void>
{
	let connector: WebConnector = new WebConnector();
	await connector.connect("ws://127.0.0.1:10107/calculator");

	console.log("connected");

	await ICalculator.main(connector.getDriver<ICalculator>());
	connector.close();
}
_test_web();