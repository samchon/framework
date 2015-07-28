//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/inspectors/TextFlowPropertyEditor.as $
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

package flashx.textLayout.ui.inspectors
{
	import flashx.textLayout.formats.BlockProgression;
	import flashx.textLayout.formats.LineBreak;

	public class TextFlowPropertyEditor extends DynamicTextPropertyEditor
	{
		public function TextFlowPropertyEditor()
		{
			var recipe:XML =
				<recipe>
					<row>
						<editor type="combo" label="$$$/stage/TextEditing/Label/LineProgression=Orientation:">
							<property name={TextInspectorController.BLOCK_PROGRESSION_UIPROP}/>
							<choice display="Horizontal" value={flashx.textLayout.formats.BlockProgression.TB}/>
							<choice display="Vertical" value={flashx.textLayout.formats.BlockProgression.RL}/>
						</editor>
					</row>
					<row>
						<editor type="combo" label="$$$/stage/TextEditing/Label/direction=Direction:">
							<property name={TextInspectorController.FLOW_DIRECTION_UIPROP}/>
							<choice display="Left to Right" value={flashx.textLayout.formats.Direction.LTR}/>
							<choice display="Right to Left" value={flashx.textLayout.formats.Direction.RTL}/>
						</editor>
					</row>
					<row>
						<editor type="combo" label="$$$/stage/TextEditing/Label/Linebreak=Line Breaks:">
							<property name={TextInspectorController.LINE_BREAK_UIPROP}/>
							<choice display="Auto Line Wrap" value={flashx.textLayout.formats.LineBreak.TO_FIT}/>
							<choice display="Hard Breaks Only" value={flashx.textLayout.formats.LineBreak.EXPLICIT}/>
						</editor>
					</row>
					<row>
						<editor type="combo" label="$$$/stage/TextEditing/Label/vertScroll=V. Scroll:">
							<property name={TextInspectorController.VERTICAL_SCROLL_UIPROP}/>
							<choice display="Off" value="off"/>
							<choice display="On" value="on"/>
							<choice display="Auto" value="auto"/>
						</editor>
						<editor type="combo" label="$$$/stage/TextEditing/Label/horzScroll=H. Scroll:">
							<property name={TextInspectorController.HORIZONTAL_SCROLL_UIPROP}/>
							<choice display="Off" value="off"/>
							<choice display="On" value="on"/>
							<choice display="Auto" value="auto"/>
						</editor>
					</row>
				</recipe>;
			super(recipe);
		}
		
	}
}