package org.samchon.ui
{
	import mx.containers.VDividedBox;
	
	public class VDividedBox extends mx.containers.VDividedBox
	{
		public function VDividedBox()
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