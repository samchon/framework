//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/inspectors/TabPropertyEditor.as $
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
	import bxf.ui.inspectors.DynamicPropertyEditorBase;
	
	import flash.text.engine.*;
	
	import flashx.textLayout.formats.TabStopFormat;
	import flashx.textLayout.tlf_internal;
	use namespace tlf_internal;
	
	public class TabPropertyEditor extends DynamicPropertyEditorBase
	{
		public function TabPropertyEditor()
		{
			var recipe:XML = 
				<recipe>
					<row>
						<editor type="checkbox" label="$$$/stage/TextEditing/Label/showRuler=Show Ruler" labelSide="right">
							<property name="rulervisible"/>
						</editor>
						<editor type="hotnumber" label="$$$/stage/TextEditing/Label/tabPosition=Position:" decimals="1" enforcePrecision="no">
							<property name={TabStopFormat.positionProperty.name}
								minValue={TabStopFormat.positionProperty.minValue}
								maxValue={TabStopFormat.positionProperty.maxValue}/>
						</editor>
					</row>
					<row>
						<editor type="combo" label="$$$/stage/TextEditing/Label/tabType=Tab Type:">
							<property name={TabStopFormat.alignmentProperty.name}/>
							<choice display="Start" value={flash.text.engine.TabAlignment.START}/>
							<choice display="Center" value={flash.text.engine.TabAlignment.CENTER}/>
							<choice display="End" value={flash.text.engine.TabAlignment.END}/>
							<choice display="Align" value={flash.text.engine.TabAlignment.DECIMAL}/>
						</editor>
						<editor type="string" label="$$$/stage/TextEditing/Label/tabAlign=Align to:" width="50">
							<property name={TabStopFormat.decimalAlignmentTokenProperty.name}/>
						</editor>
					</row>
				</recipe>;

			super(recipe);
		}
		
	}
}