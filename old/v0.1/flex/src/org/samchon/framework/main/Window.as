package org.samchon.framework.main
{
	import flash.display.BitmapData;
	import flash.display.IBitmapDrawable;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.net.*;
	import flash.utils.ByteArray;
	
	import mx.controls.Alert;
	import mx.events.CloseEvent;
	import mx.events.FlexEvent;
	import mx.graphics.codec.PNGEncoder;
	import mx.utils.StringUtil;
	
	import org.samchon.framework.invoke.IInvoke;
	import org.samchon.framework.invoke.Invoke;
	import org.samchon.framework.socket.CPPSocket;
	import org.samchon.framework.socket.CPPSocketEvent;
	import org.samchon.utils.URL;
	
	import spark.components.Application;
	import spark.components.VGroup;
	
	public class Window extends Application implements IInvoke
	{
		protected var socket:CPPSocket;
		
		protected var vGroup:VGroup;
		protected var topMenu:TopMenu;
		protected var movie:Movie;
		protected var titleWindow:TitleWindow;
		
		protected var creationFlag:Boolean = false;
		
		/* -------------------------------------------------------------
			THE CONSTRUCTION ROUTINE:
				1) SOCKET CONNECTION
					1-1) CONNECT TO THE CPP SERVER
				2) FETCH AUTHORITY
					2-2) SEND A REQUEST TO FETCHING AUTHORITY
					2-3) BY AUTHORITY, THE WINDOW CAN BE MOVED
				3) ALL THE ROUTINES ARE CONSTRUCTED
		------------------------------------------------------------- */
		/* -------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------- */
		protected function get service():String { return ""; }
		
		public function Window()
		{
			super();
			this.percentWidth = 100.0;
			this.percentHeight = 100.0;
			
			this.addEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		protected function creationCompleted(event:FlexEvent):void
		{
			this.removeEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
			navigateToURL(new URLRequest("javascript: document.getElementById('" + this.className + "').focus();"), "_self");
			creationFlag = true;
			
			constructTopMenu();
			goServerInfo();
		}
		public function createTopMenu():TopMenu
		{
			return new TopMenu(this);
		}
		public function createMovie():Movie
		{
			return new Movie(this);
		}
		
		protected function constructVGroup():void
		{
			if(vGroup)
				return;
			
			vGroup = new VGroup();
			vGroup.percentWidth = 100.0;
			vGroup.percentHeight = 100.0;
			
			this.addElement(vGroup);
		}
		protected function constructTopMenu():void
		{
			topMenu = createTopMenu();
			if(topMenu == null)
				return;
			else
			{
				constructVGroup();
				
				topMenu.percentWidth = 100.0;
				vGroup.addElement(topMenu);
				topMenu.window = this;
			}	
		}
		protected function constructMovie():void
		{
			movie = createMovie();
			if(movie == null)
				return;
			
			movie.window = this;
			{
				constructVGroup();
				
				movie.padding = 5;
				movie.percentWidth = 100;
				movie.percentHeight = 100;
			}
			vGroup.addElement(movie);
		}
		
		/* -------------------------------------------------------
			ROUTINES FOR PROTOCOL
		------------------------------------------------------- */
		protected function goServerInfo():void
		{
			var urlLoader:URLLoader = new URLLoader();
			urlLoader.addEventListener(Event.COMPLETE, handleServerInfo);
			
			urlLoader.load(new URLRequest("server.xml"));
		}
		protected function goConnect(ip:String, port:int):void
		{
			socket = new CPPSocket();
			socket.addEventListener(CPPSocketEvent.CONNECT, handleConnect);
			socket.addEventListener(IOErrorEvent.IO_ERROR, handleSocketError);
			socket.addEventListener(CPPSocketEvent.REPLY, handleReply);
			
			socket.connect(ip, port);
		}
		protected function goAuthority():void
		{
			var invoke:Invoke = new Invoke("goAuthorization");
			invoke.addParameter("service", "string", service);
			
			socket.sendData(invoke);
		}
		
		protected function handleServerInfo(event:Event):void
		{
			var xml:XML = new XML(event.target.data);
			var ip:String = xml.ip;
			var port:int = xml.port;
			
			goConnect(ip, port);
		}
		protected function handleConnect(event:CPPSocketEvent):void
		{
			goAuthority();
		}
		protected function handleAuthority(level:int, flag:Boolean):void
		{
			if(topMenu)
				topMenu.setAuthority( level );
			
			if(flag == true)
				constructMovie();
			else
				Alert.show
				(
					"You don't have permission to access this function", 
					"Authority", 4, null, 
					function (event:CloseEvent):void
					{
						URL.closeWindow();
					}
				);
		}
		
		/* ------------------------------------------------------
			EVENTS FROM CHILDS
		------------------------------------------------------ */
		//NORMAL FUNCTIONS
		public function goPopUp($class:Class):TitleWindow
		{
			titleWindow = TitleWindow.createPopUp(this, $class) as TitleWindow;
			return titleWindow;
		}
		public function goWindow(movie:String = ""):void
		{
			if(movie == "")
				URL.goNewWindow();
			else
				URL.goWindow(movie);
		}
		
		//DOCUMENTATION
		public function goExport(extension:String):void
		{
			var fileName:String = movie.getFileName();
			if(fileName == null)
				return;
			
			var file:FileReference = new FileReference();
			file.save(movie.toHTML(), fileName + "." + extension);
		}
		public function goScreenshot():void
		{
			var pngSource:BitmapData = new BitmapData(vGroup.width, vGroup.height);
			var pngEncoder:PNGEncoder = new PNGEncoder();
			var pngData:ByteArray;
			
			pngSource.draw(this as IBitmapDrawable);
			pngData = pngEncoder.encode(pngSource);
			
			var file:FileReference = new FileReference();
			file.save(pngData, movie.getFileName() + ".png");
		}
		
		//CLOSING
		public function goLogout():void
		{
			sendData(new Invoke("goLogout"));
			URL.navigateToURL("Login.html");
		}
		public function doLogout():void
		{
			/*Alert.show
			(
				"Log-out was done", 
				"Manager", 4, null, 
				function(e:CloseEvent):void
				{
					goClose();
				}
			);*/
			Alert.show("Log-out was done", "Server");
			goClose();
		}
		public function goClose():void
		{
			URL.closeWindow();
			this.enabled = false;
		}
		
		/* ------------------------------------------------------
			HANDLING SOCKET
		------------------------------------------------------ */
		protected function handleReply(event:CPPSocketEvent):void
		{
			replyData(event.message);
		}
		protected function handleSocketError(event:IOErrorEvent):void
		{
			Alert.show("Connection with Server has failed", "Network Error");
		}
		
		public function sendData(invoke:Invoke):void
		{
			socket.sendData(invoke);
		}
		public function replyData(invoke:Invoke):void
		{
			var listener:String = invoke.getListener();
			
			if(listener == "handleAuthority")
				handleAuthority
				(
					int(invoke.at(0).getValue()),
					Boolean( int(invoke.at(1).getValue()) )
				);
			else if(listener == "handleError")
			{
				var serviceID:int = int(invoke.at(0).getValue());
				var errorID:int = int(invoke.at(1).getValue());
				
				replyError( serviceID, errorID );
			}
			else if(listener == "doLogout")
				doLogout();
			else if(titleWindow)
				titleWindow.replyData(invoke);
		}
		protected function replyError(serviceID:int, errorID:int):void
		{
			//FOR IMPLEMENTATION
			Alert.show
			(
				StringUtil.substitute
				(
					"Error has occured:\n\tservice: {0}\n\terror_id: {1}", 
					serviceID, errorID
				),
				"Error message from Server"
			);
		}
	}
}