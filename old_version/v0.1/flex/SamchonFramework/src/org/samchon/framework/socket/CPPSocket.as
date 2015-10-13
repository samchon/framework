package org.samchon.framework.socket
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.net.SharedObject;
	import flash.net.Socket;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.utils.ByteArray;
	import flash.utils.Endian;
	
	import mx.controls.Alert;
	
	import org.samchon.framework.invoke.Invoke;
	import org.samchon.utils.StringUtil;

	public class CPPSocket extends EventDispatcher
	{
		private var socket:Socket;
		
		//FOR STRING
		private var str:String;
		
		//FOR BINARY
		private var binaryInvoke:Invoke;
		private var byteArray:ByteArray;
		private var pieceSize:int;
		
		/* ---------------------------------------------------------------------
			MAIN METHODS
		--------------------------------------------------------------------- */
		public function CPPSocket()
		{
			super();
			socket = new Socket();
			
			str = "";
			binaryInvoke = null;
			
			socket.addEventListener(Event.CONNECT, handleConnect);
			socket.addEventListener(IOErrorEvent.IO_ERROR, handleError);
			socket.addEventListener(ProgressEvent.SOCKET_DATA, handleReply);
		}
		public function connect(host:String, port:int):void
		{
			socket.connect(host, port);
		}
		public function sendData(invoke:Invoke):void
		{
			var str:String = invoke.toXML();
			socket.writeMultiByte(str, "unicode");
			
			socket.flush();
		}
		
		private function handleConnect(event:Event):void
		{
			//IDENTIFIER OF CLIENT: PAIR<IP, SO.DATA.ID>
			var id:String; 
			
			var so:SharedObject = SharedObject.getLocal("org.samchon.framework.socket.identifier", "/");
			if(so.data.id == null)
			{
				id = new Date().time + "_" + Math.random();
				so.data.id = id;
				so.flush();
			}
			else
				id = so.data.id;
			
			socket.writeMultiByte(id, "unicode");
			socket.flush();
			
			dispatchEvent(new CPPSocketEvent(CPPSocketEvent.CONNECT));
		}
		private function handleError(event:IOErrorEvent):void
		{
			dispatchEvent(event);
		}
		private function handleReply(event:ProgressEvent):void
		{
			var binary:ByteArray = new ByteArray();
			socket.readBytes(binary);
			
			if(binaryInvoke != null)
				replyBinary(binary);
			else
				replyString(binary);
		}
		
		/* ---------------------------------------------------------------------
			HANDLING STRING DATA
		--------------------------------------------------------------------- */
		private function replyString(binary:ByteArray):void
		{
			var binaryWithHeader:ByteArray = new ByteArray();
			
			if(binary[0] == 0xFE && binary[1] == 0xFE)
				binaryWithHeader.length = binary.length;
			else
			{
				binaryWithHeader.length = 2 + binary.length;
				binaryWithHeader.writeByte(0xFF);
				binaryWithHeader.writeByte(0xFE);
			}
			binaryWithHeader.writeBytes(binary);
			
			var buffer:String = binaryWithHeader.toString();
			str += buffer;
			
			//BUFFER SOMETIMES DO NOT CONTAINS ALL OF INVOKE
			if(buffer.indexOf("</invoke>") == -1)
				return;
			
			var invokeArray:Array = StringUtil.betweens(str, "<invoke", "</invoke>");
			
			for(var i:int = 0; i < invokeArray.length; i++)
			{
				var xmlStr:String = "<invoke" + invokeArray[i] + "</invoke>";
				var xml:XML = new XML(xmlStr);
				var invoke:Invoke = new Invoke(xml);
				
				if(i == invokeArray.length - 1)
				{
					var position:int = (buffer.lastIndexOf("</invoke>") + ("</invoke>").length)*2 + 2; //+2: HEADER
					if(invoke.length >= 2 && invoke.at(invoke.length - 2).getType() == "byteArray")
					{
						if(binaryWithHeader.length == position)
							position = -1;
						
						reserve(invoke, binaryWithHeader, position);
						str = "";
					}
					else
					{
						//OTHERWISDE, MULTIPLE INVOKES CAN BE THROWN
						str = str.substr( str.lastIndexOf("</invoke>") + ("</invoke>").length );
						dispatchEvent( new CPPSocketEvent(CPPSocketEvent.REPLY, invoke) );
					}
				}
				else
					dispatchEvent( new CPPSocketEvent(CPPSocketEvent.REPLY, invoke) );
			}
		}
		
		/* ---------------------------------------------------------------------
			HANDLING BINARY DATA
		--------------------------------------------------------------------- */
		private function reserve(invoke:Invoke, headerBinary:ByteArray, position:int = -1):void
		{
			this.binaryInvoke = invoke;
			
			byteArray = new ByteArray();
			byteArray.length = invoke.at(invoke.length - 1).getValue();
			
			if(position == -1)
			{
				pieceSize = 0;
			}
			else
			{
				var binary:ByteArray = new ByteArray();
				binary.writeBytes(headerBinary, position);
				
				replyBinary(binary);
			}
		}
		private function replyBinary(binary:ByteArray):void
		{
			pieceSize += binary.length;
			var exceededSize:int = pieceSize - byteArray.length;
			
			if(exceededSize > 0)
			{
				pieceSize = byteArray.length;
				byteArray.writeBytes(binary, 0, binary.length - exceededSize);
			}
			else
				byteArray.writeBytes(binary);
			
			if(pieceSize == byteArray.length)
			{
				binaryInvoke.at(binaryInvoke.length - 2).setValue(byteArray);
				binaryInvoke.removeItemAt(binaryInvoke.length - 1); //REMOVE SIZE
				
				dispatchEvent( new CPPSocketEvent(CPPSocketEvent.REPLY, binaryInvoke) );
				
				//CLEAR BINARY DATA
				binaryInvoke = null;
				byteArray = null;
				pieceSize = 0;
			}
			
			if(exceededSize > 0)
			{
				var stringBinary:ByteArray = new ByteArray();
				stringBinary.writeBytes(binary, binary.length - exceededSize);
				
				replyString(stringBinary);
			}
		}
	}
}