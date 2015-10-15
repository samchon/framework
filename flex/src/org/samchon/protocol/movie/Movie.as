package org.samchon.protocol.movie
{
	import mx.events.FlexEvent;
	
	import org.samchon.library.ui.VGroup;
	import org.samchon.protocol.invoke.Invoke;
	
	/**
	 * <p> Movie is contained in Window. </p>
	 * <p> Movie is correspond with Service in Server, having domain UI components for the Service. </p>
	 * 
	 * <img src="movie.png" />
	 * 
	 * @see Window
	 * @see SubMovie
	 * @see TitleWindow
	 * @author Jeongho
	 */
	public class Movie
		extends VGroup
		implements IMovie
	{
		/**
		 * <p> Parent Window containning this Movie. </p>
		 */
		public var window:Window;
		
		/**
		 * <p> Whether the creation was completed or not. </p>
		 */
		protected var creationFlag:Boolean = false;
		
		/* -------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------- */
		/**
		 * <p> Constructor from window. </p>
		 * 
		 * @param window Window containing this Movie.
		 */
		public function Movie(window:Window)
		{
			super();
			this.window = window;
			
			this.addEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		
		/**
		 * <p> Handler of Creation Complete. </p>
		 * 
		 * <p> If you want to do something more, override this method. </p>
		 */
		protected function creationCompleted(event:FlexEvent):void
		{
			this.removeEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
			creationFlag = true;
		}
		
		//TITLE_WINDOW_CREATION
		/**
		 * <p> Create a Pop-up; TitleWindow. </p>
		 * 
		 * @param $class Target TitleWindow class wants to create that is dervied from TitleWindow
		 * @return The TitleWindow to be made
		 */
		public function createPopUp($class:Class):TitleWindow
		{
			return window.createPopUp($class);
		}
		
		//GETTER
		/**
		 * <p> Get Window. </p>
		 */
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
		 * <p> The name of HTML file containning contents of this Movie. </p>
		 */
		public function get fileName():String
		{
			return this.className;
		}
		
		/**
		 * <p> Converts this movie's contents to HTML. </p>
		 */
		public function toHTML():String
		{
			return "";
		}
	}
}