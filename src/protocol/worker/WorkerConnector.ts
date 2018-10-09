import { CommunicatorBase } from "../CommunicatorBase";
import { Invoke } from "../Invoke";

export class WorkerConnector<Listener extends Object = {}> 
	extends CommunicatorBase<Listener>
{
	/**
	 * @hidden
	 */
	private worker_: Worker;

	public constructor(listener: Listener = null)
	{
		super(listener);
	}

	public connect(jsFile: string): void
	{
		this.worker_ = new Worker(jsFile);
		this.worker_.onmessage = evt =>
		{
			this.replyData(JSON.parse(evt.data));
		};
	}

	public close(): void
	{
		this.worker_.terminate();
	}

	public sendData(invoke: Invoke): void
	{
		this.worker_.postMessage(JSON.stringify(invoke));
	}
}