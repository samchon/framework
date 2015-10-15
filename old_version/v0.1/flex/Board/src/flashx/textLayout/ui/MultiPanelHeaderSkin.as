//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/MultiPanelHeaderSkin.as $
//  $DateTime: 2010/03/15 11:44:20 $
//  $Revision: #1 $
//  $Change: 744811 $
//  
//  ADOBE CONFIDENTIAL
//  
//  Copyright 2007-08 Adobe Systems Incorporated. All rights reserved.
//  
//  NOTICE:  All information contained herein is, and remains
//  the property of Adobe Systems Incorporated and its suppliers,
//  if any.  The intellectual and technical concepts contained
//  herein are proprietary to Adobe Systems Incorporated and its
//  suppliers, and are protected by trade secret or copyright law.
//  Dissemination of this information or reproduction of this material
//  is strictly forbidden unless prior written permission is obtained
//  from Adobe Systems Incorporated.
//  
//========================================================================================

package flashx.textLayout.ui
{
	import mx.skins.RectangularBorder;
	import mx.utils.GraphicsUtil;
	import flash.display.LineScaleMode;
	import flash.display.CapsStyle;

	public class MultiPanelHeaderSkin extends RectangularBorder
	{
		public function MultiPanelHeaderSkin()
		{
			super();
		}
		
		override protected function updateDisplayList(w:Number, h:Number):void
		{
			super.updateDisplayList(w, h);
			
			var fillColors:Array = [0x000000, 0x000000];
			var fillAlphas:Array = [1.0, 1.0];
			var borderColor:uint = 0x2A2A2A;
			var borderAlpha:Number = 1.0;
			
 			if (getStyle("fillColors") != undefined)
				fillColors = getStyle("fillColors");
 			if (getStyle("fillAlphas") != undefined)
				fillAlphas = getStyle("fillAlphas");
 			if (getStyle("borderColor") != undefined)
				borderColor = getStyle("borderColor");
 			if (getStyle("borderAlpha") != undefined)
				borderAlpha = getStyle("borderAlpha");

			graphics.clear();
			drawRoundRect(0,0,w, h, null, fillColors, fillAlphas, verticalGradientMatrix(0,0,w,h));
			graphics.lineStyle(1, borderColor, borderAlpha, true, LineScaleMode.NONE, CapsStyle.SQUARE);
			graphics.drawRect(0, 0, w-1, h);
		}
	}
}