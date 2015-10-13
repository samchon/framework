//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/rulers/RulerMarker.as $
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
	import mx.containers.Canvas;

	public class RulerMarker extends Canvas
	{
		public function RulerMarker(inRuler:RulerBar, inWidth:Number, inHeight:Number, inHOffset:Number, inVOffset:Number, inPos:Number)
		{
			super();
			width = inWidth;
			height = inHeight;
			mHOffset = inHOffset;
			mVOffset = inVOffset;
			mPos = inPos;
			mRuler = inRuler;
		}
		
		override public function initialize():void
		{
			super.initialize();
			positionMarker();
		}
		
		protected function positionMarker():void
		{
			if (parent)
			{
				if (alignToRight)
				{
					x = parent.width - originPosition - pos + hOffset;
					y = parent.height - height + vOffset;
				}
				else
				{
					x = originPosition + pos + hOffset;
					y = parent.height - height + vOffset;
				}
			}
		}
		
		protected function get alignToRight():Boolean
		{
			return ruler.rightToLeft;
		}
		
		protected function get originPosition():Number
		{
			return 0;
		}

		public function set pos(inPos:Number):void
		{
			mPos = inPos;
			positionMarker();
		}
		
		public function get pos():Number
		{
			return mPos;
		}
		
		public function set hOffset(inOffset:Number):void
		{
			mHOffset = inOffset;
			positionMarker();
		}
		
		public function get hOffset():Number
		{
			return mHOffset;
		}
		
		public function set vOffset(inOffset:Number):void
		{
			mVOffset = inOffset;
			positionMarker();
		}
		
		public function get vOffset():Number
		{
			return mVOffset;
		}
		
		public function get ruler():RulerBar
		{
			return mRuler;
		}
		
		public function set markerLeft(inNewLeft:Number):void
		{
			if (parent)
			{
				if (alignToRight)
					pos = parent.width - (inNewLeft + hOffset > parent.width ? parent.width : inNewLeft + hOffset)  - originPosition;
				else
					pos = (inNewLeft < 0 ? 0 : inNewLeft) - originPosition - hOffset;
			}
		}

		private var mPos:Number;
		private var mHOffset:Number;
		private var mVOffset:Number;
		private var mRuler:RulerBar = null;
	}
}