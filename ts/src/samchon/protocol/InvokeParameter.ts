/// <reference path="../API.ts" />

/// <reference path="Entity.ts" />

namespace samchon.protocol
{
	/**
	 * A parameter belongs to an Invoke.
	 *
	 * @see Invoke
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class InvokeParameter
		extends Entity
	{
		/**
		 * <p> Name of the parameter. </p>
		 *
		 * @details Optional property, can be omitted.
		 */
		protected name: string = "";

		/**
		 * <p> Type of the parameter. </p>
		 */
		protected type: string = "";

		/** 
		 * <p> Value of the parameter. </p>
		 */
		protected value: any = null;

		/**
		 * Default Constructor.
		 */
		public constructor();

		/**
		 * Initialization Constructor without type specification.
		 * 
		 * @param name
		 * @param val
		 */
		public constructor(name: string, val: any);

		/**
		 * Initialization Constructor.
		 * 
		 * @param name
		 * @param type
		 * @param val
		 */
		public constructor(name: string, type: string, val: any);

		/* -------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------- */
		public constructor(...args: any[])
		{
			super();

			if (args.length == 0)
				return;
			else if (args.length == 2)
			{
				this.name = args[0];
				this.value = args[1];
			}
			else if (args.length == 3)
			{
				this.name = args[0];
				this.value = args[2];
			}

			this.type = typeof this.value;
			if (this.value instanceof library.XML)
				this.type = "XML";
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
				this.value = parseFloat(xml.getValue());
			else
				this.value = xml.getValue();
		}

		public setValue(value: any): void
		{
			this.value = value;
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

			xml.setProperty("name", this.name);
			xml.setProperty("type", this.type);

			// NOT CONSIDERED ABOUT THE BINARY DATA
			if (this.type == "XML")
				xml.push(this.value);
			else if (this.type != "ByteArray")
				xml.setValue(this.value);

			return xml;
		}
	}
}