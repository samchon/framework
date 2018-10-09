import { ProcessServer } from "../../../protocol/worker/ProcessServer";
import { Calculator } from "../../base/Calculator";

function main(): void
{
	new ProcessServer(new Calculator());
}
main();