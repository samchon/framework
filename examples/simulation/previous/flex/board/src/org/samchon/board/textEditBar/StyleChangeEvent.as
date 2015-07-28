//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_editBar/src/textEditBar/StyleChangeEvent.as $
//  $DateTime: 2010/03/15 11:44:20 $
//  $Revision: #1 $
//  $Change: 744811 $
//  
//  ADOBE CONFIDENTIAL
//  
//  Copyright 2007-08 Adobe Systems Incorporated. All rights reserved.
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
package org.samchon.board.textEditBar
{
	import flash.events.Event;
	
	import flashx.textLayout.formats.ITextLayoutFormat;

	public class StyleChangeEvent extends Event
	{
		private var _attrs:Object;
		
		public function StyleChangeEvent(type:String, styleAttrs:Object, bubbles:Boolean=false, cancelable:Boolean=false)
		{
			_attrs = styleAttrs;
			super(type, bubbles, cancelable);
		}
		
		override public function clone():Event
		{
			return new StyleChangeEvent(type, _attrs, bubbles, cancelable);
		}
		
		public function get format():ITextLayoutFormat
		{ return _attrs as ITextLayoutFormat; }	
		
		public function get attrs():Object
		{ return _attrs; }
	}
}