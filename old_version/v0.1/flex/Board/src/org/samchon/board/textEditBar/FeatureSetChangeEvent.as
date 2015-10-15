//========================================================================================
//  $File: //a3t/argon/branches/v1/1.1/dev/sdk/samples/flex/textLayout_editBar/src/textEditBar/FeatureSetChangeEvent.as $
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
import flashx.textLayout.elements.TextFlow;

public class FeatureSetChangeEvent extends Event
{
	public const FEATURE_SET:String = "featureSet";
	
	public var featureSet:String;

	public function FeatureSetChangeEvent(newFeatureSet:String, type:String = FEATURE_SET,
							  bubbles:Boolean = false,
							  cancelable:Boolean = false)
	{
		super(type, bubbles, cancelable);
		featureSet = newFeatureSet;
	}
	override public function clone():Event
	{
		return new FeatureSetChangeEvent(featureSet, type, bubbles, cancelable);
	}
}		// end class
}
