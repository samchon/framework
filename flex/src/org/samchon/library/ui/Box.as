package org.samchon.library.ui
{
	import mx.containers.Box;
	
	import org.samchon.library.ui.IPadding;
	
	public class Box 
		extends mx.containers.Box
		implements IPadding
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