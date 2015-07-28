package org.samchon.library.ui
{
	import mx.collections.ListCollectionView;
	import mx.controls.DataGrid;
	import mx.events.DragEvent;
	
	public class DataGrid 
		extends mx.controls.DataGrid
	{
		public function DataGrid()
		{
			super();
		}
		override protected function dragDropHandler(event:DragEvent):void
		{
			var ac:ListCollectionView = this.dataProvider as ListCollectionView;
			
			var items:Array = event.dragSource.dataForFormat("items") as Array;
			var item:Object;
			
			var isDuplicated:Boolean;
			
			for(var i:int = items.length - 1; i >= 0; i--)
			{
				isDuplicated = false;
				item = items[i];
				
				for(var j:int = 0; j < ac.length; j++)
					if(ac.getItemAt(j) == item)
					{
						isDuplicated = true;
						break;
					}
				if(isDuplicated == false)
					ac.addItem( item );
			}
		}
	}
}