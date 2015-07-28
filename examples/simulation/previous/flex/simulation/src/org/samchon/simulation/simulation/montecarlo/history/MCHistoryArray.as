package org.samchon.simulation.simulation.montecarlo.history
{
	import org.samchon.simulation.simulation.abstract.history.History;
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	import org.samchon.simulation.worker.SimulationWorker;
	import org.samchon.utils.HTML;
	
	public dynamic class MCHistoryArray extends HistoryArray
	{
		public function MCHistoryArray(worker:SimulationWorker)
		{
			super(worker);
		}
		override protected function getNewHistory(code:String, name:String, market:int):History
		{
			return new MCHistory(this, code, name, market);
		}
		
		/* -------------------------------------------------------
			DO SIMULATE
		------------------------------------------------------- */
		override protected function determine():void
		{
			//MAIN
			getCompiled().main(this);
			
			super.determine();
		}
		
		/* -------------------------------------------------------------------
			TO_XML
		------------------------------------------------------------------- */
		override public function toHTML():String
		{
			var html:String = HTML.HEAD;
			
			html +=
				"<table border='1'>\n" +
				"	<tr>\n" +
				"		<th rowspan='2'>Company Name</th>\n" +
				"		<th colspan='2'>Parameter</th>\n" +
				"		<th colspan='2'>Simulated</th>\n" +
				"		<th colspan='3'>Return Distribution</th>\n" +
				"	</tr>\n" +
				"	<tr>\n" +
				"		<th>Mean</th>\n" +
				"		<th>Stdev</th>\n" +
				"		<th>Mean</th>\n" +
				"		<th>Stdev</th>\n" +
				"		<th>5%</th>\n" +
				"		<th>Median</th>\n" +
				"		<th>95%</th>\n" +
				"	</tr>";
			
			for(var i:int = 0; i < this.length; i++)
				html += this.at(i).toHTML() + "\n";
			
			html +=	"</table>\n" +
				"<br>\n" +
				"<br>\n";
			html += HTML.TAIL;
			
			return html;
		}
	}
}