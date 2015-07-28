package org.samchon.namTree.fileTree.window.grid
{
	import flash.events.Event;
	
	import mx.controls.TextInput;
	
	import org.samchon.format.Format;
	import org.samchon.utils.StringUtil;
	
	public class NTParameterInputDGEditor extends NTParameterNameDGEditor
	{
		protected var prevType:String = null;
		
		public function NTParameterInputDGEditor()
		{
			super();
			this.addEventListener(Event.CHANGE, handleChanged);
		}
		protected function handleChanged(event:Event):void {
			var value:Number = Number( StringUtil.replace(this.text, ",", "") );
			
			//IF NOT A NUMBER THEN, TERMINATE
			if( isNaN(value) == false && this.text.charAt( this.text.length - 1 ) != "." )
			{
				//PREV POSITION AND LENGTH
				var prevAnchorX:int = this.selectionBeginIndex;
				var prevLength:int = this.text.length;
				
				var fractionalDigits:int = (this.text.indexOf(".") != -1) ? this.text.split(".")[1].length : 0;
				
				//SET NEW DATA
				this.text = Format.numberFormat(value, false, false, fractionalDigits);
				
				var length:int = this.text.length;
				var lengthChanged:int = length - prevLength;
				var anchorX:int = prevAnchorX + lengthChanged;
				
				if(anchorX < 0)
					anchorX = 0;
				this.setSelection(anchorX, anchorX);
			}
		}
	}
}