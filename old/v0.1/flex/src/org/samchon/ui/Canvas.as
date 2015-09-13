package org.samchon.ui
{
	import mx.containers.Canvas;
	
	public class Canvas extends mx.containers.Canvas
	{
		public function Canvas()
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