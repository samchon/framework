import { WebServer } from "../../../protocol/web";
import { Calculator } from "../../base/Calculator";

function main(): void
{
	let server: WebServer = new WebServer();
	server.open(10107, acceptor =>
	{
		acceptor.accept();
		acceptor.listen(new Calculator());
	});
}
main();