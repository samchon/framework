package org.samchon.ui.label
{
	import org.samchon.format.Format;
	import spark.components.Label;
	
	public class PercentLabel extends spark.components.Label
	{
		public function PercentLabel()
		{
			super();
		}
		
		public override function set text($text:String):void {
			if($text == null || $text == "")
				return;
			
			value = Number($text);
		}
		protected function set value(val:Number):void {
			//SET COLOR
			if(val > 0)			this.setStyle("color", "red");
			else if(val == 0)	this.setStyle("color", "black");
			else				this.setStyle("color", "blue");
			
			//SET LABEL TEXT
			super.text = Format.percentFormat( val );
		}
	}
}