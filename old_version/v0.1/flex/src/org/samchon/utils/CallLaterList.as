package org.samchon.utils
{
	import mx.collections.ArrayCollection
	
	public class CallLaterList extends ArrayCollection
	{
		public function CallLaterList(source:Array=null)
		{
			super(source);
		}
		public function at(x:int):CallLater
		{
			return getItemAt(x) as CallLater;
		}
		
		public function apply():void
		{
			if(this.length == 0)
				return;
			
			at(0).apply();
			this.removeItemAt(0);
		}
		public function add(method:Function, args:Array):void
		{
			this.addItem( new CallLater(method, args) );
		}
	}
}