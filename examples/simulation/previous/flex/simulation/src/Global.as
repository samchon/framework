package
{
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	
	import org.samchon.utils.CallLater;
	import org.samchon.utils.CallLaterList;

	public class Global
	{
		/*
		================================================================
			DOMAIN CONSTS -> TRADE
		================================================================
		*/
		public static const DIRECTION_BUY:int = 1;
		public static const DIRECTION_SELL:int = -1;
		
		public static const AGGREGATION_AVERAGE:int = -1;
		public static const AGGREGATION_TOTAL:int = -100;
		
		public static const RETURN_PAPER:int = 0;
		public static const RETURN_REAL:int = 1;
		
		/*
		================================================================
			COMMON CONSTS
		================================================================
		*/
		public static const NULL:int = int.MIN_VALUE;
		
		/*
		----------------------------------------------------------------
			CALL_LATER
		----------------------------------------------------------------
		*/
		static protected var callLaterList:CallLaterList = new CallLaterList();
		static public function callLater( method: Function, args:Array = null ): void
		{
			callLaterList.add( method, args );
			
			//trace(callLater.length);
			goCallLater();
		}
		static protected function goCallLater():void
		{
			if(callLaterList.length == 1)
				doCallLater();
		}
		static protected function doCallLater():void
		{
			var timer:Timer = new Timer( 1, 1 );
			timer.addEventListener( TimerEvent.TIMER_COMPLETE, timerListener );
			timer.start();
		}
		static protected function timerListener( event:TimerEvent ): void
		{
			event.target.removeEventListener(TimerEvent.TIMER_COMPLETE, timerListener);
			callLaterList.apply();
			
			if(callLaterList.length > 0)
				doCallLater();
		}
	}
}