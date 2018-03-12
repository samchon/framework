import * as std from "tstl";

import { IProtocol } from "../../protocol/invoke/IProtocol";
import { ICommunicator } from "../../protocol/communicator/ICommunicator";

import { InvokeHistory } from "./InvokeHistory";
import { PInvoke } from "./PInvoke";
import { Invoke } from "../../protocol/invoke/Invoke";
import { InvokeParameter } from "../../protocol/invoke/InvokeParameter";

/**
 * A slave system.
 * 
 * @author Jeongho Nam <http://samchon.org>
 */
export abstract class SlaveSystem
	implements IProtocol
{
	/**
	 * @hidden
	 */
	protected communicator_: ICommunicator;

	/* ---------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------- */
	/**
	 * Default Constructor.
	 */
	public constructor()
	{
		this.communicator_ = null;
	}

	/* ---------------------------------------------------------
		INVOKE MSSAGE CHIAN
	--------------------------------------------------------- */
	public sendData(invoke: Invoke): void
	{
		this.communicator_.sendData(invoke);
	}

	public abstract replyData(invoke: Invoke): void | Promise<void>;

	/**
	 * @hidden
	 */
	protected _Reply_data(invoke: Invoke): void
	{
		// INTERCEPT INVOKE MESSAGE
		if (invoke.has("_History_uid"))
		{
			// INIT HISTORY - WITH START TIME
			let history: InvokeHistory = new InvokeHistory(invoke);
			invoke.erase
			(
				std.remove_if(invoke.begin(), invoke.end(), function (parameter: InvokeParameter): boolean
				{
					return parameter.getName() == "_History_uid"
						|| parameter.getName() == "_Process_name"
						|| parameter.getName() == "_Process_weight";
				}),
				invoke.end()
			); // DETACH THE UID FOR FUNCTION AUTO-MATCHING

			// MAIN PROCESS - REPLY_DATA
			let pInvoke: PInvoke = new PInvoke(invoke, history, this);
			let ret: Promise<void> = this.replyData(pInvoke) as Promise<void>; // NOTHING OR PROMISE

			if (ret instanceof Function && ret.then instanceof Function && ret.catch instanceof Function)
			{
				ret.then(() =>
				{
					this._Complete_process(pInvoke);
				});
			}
			else
				this._Complete_process(pInvoke);
		}
		else
			this.replyData(invoke);
	}

	private _Complete_process(pInvoke: PInvoke): void
	{
		// NOTIFY - WITH END TIME
		if (pInvoke.isHold() == false)
			pInvoke.complete();
	}
}