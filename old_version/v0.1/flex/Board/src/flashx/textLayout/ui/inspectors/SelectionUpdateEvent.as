//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/inspectors/SelectionUpdateEvent.as $
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

package flashx.textLayout.ui.inspectors
{
	import flash.events.Event;

	public class SelectionUpdateEvent extends Event
	{
		public static const SELECTION_UPDATE:String = "selectionUpdate";
		
		public function SelectionUpdateEvent(inFormat:Object)
		{
			super(SELECTION_UPDATE);
			mFormat = inFormat;
		}
		
		public function get format():Object
		{
			return mFormat;
		}
		
		private var mFormat:Object;
	}
}