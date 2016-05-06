package org.samchon.protocol.movie
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
	
	import org.samchon.library.utils.URL;
	import org.samchon.protocol.invoke.IProtocol;
	import org.samchon.protocol.invoke.Invoke;
	import org.samchon.protocol.invoke.InvokeParameter;
	import org.samchon.protocol.socket.ServerConnector;
	import org.samchon.protocol.movie.menu.TopMenu;
	
	import spark.components.Application;
	import spark.components.VGroup;
	
	/**
	 * <p> Window is an Application, the top class in Flex-UI. </p>
	 * 
	 * <p> The Window is separated to three part, TopMenu, Movie and ServerConnector. </p>
	 * <ul>
	 * 	<li> <code>TopMenu</code>: Menu on the top. It's not an essential component. </li>
	 * 	<li> <code>Movie</code>: Correspond with Service in Server. Movie has domain UI components(Movie) for the matched Service. </li>
	 * 	<li> <code>ServerConnector</code>: The socket connecting to the Server. </li>
	 * </ul>
	 * 
	 * <p> The Window and its UI-layout is not fixed, essential component for Samchon Framework in Flex, 
	 * so it's okay to do not use the provided Window and make your custom Window.
	 * But the custom Window, your own, has to contain the Movie and keep the construction routine. </p>
	 * 
	 * <p> <img src="movie.png" /> </p>
	 * 
	 * <h4> THE CONSTRUCTION ROUTINE </h4>
	 * <ul>
	 * 	<li>Socket Connection</li>
	 * 	<ul>
	 * 		<li>Connect to the CPP-Server</li>
	 * 	</ul>
	 * 	<li>Fetch authority</li>
	 * 	<ul>
	 * 		<li>Send a request to fetching authority</li>
	 * 		<li>The window can be navigated to other page by the authority</li>
	 * 	</ul>
	 * 	<li>Construct Movie</li>
	 * 	<ul>
	 * 		<li>Determine a Movie by URLVariables::movie and construct it</li>
	 * 	</ul>
	 * 	<li>All the routines are done</li>
	 * </ul>
	 * 
	 * @see Movie
	 * @see SubMovie
	 * @see TitleWindow
	 * @see ServerConnector
	 * @author Jeongho Nam <http://samchon.org>
	 */ 
	public class Window
		extends Application 
		implements IProtocol
	{
		/**
		 * <p> A socket for connecting to the Server. </p>
		 */ 
		protected var socket:ServerConnector;
		
		/**
		 * <p> A VGroup containing TopMenu and Movie filling Window. </p>
		 * 
		 * <ul>
		 * 	<li> &lt;window:Window&gt; </li>
		 * 	<ul>
		 * 		<li> &lt;s:VGroup&gt; </li>
		 * 		<ul>
		 * 			<li> &lt;window:Movie /&gt; </li>
		 * 			<li> &lt;window:TopMenu /&gt; </li>
		 * 		</ul>
		 * 		<li> &lt;/s:VGroup&gt; </li>
		 * 	</ul>
		 * 	<li> &lt;/window:Window&gt; </li>
		 * </ul>
		 */
		protected var vGroup:VGroup;
		
		/**
		 * <p> A TopMenu in the Window. </p>
		 */
		protected var topMenu:TopMenu;
		
		/**
		 * <p> A movie contained in the Window. </p>
		 */
		protected var movie:Movie;
		
		/**
		 * <p> A TitleWindow created in the Window. </p>
		 * 
		 * @default null
		 */
		protected var titleWindow:TitleWindow;
		
		/**
		 * <p> Whether the creation was completed or not. </p>
		 */
		protected var creationFlag:Boolean;
		
		/**
		 * <p> Default is url.html?movie={<code>SERVICE</code>}. </p>
		 * <p> If you want to test <code>Window</code> by fixing <code>Movie</code>, override this method. </p>
		 */
		protected function get movieName():String { return URL.getMovieName(); }
		
		/* -------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------- */
		/**
		 * <p> Default Constructor. </p>
		 */
		public function Window()
		{
			super();
			
			this.percentWidth = 100.0;
			this.percentHeight = 100.0;
			this.creationFlag = false;
			
			socket = new ServerConnector(this);
			socket.addEventListener(Event.CONNECT, handleConnect);
			socket.addEventListener(IOErrorEvent.IO_ERROR, handleSocketError);
			
			this.addEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		
		/**
		 * <p> Handler of Creation Complete. </p>
		 * 
		 * <p> Starts the construction routine. If you want to do something more, override this method. </p>
		 */
		protected function creationCompleted(event:FlexEvent):void
		{
			this.removeEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
			navigateToURL( new URLRequest("javascript: document.getElementById('" + this.className + "').focus();"), "_self" );
			creationFlag = true;
			
			constructTopMenu();
			goServerInfo();
		}
		
		/**
		 * <p> Factory method for TopMenu. </p>
		 * 
		 * <p> If returns null, then TopMenu will not be constructed. </p>
		 */
		public function createTopMenu():TopMenu
		{
			return new TopMenu(this);
		}
		
		/**
		 * <p> Create a Movie by the name in URLVariables. </p>
		 * <p> Override this method to return a new Movie matched in the name. </p>
		 * 
		 * @param name Movie name in URLVariables; url.html?movie={name}
		 * @return Matched Movie about the name
		 * 
		 * @see Movie
		 */
		public function createMovie(name:String):Movie
		{
			return new Movie(this);
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
		protected function constructVGroup():void
		{
			if(vGroup)
				return;
			
			vGroup = new VGroup();
			vGroup.percentWidth = 100.0;
			vGroup.percentHeight = 100.0;
			
			this.addElement(vGroup);
		}
		protected function constructMovie():void
		{
			movie = createMovie(movieName);
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
			GETTERS
		------------------------------------------------------- */
		/**
		 * <p> Get TopMenu. </p>
		 */
		public function getTopMenu():TopMenu
		{
			return topMenu;
		}
		
		/**
		 * <p> Get Movie. </p>
		 */
		public function getMovie():Movie
		{
			return movie;
		}
		
		/* -------------------------------------------------------
			ROUTINES FOR PROTOCOL
		------------------------------------------------------- */
		/**
		 * <p> Fetch Server's ip and port from external configuration file. </p>
		 */ 
		protected function goServerInfo():void
		{
			var urlLoader:URLLoader = new URLLoader();
			urlLoader.addEventListener(Event.COMPLETE, handleServerInfo);
			
			urlLoader.load(new URLRequest("server.xml"));
		}
		
		/**
		 * <p> Connect to the C++ cloud server. </p>
		 * 
		 * @param ip An ip address of the C++ cloud server.
		 * @param port A port number of the C++ cloud server.
		 */
		protected function goConnect(ip:String, port:int):void
		{
			socket.connect(ip, port);
		}
		
		/**
		 * <p> Request the minimum authority for the Service. </p>
		 */
		protected function goAuthority():void
		{
			var invoke:Invoke = new Invoke("goAuthorization");
			invoke.addItem(new InvokeParameter("service", "string", movieName));
			
			socket.sendData(invoke);
		}
		
		protected function handleServerInfo(event:Event):void
		{
			var xml:XML = new XML(event.target.data);
			var ip:String = xml.ip;
			var port:int = xml.port;
			
			goConnect(ip, port);
		}
		protected function handleConnect(event:Event):void
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
		/**
		 * <p> Create a Pop-up; TitleWindow. </p>
		 * 
		 * @param $class Target TitleWindow class wants to create that is dervied from TitleWindow
		 * @return The TitleWindow to be made
		 */
		public function createPopUp($class:Class):TitleWindow
		{
			titleWindow = TitleWindow.createPopUp(this, $class) as TitleWindow;
			return titleWindow;
		}
		
		/**
		 * <p> Navigate this browser to another Window. </p>
		 * 
		 * @param movie If default, make a new Window having same Movie
		 */ 
		public function goWindow(movie:String = ""):void
		{
			if(movie == "")
				URL.goNewWindow();
			else
				URL.goWindow(movie);
		}
		
		//DOCUMENTATION
		/**
		 * <p> Save principle Entity(s) in Movie. </p>
		 * 
		 * <p> The default is to saving as HTML format. </p>
		 */
		public function goExport(extension:String):void
		{
			var fileName:String = movie.fileName;
			if(fileName == null)
				return;
			
			var file:FileReference = new FileReference();
			file.save(movie.toHTML(), fileName + "." + extension);
		}
		
		/**
		 * <p> Capture current Window's image and save it. </p>
		 */
		public function goScreenshot():void
		{
			var pngSource:BitmapData = new BitmapData(vGroup.width, vGroup.height);
			var pngEncoder:PNGEncoder = new PNGEncoder();
			var pngData:ByteArray;
			
			pngSource.draw(this as IBitmapDrawable);
			pngData = pngEncoder.encode(pngSource);
			
			var file:FileReference = new FileReference();
			file.save(pngData, movie.fileName + ".png");
		}
		
		//CLOSING
		/**
		 * <p> Request log-out to Server and navigate to the log-in page. </p>
		 * 
		 * <p> When the request was delivered, then doLogout will be called in another Window(s). </p>
		 * <p> By the doLogout() method, all another windows, except this window, will be closed. </p>
		 */ 
		public function goLogout():void
		{
			sendData(new Invoke("goLogout"));
			URL.navigateToURL("Login.html");
		}
		
		/**
		 * <p> Log-out was requested in Server by another Window. </p>
		 * <p> This window will be closed. </p>
		 */
		public function doLogout():void
		{
			Alert.show("Log-out was done", "Server");
			goClose();
		}
		
		/**
		 * <p> Close this window. </p>
		 */
		public function goClose():void
		{
			URL.closeWindow();
			this.enabled = false;
		}
		
		/* ------------------------------------------------------
			HANDLING SOCKET
		------------------------------------------------------ */
		/**
		 * @private
		 */
		protected function handleSocketError(event:IOErrorEvent):void
		{
			Alert.show("Connection with Server has failed", "Network Error");
		}
		
		public function sendData(invoke:Invoke):void
		{
			socket.sendData(invoke);
		}
		
		/**
		 * <p> Handles authority, error and logout. The others will be shift to the chain. </p>
		 * 
		 * @inheritDoc
		 */
		public function replyData(invoke:Invoke):void
		{
			var listener:String = invoke.getListener();
			
			if(listener == "handleAuthority")
			{
				var level:int = invoke.at(0).getValue();
				var flag:Boolean = invoke.at(1).getValue();
				
				handleAuthority(level, flag);
			}
			else if(listener == "handleError")
			{
				var message:String = invoke.at(0).getValue();
				
				replyError( message );
			}
			else if(listener == "doLogout")
				doLogout();
			else if(titleWindow)
				titleWindow.replyData(invoke);
		}
		
		/**
		 * <p> Handling error message from Server. The default is to showing an alert message. </p>
		 * 
		 * @param message The error message from Server. Those're almost occured by thrown exception
		 */
		protected function replyError(message:String):void
		{
			//FOR IMPLEMENTATION
			Alert.show(message, "Error message from Server");
		}
	}
}