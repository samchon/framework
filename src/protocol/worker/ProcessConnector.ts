import { Communicator } from "../Communicator";

import * as std from "tstl";
import * as cp from "child_process";
import { IReturn } from "../Invoke";

export class ProcessConnector<Listener extends object = {}> 
	extends Communicator<Listener>
{
	/**
	 * @hidden
	 */
	private child_: cp.ChildProcess;

	public constructor(listener: Listener = null)
	{
		super(invoke =>
		{
			this.child_.send(JSON.stringify(invoke));
		}, listener);
	}

	public connect(jsFile: string): void
	{
		this.child_ = cp.fork(jsFile);
		this.child_.on("message", msg =>
		{
			this.replyData(JSON.parse(msg));
		});
	}

	public close(): void
	{
		// this.child_.kill();
	}

	protected _Handle_return(invoke: IReturn): void
	{
		let exists: boolean = false;
		for (let entry of this.promises_)
			if (entry.first === invoke.uid)
				exists = true;
		
		console.log(invoke, this.promises_.has(invoke.uid), exists);
		if (this.promises_.has(invoke.uid) === false)
		{
			let hash: number = std.hash(invoke.uid);
			console.log("\t", "hash", 
				hash, 
				this.promises_.bucket(invoke.uid),
				this.promises_.buckets_.at(this.promises_.bucket(invoke.uid))
			);
		}

		super._Handle_return(invoke);
	}
}