package org.samchon.simulation.simulation.backtesting.boundary
{
	import org.samchon.simulation.simulation.abstract.boundary.SMProgrammingBoundary;
	
	public class BTProgrammingBoundary extends SMProgrammingBoundary
	{
		public function BTProgrammingBoundary()
		{
			super();
		}
		
		override protected function get baseScript():String
		{
			var script:String =
				"function getAlgorithmList():AlgorithmList\n" +
				"{\n" +
				"	var algList:AlgorithmList = new AlgorithmList();\n" +
				"	algList.addItem( new Algorithm('Algorithm1') );\n" +
				"	\n" +
				"	return algList;\n" +
				"}\n" +
				"function buy(historyArray:HistoryArray, history:History, x:int, alg:int):int\n" +
				"{\n" +
				"	return 0;\n" +
				"}\n" +
				"function sell(historyArray:HistoryArray, history:History, x:int, alg:int):int\n" +
				"{\n" +
				"	return 0;\n" +
				"}\n" +
				"	\n" +
				"function main(historyArray:HistoryArray):void\n" +
				"{\n" +
				"	\n" +
				"};\n";
			return script;
		}
	}
}