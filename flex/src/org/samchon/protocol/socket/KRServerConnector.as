package org.samchon.protocol.socket
{
	import flash.system.System;
	import flash.utils.ByteArray;
	
	import org.samchon.library.utils.StringUtil;
	import org.samchon.protocol.invoke.IProtocol;
	import org.samchon.protocol.invoke.Invoke;
	
	public class KRServerConnector extends ServerConnector
	{
		public function KRServerConnector(parent:IProtocol)
		{
			super(parent);
		}
		
		override protected function readString(byteArray:ByteArray):String
		{			
			if (System.useCodePage == true)
				return byteArray.toString();
			else
				return byteArray.readMultiByte(byteArray.bytesAvailable, "euc-kr");
		}
		override protected function writeString(str:String):void
		{
			socket.writeMultiByte(str, "euc-kr");
		}
	}
}