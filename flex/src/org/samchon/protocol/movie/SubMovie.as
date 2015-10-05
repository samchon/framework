package org.samchon.protocol.movie
{
	import mx.events.FlexEvent;
	
	import org.samchon.library.ui.Box;
	import org.samchon.protocol.invoke.Invoke;
	
	import spark.components.Group;
	
	/**
	 * <p> SubMovie is contained in Movie or another parent SubMovie.
	 * Thus, the SubMovie can be composed hierarchically. </p>
	 * 
	 * <ul>
	 * 	<li> Window </li>
	 * 	<ul>
	 * 		<li> Movie </li>
	 * 		<ul>
	 * 			<li> SubMovie </li>
	 * 			<ul>
	 * 				<li> SubMovie </li>
	 * 				<ul>
	 * 					<li> {SubMovie...} </li>
	 * 				</ul>
	 * 			</ul>
	 * 		</ul>
	 * 	</ul>
	 * </ul>
	 * 
	 * <img rsc="movie.png" />
	 * 
	 * @see Window
	 * @see Movie
	 * @see IProtocol
	 */
	public class SubMovie
		extends Group 
		implements IMovie
	{
		/**
		 * <p> Parent IMovie containning current SubMovie. </p>
		 * <p> The parent can be not only Movie but also SubMovie. </p>
		 * 
		 * @default Can't be null
		 */
		public var parentMovie:IMovie;
		
		/**
		 * <p> Pointer of SubMovieTitleWindow created in SubMovie. </p>
		 * 
		 * @defautl null
		 */
		protected var titleWindow:SubMovieTitleWindow;
		
		/**
		 * <p> Whether the creation was completed or not. </p>
		 */
		protected var creationFlag:Boolean = false;
		
		/**
		 * <p> Get Window from related. </p>
		 */
		protected function get window():Window
		{
			return movie.getWindow();
		}
		
		/**
		 * <p> Get Movie from related. </p>
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
		 * <p> Constructor from parent movie. </p>
		 *
		 * @param parent Parent object containning this SubMovie
		 */
		public function SubMovie(parentMovie:IMovie = null)
		{
			super();
			
			this.parentMovie = parentMovie;
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
		
		//POP-UP FOR SUB_MOVIE
		/**
		 * <p> Create a Pop-up, SubMovieTitleWindow </p>
		 * 
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