package org.samchon.utils
{
	public class CallLater
	{
		protected var method:Function;
		protected var args:Array;
		
		public function CallLater(method:Function, args:Array)
		{
			this.method = method;
			this.args = args;
		}
		public function apply():void
		{
			method.apply(null, args);
		}
	}
}