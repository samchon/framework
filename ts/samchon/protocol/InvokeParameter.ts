/// <reference path="Entity.ts" />

namespace samchon.protocol
{
    /**
     * A parameter belongs to an Invoke.
     *
     * @see Invoke
     * @author Jeongho Nam
     */
    export class InvokeParameter
        extends Entity
    {
        /**
	     * <p> Name of the parameter. </p>
	     *
	     * @details Optional property, can be omitted.
	     */
        protected name: string;

        /**
	     * <p> Type of the parameter. </p>
	     */
        protected type: string;

        /** 
	     * <p> Value of the parameter. </p>
	     */
        protected value: any;

        public constructor();
        public constructor(val: any);
        public constructor(name: string, val: any);

        /* -------------------------------------------------------------------
		    CONSTRUCTORS
	    ------------------------------------------------------------------- */
        public constructor(...args: any[])
        {
            super();
        }

        public construct(xml: library. XML): void
        {
        }

        /* -------------------------------------------------------------------
		    GETTERS
	    ------------------------------------------------------------------- */
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
        public TAG(): string
        {
            return "parameter";
        }
        
        public toXML(): library.XML
        {
            var xml: library.XML = super.toXML();

            if (this.name != "")
                xml.setProperty("name", this.name);
            xml.setProperty("type", this.type);

            // NOT CONSIDERED ABOUT THE BINARY DATA
            xml.setProperty("value", this.value);

            return xml;
        }
    }
}