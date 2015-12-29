package org.samchon.protocol.socket
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.SharedObject;
	import flash.net.Socket;
	import flash.system.System;
	import flash.utils.ByteArray;
	
	import mx.controls.Alert;
	
	import org.samchon.library.utils.StringUtil;
	import org.samchon.protocol.invoke.IProtocol;
	import org.samchon.protocol.invoke.Invoke;
	import org.samchon.protocol.invoke.InvokeParameter;
	import org.samchon.protocol.movie.Window;

	/**
	 * <p> A server connector for a physical client. </p>
	 *
	 * <p> ServerConnector is a class for a physical client connecting a server. If you want to connect 
	 * to a server,  then implements this ServerConnector and just override some methods like 
	 * getIP(), getPort() and replyData(). That's all. </p>
	 *
	 * <p> In Samchon Framework, package protocol, There are basic 3 + 1 components that can make any 
	 * type of network system in Samchon Framework. The basic 3 components are IProtocol, IServer and
	 * IClient. The last, surplus one is the ServerConnector. Looking around classes in 
	 * Samchon Framework, especially module master and slave which are designed for realizing 
	 * distributed processing systems and parallel processing systems, physical client classes are all 
	 * derived from this ServerConnector. </p>
	 *
	 * <img src="interface.png" />
	 *
	 * @author Jeongho Nam
	 */
	public class ServerConnector 
		extends EventDispatcher
		implements IProtocol
	{
		//BASIC MEMBERS
		/**
		 * <p> A Window object who listens and sends Invoke message. </p>
		 * 
		 * <ul>
		 * 	<li> ServerConnector.replyData(Invoke) -> parent.replyData(Invoke) </li>
		 * </ul>
		 */
		private var parent:IProtocol;
		
		/**
		 * <p> A socket for network I/O. </p>
		 */
		protected var socket:Socket;
		
		/**
		 * @private
		 */
		//private var bufferQueue:Vector.<ByteArray>;
		
		/**
		 * @private
		 */ 
		private var str:String;
		
		/**
		 * @private
		 */
		private var binaryInvoke:Invoke = null;
		
		/**
		 * @private
		 */
		private var binaryData:ByteArray = null;
		
		protected static const CLOSED_PARENTHESIS_SIZE:int = String("</invoke>").length;
		
		/* ---------------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------------- */
		/**
		 * <p> Construct from a window. </p>
		 * 
		 * @param parent A target object who will receive replied data from server
		 */
		public function ServerConnector(parent:IProtocol)
		{
			this.parent = parent;
			
			socket = new Socket();
			
			//bufferQueue = new Vector.<ByteArray>();
			str = "";
			binaryInvoke = null;
			
			socket.addEventListener(Event.CONNECT, handleConnect);
			socket.addEventListener(IOErrorEvent.IO_ERROR, handleError);
			socket.addEventListener(ProgressEvent.SOCKET_DATA, handleReply);
			socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, handleSecurityError);
		}
		
		/**
		 * <p> Connects to a cloud server with specified host and port. </p>
		 * 
		 * <p> If the connection fails immediately, either an event is dispatched or an exception is thrown: 
		 * an error event is dispatched if a host was specified, and an exception is thrown if no host 
		 * was specified. Otherwise, the status of the connection is reported by an event. 
		 * If the socket is already connected, the existing connection is closed first. </p>
		 * 
		 * @param host
		 * 		The name or IP address of the host to connect to. 
		 * 		If no host is specified, the host that is contacted is the host where the calling 
		 * 		file resides. If you do not specify a host, use an event listener to determine whether 
		 * 		the connection was successful.
		 * @param port 
		 * 		The port number to connect to.
		 * 
		 * @throws IOError
		 * 		No host was specified and the connection failed.
		 * @throws SecurityError
		 * 		This error occurs in SWF content for the following reasons: 
		 * 		Local untrusted SWF files may not communicate with the Internet. You can work around 
		 * 		this limitation by reclassifying the file as local-with-networking or as trusted.
		 */
		public function connect(ip:String, port:int):void
		{
			socket.connect(ip, port);
		}
		
		/* ---------------------------------------------------------------------
			SEND-DATA 
		--------------------------------------------------------------------- */
		/**
		 * Send <code>Invoke</code> message to the Server
		 * 
		 * @param invoke An <code>Invoke</code> message wants to send server
		 */
		public function sendData(invoke:Invoke):void
		{
			/*
			---------------------------------------------------------------------
				PROMISED STRUCTURE FOR BYTE-ARRAY
			---------------------------------------------------------------------
				<invoke listener="something">
					<!-- {... some parameters ...} -->
					<parameter name="byteArray" type="ByteArray">#size: 100</parameter>
				</invoke>
			---------------------------------------------------------------------
			*/
			if (invoke.length == 0)
				writeString("<invoke listener=\"" + invoke.getListener() + "\"></invoke>");
			else
				writeString(invoke.toXML().toXMLString());
			
			for (var i:int = 0; i < invoke.length; i++)
				if( invoke.at(i).getType() == "ByteArray")
					socket.writeBytes( invoke.at(i).getValue() );
			
			socket.flush();
		}
		public function replyData(invoke:Invoke):void
		{
			parent.replyData(invoke);
		}
		
		protected function readString(byteArray:ByteArray):String
		{
			//if (System.useCodePage == true)
				return byteArray.readUTFBytes(byteArray.bytesAvailable);
			//else
				//return byteArray.toString();
		}
		protected function writeString(str:String):void
		{
			socket.writeUTFBytes(str);
		}
		
		/* ---------------------------------------------------------------------
			HANDLERS
		--------------------------------------------------------------------- */
		/**
		 * @private
		 */
		private function handleConnect(event:Event):void
		{
			//IDENTIFIER OF CLIENT: PAIR<IP, SO.DATA.ID>
			/*var id:String; 
			
			var so:SharedObject = SharedObject.getLocal("org.samchon.framework.socket.identifier", "/");
			if(so.data.id == null)
			{
				id = new Date().time + "_" + Math.random();
				so.data.id = id;
				so.flush();
			}
			else
				id = so.data.id;
			
			socket.writeUTFBytes(id);
			socket.flush();*/
			
			dispatchEvent(event);
		}
		
		/**
		 * @private
		 */
		private function handleError(event:IOErrorEvent):void
		{
			dispatchEvent(event);
		}
		
		/**
		 * @private
		 */
		private function handleSecurityError(event:SecurityErrorEvent):void
		{
			dispatchEvent(event);
		}
		
		/* ---------------------------------------------------------------------
			HANDLING INVOKE DATA
		--------------------------------------------------------------------- */
		/**
		 * @private
		 */
		private function handleReply(event:ProgressEvent):void
		{
			var buffer:ByteArray = new ByteArray();
			socket.readBytes(buffer);
			
			if (binaryInvoke == null)
				handleString(buffer);
			else
				handleBinary(buffer);
			
			/*if (bufferQueue.length == 0)
				handleBuffer(buffer);
			else
				bufferQueue.push(buffer);*/
		}
		/*private function handleBuffer(_buffer:ByteArray):void
		{
			bufferQueue.push(_buffer);
			
			while (bufferQueue.length > 0)
			{
				var buffer:ByteArray = bufferQueue.splice(0, 1)[0];
				
				if (binaryInvoke == null)
					handleString(buffer);
				else
					handleBinary(buffer);
			}
		}*/
		
		//ONLY INVOKE
		/**
		 * @private
		 */
		protected function handleString(buffer:ByteArray):void
		{
			if (buffer.bytesAvailable == 0)
				return;
			
			// LIST OF INVOKE MESSAGES
			var invokeArray:Array = [];
			var i:int;
			
			// PREV INDEXES
			var prevStrSize:int = str.length;
			var prevPosition:int = buffer.position;
			
			// READ STRING
			var pieceString:String = readString(buffer);
			str += pieceString;

			var strArray:Array = StringUtil.betweens(str, "<invoke ", "</invoke>");
			
			for (i = 0; i < strArray.length; i++)
			{
				// CONSTRUCTS INVOKE MESSAGES
				var message:String = "<invoke " + strArray[i] + "</invoke>";	
				//trace(message);
				var xml:XML = new XML(message);
				
				invokeArray.push(new Invoke(xml));
			}
			
			if (invokeArray.length == 0)
				return;
				
			var lastIndex:int = str.lastIndexOf("</invoke>") + CLOSED_PARENTHESIS_SIZE;
			
			// CUT USED STRING
			buffer.position = lastIndex - prevStrSize;
			str = str.substr(lastIndex);
			
			// CALL REPLY_DATA
			for (i = 0; i < invokeArray.length - 1; i++)
				replyData(invokeArray[i]);
			
			// TEST WHETHER THE LAST CONTAINS BINARY DATA
			var lastInvoke:Invoke = invokeArray[invokeArray.length - 1];
			
			for (i = 0; i < lastInvoke.length; i++)
			{
				if (lastInvoke.at(i).getType() == "ByteArray")
				{
					this.binaryInvoke = lastInvoke;
					this.binaryData = null;
							
					handleBinary(buffer);
					return;
				}
			}
			
			// IF DOES NOT CONTAIN BINARY DATA, CALL DIRECTLY
			replyData(lastInvoke);
		}
		
		//INVOKE WITH BINARY DATA
		
		/**
		 * @private
		 */
		private function handleBinary(buffer:ByteArray):void
		{
			if (buffer.bytesAvailable == 0)
				return;
			
			var binaryIndex:int = -1;
			var binarySize:int = -1;
			var i:int;
			
			// FIND MATCHED BYTE-ARRAY
			for (i = 0; i < binaryInvoke.length; i++)
				if (binaryInvoke.at(i).getType() == "ByteArray" && !(binaryInvoke.at(i).getValue() is ByteArray))
				{
					if (binaryData == null)
					{
						binaryData = new ByteArray();
					}
						
					binaryIndex = i;
					binarySize = binaryInvoke.at(i).getValue();
					
					break;
				}
			
			// READ BYTE-ARRAY
			buffer.readBytes
			(
				binaryData,
				binaryData.length,
				Math.min(buffer.bytesAvailable, binarySize - binaryData.length)
			);
			
			if (binaryData.length < binarySize)
				return;
			
			// DETERMINE
			binaryInvoke.at(binaryIndex).setValue(binaryData);
			
			// IF NOT LAST BINARY
			for (i = binaryIndex + 1; i < binaryInvoke.length; i++)
				if (binaryInvoke.at(i).getType() == "ByteArray")
					return;
			
			replyData(binaryInvoke);
			
			binaryInvoke = null;
			binaryData = null;
			
			handleString(buffer);
		}
	}
}