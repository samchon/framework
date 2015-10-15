package org.samchon.ui
{
	import mx.collections.IList;
	import mx.core.IVisualElement;
	import mx.events.FlexEvent;
	
	import spark.components.ButtonBar;
	import spark.components.IItemRenderer;
	
	public class ButtonBar extends spark.components.ButtonBar {
		protected var creationFlag:Boolean = false;
		protected var _setSelectedIndex:int = -1;
		
		protected var _allowMultipleSelection:Boolean;
		protected var _selectedIndex:int = -1;
		protected var _selectedIndices:Array = [];
		protected var _removedIndex:int = -1;
		
		public function ButtonBar()
		{
			super();
			this.addEventListener(FlexEvent.CREATION_COMPLETE, main);
		}
		protected function main(event:FlexEvent):void {
			creationFlag = true;
			if(_setSelectedIndex != -1)
				selectedIndex = _setSelectedIndex;
		}
		
		/*
		==================================================
		GET METHOD
		==================================================
		*/
		public override function get selectedIndex():int {
			return _selectedIndex;
		}
		public function get selectedItems():Array {
			var items:Array = [];
			for(var i:int = 0; i < _selectedIndices.length; i++)
				items.push( dataProvider.getItemAt(_selectedIndices[i]) );
			
			return items;
		}
		public function get selectedIndices():Array {
			return _selectedIndices;
		}
		public function get removedIndex():int {
			return _removedIndex;
		}
		public function get removedItem():Object {
			if(_removedIndex == -1)
				return null;
			else
				return dataProvider.getItemAt(_removedIndex);
		}
		
		/*
		==================================================
		SET METHOD
		==================================================
		*/
		public override function set selectedIndex(value:int):void {
			if(creationFlag) {
				getItemRenderer(value).selected = true;
				_selectedIndices = [value];
			}
			else _setSelectedIndex = value;
		}
		
		public function set allowMultipleSelection(value:Boolean):void {
			_allowMultipleSelection = value;
		}
		public function removeSelectionAt(x:int, manual:Boolean = true):void {
			if(manual)
				getItemRenderer(x).selected = false;
			
			for(var i:int = 0; i < _selectedIndices.length; i++)
				if( x == _selectedIndices[i] )
					break;
			_selectedIndices.splice(i, 1);
			_removedIndex = x;
			_selectedIndex = -1;
		}
		
		/*
		==================================================
		ABOUT MULTIPLE-SELECTION
		==================================================
		*/
		protected override function itemSelected(index:int, selected:Boolean):void {
			if( _allowMultipleSelection == false ) {
				super.itemSelected(index, selected);
				_removedIndex = -1;
				return;
			}
			var itemRenderer:IItemRenderer = getItemRenderer(index);
			if(itemRenderer)
				selected = itemRenderer.selected;
			
			if(selected == true) {
				for(var i:int = 0; i < _selectedIndices.length; i++)
					if(index == _selectedIndices[i])
						return;
					
				_selectedIndices.push( index );
				_selectedIndex = index;
				_selectedIndices.sort();
				_removedIndex = -1;
			}else //false
				removeSelectionAt(index, false);
		}
		protected function getItemRenderer(index:int):IItemRenderer {
			if (!dataGroup || (index < 0) || (index >= dataGroup.numElements))
				return null;
			
			return dataGroup.getElementAt(index) as IItemRenderer;
		}
	}
}