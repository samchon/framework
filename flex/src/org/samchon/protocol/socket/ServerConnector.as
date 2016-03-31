package org.samchon.protocol.socket
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IEventDispatcher;
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
		extends Socket
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
			super();
			
			this.parent = parent;

			str = "";
			binaryInvoke = null;
			
			super.addEventListener(ProgressEvent.SOCKET_DATA, handleReply);
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
					this.writeBytes( invoke.at(i).getValue() );
			
			this.flush();
		}
		
		public function replyData(invoke:Invoke):void
		{
			parent.replyData(invoke);
		}
		
		protected function readString(byteArray:ByteArray):String
		{
			return byteArray.readUTFBytes(byteArray.bytesAvailable);
		}
		
		protected function writeString(str:String):void
		{
			this.writeUTFBytes(str);
		}
		
		/* ---------------------------------------------------------------------
			EVENT HANDLERS
		--------------------------------------------------------------------- */
		override public function addEventListener(type:String, listener:Function, useCapture:Boolean=false, priority:int=0, useWeakReference:Boolean=false):void
		{
			if (type == ProgressEvent.PROGRESS)
				return;
			
			super.addEventListener(type, listener, useCapture, priority, useWeakReference);
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
			this.readBytes(buffer);
			
			if (binaryInvoke == null)
				handleString(buffer);
			else
				handleBinary(buffer);
		}
		
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