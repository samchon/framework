package org.samchon.framework.main
{
	import mx.events.FlexEvent;
	
	import org.samchon.framework.invoke.IInvoke;
	import org.samchon.framework.invoke.Invoke;
	import org.samchon.ui.Box;
	
	import spark.components.Group;
	
	public class SubMovie extends Group implements IInvoke
	{
		public var parentMovie:IInvoke;
		protected var titleWindow:SubMovieTitleWindow;
		
		protected var creationFlag:Boolean = false;
		
		//POINTER GETTERS
		protected function get window():Window
		{
			return movie.getWindow();
		}
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
		public function SubMovie(parentMovie:IInvoke = null)
		{
			super();
			
			this.parentMovie = parentMovie;
			this.addEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		protected function creationCompleted(event:FlexEvent):void
		{
			this.removeEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
			creationFlag = true;
		}
		
		//POP-UP FOR SUB_MOVIE
		public function goPopUp($class:Class):SubMovieTitleWindow
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