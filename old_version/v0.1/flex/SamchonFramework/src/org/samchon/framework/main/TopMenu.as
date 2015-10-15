package org.samchon.framework.main
{
	import mx.containers.TabNavigator;
	
	public class TopMenu extends TabNavigator
	{
		public var window:Window;
		
		public function TopMenu(window:Window = null)
		{
			super();
			
			this.window = window;
		}
		
		public function setAuthority(level:int):void
		{
			//FOR IMPLEMENTATION
		}
	}
}