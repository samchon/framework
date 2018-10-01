import { Communicator } from "../Communicator";

export class ProcessServer<Listener extends object = {}> 
	extends Communicator<Listener>
{
	public constructor(listener: Listener = null)
	{
		super(invoke =>
		{
			process.send(JSON.stringify(invoke));
		}, listener);

		process.on("message", msg =>
		{
			this.replyData(JSON.parse(msg));
		});
	}
}