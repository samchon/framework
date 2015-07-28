package org.samchon.simulation.simulation.backtesting.history.trader
{
	import org.samchon.format.Format;
	import org.samchon.simulation.inquiry.price.candle.CandleArray;
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	import org.samchon.simulation.simulation.backtesting.history.BTHistory;
	import org.samchon.utils.StringUtil;

	public dynamic class BTTrader// extends Array
	{
		protected var history:BTHistory;
				
		//거래 내역
		protected var inventoryVolume:int = 0;
		
		protected var boughtArray:Vector.<BTTradeRecord> = new Vector.<BTTradeRecord>();
		protected var soldArray:Vector.<BTTradeRecord> = new Vector.<BTTradeRecord>();
		protected var boughtTotal:BTTradeTotal = new BTTradeTotal();
		protected var soldTotal:BTTradeTotal = new BTTradeTotal();
		
		//수익률
		protected var realReturn:BTTradeReturn = new BTTradeReturn();
		protected var paperReturn:BTTradeReturn = new BTTradeReturn();
		
		protected var paperBoughtPrice:Number = 0.0;
		protected var realBoughtPrice:Number = 0.0;
		
		protected function get candleArray():CandleArray	{	return history.getCandleArray();		}
		protected function get buyingCommission():Number	{	return history.getBuyingCommission();	}
		protected function get sellingCommission():Number	{	return history.getSellingCommission();	}
		
		public function BTTrader(history:BTHistory)
		{
			//super();
			this.history = history;
		}
		//public function at(x:int):BTTradeRecord	{	return this[x] as BTTradeRecord;	}
		
		protected function cloneTradeArray(tradeArray:Vector.<BTTradeRecord>):Vector.<BTTradeRecord>
		{
			var clonedArray:Vector.<BTTradeRecord> = new Vector.<BTTradeRecord>();
			var trade:BTTradeRecord;
			
			for(var i:int = 0; i < tradeArray.length; i++)
			{
				trade = tradeArray[i];
				clonedArray.push( new BTTradeRecord(trade.x, trade.direction, trade.volume) );
			}
			return clonedArray;
		}
		public function getPriceAt(x:int, direction:int):Number
		{
			var price:int = candleArray.at(x).close;
			if(direction == Global.DIRECTION_BUY)
				return price * (1 + buyingCommission);
			else
				return price * (1 - sellingCommission);
		}
		protected function getDateAt(x:int):String
		{
			return candleArray.at(x).date;
		}
		
		public function getRealReturn():BTTradeReturn	{	return realReturn;	}
		public function getPaperReturn():BTTradeReturn	{	return paperReturn;	}
		public function getBoughtTotal():BTTradeTotal	{	return boughtTotal;	}
		
		public function getDateLength():int
		{
			return HPR.getDays( getDateAt(0), getDateAt( candleArray.length - 1 ) );
		}
		
		public function getTotalVolume(type:int):int
		{
			if(type == 0)
				return boughtTotal.getVolume();
			else
				return soldTotal.getVolume();
		}
		public function getTotalAmount():int
		{
			return boughtTotal.getAmount();
		}
		public function getTradeReturn(type:int):BTTradeReturn
		{
			if(type == Global.RETURN_PAPER)
				return paperReturn;
			else
				return realReturn;
		}
		
		/* 
		=================================================================
			TRADING METHOD
		=================================================================
		*/
		protected var calcFlag:Boolean = false;
		
		public function calc():void
		{
			if(calcFlag == true)
				return;
			/*
				실현수익
					
			*/
			calcAs(realReturn, soldArray, soldTotal.getVolume());
			
			var leftVolume:int = boughtTotal.getVolume() - soldTotal.getVolume();
			
			//매도기록 복제
			var $soldArray:Vector.<BTTradeRecord> = cloneTradeArray(soldArray);
			if(leftVolume > 0)
				$soldArray.push( new BTTradeRecord(candleArray.length - 1, Global.DIRECTION_SELL, leftVolume) );
			
			/*
				평가수익
					따라서 매수 총량이 바로 매도 총량과 같아진다
			*/
			calcAs(paperReturn, $soldArray, boughtTotal.getVolume());
			
			calcFlag = true;
		}
		protected function calcAs(tradeReturn:BTTradeReturn, soldArray:Vector.<BTTradeRecord>, soldTotalVolume:int):void
		{
			//수익 - 매도 수량에 근거하여 계산해야 한다.
			if(soldTotalVolume == 0)
			{
				tradeReturn.profit = Global.NULL;
				tradeReturn.simpleReturn = Global.NULL;
				tradeReturn.yearReturn = Global.NULL;
			}
			else
			{
				var i:int;
				var j:int = 0;
				
				var profit:Number = 0.0;
				var boughtPrice:Number;
				var boughtVolume:int;
				var soldPrice:Number;
				var soldVolume:int = soldTotal.getVolume();
				
				var hprArray:Vector.<HPR> = new Vector.<HPR>(); //기하수익률 계산기
				var boughtArray:Vector.<BTTradeRecord> = cloneTradeArray(this.boughtArray); //boughtArray 복제: this.boughtArray -> boughtArray
				
				//i->매도 시점, j->매수 시점
				for(i = 0; i < soldArray.length; i++)
				{
					soldVolume = soldArray[i].volume;
					soldPrice = getPriceAt(soldArray[i].x, Global.DIRECTION_SELL);
					
					if(soldVolume == 0)
						continue;
					
					while(j < boughtArray.length)
					{
						boughtVolume = boughtArray[j].volume;
						if(boughtVolume == 0)
						{
							j++;
							continue;
						}
						
						//매수 기록의 수량이 더 크면, 매도 수량에 맞춘다.
						if(boughtVolume > soldVolume)
							boughtVolume = soldVolume;
						
						//금액 산정
						boughtPrice = getPriceAt(boughtArray[j].x, Global.DIRECTION_BUY);
						
						//수익률 계산
						//기록되는 수익은 매수의 거래량을 기준으로 함
						profit += (soldPrice - boughtPrice) * boughtVolume; //금액
						hprArray.push
						(
							new HPR
							(
								boughtPrice,
								soldPrice, 
								boughtVolume, //volume transacted
								getDateAt( boughtArray[j].x ),
								getDateAt( soldArray[i].x )
							)
						); //기하수익률_계산기_배열 구성
						
						//계산된 수량 차감
						boughtArray[j].volume -= boughtVolume;
						soldVolume -= boughtVolume;
						
						if(soldVolume == 0)
							break;
					}
				}
				//이익 금액 및 일반 수익률 계산
				tradeReturn.profit = profit;
				tradeReturn.simpleReturn = profit / boughtTotal.getAmount();
				
				//기하수익률 최종 계산
				var hpr:Number = 1.0;
				var value:Number;
				
				for(i = 0; i < hprArray.length; i++)
				{
					value = hprArray[i].getWeighted(soldTotalVolume);
					if(value != Global.NULL)
						hpr *= value;
				}
				tradeReturn.yearReturn = hpr - 1.0;
			}
		}
		
		public function buy(x:int, volume:int):void
		{
			//x -> date
			var trade:BTTradeRecord = new BTTradeRecord(x, Global.DIRECTION_BUY, volume);
			
			//this.push( trade );
			boughtArray.push( trade );
			boughtTotal.add( candleArray.at(x).close, volume );
			
			inventoryVolume += volume;
		}
		public function sell(x:int, volume:int):int
		{
			if(volume > inventoryVolume)
				volume = inventoryVolume;
			
			var trade:BTTradeRecord = new BTTradeRecord(x, Global.DIRECTION_SELL, volume);
			
			//this.push( trade );
			soldArray.push( trade );
			soldTotal.add( candleArray.at(x).close, volume );
			
			inventoryVolume -= volume;
			return volume;
		}

		public function toResultXML():String
		{
			var historyArray:HistoryArray = history.getHistoryArray();
			
			var xml:String = 
				StringUtil.sprintf
				(
					//"<result algorithm='{0}' code='{1}' name='{2}' {3} {4} {5} {6} />\n",
					"{0} {1} {2} {3}",
						//history.getAlgorithmIndex(this),
						
						//history.getCode(),				history.getName(),
						boughtTotal.toXML("bought"),	soldTotal.toXML("sold"),
						paperReturn.toXML("paper"), 	realReturn.toXML("real")
				);
			return xml;
		}
		public function toCandleXML():XML
		{
			var xml:String = "<candleList>\n";
			var line:String;
			var i:int = 0;
			var bought_x:int = 0;
			var sold_x:int = 0;
			
			var bought:int;
			var sold:int;
			
			for(i = 0; i < candleArray.length; i++)
			{
				line = candleArray.at(i).toXML();
				
				bought = 0;
				sold = 0;
				
				//ITERATING FOR MATCHING DATE
				while(bought_x < boughtArray.length)
				{
					if(boughtArray[bought_x].x > i)
						break;
					else if(boughtArray[bought_x].x == i)
						bought = boughtArray[bought_x].volume;
					bought_x++;
				}
				while(sold_x < soldArray.length)
				{
					if(soldArray[sold_x].x > i)
						break;
					else if(soldArray[sold_x].x == i)
						sold = soldArray[sold_x].volume;
					sold_x++;
				}
				
				line = StringUtil.sprintf("{0} bought='{1}' sold='{2}' />", StringUtil.between(line, null, " />"), bought, sold);
				xml += line + "\n";
			}
			xml += "</candleList>";
			return new XML(xml);
		}
		public function toHTML():String
		{
			var html:String;
			//html = 
			//		"	<tr>\n";
			//html += "		<td>" + history.getName() + "</td>\n";
			
			html += boughtTotal.toHTML() + "\n";
			html += soldTotal.toHTML() + "\n";
			html += realReturn.toHTML() + "\n";
			html += paperReturn.toHTML() + "\n";
			//html += "	</tr>\n";
			
			return html;
		}
	}
}