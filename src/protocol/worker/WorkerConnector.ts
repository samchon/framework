import { Communicator } from "../Communicator";

export class WorkerConnector<Listener extends Object = {}> 
	extends Communicator<Listener>
{
	/**
	 * @hidden
	 */
	private worker_: Worker;

	public constructor(listener: Listener = null)
	{
		super(invoke =>
		{
			this.worker_.postMessage(JSON.stringify(invoke))
		}, listener)
	}

	public connect(path: string): void
	{
		this.worker_ = new Worker(path);
		this.worker_.onmessage = evt =>
		{
			this.replyData(JSON.parse(evt.data));
		};
	}

	public close(): void
	{
		this.worker_.terminate();
	}
}