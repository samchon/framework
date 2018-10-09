import * as cp from "child_process";

import { CommunicatorBase } from "../CommunicatorBase";
import { Invoke } from "../Invoke";

export class ProcessConnector<Listener extends object = {}> 
	extends CommunicatorBase<Listener>
{
	/**
	 * @hidden
	 */
	private child_: cp.ChildProcess;

	public constructor(listener: Listener = null)
	{
		super(listener);
	}

	public connect(jsFile: string, args: string[] = []): void
	{
		this.child_ = cp.fork(jsFile, args);
		this.child_.on("message", msg =>
		{
			this.replyData(JSON.parse(msg));
		});
	}

	public close(): void
	{
		this.child_.kill();
	}

	public sendData(invoke: Invoke): void
	{
		this.child_.send(JSON.stringify(invoke));
	}
}