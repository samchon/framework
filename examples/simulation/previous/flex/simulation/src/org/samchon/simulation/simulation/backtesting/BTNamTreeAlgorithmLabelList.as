package org.samchon.simulation.simulation.backtesting
{
	import mx.collections.ArrayCollection;
	
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.BTNamTreeMovie;
	import org.samchon.utils.StringUtil;
	
	public class BTNamTreeAlgorithmLabelList extends AlgorithmList
	{
		protected var namTree:BTNamTreeMovie;
		
		public function BTNamTreeAlgorithmLabelList(namTree:BTNamTreeMovie)
		{
			super(null);
			
			this.namTree = namTree;
			this.addItem( new BTNamTreeAlgorithm(this) );
		}
		
		//METHODS OF ARRAY_COLLECTION
		override public function addItem(item:Object):void
		{
			//namTree.addCriteriaGridPair();
			super.addItem(item);
		}
		override public function removeItemAt(index:int):Object
		{
			namTree.removeCriteriaGridPairAt(index);
			return super.removeItemAt(index);
		}
		override public function removeAll():void
		{
			namTree.removeAllCriteriaPair();
			super.removeAll();
		}
	
		public function getNamTree():BTNamTreeMovie
		{
			return this.namTree;
		}
		
		/* ---------------------------------------------
			XML
		--------------------------------------------- */
		public function constructXML(xml:XML):void
		{
			if(xml.hasOwnProperty("algorithm") == false)
				return;
			
			this.removeAll();
			
			var xmlList:XMLList = xml.algorithm;
			var algorithm:BTNamTreeAlgorithm;
			
			for(var i:int = 0; i < xmlList.length(); i++)
			{
				algorithm = new BTNamTreeAlgorithm(this);
				this.addItem(algorithm);
				
				algorithm.constructXML(xmlList[i] as XML);
			}
		}
		
	}
}