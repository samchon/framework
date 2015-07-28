//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_ui/src/flashx/textLayout/ui/inspectors/AntiAliasPropertyEditor.as $
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
	import flash.text.AntiAliasType;
	import flash.text.engine.CFFHinting;
	import flash.text.engine.RenderingMode;

	public class AntiAliasPropertyEditor extends DynamicTextPropertyEditor
	{
		public function AntiAliasPropertyEditor()
		{
			var recipe:XML = 
				<recipe>
					<row>
						<editor type="combo" label="$$$/stage/TextEditing/Label/Antialias=Antialias:">
							<property name={TextInspectorController.RENDERING_MODE_UIPROP}/>
							<choice display="Normal" value={flash.text.engine.RenderingMode.NORMAL}/>
							<choice display="CFF" value={flash.text.engine.RenderingMode.CFF}/>
						</editor>
					</row>
					<row>
						<editor type="combo" label="$$$/stage/TextEditing/Label/GridFit=Grid Fit:">
							<property name={TextInspectorController.CFF_HINTING_UIPROP}/>
							<choice display="None" value={flash.text.engine.CFFHinting.NONE}/>
							<choice display="Horizontal stem" value={flash.text.engine.CFFHinting.HORIZONTAL_STEM}/>
						</editor>
					</row>
				</recipe>;
			super(recipe);
		}
		
	}
}