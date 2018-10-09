import { HashMap } from "tstl/container/HashMap";
import { Pair, make_pair } from "tstl/utility/Pair";

import { Invoke, IFunction, IReturn } from "./Invoke";

export abstract class CommunicatorBase<Listener extends object = {}>
{
	/**
	 * @hidden
	 */
	protected listener_: Listener;

	/**
	 * @hidden
	 */
	private static SEQUENCE: number = 0;

	/**
	 * @hidden
	 */
	private promises_: HashMap<number, Pair<Function, Function>>;

	/* ----------------------------------------------------------------
		CONSTRUCTORS
	---------------------------------------------------------------- */
	public constructor(listener: Listener = null)
	{
		this.listener_ = listener;
		this.promises_ = new HashMap();
	}

	public async destroy(): Promise<void>
	{
		for (let entry of this.promises_)
		{
			let reject: Function = entry.second.second;
			reject();
		}
		this.promises_.clear();
	}

	/* ----------------------------------------------------------------
		ACCESSORS
	---------------------------------------------------------------- */
	public getDriver<Feature extends object>(): Feature
	{
		return new Proxy<Feature>({} as Feature,
		{
			get: (target: Feature, name: string) =>
			{
				target; // TO AVOID THE UNUSED PARAMETER ERROR
				return (...params: any[]) =>
				{
					return this._Call_function(name, ...params);
				};
			}
		});
	}

	/**
	 * @hidden
	 */
	private _Call_function(name: string, ...params: any[]): Promise<any>
	{
		return new Promise((resolve, reject) =>
		{
			// CONSTRUCT INVOKE MESSAGE
			let invoke: IFunction =
			{
				uid: ++CommunicatorBase.SEQUENCE,
				name: name,
				params: params
			};

			// DO SEND WITH PROMISE
			this.promises_.emplace(invoke.uid, make_pair(resolve, reject));
			this.sendData(invoke);
		});
	}

	/* ----------------------------------------------------------------
		COMMUNICATORS
	---------------------------------------------------------------- */
	public abstract sendData(invoke: Invoke): void;

	public replyData(invoke: Invoke): void
	{
		if ((invoke as IFunction).name)
			this._Handle_function(invoke as IFunction);
		else
			this._Handle_return(invoke as IReturn);
	}

	/**
	 * @hidden
	 */
	private _Handle_function(invoke: IFunction): void
	{
		let uid: number = invoke.uid;
		let func: Function = (this.listener_ as any)[invoke.name];

		try
		{
			// CALL FUNCTION
			let ret: any = func(...invoke.params);

			// RETURNS
			if (ret.then instanceof Function) // Async
				ret.then(this._Send_return.bind(this, uid, true))
				   .catch(this._Send_return.bind(this, uid, false));
			else
				this._Send_return(uid, true, ret); // Sync
		}
		catch (exp)
		{
			this._Send_return(uid, false, exp);
		}
	}

	/**
	 * @hidden
	 */
	private _Handle_return(invoke: IReturn): void
	{
		// GET THE PROMISE OBJECT
		let it = this.promises_.find(invoke.uid);
		if (it.equals(this.promises_.end()))
			return;

		// RETURNS
		let func: Function = invoke.success 
			? it.second.first 
			: it.second.second;
		this.promises_.erase(it);
		
		func(invoke.value); 
	}

	/**
	 * @hidden
	 */
	private _Send_return(uid: number, flag: boolean, val: any): void
	{
		let ret: IReturn = {uid: uid, success: flag, value: val};
		this.sendData(ret);
	}
}