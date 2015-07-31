package samchon.library.ui
{
	import mx.containers.Canvas;
	
	public class Canvas 
		extends mx.containers.Canvas
		implements IPadding
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