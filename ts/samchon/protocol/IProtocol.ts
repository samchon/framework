/// <reference path="Invoke.ts" />

namespace samchon.protocol
{
    /**
     * <p> An interface for Invoke message chain. </p>
     * 
     * <p> IProtocol is an interface for Invoke message, which is standard message of network I/O 
     * in Samchon Framework, chain. The IProtocol interface is used to network drivers and some 
     * classes which are in a relationship of chain of responsibility with those network drivers. </p>
     * 
     * <p> In Samchon Framework, server side, IProtocol is one of the basic 3 + 1 components that 
     * can make any type of network system in Samchon Framework with IServer and IClient. Following 
     * the "chain of responsibility" pa1ttern, looking around classes in Samchon Framework, you 
     * can see all related classes with network I/O are implemented from the IProtocol. </p>
     *
     * @see Invoke 
     * @author Jeongho Nam
     */
    export interface IProtocol
    {
        /**
	     * <p> Sending message. </p>
	     * <p> Sends message to related system or shifts the responsibility to chain. </p>
         *
	     * @param invoke Invoke message to send
	     */
        replyData(invoke: Invoke): void;

        /**
	     * <p> Handling replied message. </p>
	     * <p> Handles replied message or shifts the responsibility to chain. </p>
         *
	     * @param invoke Replied invoke message 
	     */
        sendData(invoke: Invoke): void;
    }
}