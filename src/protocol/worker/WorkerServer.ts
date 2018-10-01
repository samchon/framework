import { Communicator } from "../Communicator";

export class WorkerServer<Listener extends object = {}> 
	extends Communicator<Listener>
{
	public constructor(listener: Listener = null)
	{
		super(invoke =>
		{
			postMessage(JSON.stringify(invoke), "")
		}, listener)
	}

	public close(): void
	{
		close();
	}
}