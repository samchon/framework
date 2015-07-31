package samchon.library.ui
{
	import mx.containers.VDividedBox;
	
	public class VDividedBox 
		extends mx.containers.VDividedBox
		implements IPadding
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