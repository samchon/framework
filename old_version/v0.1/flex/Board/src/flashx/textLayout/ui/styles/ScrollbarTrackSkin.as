package flashx.textLayout.ui.styles
{
	import flash.display.CapsStyle;
	import flash.display.LineScaleMode;
	
	import mx.skins.RectangularBorder;

	public class ScrollbarTrackSkin extends RectangularBorder
	{
		public function ScrollbarTrackSkin()
		{
			super();
		}
		
		override public function get measuredWidth():Number
		{
			return 13;
		}
		
		override public function get measuredHeight():Number
		{
			return 10;
		}
		
		override protected function updateDisplayList(w:Number, h:Number):void
		{
			super.updateDisplayList(w, h);
			
			var trackFill:uint = 0x000000;
			var trackFillAlpha:Number = 1.0;
			var trackStroke:uint = 0x2A2A2A;
			var trackStrokeAlpha:Number = 1.0;
			
 			if (getStyle("trackFill") != undefined)
				trackFill = getStyle("trackFill");
 			if (getStyle("trackFillAlpha") != undefined)
				trackFillAlpha = getStyle("trackFillAlpha");
 			if (getStyle("trackStroke") != undefined)
				trackStroke = getStyle("trackStroke");
 			if (getStyle("trackStrokeInnerAlpha") != undefined)
				trackStrokeAlpha = getStyle("trackStrokeAlpha");

			graphics.clear();
			graphics.beginFill(trackFill, trackFillAlpha);
			graphics.drawRect(0, 0, w-1, h);
			graphics.endFill();
			graphics.lineStyle(1, trackStroke, trackStrokeAlpha, true, LineScaleMode.NONE, CapsStyle.SQUARE);
			graphics.drawRect(0, 0, w-1, h);
		}
	}}