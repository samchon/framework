package org.samchon.simulation.simulation.montecarlo.boundary
{
	import org.samchon.simulation.simulation.abstract.boundary.SMProgrammingBoundary;
	
	public class MCProgrammingBoundary extends SMProgrammingBoundary
	{
		public function MCProgrammingBoundary()
		{
			super();
		}
		
		override protected function get baseScript():String
		{
			var script:String =
				"function setParam(historyArray:HistoryArray, history:History):MCParameter\n" +
				"{\n" +
				"	return new MCParameter(0, 0);\n" +
				"}\n" +
				"\n" +
				"function main(historyArray:HistoryArray):void\n" +
				"{\n" +
				"}";
			return script;
		}
	}
}