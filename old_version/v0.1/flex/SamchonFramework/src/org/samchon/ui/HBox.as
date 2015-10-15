package org.samchon.ui
{
	import mx.containers.HBox;
	
	public class HBox extends mx.containers.HBox
	{
		public function HBox()
		{
			super();
		}
		public function set padding(value:int):void {
			this.setStyle("paddingTop", value);
			this.setStyle("paddingLeft", value);
			this.setStyle("paddingRight", value);
			this.setStyle("paddingBottom", value);
		}
	}
}