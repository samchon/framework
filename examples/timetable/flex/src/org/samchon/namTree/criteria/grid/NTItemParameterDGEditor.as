package org.samchon.namTree.criteria.grid
{
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import mx.containers.Box;
	import mx.controls.Alert;
	import mx.controls.ComboBox;
	import mx.events.DropdownEvent;
	import mx.events.ListEvent;
	
	import org.samchon.namTree.fileTree.file.NTParameter;
	import org.samchon.namTree.fileTree.file.NTParameterList;
	import org.samchon.ui.NumberInputMX;
	
	public class NTItemParameterDGEditor extends Box
	{
		protected function get itemParameter():NTItemParameter
		{
			return super.data as NTItemParameter;
		}
		protected function get parameter():NTParameter
		{
			return itemParameter.parameter;
		}
		
		protected var textInput:NumberInputMX = null;
		protected var comboBox:ComboBox = null;
		protected var isConstructed:Boolean = false;
		
		public var value:String;
		
		public function NTItemParameterDGEditor()
		{
			super();
		}	
		protected function construct():void
		{
			if(this.numElements > 0)
				return;
			
			if(this.parameter.length == 0)
			{
				textInput = new NumberInputMX();
				switch(itemParameter.type)
				{
					case "int":
						textInput.restrict = "[0-9\\-]";
						break;
					case "Number":
						textInput.restrict = "[0-9.\\-]";
						break;
					case "String":
						textInput.restrict = "^";
						break;
				}
				textInput.addEventListener(Event.CHANGE, handleTIChanged);
				
				textInput.percentWidth = 100;
				textInput.percentHeight = 100;
				
				this.addChild( textInput );
			}
			else
			{
				comboBox = new ComboBox();
				comboBox.dataProvider = parameter;
				comboBox.addEventListener(ListEvent.CHANGE, handleCBChanged);
				comboBox.addEventListener(DropdownEvent.CLOSE, handleCBChanged);
				
				comboBox.percentWidth = 100;
				comboBox.percentHeight = 100;
				
				this.addChild( comboBox );
			}
		}
		override public function set data(val:Object):void
		{
			super.data = val;
			
			itemParameter.setValue(this.value);
			this.value = itemParameter.value;
			
			construct();
		}
		override public function get data():Object
		{
			if(textInput)
				textInput.text = value;
			else if(comboBox)
				for(var i:int = 0; i < parameter.length; i++)
					if(parameter.getParameterDeterminedAt(i).data == value)
						comboBox.selectedIndex = i;
			return super.data;
		}
		
		protected function handleTIChanged(event:Event):void
		{
			this.value = event.target.text;
			this.data = itemParameter;
		}
		protected function handleCBChanged(event:Event):void
		{
			this.value = event.target.selectedItem.data;
			this.data = itemParameter;
			stage.focus = null;
		}
		
	}
}