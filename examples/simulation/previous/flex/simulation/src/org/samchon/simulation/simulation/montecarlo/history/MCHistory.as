package org.samchon.simulation.simulation.montecarlo.history
{
	import org.samchon.simulation.math.Quotation;
	import org.samchon.simulation.math.SMath;
	import org.samchon.simulation.simulation.montecarlo.request.MCRequestParameter;
	import org.samchon.simulation.inquiry.price.candle.Candle;
	import org.samchon.simulation.inquiry.price.today.Today;
	import org.samchon.simulation.inquiry.price.today.TodayArray;
	import org.samchon.simulation.simulation.abstract.history.History;
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	import org.samchon.utils.StringUtil;
	import org.samchon.utils.Timestamp;
	
	public class MCHistory extends History
	{
		private var param:MCParameter;
		
		//MATRIX
		private var dateVector:Vector.<String>;
		private var priceMatrix:Vector.<Vector.<int>>;
		
		//STATISTICS OF RESULT
		private var returnVector:Vector.<Number>;
		private var siMean:Number;
		private var siStdev:Number;
		
		private var median:Number;
		private var percent5:Number;
		private var percent95:Number;
		
		public function MCHistory(historyArray:HistoryArray, code:String, name:String, market:int)
		{
			super(historyArray, code, name, market);
		}

		private function getRepeat():int		{	return MCRequestParameter(parameter).getRepeat();	}
		private function getPredict():int		{	return MCRequestParameter(parameter).getPredict();	}
		private function getParamMean():Number	{	return param.getMean();		}
		private function getParamStdev():Number	{	return param.getStdev();	}
		
		override public function determine():void
		{
			//이 것은 남트리가 없다
			var compiled:Object = historyArray.getCompiled();
			param = compiled.setParam(this.getHistoryArray(), this);
		}
		
		/* -------------------------------------------------------------------
			SIMULATE
		------------------------------------------------------------------- */
		override public function simulate():void
		{
			//PARAMETERS
			var repeat:int = getRepeat();
			var predict:int = getPredict();
			var mean:Number = param.getMean();
			var variance:Number = param.getVariance();
			
			//VARS
			var price:int;
			var yesterday:int;
			var timestamp:Timestamp;
			var i:int;
			var j:int;
			
			var candle:Candle = candleArray.at(candleArray.length - 1);
			
			//RESERVE
			dateVector = new Vector.<String>(predict, true);		
			priceMatrix = new Vector.<Vector.<int>>(repeat, true);
			for(i = 0; i < repeat; i++)
				priceMatrix[i] = new Vector.<int>(predict, true);
			
			//SIMULATION
			for(i = 0; i < repeat; i++) {
				price = candle.close;
				yesterday = candle.close;
				
				timestamp = new Timestamp();
				timestamp.ymd = candle.date;
				
				for(j = 0; j < predict; j++) {
					if(i == 0)
						dateVector[j] = timestamp.ymd;
					
					price = SMath.montecarlo(price, mean, variance, 1);
					
					do 	  timestamp.addDate = 1;
					while(timestamp.day == 0 || timestamp.day == 6);
					
					//상하한가 조정
					if(price > yesterday*1.15)		price = Quotation.roundQuote(yesterday*1.15, market, Quotation.ROUND_FLOOR);
					else if(price < yesterday*.85)	price = Quotation.roundQuote(yesterday*.85, market, Quotation.ROUND_CEIL);
					else							price = Quotation.roundQuote(price, 1);
					
					yesterday = price;
					priceMatrix[i][j] = price;
				}
			}

			//SORT
			priceMatrix.sort( sortPriceMatrix );
			
			
			//RESULT CALCULATION
			var returnVector:Vector.<Number> = new Vector.<Number>(repeat, true);
			var start:int = candle.close;
			var end:int;
			
			//COMPOSE RETURN AND RESULT
			for(i = 0; i < repeat; i++)
			{
				end = priceMatrix[i][predict - 1];
				
				returnVector[i] = end / Number(start) - 1.0;
			}
			//returnVector.sort(Array.NUMERIC); //AND SORT
			
			siMean = getMean(returnVector);
			siStdev = getVariance(returnVector, siMean);
			
			median = getMedian(returnVector);
			percent5 = getValueByRank(returnVector, .05);
			percent95 = getValueByRank(returnVector, 0.95);
		}
		protected function sortPriceMatrix(left:Vector.<int>, right:Vector.<int>):Number
		{
			var length:int = left.length;
			
			var leftPrice:int = left[length - 1];
			var rightPrice:int = right[length - 1];
			
			return leftPrice - rightPrice;
		}
		
		/* -------------------------------------------------------------------
			TO_XML
		------------------------------------------------------------------- */		
		override public function toXML(x:int=0):String
		{
			var xml:String = 
				StringUtil.sprintf
				(
					"<result name='{0}' prMean='{1}' prStdev='{2}' siMean='{3}' siStdev='{4}' percent5='{5}' median='{6}' percent95='{7}' />",
					getName(),
					getParamMean(), getParamStdev(),
					siMean, siStdev,
					percent5, median, percent95
				);
			return xml;
		}
		public function toDetailXML():String
		{
			var xml:String = "<priceList>\n";
			var i:int;
			var j:int;
			
			var candle:Candle = candleArray.at(candleArray.length - 1);
			var date:String;
			
			for(i = -1; i < dateVector.length; i++)
			{
				if(i == -1)
					date = candle.date;
				else
					date = dateVector[i];
				
				xml += "	<price date='" + date + "' ";

				for(j = 0; j < priceMatrix.length; j++)
					if(i == -1)
					{
						var price:int = candle.close;	
						xml += StringUtil.sprintf("price{0}='{1}' ", j, price);
					}
					else
						xml += StringUtil.sprintf("price{0}='{1}' ", j, priceMatrix[j][i]);
				xml += "/>\n";
			}
			xml += "</priceList>";
			
			return xml;
		}
		override public function toHTML(x:int=0):String
		{
			return "";
		}
		
		/* -------------------------------------------------------------------
			STATISTICS
		------------------------------------------------------------------- */
		//MEAN AND VARIANCE
		protected function getMean(vec:Vector.<Number>):Number
		{
			var value:Number = 0.0;
			for(var i:int = 0; i < vec.length; i++)
				value += vec[i] / Number(vec.length);
			
			return value;
		}
		protected function getVariance(vec:Vector.<Number>, mean:Number = Global.NULL):Number
		{
			var value:Number = 0.0;
			if(mean == Global.NULL)	mean = getMean(vec);
			
			for(var i:int = 0; i < vec.length; i++)
				value += Math.pow(vec[i] - mean, 2) / Number(vec.length);
			
			return value;
		}
		
		//RANK
		protected function getMedian(vec:Vector.<Number>):Number
		{
			var length:int = vec.length;
			if(length % 2 == 1)
				return vec[(length - 1) / 2];
			else
			{
				var x:int = length / 2 - 1;
				return (vec[x] + vec[x + 1]) / 2.0;
			}
		}
		protected function getValueByRank(vec:Vector.<Number>, rank:Number):Number
		{
			var x:int = vec.length * rank - 1;
			if(x < 0)	x = 0;
			
			return vec[x];
		}
	}
}