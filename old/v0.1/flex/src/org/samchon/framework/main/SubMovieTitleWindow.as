package org.samchon.framework.main
{
	import mx.managers.PopUpManager;
	
	import org.samchon.framework.invoke.IInvoke;
	import org.samchon.framework.invoke.Invoke;
	import org.samchon.ui.TitleWindow;
	
	public class SubMovieTitleWindow extends TitleWindow implements IInvoke
	{
		protected var subMovie:SubMovie;
		
		public function SubMovieTitleWindow(subMovie:SubMovie = null)
		{
			super();
			
			this.subMovie = subMovie;
		}
		
		public function sendData(invoke:Invoke):void
		{
			subMovie.sendData(invoke);
		}
		public function replyData(invoke:Invoke):void
		{
		}
		
		public static function createPopUp(subMovie:SubMovie, $class:Class):SubMovieTitleWindow
		{
			var popUp:SubMovieTitleWindow = PopUpManager.createPopUp(subMovie, $class, true) as SubMovieTitleWindow;
			popUp.subMovie = subMovie;
			PopUpManager.centerPopUp(popUp);
			
			return popUp;
		}
	}
}