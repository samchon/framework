/// <reference path="../API.ts" />

/// <reference path="EntityContainer.ts" />

namespace samchon.protocol
{
	/**
	 * <p> Standard message of network I/O. </p>
	 * <p> Invoke is a class used in network I/O in protocol package of Samchon Framework. </p>
	 *
	 * <p> The Invoke message has an XML structure like the result screen of provided example in below. 
	 * We can enjoy lots of benefits by the normalized and standardized message structure used in
	 * network I/O. </p>
	 *
	 * <p> The greatest advantage is that we can make any type of network system, even how the system 
	 * is enourmously complicated. As network communication message is standardized, we only need to
	 * concentrate on logical relationships between network systems. We can handle each network system 
	 * like a object (class) in OOD. And those relationships can be easily designed by using design
	 * pattern. </p>
	 *
	 * <p> In Samchon Framework, you can make any type of network system with basic 3 + 1 componenets
	 * (IProtocol, IServer and IClient + ServerConnector), by implemens or inherits them, like designing
	 * classes of S/W architecture. </p>
	 *
	 * @see IProtocol
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class Invoke
		extends EntityArray<InvokeParameter>
	{
		/**
		 * <p> Listener, represent function's name. </p>
		 */
		protected listener: string;

		/* -------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------- */
		public constructor(listener: string);

		/**
		 * Copy Constructor. 
		 *
		 * @param invoke
		 */
		public constructor(invoke: Invoke);

		public constructor(xml: library.XML);

		public constructor(listener: string, begin: std.VectorIterator<InvokeParameter>, end: std.VectorIterator<InvokeParameter>);

		public constructor(listener: string, ...parameters: any[]);

		public constructor(...args: any[])
		{
			super();

			if (args.length == 0)
			{
				this.listener = "";
			}
			else if (args.length == 1 && typeof args[0] == "string")
			{
				let listener: string = args[0];

				this.listener = listener;
			}
			else if (args.length == 1 && args[0] instanceof library.XML)
			{
				this.listener = "";
				let xml: library.XML = args[0];

				this.construct(xml);
			}
			else if (args.length == 1 && args[0] instanceof Invoke) 
			{
				let invoke: Invoke = args[0];

				this.listener = invoke.listener;
				this.assign(invoke.begin(), invoke.end());
			}
			else if (args.length == 3 && args[1] instanceof std.VectorIterator && args[2] instanceof std.VectorIterator)
			{
				let listener: string = args[0];
				let begin: std.VectorIterator<InvokeParameter> = args[1];
				let end: std.VectorIterator<InvokeParameter> = args[2];

				this.listener = listener;
				this.assign(begin, end);
			}
			else if (args.length > 1)
			{
				this.listener = args[0];

				for (let i: number = 1; i < args.length; i++)
					this.push_back(new InvokeParameter("", args[i]));
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
		 * <p> Get arguments for Function.apply(). </p>
		 *
		 * @return An array containing values of the contained parameters.
		 */
		public getArguments(): Array<any>
		{
			let args: Array<any> = [];
			for (let i: number = 0; i < this.size(); i++)
				args.push(this[i].getValue());

			return args;
		}

		/* -------------------------------------------------------------------
			APPLY BY FUNCTION POINTER
		------------------------------------------------------------------- */
		/**
		 * <p> Apply to a matched function. </p>
		 */
		public apply(obj: IProtocol): boolean
		{
			if (!(this.listener in obj && obj[this.listener] instanceof Function))
				return false;
		
			let func: Function = obj[this.listener];
			let args: Array<any> = this.getArguments();

			func.apply(obj, args);

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