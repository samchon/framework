//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/rulers/RulerDragTracker.as $
//  $DateTime: 2010/03/15 11:44:20 $
//  $Revision: #1 $
//  $Change: 744811 $
//  
//  ADOBE CONFIDENTIAL
// ___________________
//
//  Copyright 2008 Adobe Systems Incorporated
//  All Rights Reserved.
//
// NOTICE:  All information contained herein is, and remains
// the property of Adobe Systems Incorporated and its suppliers,
// if any.  The intellectual and technical concepts contained
// herein are proprietary to Adobe Systems Incorporated and its
// suppliers and may be covered by U.S. and Foreign Patents,
// patents in process, and are protected by trade secret or copyright law.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe Systems Incorporated.
//========================================================================================

package flashx.textLayout.ui.rulers
{
	import flash.events.MouseEvent;
	import flash.geom.Point;
	
	import mx.core.UIComponent;
	
	import bxf.ui.toolkit.Tracker;

	public class RulerDragTracker extends Tracker
	{
		public function RulerDragTracker(inPeerToTrackTo:UIComponent, inController:RulerBar, inCookie:Object, inDragThreshold:Number = 2)
		{
			super(inPeerToTrackTo, 0, 0);
			mController = inController;
			mDragCookie = inCookie;
			mDragThreshold = inDragThreshold;
		}
		
		/**	Override to get cursor adjust hook and mouse down. 
		 * @param inMouseEvent mouse info.
		 * @param inCursorAdjust true if this is a mouse up track.*/
		override public function BeginTracking(inMouseEvent:MouseEvent, inCursorAdjust:Boolean):void
		{
			super.BeginTracking(inMouseEvent, inCursorAdjust);
		}
		
		/**	Override to get mouse move. 
		 * @param inMouseEvent mouse info.*/
		override public function ContinueTracking(inMouseEvent:MouseEvent):void
		{
			super.ContinueTracking(inMouseEvent);
			if (!mDragThresholdReached)
			{
				if (Point.distance(mAnchorPt, mTrackPt) >= mDragThreshold)
					mDragThresholdReached = true;
			}
			if (mDragThresholdReached)
				mController.TrackDrag(mTrackPt, mDragCookie, false);
			inMouseEvent.stopPropagation();
		}
		
		/**	Override to get mouse up. 
		 * @param inMouseEvent mouse info.*/
		override public function EndTracking(inMouseEvent:MouseEvent):void
		{
			super.EndTracking(inMouseEvent);
			if (mDragThresholdReached)
				mController.TrackDrag(mTrackPt, mDragCookie, true);
			else
				mController.DragCancelled();
			inMouseEvent.stopPropagation();
		}
		
		override protected function TrackPoint(inMouseEvent:MouseEvent, inAlsoSetAnchor:Boolean): void
		{
			mTrackPt.x = inMouseEvent.stageX;
			mTrackPt.y = inMouseEvent.stageY;
			mTrackPt = mController.globalToLocal(mTrackPt);
			if (inAlsoSetAnchor)
				mAnchorPt = mTrackPt.clone();
		}

		private var mController:RulerBar = null;
		private var mDragCookie:Object = null;
		private var mDragThreshold:Number;
		private var mDragThresholdReached:Boolean = false;
	}
}