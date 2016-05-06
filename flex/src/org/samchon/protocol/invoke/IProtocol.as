package org.samchon.protocol.invoke
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
	 * @author Jeongho Nam <http://samchon.org>
	 */ 
	public interface IProtocol
	{
		/**
		 * <p> Reply a message. </p>
		 * <p> Handles replied Invoke message or shifts the responsibility to related chain. </p>
		 *
		 * @pram invoke An invoke message gotten from a network system. 
		 */ 
		function sendData(invoke:Invoke):void;
		
		/**
		 * <p> Send a message. </p>
		 * <p> Sends Invoke message to a network system or shifts the responsibility to related chain. </p>
		 * 
		 * @param invoke An Invoke message to send to a network system.
		 */
		function replyData(invoke:Invoke):void;
	}
}