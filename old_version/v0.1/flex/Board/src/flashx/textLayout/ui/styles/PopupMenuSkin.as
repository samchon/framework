//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/styles/PopupMenuSkin.as $
//  $DateTime: 2010/03/15 11:44:20 $
//  $Revision: #1 $
//  $Change: 744811 $
//  
//  ADOBE CONFIDENTIAL
//  
//  Copyright 2008 Adobe Systems Incorporated. All rights reserved.
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

package flashx.textLayout.ui.styles
{
	import flash.filters.DropShadowFilter;
	
	import mx.skins.RectangularBorder;

	public class PopupMenuSkin extends RectangularBorder
	{
		public function PopupMenuSkin()
		{
			super();
			filters = [new DropShadowFilter(2, 90, 0x000000, .45, 2, 2)];
		}

		override protected function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void 
		{
			super.updateDisplayList(unscaledWidth, unscaledHeight);
			
	 		if (getStyle("cornerRadius") != undefined)
				mCornerRadius = getStyle("cornerRadius");
			if (getStyle("backColor") != undefined)
				mBackColor = getStyle("backColor");
			if (getStyle("backAlpha") != undefined)
				mBackAlpha = getStyle("backAlpha");
			if (getStyle("lineColor") != undefined)
				mLineColor = getStyle("lineColor");
			if (getStyle("lineAlpha") != undefined)
				mLineAlpha = getStyle("lineAlpha");
			if (getStyle("lineWidth") != undefined)
				mLineWidth = getStyle("lineWidth");
	
			graphics.clear();
	 		graphics.lineStyle(mLineWidth, mLineColor, mLineAlpha);
			graphics.beginFill(mBackColor, mBackAlpha);
			graphics.drawRect(0, 0, unscaledWidth, unscaledHeight);
			graphics.endFill();
				
		}
	
	 	private var mCornerRadius:Number = 0;
	 	private var mLineWidth:Number = 1;
	 	private var mBackColor:uint = 0x1a1a1a;
	 	private var mBackAlpha:Number = 0.9;
	 	private var mLineColor:uint = 0xffffff;
	 	private var mLineAlpha:Number = 0.15;


	}
	
	
}
