package
{
	import flash.events.TimerEvent;
	import flash.utils.Timer;

	public class Global
	{
		public static const NULL:int = int.MIN_VALUE;
		
		static public function callLater( callFunction: Function, parameters:Array = null ): void
		{
			var timer:Timer = new Timer( 0, 1 );
			timer.addEventListener( TimerEvent.TIMER_COMPLETE, timerListener );
			timer.start();
			
			function timerListener( event:TimerEvent ): void
			{
				timer.removeEventListener(TimerEvent.TIMER_COMPLETE, timerListener);
				callFunction.apply( null, parameters );
			}
		}
	}
}