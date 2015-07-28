package org.samchon.simulation.simulation.backtesting.boundary.namtree.criteria
{
	import org.samchon.namtree.criteria.NTCriteria;
	import org.samchon.namtree.criteria.NTItem;
	import org.samchon.namtree.criteria.data.NTOperator;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree.file.BTFile;
	
	public class BTCriteria extends NTCriteria
	{
		public function BTCriteria()
		{
			super();
		}
		override protected function getNewCriteria():NTCriteria
		{
			return new BTCriteria();
		}
		override protected function getNewItem():NTItem
		{
			return new BTItem();
		}
		
		public function getExploratoryName():String
		{
			var item:NTItem;
			
			if(leftItem.getFile() != null)
				item = leftItem;
			else
				item = rightItem;
			
			return item.$data + "[" + item.$option + "]";
		}
		
		/*
		===============================================================
			METHODS FOR EXPLORATION
		===============================================================
		*/
		private static var invalidSellingCriteria:BTCriteria = null;
		public static function getInvalidSellingCriteria():BTCriteria
		{
			if(invalidSellingCriteria != null)
				return invalidSellingCriteria;
			
			invalidSellingCriteria = new BTCriteria();
			var leftItem:BTItem = new BTItem(0, null, "int", "0");
			var rightItem:BTItem = new BTItem(0, null, "int", "1");
			var operator:int = NTOperator.EQUAL;
			
			invalidSellingCriteria.setLeftItem(leftItem);
			invalidSellingCriteria.setRightItem(rightItem);
			invalidSellingCriteria.setOperator(operator);
			
			return invalidSellingCriteria;
		}
		
		public function setExploratoryValue(value:Number):void
		{
			var file:BTFile = this.getFile() as BTFile;
			
			if(file != null && file.getAccuracy() != Global.NULL)
				if(leftItem.getFile() == null)
					BTItem(leftItem).setExploratoryValue(value);
				else
					BTItem(rightItem).setExploratoryValue(value);
			//trace(this.toXML());
		}
		
		public function getExploratoryArray():Vector.<BTCriteria>
		{
			var vec:Vector.<BTCriteria> = new Vector.<BTCriteria>();
			
			var file:BTFile = this.getFile() as BTFile;
			if(file != null && file.getAccuracy() != Global.NULL)
				if(leftItem.getType() == "explore" || rightItem.getType() == "explore")
					vec.push( this );
			
			for(var i:int = 0; i < this.length; i++)
				vec = vec.concat( BTCriteria( at(i) ).getExploratoryArray() );
			
			return vec;
		}
		public function duplicate(val:Number):BTCriteria
		{
			var criteria:BTCriteria = new BTCriteria();
			
			var leftItem:BTItem = duplicateItem( this.leftItem as BTItem );
			var rightItem:BTItem = duplicateItem( this.rightItem as BTItem );
			var operator:int = this.operator;
			var weight:Number = this.weight;
			
			criteria.setLeftItem( leftItem );
			criteria.setRightItem( rightItem );
			criteria.setOperator( operator );
			criteria.setWeight( weight );
			
			criteria.setExploratoryValue(val);
			return criteria;
		}
		protected function duplicateItem(item:BTItem):BTItem
		{
			var newItem:BTItem = 
				new BTItem
				(
					item.getAggregation(), 
					item.getFile(),
					item.getType(),
					item.getValue(),
					item.getParameterMap() //PARAMETER_MAP은 추후 반드시 복제를 해야한다.
				);
			return newItem;
		}
		
		//TO_XML
		override public function toString():String
		{
			return "BTCriteria";
		}
	}
}