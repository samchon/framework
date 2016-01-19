/// <reference path="EntityArray.ts" />
///     <reference path="InvokeParameter.ts" />

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
     * @author Jeongho Nam
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

        public constructor(listener: string, begin: std.Iterator<InvokeParameter>, end: std.Iterator<InvokeParameter>);

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
                var listener: string = args[0];

                this.listener = listener;
            }
            else if (args.length == 1 && args[0] instanceof library.XML)
            {
                this.listener = "";
                var xml: library.XML = args[0];

                this.construct(xml);
            }
            else if (args.length == 1 && args[0] instanceof Invoke) 
            {
                var invoke: Invoke = args[0];

                this.listener = invoke.listener;
                this.assign(invoke.begin(), invoke.end());
            }
            else if (args.length == 3 && args[1] instanceof std.Iterator && args[2] instanceof std.Iterator)
            {
                var listener: string = args[0];
                var begin: std.Iterator<InvokeParameter> = args[1];
                var end: std.Iterator<InvokeParameter> = args[2];

                this.listener = listener;
                this.assign(begin, end);
            }
            else if (args.length > 1)
            {
                this.listener = args[0];

                for (var i: number = 1; i < args.length; i++)
                    this.pushBack(new InvokeParameter("", args[i]));
            }
        }
        
        /**
         * @inheritdoc
         */
        protected createChild(xml: library.XML): InvokeParameter
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
		    var args: Array<any> = [];
            for (var i: number = 0; i < this.size(); i++)
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
		
		    var func: Function = obj[this.listener];
		    var args: Array<any> = this.getArguments();

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