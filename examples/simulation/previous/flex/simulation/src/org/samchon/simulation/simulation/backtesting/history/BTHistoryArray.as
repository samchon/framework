package org.samchon.simulation.simulation.backtesting.history
{
	import flash.events.ProgressEvent;
	
	import org.samchon.simulation.movie.BackTestingMovie;
	import org.samchon.simulation.movie.SimulationMovie;
	import org.samchon.simulation.simulation.abstract.history.History;
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	import org.samchon.simulation.simulation.backtesting.BTNamTreeAlgorithm;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.criteria.BTCriteria;
	import org.samchon.simulation.simulation.backtesting.history.algorithm.BTAlgorithm;
	import org.samchon.simulation.simulation.backtesting.history.trader.BTTradeReturn;
	import org.samchon.simulation.simulation.backtesting.history.trader.BTTrader;
	import org.samchon.simulation.simulation.backtesting.request.BTRequestParameter;
	import org.samchon.simulation.simulation.backtesting.result.comparison.plot.BTPlotTarget;
	import org.samchon.simulation.simulation.backtesting.result.comparison.plot.BTPlotTargetList;
	import org.samchon.simulation.worker.SimulationWorker;
	import org.samchon.utils.HTML;
	import org.samchon.utils.StringUtil;
	
	public dynamic class BTHistoryArray extends HistoryArray
	{
		protected var algorithmList:AlgorithmList;
		protected var algorithmArray:Vector.<BTAlgorithm> = null;
		
		/* -------------------------------------------------------------
			CONSTRUCTOR
		------------------------------------------------------------- */
		public function BTHistoryArray(worker:SimulationWorker)
		{
			super(worker);
		}
		override protected function getNewHistory(code:String, name:String, market:int):History
		{
			return new BTHistory(this as HistoryArray, code, name, market);
		}
		public function getBTHistoryAt(x:int):BTHistory
		{
			return this.at(x) as BTHistory;
		}
		
		/* -------------------------------------------------------------
			GETTER & SETTER
		------------------------------------------------------------- */
		public function getAlgorithmList():AlgorithmList
		{
			return this.algorithmList;
		}
		public function getAlgorithmArray():Vector.<BTAlgorithm>
		{
			return this.algorithmArray;
		}
		
		public function getBuyingCommission():Number	{	return BTRequestParameter(parameter).getBuyingCommission();		}
		public function getSellingCommission():Number	{	return BTRequestParameter(parameter).getSellingCommission();	}
		
		/* -------------------------------------------------------------
			SIMULATE -> DO TEST
		------------------------------------------------------------- */
		protected var explore_i:int;
		protected var explore_completed:int;
		protected var explore_totalVolume:int;
		
		override protected function determine():void
		{
			//MAIN
			if(getBoundaryType() == SimulationMovie.BOUNDARY_PROGRAMMING)
				getCompiled().main(this);
			
			var name:String;
			
			//GET ALGORITHM_LIST
			if(getBoundaryType() == SimulationMovie.BOUNDARY_PROGRAMMING)
			{
				//PROGRAMMING
				algorithmList = getCompiled().getAlgorithmList();
				
				super.determine();
			}
			else
			{
				//NAM-TREE
				algorithmList = BackTestingMovie(worker.getMovie()).namTreeBoundary.getAlgorithmList();
				algorithmArray = new Vector.<BTAlgorithm>(algorithmList.length, true);
				
				explore_completed = 0;
				explore_totalVolume = 0;
				
				var algorithm:BTNamTreeAlgorithm;
				var buyingCriteria:BTCriteria;
				var sellingCriteria:BTCriteria;
				
				for(var i:int = 0; i < algorithmList.length; i++)
				{
					algorithm = algorithmList.at(i) as BTNamTreeAlgorithm;
					name = algorithm.getName();
					buyingCriteria = algorithm.getBuyingCriteria();
					sellingCriteria = algorithm.getSellingCriteria();
					
					algorithmArray[i] = new BTAlgorithm(null, name, this, buyingCriteria, sellingCriteria);
					explore_totalVolume += algorithmArray[i].getExploratoryLength();
				}
				//trace("explore_totalVolume", explore_totalVolume);
				
				explore_i = 0;
				explore();
			}
		}
		public function explore():void
		{
			//EXPLORE IS LIKE A DEMTERMINE IN BTALGORITHM
			if(explore_i == algorithmArray.length)
			{
				completeListener.apply(null, [null]);
				simulate();
			}
			else
			{
				algorithmArray[explore_i++].explore();
			}
		}
		public function exploreCompleted():void
		{
			progressListener.apply( null, [ new ProgressEvent(ProgressEvent.PROGRESS, false, false, ++explore_completed, explore_totalVolume) ] );
		}
		
		override protected function _simulate(x:int):void
		{
			for(var i:int = 0; i < algorithmArray.length; i++)
				algorithmArray[i].tradeAt(x);
			
			progressListener.apply( null, [ new ProgressEvent(ProgressEvent.PROGRESS, false, false, x + 1, this.length) ] );
			if( x + 1 == this.length )
				completeListener.apply(null, [null]);
		}
		
		/* -------------------------------------------------------------
			TO_XML
		------------------------------------------------------------- */
		//RESULT
		override public function toXML():XML
		{
			//x -> #algorithm
			var xml:String = "<algorithmList>\n";
			
			for(var i:int = 0; i < algorithmArray.length; i++)
				xml += StringUtil.getTabbed( algorithmArray[i].toResultXML() ) + "\n";
			
			xml += "</algorithmList>\n";
			return new XML(xml);
		}
		public function toCandleXMLAt(algorithmIndex:int, algorithmIndexString:String, corporate:int):String
		{
			return algorithmArray[algorithmIndex].toCandleXMLAt(algorithmIndexString, corporate);
		}
		public function toTitle(algorithmIndex:int, algorithmIndexString:String, corporate:int):String
		{
			return algorithmArray[algorithmIndex].toTitle(algorithmIndexString, corporate);
		}
		
		//COMPARISON
		public function toComparisonXML():XML
		{
			var xml:String = "<comparisonList>\n";
			var name:String;
			
			var i:int;
			var x:int;
			var j:int;
			
			for(i = 0; i <= this.length; i++)
			{
				if(i == this.length)
				{
					name = "Average";
					x = Global.AGGREGATION_AVERAGE;
				}
				else
				{
					name = at(i).getName();
					x = i;
				}
				xml += StringUtil.sprintf("	<comparison name='{0}' index='{1}'", name, x);
				for(j = 0; j < algorithmArray.length; j++)
					xml += algorithmArray[j].toComparisonXMLAt(j, x) + " ";
				
				xml += ">\n";
				xml +=	"		<comparison>\n" +
					"			<index x='" + x + "' />\n" +
					"		</comparison>\n";
				xml += "	</comparison>\n";
			}
			
			xml += "</comparisonList>";
			return new XML(xml);
		}
		public function toComparisonReturnXMLAt(x:int):XML
		{
			const returnLabelArray:Array =
			[
				"Real Return %",
				"Real ~ / Year",
				"Paper ~",
				"Paper ~ / Year"
			];
			
			var xml:String = "<comparisonList>\n";
			var i:int;
			var j:int;
			
			for(i = 0; i < returnLabelArray.length; i++)
			{
				xml += "<comparison label='" + returnLabelArray[i] +  "' ";
				
				//j: algorithm
				//x: corporate
				//i: return type
				for(j = 0; j < algorithmList.length; j++)
					xml += _toComparisonReturnXMLAt(j, x, i);
				
				xml += "/>\n";
			}
			xml += "</comparisonList>\n";
			
			return new XML(xml);
		}
		protected function _toComparisonReturnXMLAt(alg:int, corp:int, type:int):String
		{
			var xml:String = "";
			var realReturn:BTTradeReturn;
			var paperReturn:BTTradeReturn;
			
			if(corp == Global.AGGREGATION_AVERAGE)
			{
				realReturn = algorithmArray[alg].getTraderArray().getAverageAggregation().getTradeReturn(Global.RETURN_REAL);
				paperReturn = algorithmArray[alg].getTraderArray().getAverageAggregation().getTradeReturn(Global.RETURN_PAPER);
			}
			else
			{
				realReturn = algorithmArray[alg].getTraderArray().at(corp).getRealReturn();
				paperReturn = algorithmArray[alg].getTraderArray().at(corp).getPaperReturn();
			}
			var value:Number = Global.NULL;
			if(type == 0)
				value = realReturn.simpleReturn;
			else if(type == 1)
				value = realReturn.yearReturn;
			else if(type == 2)
				value = paperReturn.simpleReturn;
			else if(type == 3)
				value = paperReturn.yearReturn;
			
			if(value != Global.NULL)
				xml = "algorithm" + alg + "='" + value + "' ";
			
			return xml;
		}
		
		//PLOT
		public function toPlotXML(targetList:BTPlotTargetList):XML
		{
			var xml:String = "<plotList>\n";
			var history:BTHistory;
			var target:BTPlotTarget;
			var i:int;
			var j:int;
			var algX:int;	var returnX:int;
			var algY:int;	var returnY:int;
			
			for(i = 0; i < this.length; i++)
			{
				history = this.at(i) as BTHistory;
				xml += StringUtil.sprintf( "<plot code='{0}' name='{1}' ", history.getCode(), history.getName() );;
				
				for(j = 0; j < targetList.length; j++)
				{
					target = targetList.at(j);
					algX = target.algX;		returnX = target.returnX;
					algY = target.algY;		returnY = target.returnY;
					
					xml += toPlotXMLAt("x"+j, algX, i, returnX) + " ";
				xml += toPlotXMLAt("y"+j, algY, i, returnY) + " ";
				}
				xml += "/>\n";
			}
			xml += "</plotList>";
			return new XML(xml);
		}
		protected function toPlotXMLAt(label:String, alg:int, corp:int, returnType:int):String
		{
			var xml:String;
			var value:Number = Global.NULL;
			var trader:BTTrader = algorithmArray[alg].getTraderArray().at(corp);//history.getAlgorithmArray()[alg];
			
			if(returnType == 0)
				value = trader.getRealReturn().simpleReturn;
			else if(returnType == 1)
				value = trader.getRealReturn().yearReturn;
			else if(returnType == 2)
				value = trader.getPaperReturn().simpleReturn;
			else if(returnType == 3)
				value = trader.getPaperReturn().yearReturn;
			
			if(value == Global.NULL)
				xml = "";
			else
				xml = label + "='" + value + "'";
			
			return xml;
		}
		
		override public function toHTML():String
		{
			var html:String = HTML.HEAD;
			var i:int;
			
			html += parameter.toHTML() + "<br>\n<br>\n";
			
			for(var i:int = 0; i < algorithmArray.length; i++)
				html += algorithmArray[i].toHTML() + "\n";
			
			html += HTML.TAIL;
			return html;
		}
	}
}





















