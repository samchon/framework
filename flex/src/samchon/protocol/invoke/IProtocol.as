package samchon.protocol.invoke
{
	/**
	 * 
	 */ 
	public interface IProtocol
	{
		/**
		 * Sends <code>Invoke</code> message to Server-side or shift responsibility to chain
		 * 
		 * @param invoke An <code>Invoke</code> message wants to send server
		 * @see Invoke
		 */
		function sendData(invoke:Invoke):void;
		
		/**
		 * Handles replied message from server or shift responsibility to chain
		 * 
		 * @param invoke An <code>Invoke</code> message will be handled
		 * @see Invoke
		 */
		function replyData(invoke:Invoke):void;
	}
}