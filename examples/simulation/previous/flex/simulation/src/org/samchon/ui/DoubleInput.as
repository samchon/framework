package org.samchon.ui
{
	import flash.events.Event;
	
	import mx.controls.TextInput;
	
	public class DoubleInput extends TextInput
	{
		private var min:Number = Number.MIN_VALUE;
		private var max:Number = Number.MAX_VALUE;
		
		public function DoubleInput()
		{
			super();
			this.restrict = "[0-9.\\-]";
			this.addEventListener(Event.CHANGE, handleChanged);
		}
		public function get value():Number {
			return Number(this.text);
		}
		public function set minimum(value:Number):void {
			min = value;
		}
		public function set maximum(value:Number):void {
			max = value;
		}
		public function set enableNagative(bool:Boolean):void {
			if(bool)
				this.restrict = "[0-9.\\-]";
			else
				this.restrict = "[0-9.]";
		}
		
		private function handleChanged(e:Event):void {
			var str:String = this.text;
			var value:Number;
			var n:int = 0;
			
			for(var i:int = 0; i < str.length; i++)
				if(str.charAt(i) == ".")
					n++;
			if(n >= 2)
				str = str.substr(0, str.length - 1);
			
			n = 0;
			for(i = 0; i < str.length; i++)
				if(str.charAt(i) == "-")
					n++;
			if(n >= 2)
				str = str.substr(0, str.length - 1);
			
			value = Number(str);
			if(value > max)
				this.text = String(max);
			//else if(value < min)
				//this.text = String(min);
			else
				this.text = str;
			
			this.setSelection(this.text.length, this.text.length);
		}
	}
}