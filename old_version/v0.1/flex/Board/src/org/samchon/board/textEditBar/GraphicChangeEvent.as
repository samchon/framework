//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_editBar/src/textEditBar/GraphicChangeEvent.as $
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
	
	import mx.collections.ArrayCollection;
	
	public class GraphicChangeEvent extends Event
	{
		private var _imageLink:String;
		private var _imageWidth:Object;
		private var _imageHeight:Object;
		private var _float:String;
		private var _replaceCurrent:Boolean;
		
		public function GraphicChangeEvent(type:String, imageLink:String, imageWidth:Object, imageHeight:Object, float:String, replaceCurrent:Boolean = false, bubbles:Boolean=false, cancelable:Boolean=false)
		{
			_imageLink = imageLink;
			_imageWidth = imageWidth;
			_imageHeight = imageHeight;
			_replaceCurrent = replaceCurrent;
			_float = float;
			super(type, bubbles, cancelable);
		}
		
		override public function clone():Event
		{
			return new GraphicChangeEvent(type, _imageLink, _imageWidth, _imageHeight, _float, _replaceCurrent, bubbles, cancelable);
		}
		
		public function get imageLink():String
		{ return _imageLink; }		
		
		public function get imageWidth():Object
		{ return _imageWidth; }
		
		public function get imageHeight():Object
		{ return _imageHeight; }
		
		public function get float():String
		{ return _float; }
		
		public function get replaceCurrent():Boolean
		{ return _replaceCurrent; }
	}
}
