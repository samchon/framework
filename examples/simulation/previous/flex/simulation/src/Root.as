package
{
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	
	import org.samchon.simulation.movie.InquiryMovie;
	
	import Simulation;

	public class Root
	{
		public static var window:*;
		public static var core:String = "FLEX";
		
		public static const application:int = 1;
		[Bindable]public static var category:int;
		
		/*
		//INTERACTION WITH COMPILER
		protected static var compileCompletedHandler:Function = null;
		
		public static function addCompilerListener(listener:Function):void
		{
			Root.compileCompletedHandler = listener;
		}
		public static function handleCompileCompleted(compiled:Object):void
		{
			compileCompletedHandler.apply(null, [compiled]);
		}*/
	}
}