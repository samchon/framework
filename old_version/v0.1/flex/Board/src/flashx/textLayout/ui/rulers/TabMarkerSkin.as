//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/rulers/TabMarkerSkin.as $
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

package flashx.textLayout.ui.rulers
{
	import flash.text.engine.TabAlignment;
	
	import mx.skins.RectangularBorder;

	public class TabMarkerSkin extends RectangularBorder
	{
		public function TabMarkerSkin()
		{
			super();
		}
		
		override protected function updateDisplayList(w:Number, h:Number):void
		{
		    super.updateDisplayList(w, h);
		    
		    var tabKind:String = getStyle("tabkind");
		    
			graphics.clear();

		    graphics.lineStyle(3, 0xffffff);
		    drawOrnament(tabKind, w, h);
		    graphics.lineStyle(1, 0x000000);
		    drawOrnament(tabKind, w, h);
		    
		    if (tabKind == flash.text.engine.TabAlignment.DECIMAL)
		    {
				graphics.beginFill(0x000000);
				graphics.drawCircle(w / 2 + 3, (h - w / 2) / 2, .75);
				graphics.endFill();
		    }
		    
			graphics.beginFill(0x000000);
			graphics.moveTo(0, h - w / 2);
			graphics.lineTo(w / 2, h);
			graphics.lineTo(w, h - w / 2);
			graphics.lineTo(0, h - w / 2);
			graphics.endFill();
			
		    var selected:Boolean = getStyle("selected");
	  		graphics.lineStyle();
	    	graphics.beginFill(0x0000ff, selected ? .3 : 0);
	    	graphics.drawRect(0, 0, w, h);
	    	graphics.endFill();
		}

		private function drawOrnament(inKind:String, w:Number, h:Number):void
		{
			switch (inKind)
			{
			case flash.text.engine.TabAlignment.START:
				graphics.moveTo(w / 2, h - w / 2);
				graphics.lineTo(w / 2, 1);
				graphics.lineTo(w, 1);
				break;
			case flash.text.engine.TabAlignment.CENTER:
				graphics.moveTo(w / 2, h - w / 2);
				graphics.lineTo(w / 2, 0);
				break;
			case flash.text.engine.TabAlignment.END:
				graphics.moveTo(w / 2, h - w / 2);
				graphics.lineTo(w / 2, 1);
				graphics.lineTo(0, 1);
				break;
			case flash.text.engine.TabAlignment.DECIMAL:
				graphics.moveTo(w / 2, h - w / 2);
				graphics.lineTo(w / 2, 0);
				break;
			}
		}
		

	}
}