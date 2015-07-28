package org.samchon.ui
{
	import mx.collections.ArrayList;
	
	import spark.components.Window;
	
	public class Window extends spark.components.Window
	{
		public static var windowList:ArrayList = new ArrayList();
		
		public function Window()
		{
			super();
			windowList.addItem(this);
		}
		public override function close():void
		{
			for(var i:int = 0; i < windowList.length; i++)
				if(windowList.getItemAt(i) == this)
					windowList.removeItemAt(i);
			super.close();
		}
		
		public static function closeAll():void
		{
			for(var i:int = windowList.length -1; i >= 0; i--)
				windowList.getItemAt(i).close();
		}
	}
}