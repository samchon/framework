//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/inspectors/LinkPropertyEditor.as $
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
	public class LinkPropertyEditor extends DynamicTextPropertyEditor
	{
		public function LinkPropertyEditor()
		{
			var recipe:XML =
				<recipe>
					<row>
						<editor type="string" label="$$$/stage/TextEditing/Label/linkURL=URL:" width="150">
							<property name={TextInspectorController.LINK_URL_UIPROP}/>
						</editor>
					</row>
					<row>
						<editor type="combo" label="$$$/stage/TextEditing/Label/linkTarget=Target:">
							<property name={TextInspectorController.LINK_TARGET_UIPROP}/>
							<choice display="_blank" value={"_blank"}/>
							<choice display="_self" value={"_self"}/>
							<choice display="_parent" value={"_parent"}/>
							<choice display="_top" value={"_top"}/>
						</editor>
						<editor type="checkbox" label="$$$/stage/TextEditing/Label/linkExtend=Extend:">
							<property name={TextInspectorController.LINK_EXTEND_UIPROP}/>
						</editor>
					</row>
				</recipe>;
			super(recipe);
		}
		
	}
}