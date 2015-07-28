package flashx.textLayout.ui.styles
{
	import mx.skins.RectangularBorder;

	public class ScrollbarUpArrowUpSkin extends RectangularBorder
	{
		public function ScrollbarUpArrowUpSkin()
		{
			super();
		}
		
		override public function get measuredWidth():Number
		{
			return 13;
		}
		
		override public function get measuredHeight():Number
		{
			return 14;
		}
		
		override protected function updateDisplayList(w:Number, h:Number):void
		{
			super.updateDisplayList(w, h);
		}
	}
}