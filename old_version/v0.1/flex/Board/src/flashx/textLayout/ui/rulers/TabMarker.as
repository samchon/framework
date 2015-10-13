//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/rulers/TabMarker.as $
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
	import mx.messaging.management.Attribute;
	
	import flashx.textLayout.formats.ITabStopFormat;
	
	public class TabMarker extends RulerMarker implements ITabStopFormat
	{
		public function TabMarker(inRuler:RulerBar, tabAttrs:ITabStopFormat)
		{
			super(inRuler, 9, 10, -4, 0, Number(tabAttrs.position));
			mTabKind = tabAttrs.alignment;
			mAlignmentToken = tabAttrs.decimalAlignmentToken;
			setStyle("tabkind", mTabKind);
		}
		
		public function get alignment():*
		{
			return mTabKind;
		}
		
		public function set alignment(inAlignment:String):void
		{
			mTabKind = inAlignment;
			setStyle("tabkind", mTabKind);
		}
		
		public function get decimalAlignmentToken():*
		{
			return mAlignmentToken;
		}
		
		public function set decimalAlignmenyToken(inToken:String):void
		{
			mAlignmentToken = inToken;
		}
		
		public function set decimalAlignmentToken(inToken:String):void
		{
			mAlignmentToken = inToken;
		}
		
		public function get position():*
		{
			return pos;
		}
		
		public function set position(inPosition:Object):void
		{
			pos = inPosition as Number;
		}
		
		
		public function isDifferentPosition(element:*, index:int, arr:Array):Boolean
		{
			var other:TabMarker = element as TabMarker;
			if (other)
				return other.position != position;
			else
				return true;
		}
		

		private var mTabKind:String;
		private var mAlignmentToken:String = null;
	}
}