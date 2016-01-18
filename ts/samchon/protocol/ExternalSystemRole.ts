/// <reference path="../API.ts" />

/// <reference path="IProtocol.ts" />

/// <reference path="ExternalSystem.ts" />
/// <reference path="../../std/UnorderedSet.ts" />

namespace samchon.protocol
{
    /**
     * <p> A role belongs to an external system. </p>
     *
     * <p> ExternalSystemRole is a 'control' class groupping methods, handling Invoke messages 
     * interacting with an external system that the ExternalSystemRole is belonged to, by a subject or 
     * unit of a module. <p>
     *
     * <p> ExternalSystemRole can be a "logical proxy" for an ExternalSystem which is containing the 
     * ExternalSystemRole. Of course, the ExternalSystemRole is belonged to an ExternalSystem. However, 
     * if you access an ExternalSystemRole from an ExternalSystemArray directly, not passing by a 
     * belonged ExternalSystem, and send an Invoke message even you're not knowing which ExternalSystem 
     * is related in, the ExternalSystemRole acted a role of proxy. </p>
     *
     * <p> It's called as "Proxy pattern". With the pattern, you can only concentrate on 
     * ExternalSystemRole itself, what to do with Invoke message, irrespective of the ExternalSystemRole 
     * is belonged to which ExternalSystem. </p>
     *
     * @author Jeongho Nam
     */
    export class ExternalSystemRole
        extends Entity
        implements IProtocol
    {
        /**
	     * <p> A driver of external system containing the ExternalSystemRole. </p>
	     */
        protected system: ExternalSystem;

        /**
	     * <p> A name representing the role. </p>
         */
        protected name: string;

        protected sendListeners: std.UnorderedSet<string>;

        /* ------------------------------------------------------------------
		    CONSTRUCTORS
	    ------------------------------------------------------------------ */
        /**
	     * <p> Construct from external system driver. </p>
	     *
	     * @param system A driver of external system the ExternalSystemRole is belonged to.
	     */
        public constructor(system: ExternalSystem)
        {
            super();

            this.system = system;
            this.sendListeners = new std.UnorderedSet<string>();
        }
        public construct(xml: library.XML): void
        {
            super.construct(xml);
        }

        /* ------------------------------------------------------------------
		    GETTERS
	    ------------------------------------------------------------------ */
        public getName(): string
        {
            return this.name;
        }
        public hasSendListener(key: string): boolean
        {
            return this.sendListeners.has(key);
        }

        /* ------------------------------------------------------------------
		    CHAIN OF INVOKE MESSAGE
	    ------------------------------------------------------------------ */
        public sendData(invoke: Invoke): void
        {
            this.system.sendData(invoke);
        }
        public replyData(invoke: Invoke): void
        {
            invoke.apply(this);
        }

        /* ------------------------------------------------------------------
		    EXPORTERS
	    ------------------------------------------------------------------ */
        public TAG(): string
        {
            return "role";
        }
        public toXML(): library.XML
        {
            var xml: library.XML = super.toXML();
            
            return xml;
        }
    }
}