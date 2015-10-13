package org.samchon.ui
{
	import flash.events.Event;
	
	import mx.controls.TextInput;
	
	import org.samchon.format.Format;
	import org.samchon.utils.StringUtil;
	
	public class NumberInput extends TextInput
	{
		public function NumberInput(type:String = "Number")
		{
			super();
			
			setType(type);
			this.addEventListener(Event.CHANGE, handleChanged);
		}
		public function setType(type:String):void
		{
			if(type == "int")
				this.restrict = "[0-9\\-]";
			else if(type == "Number")
				this.restrict = "[0-9\\.\\-]";
			else if(type == "String")
				this.restrict = "^";
		}
		
		public override function set text(value:String):void
		{
			if(value == null)
				return;
			var number:Number = Number( StringUtil.replace(value, ",", "") );
			
			//IF NOT A NUMBER THEN, TERMINATE
			if( isNaN(number) == true )
				super.text = value;
			
			//SET NEW DATA
			else
			{
				var fraction:int = 0;
				if( super.text.indexOf(".") != -1 )
					fraction = super.text.length - 1 - super.text.indexOf(".");
				super.text = Format.numberFormat(number, false, false, fraction);
			}
		}
		public override function get text():String
		{
			var value:Number = Number( StringUtil.replace(super.text, ",", "") );
			
			//IF NOT A NUMBER THEN, TERMINATE
			if( isNaN(value) == true )
				return super.text;
			else
				return StringUtil.replace(super.text, ",", "")
		}
		
		protected function handleChanged(event:Event):void {
			var value:Number = Number( StringUtil.replace(super.text, ",", "") );
			
			//IF NOT A NUMBER THEN, TERMINATE
			if( isNaN(value) == true || super.text.indexOf(".") == super.text.length - 1 )
				return;
			
			//PREV POSITION AND LENGTH
			var prevAnchorX:int = this.selectionBeginIndex;
			var prevLength:int = super.text.length;
			
			//SET NEW DATA
			this.text = value.toString();
			
			var length:int = super.text.length;
			var lengthChanged:int = length - prevLength;
			var anchorX:int = prevAnchorX + lengthChanged;
			
			if(anchorX < 0)
				anchorX = 0;
			this.setSelection(anchorX, anchorX);
		}
	}
}