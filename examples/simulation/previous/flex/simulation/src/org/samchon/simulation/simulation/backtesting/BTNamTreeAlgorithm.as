package org.samchon.simulation.simulation.backtesting
{
	import org.samchon.namtree.NTCriteriaGrid;
	import org.samchon.namtree.criteria.NTCriteria;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.BTNamTreeMovie;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.criteria.BTCriteria;
	import org.samchon.utils.StringUtil;

	public class BTNamTreeAlgorithm extends Algorithm
	{
		protected function get namTree():BTNamTreeMovie
		{
			return algorithmList.getNamTree();
		}
		protected var algorithmList:BTNamTreeAlgorithmLabelList;
		
		public function BTNamTreeAlgorithm(algorithmList:BTNamTreeAlgorithmLabelList, name:String = null)
		{
			this.algorithmList = algorithmList;
			if(name == null)
				name = "Algorithm" + (algorithmList.length + 1);
			
			namTree.addCriteriaGridPair();
			namTree.setCriteriaGridPairNameAt(name, algorithmList.length);
			
			super(name);
		}
		public function get $no():int		{	return getIndex() + 1;	}
		override public function get $name():String	{	return name;			}
		protected function getIndex():int
		{
			return algorithmList.getItemIndex(this);
		}
		
		public function set $name(val:String):void	{	setName(val);	}
		override public function setName(val:String):void
		{
			super.setName(val);
			namTree.setCriteriaGridPairNameAt(val, getIndex());
		}
		
		public function getBuyingCriteria():BTCriteria
		{
			return criteriaGridArray[ getIndex() * 2 ].getTopCriteria() as BTCriteria;
		}
		public function getSellingCriteria():BTCriteria
		{
			return criteriaGridArray[ getIndex() * 2 + 1 ].getTopCriteria() as BTCriteria;
		}
		
		//TO XML
		protected function get criteriaGridArray():Vector.<NTCriteriaGrid>
		{
			return namTree.criteriaGridArray;
		}
		
		override public function toXML():String
		{
			var idx:int = getIndex();
			var xml:String = "<algorithm name='" + this.name +"'>\n";
			xml += "	<buy>\n" +
					 		StringUtil.getTabbed( criteriaGridArray[idx*2].getTopCriteria().toXML(), 2 ) + "\n" +
					"	</buy>\n";
			xml += "	<sell>\n" +
							StringUtil.getTabbed( criteriaGridArray[idx*2 + 1].getTopCriteria().toXML(), 2 ) + "\n" +
					"	</sell>\n";
			xml += "</algorithm>";
			
			return xml;
		}
		public function constructXML(xml:XML):void
		{
			var idx:int = getIndex();
			
			//아직 creationCompleted 상태가 아닐 가능성이 높다.
			criteriaGridArray[idx*2].constructXML( xml.buy.criteria[0] as XML );
			criteriaGridArray[idx*2 + 1].constructXML( xml.sell.criteria[0] as XML );
			
			this.setName( xml.@name );
		}
		
	}
}