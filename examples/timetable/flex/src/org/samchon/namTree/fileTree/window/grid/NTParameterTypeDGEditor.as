package org.samchon.namTree.fileTree.window.grid
{
	import mx.collections.ArrayList;
	import mx.controls.ComboBox;
	import mx.events.ListEvent;
	
	import org.samchon.namTree.fileTree.file.NTParameter;
	
	public class NTParameterTypeDGEditor extends ComboBox
	{
		protected static function get typeParameterList():ArrayList
		{
			return NTParameter.typeParameterList;
		}
		
		public function NTParameterTypeDGEditor()
		{
			super();
			this.dataProvider = typeParameterList;
			this.selectedIndex = 0;
			
			this.addEventListener(ListEvent.CHANGE, handleChanged);
		}
		override public function set data(map:Object):void
		{
			super.data = map;
			
			for(var i:int = 0; i < typeParameterList.length; i++)
				if(map.type == typeParameterList.getItemAt(i).data)
					this.selectedIndex = i;
		}
		protected function handleChanged(event:ListEvent):void
		{
			var map:Object = this.data;
			map.type = this.selectedItem.data;
			
			this.data = map;
		}
		
	}
}