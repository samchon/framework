package org.samchon.protocol.movie
{
	import mx.events.FlexEvent;
	
	import org.samchon.library.ui.Box;
	import org.samchon.protocol.invoke.Invoke;
	
	import spark.components.Group;
	
	/**
	 * SubMovie is contained in Movie or another parent SubMovie<br>
	 * Thus, the SubMovie can be composed hierarchically.<br>
	 * <br>
	 * Window<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp;Movie<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SubMovie<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SubMovie<br>
	 * <br>
	 * @see Movie
	 * @see IProtocol
	 */
	public class SubMovie
		extends Group 
		implements IMovie
	{
		/**
		 * Parent IMovie containning current SubMovie<br>
		 * The parent can be not only Movie but also SubMovie<br>
		 * <br>
		 * @default Can't be null
		 */
		public var parentMovie:IMovie;
		/**
		 * Pointer of SubMovieTitleWindow created in SubMovie
		 * 
		 * @defautl null
		 */
		protected var titleWindow:SubMovieTitleWindow;
		
		/**
		 * Whether the creation was completed or not
		 */
		protected var creationFlag:Boolean = false;
		
		/**
		 * Pointer of Window from related
		 */
		protected function get window():Window
		{
			return movie.getWindow();
		}
		/**
		 * Pointer of Movie from related
		 */
		protected function get movie():Movie
		{
			if(parentMovie is SubMovie)
				return (parentMovie as SubMovie).movie;
			else
				return parentMovie as Movie;
		}
		
		/* -------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------- */
		/**
		 * Constructor.<br>
		 * <br>
		 * @param window Window containning this Movie
		 */
		public function SubMovie(parentMovie:IMovie = null)
		{
			super();
			
			this.parentMovie = parentMovie;
			this.addEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		/**
		 * Handler of Creation Complete<br>
		 * If you want to do something more, override this method
		 */
		protected function creationCompleted(event:FlexEvent):void
		{
			this.removeEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
			creationFlag = true;
		}
		
		//POP-UP FOR SUB_MOVIE
		/**
		 * Create a Pop-up; SubMovieTitleWindow<br>
		 * <br>
		 * @param $class Target TitleWindow class wants to create that is dervied from TitleWindow
		 * @return The SubMovieTitleWindow to be made
		 */
		public function createPopUp($class:Class):SubMovieTitleWindow
		{
			titleWindow = SubMovieTitleWindow.createPopUp(this, $class);
			return titleWindow;
		}
		
		//SOCKET
		public function replyData(invoke:Invoke):void
		{
			if(titleWindow)
				titleWindow.replyData(invoke);
		}
		public function sendData(invoke:Invoke):void
		{
			parentMovie.sendData(invoke);
		}
	}
}