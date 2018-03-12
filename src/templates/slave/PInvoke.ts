import { Invoke } from "../../protocol/invoke/Invoke";

import { SlaveSystem } from "./SlaveSystem";
import { InvokeHistory } from "./InvokeHistory";

/**
 * An {@link Invoke} message which represents a **process**.
 * 
 * 
 * 
 * #### [Inherited] {@link Invoke}
 * @copydoc Invoke
 */
export class PInvoke extends Invoke
{
	/**
	 * @hidden
	 */
	private history_: InvokeHistory;

	/**
	 * @hidden
	 */
	private slave_system_: SlaveSystem;

	/**
	 * @hidden
	 */
	private hold_: boolean;

	/* ---------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------- */
	/**
	 * Initializer Constructor.
	 * 
	 * @param invoke Original {@link Invoke} message.
	 * @param history {@link InvokeHistory} object archiving execution time.
	 * @param slaveSystem Related {@link SlaveSystem} object who gets those processes from its master. 
	 */
	public constructor(invoke: Invoke, history: InvokeHistory, slaveSystem: SlaveSystem)
	{
		// INVOKE'S CONSTRUCTION
		super(invoke.getListener());
		this.assign(invoke.begin(), invoke.end());

		// INITIALIZATION OF MEMBERS
		this.history_ = history;
		this.slave_system_ = slaveSystem;
		this.hold_ = false;
	}

	/* ---------------------------------------------------------
		ACCESSORS
	--------------------------------------------------------- */
	/**
	 * Get history object.
	 *
	 * Get {@link InvokeHistory} object who is archiving execution time of this process.
	 */
	public getHistory(): InvokeHistory
	{
		return this.history_;
	}

	/**
	 * Is the reporting hold?
	 */
	public isHold(): boolean
	{
		return this.hold_;
	}

	/**
	 * Hold reporting completion to master. 
	 */
	public hold(): void
	{
		this.hold_ = true;
	}

	/**
	 * Report completion.
	 */
	public complete(): void
	{
		this.history_.complete();

		this.slave_system_.sendData(this.history_.toInvoke());
	}
}