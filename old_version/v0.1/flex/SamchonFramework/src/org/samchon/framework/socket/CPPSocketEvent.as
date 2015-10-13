package org.samchon.framework.socket
{
	import flash.events.Event;
	
	import org.samchon.framework.invoke.Invoke;

	public class CPPSocketEvent extends Event
	{
		public static const CONNECT:String = "cpp_socket_connect";
		public static const REPLY:String = "cpp_socket_reply";
		
		protected var _message:Invoke;
		
		public function CPPSocketEvent(type:String, $message:Invoke = null)
		{
			super(type);
			//super(type, bubbles, cancelable);
			_message = $message;
		}
		
		public function get message():Invoke
		{
			return _message;
		}
	}
}