/// <reference path="../API.ts" />

/// <reference path="EntityArray.ts" />
///     <reference path="ExternalSystemRole.ts" />
/// <reference path="IProtocol.ts" />

/// <reference path="ServerConnector.ts" />

namespace samchon.protocol
{
    /**
     * <p> A network driver for an external system. </p>
     *
     * <p> ExternalSystem is a boundary class interacting with an external system by network communication.
     * Also, ExternalSystem is an abstract class that a network role, which one is server and which one is 
     * client, is not determined yet. </p>
     *
     * <p> The ExternalSystem has ExternalSystemRole(s) groupped methods, handling Invoke message
     * interacting with the external system, by subject or unit of a moudle. The ExternalSystemRole is 
     * categorized in a 'control'. </p>
     *
     * <h4> Note </h4>
     * <p> The ExternalSystem class takes a role of interaction with external system in network level.
     * However, within a framework of Samchon Framework, a boundary class like the ExternalSystem is
     * not such important. You can find some evidence in a relationship between ExternalSystemArray,
     * ExternalSystem and ExternalSystemRole. </p>
     *
     * <p> Of course, the ExternalSystemRole is belonged to an ExternalSystem. However, if you 
     * access an ExternalSystemRole from an ExternalSystemArray directly, not passing by a belonged
     * ExternalSystem, and send an Invoke message even you're not knowing which ExternalSystem is
     * related in, it's called "Proxy pattern".
     *
     * <p> Like the explanation of "Proxy pattern", you can utilize an ExternalSystemRole as a proxy
     * of an ExternalSystem. With the pattern, you can only concentrate on ExternalSystemRole itself, 
     * what to do with Invoke message, irrespective of the ExternalSystemRole is belonged to which 
     * ExternalSystem. </p>
     *
     * @author Jeongho Nam
     */
    export class ExternalSystem
        extends EntityArray<ExternalSystemRole>
        implements IProtocol
    {
        /**
         * <p> A driver for interacting with (real, physical) external system. </p>
         */
        protected driver: ServerConnector;

        /**
	     * <p> A name can identify an external system. </p>
	     *
	     * <p> The name must be unique in ExternalSystemArray. </p>
	     */
        protected name: string;

        /**
         * <p> An ip address of an external system. </p>
         */
        protected ip: string;

        /**
         * <p> A port number of an external system. </p>
         */
        protected port: number;

        /* ------------------------------------------------------------------
		    CONSTRUCTORS
	    ------------------------------------------------------------------ */
        /**
         * <p> Default Constructor. </p>
         */
        public constructor()
        {
            super();

            this.driver = null;
        }

        /**
	     * <p> Start interaction. </p>
	     * <p> An abstract method starting interaction with an external system. </p>
	     *
	     * <p> If an external systems are a server, starts connection and listening Inovoke message, 
	     * else clients, just starts listening only. You also can addict your own procudures of starting 
	     * the driver, but if you directly override method of abstract ExternalSystem, be careful about 
	     * virtual inheritance. </p>
	     */
        public start(): void
        {
            if (this.driver != null)
                return;

            this.driver = new ServerConnector(this);
            this.driver.connect(this.ip, this.port);
        }

        /* ------------------------------------------------------------------
		    GETTERS
	    ------------------------------------------------------------------ */
        public key(): any
        {
            return this.name;
        }

        /**
         * <p> Get name. </p>
         */
        public getName(): string
        {
            return this.name;
        }

        /**
         * <p> Get ip address of the external system. </p>
         */
        public getIP(): string
        {
            return this.ip;
        }

        /**
         * <p> Get port number of the external system. </p>
         */
        public getPort(): number
        {
            return this.port;
        }

        /* ------------------------------------------------------------------
		    CHAIN OF INVOKE MESSAGE
	    ------------------------------------------------------------------ */
        public sendData(invoke: Invoke): void
        {
            this.driver.sendData(invoke);
        }
        public replyData(invoke: Invoke): void
        {
            invoke.apply(this);

            for (var i: number = 0; i < this.size(); i++)
                this[i].replyData(invoke);
        }

         /* ------------------------------------------------------------------
		    EXPORTERS
	    ------------------------------------------------------------------ */
        public TAG(): string
        {
            return "system";
        }
        public CHILD_TAG(): string
        {
            return "role";
        }
    }
}