package org.samchon.simulation.simulation.retrieve.history
{
	import org.samchon.simulation.inquiry.finance.index.IndexArray;
	import org.samchon.simulation.inquiry.finance.index.IndexArrayArray;
	import org.samchon.simulation.inquiry.price.candle.CandleArray;
	import org.samchon.simulation.simulation.abstract.history.History;
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	
	public class RTHistory extends History
	{
		public function RTHistory(historyArray:HistoryArray, code:String, name:String, market:int, xml:XML)
		{
			super(historyArray, code, name, market);
			construct(xml);
		}
		protected function construct(xml:XML):void
		{
			//FOR OVERRIDING
			if(xml.hasOwnProperty("candleList"))
				candleArray = new CandleArray(xml.candleList[0]);
			if(xml.hasOwnProperty("indexListList"))
			{
				indexArrayArray = new IndexArrayArray();
				
				var xmlList:XMLList = xml.indexListList.indexList;
				for(var i:int = 0; i < xmlList.length(); i++)
					indexArrayArray.push( new IndexArray( xmlList[i] ) );
				
			}
		}
	}
}