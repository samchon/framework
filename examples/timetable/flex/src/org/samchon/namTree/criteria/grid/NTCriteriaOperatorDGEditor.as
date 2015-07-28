package org.samchon.namTree.criteria.grid
{
	import mx.collections.ArrayList;
	import mx.controls.ComboBox;
	import mx.events.ListEvent;
	
	import org.samchon.namTree.criteria.NTCriteria;
	import org.samchon.namTree.criteria.data.NTOperator;
	
	public class NTCriteriaOperatorDGEditor extends ComboBox
	{
		
		public function NTCriteriaOperatorDGEditor()
		{
			super();
			this.dataProvider = NTOperator.operatorList;
			
			this.addEventListener(ListEvent.CHANGE, handleChanged);
		}
		protected function handleChanged(event:ListEvent):void
		{
			var data:NTCriteria = super.data as NTCriteria;
			data.setOperator( this.selectedItem.data );
			
			this.data = data;
		}
		override public function set data(value:Object):void
		{
			//SET SUPER_DATA
			super.data = value;
			
			//SET INDEX
			this.selectedIndex = NTCriteria(value).getOperator();
		}
	}
}