package org.samchon.library.ui
{
	import mx.containers.HDividedBox;
	
	public class HDividedBox 
		extends mx.containers.HDividedBox
		implements IPadding
	{
		public function HDividedBox()
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