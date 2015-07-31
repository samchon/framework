package samchon.protocol.movie
{
	import mx.events.FlexEvent;
	
	import samchon.library.ui.VGroup;
	import samchon.protocol.entity.IHTMLEntity;
	import samchon.protocol.invoke.Invoke;
	
	/**
	 * Movie is contained in Window.<br/>
	 * Movie is correspond with Service in Server, having domain UI components for the Service<br/>
	 * <br/>
	 * @see Window
	 * @see IProtocol
	 */
	public class Movie
		extends VGroup
		implements IMovie, IHTMLEntity
	{
		/**
		 * Parent Window containning this Movie
		 */
		public var window:Window;
		
		/**
		 * Whether the creation was completed or not
		 */
		protected var creationFlag:Boolean = false;
		
		/* -------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------- */
		/**
		 * Constructor.<br/>
		 * <br/>
		 * @param window Window containning this Movie
		 */
		public function Movie(window:Window = null)
		{
			super();
			this.window = window;
			
			this.addEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		/**
		 * Handler of Creation Complete<br/>
		 * If you want to do something more, override this method
		 */
		protected function creationCompleted(event:FlexEvent):void
		{
			this.removeEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
			creationFlag = true;
		}
		
		//TITLE_WINDOW_CREATION
		/**
		 * Create a Pop-up; TitleWindow<br/>
		 * <br/>
		 * @param $class Target TitleWindow class wants to create that is dervied from TitleWindow
		 * @return The TitleWindow to be made
		 */
		public function createPopUp($class:Class):TitleWindow
		{
			return window.createPopUp($class);
		}
		
		//GETTER
		public function getWindow():Window
		{
			return window;
		}
		
		/* -------------------------------------------------------
			SOCKET
		------------------------------------------------------- */
		public function replyData(invoke:Invoke):void
		{
			
		}
		public function sendData(invoke:Invoke):void
		{
			window.sendData(invoke);
		}
		
		/* -------------------------------------------------------
			EXPORT
		------------------------------------------------------- */
		/**
		 * The name of HTML file containning contents of this Movie
		 */
		public function get fileName():String
		{
			return this.className;
		}
		/**
		 * Converts this movie's contents to HTML
		 */
		public function toHTML():String
		{
			return "";
		}
	}
}