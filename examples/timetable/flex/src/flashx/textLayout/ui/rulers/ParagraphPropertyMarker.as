//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/rulers/ParagraphPropertyMarker.as $
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
	import flashx.textLayout.formats.TextLayoutFormat;
	import flashx.textLayout.tlf_internal;
	use namespace tlf_internal;
	
	public class ParagraphPropertyMarker extends RulerMarker
	{
		public function ParagraphPropertyMarker(inRuler:RulerBar, inProperty:String)
		{
			super(inRuler, 6, 13, 0, 0, 0);
			setStyle("propkind", inProperty);
			setStyle("rightToLeftPar", false);
			mProperty = inProperty;
		}
		
		public function get property():String
		{
			return mProperty;
		}
		
		override protected function get alignToRight():Boolean
		{
			switch(mProperty)
			{
			case TextLayoutFormat.textIndentProperty.name:
				return mRightToLeftPar ? true : false;
			case TextLayoutFormat.paragraphStartIndentProperty.name:
				return mRightToLeftPar;
			case TextLayoutFormat.paragraphEndIndentProperty.name:
				return !mRightToLeftPar;
			}
			return false;
		}
		
		override protected function get originPosition():Number
		{
			return mRelativeToPosition;
		}

		public function set relativeToPosition(inRelPos:Number):void
		{
			mRelativeToPosition = inRelPos;
			positionMarker();
		}
		
		override public function get hOffset():Number
		{
			switch(mProperty)
			{
			case TextLayoutFormat.textIndentProperty.name:
				return mRightToLeftPar ? -6 : 0;
			case TextLayoutFormat.paragraphStartIndentProperty.name:
				return mRightToLeftPar ? -6 : 0;
			case TextLayoutFormat.paragraphEndIndentProperty.name:
				return mRightToLeftPar ? 0 : -6;
			}
			return 0;
		}
		
		public function set rightToLeftPar(inRightToLeft:Boolean):void
		{
			if (inRightToLeft != mRightToLeftPar)
			{
				mRightToLeftPar = inRightToLeft;
				setStyle("rightToLeftPar", mRightToLeftPar);
				
				if (mProperty == TextLayoutFormat.paragraphStartIndentProperty.name)
					mProperty = TextLayoutFormat.paragraphEndIndentProperty.name;
				else if (mProperty == TextLayoutFormat.paragraphEndIndentProperty.name)
					mProperty = TextLayoutFormat.paragraphStartIndentProperty.name;
			}
		}
		
		private var mProperty:String;
		private var mRelativeToPosition:Number = 0;
		private var mRightToLeftPar:Boolean = false;
	}
}