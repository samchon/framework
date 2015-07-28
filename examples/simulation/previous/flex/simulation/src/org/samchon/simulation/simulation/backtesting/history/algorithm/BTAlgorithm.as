package org.samchon.simulation.simulation.backtesting.history.algorithm
{
	import mx.controls.Alert;
	
	import org.samchon.format.Format;
	import org.samchon.namtree.filetree.file.NTFile;
	import org.samchon.simulation.inquiry.price.candle.CandleArray;
	import org.samchon.simulation.math.SMath;
	import org.samchon.simulation.simulation.abstract.history.History;
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.criteria.BTCriteria;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree.file.BTFile;
	import org.samchon.simulation.simulation.backtesting.history.BTHistoryArray;
	import org.samchon.simulation.simulation.backtesting.history.trader.BTTrader;
	import org.samchon.simulation.simulation.backtesting.history.trader.aggregation.BTTraderArray;
	import org.samchon.simulation.simulation.backtesting.history.trader.aggregation.BTTraderArrayReturnAggregation;
	import org.samchon.utils.StringUtil;

	public dynamic class BTAlgorithm extends Array
	{
		private static const DIVIDER:int = 4;
		private static const LEVEL_TOP:int = 0;
		private static const LEVEL_DIRECTION:int = 1;
		private static const LEVEL_ALGORITHM_NAME:int = 2;
		
		//BASE_DATA
		protected var name:String;
		protected var historyArray:BTHistoryArray;
		protected var buyingCriteria:BTCriteria;
		protected var sellingCriteria:BTCriteria;
		
		//PARENT AND INDEX
		protected function get topAlgorithm():BTAlgorithm
		{
			if(this.level == LEVEL_TOP)
				return this;
			else
				return parentAlgorithm.topAlgorithm;
		}
		protected var parentAlgorithm:BTAlgorithm;
		protected var index:int;
		protected var level:int;
		
		//EXPLORATORY_DATA
		protected var direction:int;
		protected var value:Number;
		protected var accuracy:int;
		
		protected var _buyingExploratoryArray:Vector.<BTCriteria> = null;
		protected var _sellingExploratoryArray:Vector.<BTCriteria> = null;
		
		protected var buyingAlgorithm:BTAlgorithm = null;
		protected var sellingAlgorithm:BTAlgorithm = null;
		
		//TRADER_ARRAY
		protected var traderArray:BTTraderArray;
		
		//INTERNAL GETTERS
		protected function get criteria():BTCriteria
		{
			return (direction == Global.DIRECTION_BUY) ? buyingCriteria : sellingCriteria;
		}
		protected function get exploratoryArray():Vector.<BTCriteria>
		{
			if(direction == Global.NULL)
				return null;
			else
				return (direction == Global.DIRECTION_BUY) ? buyingExploratoryArray : sellingExploratoryArray;
		}
		protected function get illiquidCriteria():BTCriteria
		{
			if(direction == Global.NULL)
				return null;
			else
				return (direction == Global.DIRECTION_BUY) ? sellingCriteria : buyingCriteria;
		}
		protected function get buyingExploratoryArray():Vector.<BTCriteria>
		{
			if(this.level == LEVEL_TOP)
				return this._buyingExploratoryArray;
			else
				return parentAlgorithm.buyingExploratoryArray;
		}
		protected function get sellingExploratoryArray():Vector.<BTCriteria>
		{
			if(this.level == LEVEL_TOP)
				return this._sellingExploratoryArray;
			else
				return parentAlgorithm.sellingExploratoryArray;
		}
		
		/*
		===============================================================
			CONSTRUCTOR
		===============================================================
		*/
		public function BTAlgorithm
			(
				parentAlgorithm:BTAlgorithm,
				name:String, 
				
				historyArray:BTHistoryArray = null, 
				buyingCriteria:BTCriteria = null, sellingCriteria:BTCriteria = null,
				
				direction:int = Global.NULL, 
					value:Number = Global.NULL, accuracy:int = Global.NULL
			)
		{
			super();
			
			//BASE_DATA
			this.name = name;
			
			this.historyArray = historyArray;
			this.buyingCriteria = buyingCriteria;
			this.sellingCriteria = sellingCriteria;
			
			//EXPLORATORY_DATA
			this.direction = direction;
			this.value = value;
			this.accuracy = accuracy;
			
			//TRADER_ARRAY
			if(historyArray != null)
				traderArray = new BTTraderArray(historyArray);
			
			//PARENT AND INDEX AND CONSTRUCTING CHILDREN
			this.parentAlgorithm = parentAlgorithm;
			if(parentAlgorithm == null)
			{
				this.index = Global.NULL;
				this.level = LEVEL_TOP;
				
				//ExploratatoryArray 구성
				this._buyingExploratoryArray = buyingCriteria.getExploratoryArray();
				this._sellingExploratoryArray = sellingCriteria.getExploratoryArray();
				
				constructChildren
				(
					Global.DIRECTION_BUY,  
					(_sellingExploratoryArray.length > 0)
						? BTCriteria.getInvalidSellingCriteria()
						: sellingCriteria
				);
				constructChildren( Global.DIRECTION_SELL );
			}
			else
			{
				this.index = parentAlgorithm.length;
				this.level = parentAlgorithm.level + 1;
				
				if(value != Global.NULL)
					criteria.setExploratoryValue(value);
				
				if(this.level == LEVEL_DIRECTION)
					constructChildren(direction);
			}
		}
		protected function constructChildren(direction:int, illiquidCriteria:BTCriteria = null):void
		{
			var algorithm:BTAlgorithm;
			var file:BTFile;
			
			var minimum:Number;
			var maximum:Number;
			var gap:Number;
			
			var name:String;
			var value:Number;
			var i:int;
			var j:int;
			
			if(level == LEVEL_TOP)
			{
				if( getExploratoryArray(direction).length == 0 )
					return;
				
				//매수, 매도 폴더 생성
				name = (direction == Global.DIRECTION_BUY) ? "Buying Algorithm" : "Selling Algorithm";
				
				//매수, 매도 조건 설정
				algorithm = 
					new BTAlgorithm
					(
						this, name, historyArray, 
						getBuyingCriteria(), getSellingCriteria(),
						direction
					);
				this.push( algorithm );
				
				if(direction == Global.DIRECTION_BUY)
					buyingAlgorithm = algorithm;
				else
					sellingAlgorithm = algorithm;
			}
			else if(level == LEVEL_DIRECTION)
				//알고리즘 폴더 생성
				for(i = 0; i < exploratoryArray.length; i++)
				{
					name = exploratoryArray[i].getExploratoryName();
					
					if(direction == Global.DIRECTION_BUY)
						algorithm = 
							new BTAlgorithm
							(
								this, name, historyArray,
								exploratoryArray[i], getSellingCriteria(),
								//이 부분이 분기점이 되어야 한다.
								direction
							);
					else
						algorithm = 
							new BTAlgorithm
							(
								this, name, historyArray,
								getBuyingCriteria(), exploratoryArray[i],
								//이 부분이 분기점이 되어야 한다.
								direction
							);
					this.push( algorithm );
				}
			else if(level >= LEVEL_ALGORITHM_NAME)
			{
				file = criteria.getFile() as BTFile;
				
				if(file.getAccuracy() == this.accuracy)
					return;
				
				//최소, 최대, 간격 설정
				if(level == LEVEL_ALGORITHM_NAME)
				{
					minimum = file.getMinimum(direction);
					maximum = file.getMaximum(direction);
				}
				else
				{
					minimum = this.value;
					maximum = parentAlgorithm.at(this.index + 1).value;
				}
				gap = (maximum - minimum) / Number(DIVIDER);
				
				for(i = 0; i < DIVIDER + 1; i++)
				{
					value = minimum + i*gap;
					name = 
						StringUtil.sprintf
						(
							"{0} -> {1}", 
							criteria.getExploratoryName(),
							Format.numberFormat
							(
								value, true, false, 
								file.getAccuracy() + 1
							)
						);
					if(i != DIVIDER)
						name += " ~ " + 
							Format.numberFormat
							(
								value + gap, true, false, 
								file.getAccuracy() + 1
							);
					
					//매수, 매도 알고리즘 설정
					algorithm = 
						new BTAlgorithm
						(
							this, name,
							historyArray,
							
							getBuyingCriteria(value), getSellingCriteria(value),
							
							direction,
								value,
								int( SMath.log10(gap) )
						);
					this.push(	algorithm	);
				}		
			}
		}
		public function at(x:int):BTAlgorithm
		{
			return this[x] as BTAlgorithm;
		}
		
		/*
		===============================================================
			GET & SET METHOD
		===============================================================
		*/
		public function getName():String
		{
			return this.name;
		}
		public function getTraderArray():BTTraderArray
		{
			return this.traderArray;
		}
		
		protected function getAlgorithm(indexString:String):BTAlgorithm
		{
			var indexArray:Array = indexString.split("_");
			indexArray.splice(0, 1);
			
			return _getAlgorithm(indexArray);
		}
		protected function _getAlgorithm(indexArray:Array):BTAlgorithm
		{
			if(indexArray.length == 0)
				return this;
			else
			{
				var x:int = indexArray.splice(0, 1)[0];
				return this.at(x)._getAlgorithm(indexArray);
			}
		}
		protected function getExploratoryArray(direction:int):Vector.<BTCriteria>
		{
			return (direction == Global.DIRECTION_BUY) ? buyingExploratoryArray : sellingExploratoryArray;
		}
		
		protected function getBuyingCriteria(value:Number = Global.NULL):BTCriteria
		{
			if(this.level == LEVEL_TOP)
				return buyingCriteria;
			else if(this.direction == Global.DIRECTION_BUY)
				if(value == Global.NULL || buyingExploratoryArray.length == 0)
					return buyingCriteria;
				else
					return buyingCriteria.duplicate(value);
			else
				return buyingCriteria;
		}
		protected function getSellingCriteria(value:Number = Global.NULL):BTCriteria
		{
			if(this.level == LEVEL_TOP)
			{
				return sellingCriteria;
			}
			else if(this.direction == Global.DIRECTION_SELL)
			{
				if(value == Global.NULL || sellingExploratoryArray.length == 0)
					return sellingCriteria;
				else
					return sellingCriteria.duplicate(value);
			}
			else
			{
				if(sellingExploratoryArray.length > 0)
					return BTCriteria.getInvalidSellingCriteria();
				else
					return sellingCriteria;
			}
		}
		
		protected function calcMaxAlgorithm():BTAlgorithm
		{
			if(this.length == 0)
				return null;
			
			return this.at( calcMaxAlgorithmIndex() );
		}
		protected function calcMaxAlgorithmIndex():int
		{
			if(this.length == 0)
				return Global.NULL;
			
			var algorithm:BTAlgorithm;
			var value:Number;
			var maxValue:Number = int.MIN_VALUE;
			var maxIndex:int;
			
			for(var i:int = 0; i < this.length; i++)
			{
				algorithm = this.at(i);
				
				algorithm.trade();
				value = algorithm.traderArray.getExploratoryProfit(direction);
				
				if(value > maxValue)
				{
					maxValue = value;
					maxIndex = i;
				}
			}
			return maxIndex;
		}
		
		protected function setExploratoryValue(value:Number, direction:int, algorithm:int):void
		{
			var exploratoryArray:Vector.<BTCriteria> = 
				(direction == Global.DIRECTION_BUY) 
				? buyingExploratoryArray 
				: sellingExploratoryArray;
			
			exploratoryArray[algorithm].setExploratoryValue(value);
		}
		
		/*
		===============================================================
			TRADE
		===============================================================
		*/
		protected var tradeFlag:Boolean = false;
		
		public function tradeAt(x:int):void
		{
			//X번째 회사
			var trader:BTTrader = traderArray.at(x);
			
			var history:History = historyArray.at(x);
			var candleArray:CandleArray = history.getCandleArray();
			
			var buyingVolume:int;
			var sellingVolume:int;
			
			for(var i:int = 0; i < candleArray.length; i++)
			{
				buyingVolume = 
					buyingCriteria.getRetrieved
					(
						[
							this.historyArray,
							history,
							i
						]
					);
				sellingVolume =
					sellingCriteria.getRetrieved
					(
						[
							this.historyArray,
							history,
							i
						]
					);
				
				if(buyingVolume > 0)	trader.buy(i, buyingVolume);
				if(sellingVolume > 0)	trader.sell(i, sellingVolume);
			}
			trader.calc();
		}
		protected function trade():void
		{
			if(tradeFlag == true)
				return;
			
			for(var i:int = 0; i < historyArray.length; i++)
				tradeAt(i);
			tradeFlag = true;
		}
		
		/*
		===============================================================
			EXPLORE FROM [CONSTRUCT OF HISTORY_ARRAY]
		===============================================================
		*/
		public function getExploratoryLength():int
		{
			if(this.level > 0)
				return 0;
			
			return _getExploratoryLength(buyingExploratoryArray) + _getExploratoryLength(sellingExploratoryArray);
		}
		protected function _getExploratoryLength(vector:Vector.<BTCriteria>):int
		{
			var length:int = 0;
			
			var file:BTFile;
			var unit:int;
			var volume:int;
			
			for(var i:int = 0; i < vector.length; i++)
			{
				file = vector[i].getFile() as BTFile;
				
				unit = int( SMath.log10( file.getMaximum(direction) - file.getMinimum(direction) ) );
				volume = unit - file.getAccuracy();
				
				if(volume == 0)
					continue;
				
				/*
				10분법이라면, 점이 처음에는 11개, 그 다음부터는 9개씩 생긴다
				따라서 처음에는 (DIVIDER + 1)로 나누고
				그 다음부터는 (DIVIDER - 1)로 나눈다
				*/
				length += (volume + 1);
				//length += (DIVIDER + 1) + (unit + 1)*(DIVIDER + 1);
			}
			return length;
		}
		
		public function determine():void
		{
			this.explore();
		}
		
		public function explore(direction:int = Global.DIRECTION_BUY, algorithm:int = 0):void
		{
			/*
				EXPLORE(DIRECTION, I, J)
					I -> LEVEL1 -> DIRECTION NAME
					J -> LEVEL2 -> ALGORITHM NAME
			
				모두 레벨0에서 관장토록 한다.
			*/
			var x:int;
			
			if(this.level == LEVEL_TOP)
				if(direction == Global.DIRECTION_BUY)
					if(this.buyingAlgorithm != null && algorithm < buyingExploratoryArray.length)
						buyingAlgorithm.at(algorithm).explore(direction, algorithm);
					else
						this.explore(Global.DIRECTION_SELL);
				else if((direction == Global.DIRECTION_SELL) && (this.sellingAlgorithm != null && algorithm < sellingExploratoryArray.length))
					sellingAlgorithm.at(algorithm).explore(Global.DIRECTION_SELL, algorithm);
				else
					historyArray.explore();
			else
			{
				//각각의 알고리즘
				if(this.level >= 3 && this.accuracy <= BTFile(criteria.getFile()).getAccuracy())
				{
					//explore 조건의 최적값 확정
					setExploratoryValue(value, direction, algorithm);
					
					topAlgorithm.explore(direction, algorithm + 1);
				}
				else
				{
					//자식을 생성 후, EXPLORE 계속 진행
					constructChildren(this.direction, illiquidCriteria);
					
					x = this.calcMaxAlgorithmIndex();
					if(x == this.length - 1)
						x--;
					else if(x != 0)
					{
						var prevAlgorithmProfit:Number = this.at(x - 1).traderArray.getExploratoryProfit(direction);
						var nextAlgorithmProfit:Number = this.at(x + 1).traderArray.getExploratoryProfit(direction);
						
						if( prevAlgorithmProfit > nextAlgorithmProfit )
							x--;
					}
					Global.callLater( this.at(x).explore, [direction, algorithm] );
				}
				
				if(this.level > LEVEL_ALGORITHM_NAME)
					Global.callLater(historyArray.exploreCompleted);
			}
		}
		
		/*
		===============================================================
			TO_XML & TO_HTML
		===============================================================
		*/
		//FOR TRACE
		public function toString():String
		{
			var text:String = level + ") " + name;
			return StringUtil.getTabbed(text, level);
		}
		protected function toIndexString():String
		{
			if(this.level == LEVEL_TOP)
				return index.toString();
			else
				return parentAlgorithm.toIndexString() + "_" + index;
		}
		
		//RESULT
		public function toResultXML():String
		{
			//LEVEL 0
			if(this.level > LEVEL_TOP)
				return "";
			
			var xml:String = "<algorithm name='" + this.name + "'>\n";
			
			for(var i:int = 0; i < traderArray.length; i++)
				xml += StringUtil.getTabbed( this.toResultXMLAt( i ) ) + "\n";
			xml += StringUtil.getTabbed( this.toResultXMLAt( Global.AGGREGATION_AVERAGE ) ) + "\n";
			//xml += StringUtil.getTabbed( this.toResultXMLAt( Global.AGGREGATION_TOTAL ) ) + "\n";
			
			xml += "</algorithm>";;
			return xml;
		}
		protected function toResultXMLAt(x:int):String
		{
			var xml:String;
			
			if(level == LEVEL_DIRECTION || level == LEVEL_ALGORITHM_NAME) //단순 폴더
				xml = "<result name='" + name + "'>\n";
			else
			{
				//이름 설정
				var name:String;
				if(level == LEVEL_TOP)
				{
					if(x == Global.AGGREGATION_AVERAGE)		name = "Average.";
					else if(x == Global.AGGREGATION_TOTAL)	name = "Total.";
					else						name = historyArray.at(x).getName();
				}
				else
					name = this.name;
				
				//xml 기록
				if(x == Global.AGGREGATION_AVERAGE || x == Global.AGGREGATION_TOTAL)
					xml = 
						StringUtil.sprintf
						(
							"<result name='{0}' {1}>\n", 
							name, 
							traderArray.toResultXMLAt(x)
						);
				else
					xml =
						StringUtil.sprintf
						(
							"<result name='{0}' algorithmIndex='{1}' corporateIndex='{2}' {3}>\n", 
							name, 
							toIndexString(), 
							x,
							traderArray.toResultXMLAt(x)
						);
			}
			for(var i:int = 0; i < this.length; i++)
				xml += StringUtil.getTabbed( this.at(i).toResultXMLAt(x) ) + "\n";
			xml += "</result>";
			
			return xml;
		}
		
		//COMPARISON
		public function toComparisonXMLAt(algorithm:int, x:int):String
		{
			if(this.level != LEVEL_TOP)
				return topAlgorithm.toComparisonXMLAt(algorithm, x);
			
			var xml:String = "";
			
			if(x == Global.AGGREGATION_AVERAGE)
			{
				var average:BTTraderArrayReturnAggregation = traderArray.getAverageAggregation();
				
				xml += average.getTradeReturn(Global.RETURN_REAL).toXML("real", String(algorithm));
				xml += average.getTradeReturn(Global.RETURN_PAPER).toXML("paper", String(algorithm));
			}
			else
			{
				var trader:BTTrader = traderArray.at(x);
			
			
				xml += trader.getRealReturn().toXML("real", String(algorithm)) + " ";
				xml += trader.getPaperReturn().toXML("paper", String(algorithm));
			}
			return xml;
		}
		
		//HTML
		public function toHTML():String
		{
			if(this.level > LEVEL_TOP)
				return "";
			
			var html:String = 
				"<h2>" + name + "</h2>\n";
				html +=
					"<table border='1'>\n" +
					"	<tr>\n" +
					"		<th rowspan='2'>Company Name</th>\n" +
					"		<th colspan='3'>Bought</th>\n" +
					"		<th colspan='3'>Sold</th>\n" +
					"		<th colspan='3'>Real Return</th>\n" +
					"		<th colspan='3'>Paper Return</th>\n" +
					"	</tr>\n" +
					"	<tr>\n" +
					"		<th>Average</th>\n" +
					"		<th>Volume</th>\n" +
					"		<th>Amount</th>\n" +
					"		<th>Average</th>\n" +
					"		<th>Volume</th>\n" +
					"		<th>Amount</th>\n" +
					"		<th>Profit</th>\n" +
					"		<th>Return Rate</th>\n" +
					"		<th>RR % / 1 Year</th>\n" +
					"		<th>Profit</th>\n" +
					"		<th>Return Rate</th>\n" +
					"		<th>RR % / 1 Year</th>\n" +
					"	</tr>";
			
			for(var i:int = 0; i <= traderArray.length; i++)
				html += StringUtil.getTabbed( this.toHTMLAt( i ) ) + "\n";
			
			html += "</table>\n<br><br>\n";
			
			return html;
		}
		protected function toHTMLAt(x:int):String
		{
			return "";
		}
		
		//CANDLE
		public function toTitle(algorithmIndex:String, corporate:int):String
		{
			var algorithm:BTAlgorithm = getAlgorithm(algorithmIndex);
			var history:History = algorithm.historyArray.at(corporate);
			
			var title:String = history.getName() + "(" + history.getCode() + ") - " + algorithm.name;
			return title;
		}
		public function toCandleXMLAt(algorithmIndex:String, corporate:int):String
		{
			var algorithm:BTAlgorithm = getAlgorithm(algorithmIndex);
			
			return algorithm.traderArray.toCandleXMLAt(corporate);
		}
		
		//COMPARISON-GRID
		
		//PLOT CHART
	}
}