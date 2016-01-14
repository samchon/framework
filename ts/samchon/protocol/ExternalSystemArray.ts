/// <reference path="../API.ts" />

/// <reference path="EntityArray.ts" />
///     <reference path="ExternalSystem.ts" />
/// <reference path="IProtocol.ts" />

namespace samchon.protocol
{
    /**
     * <p> An array of ExternalSystem(s). </p>
     *
     * <p> ExternalSystemArray is an abstract class containing and managing external system drivers. </p>
     *
     * <p> Also, ExternalSystemArray can access to ExternalSystemRole(s) directly. With the method, you
     * can use an ExternalSystemRole as "logical proxy" of an ExternalSystem. Of course, the 
     * ExternalSystemRole is belonged to an ExternalSystem. However, if you access an ExternalSystemRole 
     * from an ExternalSystemArray directly, not passing by a belonged ExternalSystem, and send an Invoke 
     * message even you're not knowing which ExternalSystem is related in, the ExternalSystemRole acted 
     * a role of proxy. </p>
     *
     * <p> It's called as "Proxy pattern". With the pattern, you can only concentrate on 
     * ExternalSystemRole itself, what to do with Invoke message, irrespective of the ExternalSystemRole 
     * is belonged to which ExternalSystem. </p>
     *
     * <ul>
     *  <li> ExternalSystemArray::getRole("something")->sendData(invoke); </li>
     * </ul>
     *
     * @author Jeongho Nam
     */
    export class ExternalSystemArray
        extends EntityArray<ExternalSystem>
        implements IProtocol
    {
        /* ------------------------------------------------------------------
		    CONSTRUCTORS
	    ------------------------------------------------------------------ */
        /**
         * Default Constructor.
         */
        public constructor()
        {
            super();
        }

        /**
	     * <p> Start interaction. </p> 
	     * <p> An abstract method starting interaction with external systems. </p>
	     *
	     * <p> If external systems are servers, starts connection to them, else clients, opens a server
	     * and accepts the external systems. You can addict your own procudures of starting drivers, but
	     * if you directly override method of abstract ExternalSystemArray, be careful about virtual 
	     * inheritance. </p>
	     */
        public start(): void
        {
            for (var i: number = 0; i < this.size(); i++)
                this.at(i).start();
        }

        /* ------------------------------------------------------------------
	        GETTERS
        ------------------------------------------------------------------ */
        /**
	     * <p> Test whether has a role. </p>
	     *
	     * @param name Name of an ExternalSystemRole.
	     * @return Whether has or not.
	     */
        public hasRole(key: string): boolean
        {
            for (var i: number = 0; i < this.size(); i++)
                if (this.at(i).has(key) == true)
                    return true;

            return false;
        }
    
        /**
	     * <p> Get a role. </p>
	     *
	     * @param name Name of an ExternalSystemRole
	     * @return A shared pointer of specialized role
	     */
        public getRole(key: string): ExternalSystemRole
        {
            for (var i: number = 0; i < this.size(); i++)
                if (this.at(i).has(key) == true)
                    return this.at(i).get(key);

            throw Error("out of range");
        }

        /* ------------------------------------------------------------------
	        CHAIN OF INVOKE MESSAGE
        ------------------------------------------------------------------ */
        public sendData(invoke: Invoke): void
        {
            var listener: string = invoke.getListener();

            for (var i: number = 0; i < this.size(); i++)
                for (var j: number = 0; j < this.at(i).size(); j++)
                    if (this.at(i).at(j).hasSendListener(listener) == true)
                        this.at(i).sendData(invoke);
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
            return "systemArray";
        }
        public CHILD_TAG(): string
        {
            return "system";
        }
    }
}