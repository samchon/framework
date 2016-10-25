/// <reference path="../API.ts" />

/// <reference path="EntityArray.ts" />
/// <reference path="Entity.ts" />

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
		public constructor(listener: string, ...parameters: Array<number|string|library.XML>);

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
				if (this[i].getName() == "_History_uid")
					continue;
				else
					args.push(this[i].getValue());

			return args;
		}

		/* -------------------------------------------------------------------
			APPLY BY FUNCTION POINTER
		------------------------------------------------------------------- */
		/**
		 * Apply to a matched function.
		 * 
		 * @param obj Target {@link IProtocol} object to find matched function.
		 * @return Whether succeded to find matched function.
		 */
		public apply(obj: IProtocol): boolean;

		/**
		 * Apply to a function.
		 * 
		 * @param thisArg Owner of the function.
		 * @param func Function to call.
		 */
		public apply(thisArg: IProtocol, func: Function): void;

		public apply(thisArg: IProtocol, func: Function = null): boolean | void
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

namespace samchon.protocol
{
	/**
	 * A parameter belongs to an Invoke.
	 * 
	 * ![Class Diagram](http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_message_protocol.png)
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class InvokeParameter
		extends Entity
	{
		/**
		 * Name of the parameter.
		 *
		 * @details Optional property, can be omitted.
		 */
		protected name: string = "";

		/**
		 * Type of the parameter.
		 */
		protected type: string = "";

		/** 
		 * Value of the parameter.
		 */
		protected value: string | number | library.XML | Uint8Array = null;

		/**
		 * Default Constructor.
		 */
		public constructor();

		public constructor(val: number);
		public constructor(val: string);
		public constructor(val: library.XML);
		public constructor(val: Uint8Array);

		/**
		 * Construct from variable name and number value.
		 * 
		 * @param name
		 * @param val
		 */
		public constructor(name: string, val: number);
		public constructor(name: string, val: string);
		public constructor(name: string, val: library.XML);
		public constructor(name: string, val: Uint8Array);
		
		/* -------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------- */
		public constructor(...args: any[])
		{
			super();

			// DEFAULT CONSTRUCTOR
			if (args.length == 0)
				return;

			// INITIALIZATION CONSTRUCTOR
			if (args.length == 1)
			{
				this.name = "";
				this.setValue(args[0]);
			}
			else
			{
				this.name = args[0];
				this.setValue(args[1]);
			}
		}

		/**
		 * @inheritdoc
		 */
		public construct(xml: library. XML): void
		{
			this.name = (xml.hasProperty("name")) ? xml.getProperty("name") : "";
			this.type = xml.getProperty("type");

			if (this.type == "XML")
				this.value = xml.begin().second.front();
			else if (this.type == "number")
				this.value = Number(xml.getValue());
			else if (this.type == "string")
				this.value = xml.getValue();
		}

		public setValue(value: number): void;
		public setValue(value: string): void;
		public setValue(value: library.XML): void;
		public setValue(value: Uint8Array): void;

		public setValue(value: number | string | library.XML | Uint8Array): void
		{
			this.value = value;

			if (value instanceof library.XML)
				this.type = "XML";
			else if (value instanceof Uint8Array)
				this.type = "ByteArray";
			else
				this.type = typeof value;
		}

		/* -------------------------------------------------------------------
			GETTERS
		------------------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public key(): any
		{
			return this.name;
		}

		/**
		 * Get name.
		 */
		public getName(): string
		{
			return this.name;
		}

		/**
		 * Get type.
		 */
		public getType(): string
		{
			return this.type;
		}

		/**
		 * Get value.
		 */
		public getValue(): any
		{
			return this.value;
		}

		/* -------------------------------------------------------------------
			EXPORTERS
		------------------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public TAG(): string
		{
			return "parameter";
		}
		
		/**
		 * @inheritdoc
		 */
		public toXML(): library.XML
		{
			let xml: library.XML = new library.XML();
			xml.setTag(this.TAG());

			if (this.name != "")
				xml.setProperty("name", this.name);
			xml.setProperty("type", this.type);

			// NOT CONSIDERED ABOUT THE BINARY DATA
			if (this.type == "XML")
				xml.push(this.value as library.XML);
			else if (this.type != "ByteArray")
				xml.setValue(this.value + "");

			return xml;
		}
	}
}