package org.samchon.framework.main
{
	import mx.events.FlexEvent;
	
	import org.samchon.framework.invoke.IInvoke;
	import org.samchon.framework.invoke.Invoke;
	import org.samchon.ui.VGroup;
	
	public class Movie extends VGroup implements IInvoke
	{
		public var window:Window;
		
		protected var creationFlag:Boolean = false;
		
		/* -------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------- */
		public function Movie(window:Window = null)
		{
			super();
			this.window = window;
			
			this.addEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		protected function creationCompleted(event:FlexEvent):void
		{
			this.removeEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
			creationFlag = true;
		}
		
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
		public function getFileName():String
		{
			return this.className;
		}
		public function toHTML():String
		{
			return "";
		}
	}
}