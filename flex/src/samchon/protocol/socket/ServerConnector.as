package samchon.protocol.socket
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.SharedObject;
	import flash.net.Socket;
	import flash.utils.ByteArray;
	
	import samchon.library.utils.StringUtil;
	import samchon.protocol.invoke.IProtocol;
	import samchon.protocol.invoke.Invoke;
	import samchon.protocol.invoke.InvokeParameter;
	import samchon.protocol.movie.Window;

	/**
	 * <p> A cloud server connector built by Samchon Framework. </p>
	 * 
	 * @see IProtocol
	 * @see Invoke
	 * 
	 * @see Jeongho Nam
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
		private var window:Window;
		
		/**
		 * <p> A socket for network I/O. </p>
		 */
		private var socket:Socket;
		
		/**
		 * @private
		 */ 
		private var str:String;
		
		/**
		 * @private
		 */
		private var binaryInvoke:Invoke;
		
		/* ---------------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------------- */
		/**
		 * <p> Construct from a window. </p>
		 * 
		 * 
		 * @param listener A IProtocol object to get replied Invoke message
		 * Create a new InvokeSocket Object<br/>
		 * The replied data(<u>Invoke</u>) from Server will sent to parent; <i>virtual IProtocol::replyData(Invoke)</i><br/>
		 * <br/>
		 * @param parent A target object who will receive replied data from server<br/>
		 * ----this.replyData -> parent.replyData
		 */
		public function ServerConnector(window:Window)
		{
			this.window = window;
			
			socket = new Socket();
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
			socket.writeUTFBytes(invoke.toXML().toXMLString());
			
			for(var i:int = 0; i < invoke.length; i++)
				if( invoke.at(i).getType() == "ByteArray")
					socket.writeBytes( invoke.at(i).getValue() );
			
			socket.flush();
		}
		public function replyData(invoke:Invoke):void
		{
			window.replyData(invoke);
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
			
			socket.writeUTFBytes(id);
			socket.flush();
			
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
			var byteArray:ByteArray = new ByteArray();
			socket.readBytes(byteArray);
			
			if(binaryInvoke == null)
				handleString(byteArray);
			else
				handleBinary(byteArray);
		}
		
		//ONLY INVOKE
		/**
		 * @private
		 */
		private function handleString(byteArray:ByteArray):void
		{
			var invokeArray:Vector.<Invoke> = new Vector.<Invoke>();
			var buffer:String = byteArray.toString();
			str += buffer;
			
			var indexPair:IndexPair = null;
			var sizePair:SizePair = new SizePair(0, 0);
			var index:int = 0;
			
			while (true)
			{
				var iPair:IndexPair =
					new IndexPair
					(
						str.indexOf("<invoke", index),
						str.indexOf("</invoke>", index)
					); //FIND WORDS
				if(iPair.start != -1) sizePair.start++;
				if(iPair.end != -1) sizePair.end++; //AND COUNTS
					
				if(indexPair == null && sizePair.start == 1) //IF IT MEANS THE START,
					indexPair = new IndexPair( iPair.start, -1 ); //DETERMINE THE STARTING INDEX
				
				if(iPair.isOutOfRange() == true) //FAILED TO FIND ANYTHING
					break;
				
				/* FOUND SOMETHING FROM NOW ON */
				
				//AN INVOKE HAS FOUND
				if(indexPair != null && sizePair.start == sizePair.end)
				{
					var start:int = indexPair.start;
					var end:int = indexPair.end + String("</invoke>").length;
					
					var xml:XML = new XML(str.substring(start, end));
					var invoke:Invoke = new Invoke(xml);
					
					if(invoke.length > 2 && invoke.at(invoke.length - 2).getType() == "ByteArray")
						reserveBinary(invoke);
					else
						invokeArray.push(invoke);
					
					//CLEAR CURRENT INDEX PAIR
					indexPair = null;
				}
				
				//ADJUST INDEX
				index = (iPair.end == -1) 
					? (iPair.start + 1) : (iPair.end + 1);
			}
			for(var i:int = 0; i < invokeArray.length; i++)
				replyData( invokeArray[i] );
			
			if(binaryInvoke == null)
				return;
			
			/* ------------------------------------
				HANDLING BINARY DATA
			------------------------------------ */
			index = buffer.lastIndexOf("</invoke>") + String("</invoke>").length;
			
			//FIND END OF THE STRING
			for(; index < byteArray.length; index++)
				if(byteArray[i] == 0)
					break;
			
			if(index + 1 < byteArray.length)
			{
				var ba:ByteArray = new ByteArray();
				ba.writeBytes(byteArray, index + 1);
				
				handleBinary(ba);
			}
		}
		
		//INVOKE WITH BINARY DATA
		/**
		 * @private
		 */
		private function reserveBinary(invoke:Invoke):void
		{
			invoke.setItemAt( new InvokeParameter("byteArray", new ByteArray()), invoke.length - 2);
			invoke.addItem( new InvokeParameter("pieceSize", 0) );
			
			this.binaryInvoke = invoke;
		}
		/**
		 * @private
		 */
		private function handleBinary(byteArray:ByteArray):void
		{
			var binary:ByteArray = binaryInvoke.get("byteArray").getValue();
			var size:int = binaryInvoke.get("size").getValue();
			var pieceSize:int = Math.min(size - binary.length, byteArray.length)
			
			//WRITE ON BINARY
			binary.writeBytes(byteArray, 0, pieceSize);
			if(binary.length != size)
				return;
			
			binaryInvoke.erase("size");
			replyData(binaryInvoke);
			
			/* ------------------------------------
				HANDLING STRING DATA
			------------------------------------ */
			if(pieceSize == byteArray.length)
				return;
			
			var strBA:ByteArray = new ByteArray();
			strBA.writeBytes(byteArray, pieceSize);
			
			handleString(strBA);
		}
	}
}

/* ----------------------------------------------------------
	INNER(PRIVATE) CLASSES
---------------------------------------------------------- */
class SizePair
{
	public var start:int;
	public var end:int;
	
	public function SizePair(start:int, end:int)
	{
		this.start = start;
		this.end = end;
	}
}
class IndexPair extends SizePair
{
	public function IndexPair(start:int, end:int)
	{
		super(start, end);
	}
	public function isOutOfRange():Boolean
	{
		return start == -1 && end == -1;
	}
}