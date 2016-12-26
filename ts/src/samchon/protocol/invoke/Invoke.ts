/// <reference path="../../API.ts" />

/// <reference path="../entity/EntityArray.ts" />

namespace samchon.protocol
{
	/**
	 * Standard message of network I/O.
	 * 
	 * {@link Invoke} is a class used in network I/O in protocol package of Samchon Framework.
	 *
	 * The Invoke message has an XML structure like the result screen of provided example in below. 
	 * We can enjoy lots of benefits by the normalized and standardized message structure used in
	 * network I/O.
	 *
	 * The greatest advantage is that we can make any type of network system, even how the system 
	 * is enourmously complicated. As network communication message is standardized, we only need to
	 * concentrate on logical relationships between network systems. We can handle each network system 
	 * like a object (class) in OOD. And those relationships can be easily designed by using design
	 * pattern.
	 *
	 * In Samchon Framework, you can make any type of network system with basic componenets
	 * (IProtocol, IServer and ICommunicator) by implemens or inherits them, like designing
	 * classes of S/W architecture.
	 *
	 * ![Class Diagram](http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_message_protocol.png)
	 *
	 * @see {@link IProtocol}
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class Invoke
		extends EntityArray<InvokeParameter>
	{
		/**
		 * Listener, represent function's name.
		 */
		private listener: string = "";

		/* -------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor();

		public constructor(listener: string);

		/**
		 * Copy Constructor. 
		 *
		 * @param invoke
		 */
		public constructor(invoke: Invoke);

		/**
		 * Construct from listener and parametric values.
		 * 
		 * @param listener
		 * @param parameters
		 */
		public constructor(listener: string, ...parameters: Array<boolean|number|string|library.XML|Uint8Array>);

		public constructor(...args: any[])
		{
			super();

			if (args.length == 0)
			{
				this.listener = "";
			}
			else
			{
				this.listener = args[0];

				for (let i: number = 1; i < args.length; i++)
					this.push_back(new InvokeParameter(args[i]));
			}
		}
		
		/**
		 * @inheritdoc
		 */
		public createChild(xml: library.XML): InvokeParameter
		{
			return new InvokeParameter();
		}

		/* -------------------------------------------------------------------
			GETTERS
		------------------------------------------------------------------- */ 
		/**
		 * Get listener.
		 */ 
		public getListener(): string
		{
			return this.listener;
		}

		/**
		 * Get arguments for Function.apply().
		 *
		 * @return An array containing values of the contained parameters.
		 */
		public getArguments(): Array<any>
		{
			let args: Array<any> = [];

			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i).getName() == "_History_uid")
					continue;
				else
					args.push(this.at(i).getValue());

			return args;
		}

		/* -------------------------------------------------------------------
			APPLY BY FUNCTION POINTER
		------------------------------------------------------------------- */
		/**
		 * Apply to a matched function.
		 * 
		 * @param obj Target object to find matched function.
		 * @return Whether succeded to find matched function.
		 */
		public apply(obj: Object): boolean;

		/**
		 * Apply to a function.
		 * 
		 * @param thisArg Owner of the function.
		 * @param func Function to call.
		 */
		public apply(thisArg: Object, func: Function): void;

		public apply(thisArg: Object, func: Function = null): boolean | void
		{
			let argArray: any[] = this.getArguments();
			
			if (func == null)
			{
				if (!(this.listener in thisArg && (thisArg as any)[this.listener] instanceof Function))
					return false;

				func = (thisArg as any)[this.listener];
			}

			func.apply(thisArg, argArray);
			return true;
		}

		/* -------------------------------------------------------------------
			EXPORTERS
		------------------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public TAG(): string
		{
			return "invoke";
		}

		/**
		 * @inheritdoc
		 */
		public CHILD_TAG(): string 
		{
			return "parameter";
		}
	}
}
