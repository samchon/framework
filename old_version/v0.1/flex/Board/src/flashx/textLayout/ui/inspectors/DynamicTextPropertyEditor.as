//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/inspectors/DynamicTextPropertyEditor.as $
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
	import bxf.ui.inspectors.DynamicPropertyEditorBase;

	import mx.events.PropertyChangeEvent;

	public class DynamicTextPropertyEditor extends DynamicPropertyEditorBase
	{
		public function DynamicTextPropertyEditor(inRecipe:XML)
		{
			super(inRecipe);
			TextInspectorController.Instance().addEventListener(SelectionUpdateEvent.SELECTION_UPDATE, onSelectionUpdate);
			addEventListener(DynamicPropertyEditorBase.MODELCHANGED_EVENT, onFormatValueChanged, false, 0, true);
			addEventListener(DynamicPropertyEditorBase.MODELEDITED_EVENT, onFormatValueChanged, false, 0, true);
		}
		
		public function set active(inActive:Boolean):void
		{
			if (mActive != inActive)
			{
				mActive = inActive;
				if (mActive)
					TextInspectorController.Instance().forceBroadcastFormats();
			}
		}
		
		public function get active():Boolean
		{
			return mActive;
		}
		
		private function onSelectionUpdate(e:SelectionUpdateEvent):void
		{
			if (mActive)
			{
				reset();
				for (var id:String in e.format)
				{
					if (e.format[id].length == 1)
						properties[id] = e.format[id][0];
					else
						properties[id] = e.format[id];
				}
				rebuildUI();
			}
		}

		private function onFormatValueChanged(e:PropertyChangeEvent):void
		{
			TextInspectorController.Instance().SetTextProperty(e.property as String, e.newValue);
		}
		
		private var mActive:Boolean = false;
	}
}