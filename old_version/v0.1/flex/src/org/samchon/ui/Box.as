package org.samchon.ui
{
	import mx.containers.Box;
	
	public class Box extends mx.containers.Box
	{
		public function Box()
		{
			super();
		}
		public function set padding(val:int):void
		{
			this.setStyle("paddingTop", val);
			this.setStyle("paddingLeft", val);
			this.setStyle("paddingRight", val);
			this.setStyle("paddingBottom", val);
		}
	}
}