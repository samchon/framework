package org.samchon.simulation.simulation.abstract.history
{
	import flash.events.Event;
	
	import org.samchon.simulation.inquiry.finance.index.IndexArray;
	import org.samchon.simulation.inquiry.finance.index.IndexArrayArray;
	import org.samchon.simulation.inquiry.price.candle.CandleArray;
	import org.samchon.simulation.simulation.abstract.request.SMRequestParameter;
	import org.samchon.socket.HTTPService;

	public class History
	{
		protected var historyArray:HistoryArray;
		
		protected var candleArray:CandleArray = null;
		protected var indexArrayArray:IndexArrayArray = null;
		
		protected var code:String;
		protected var name:String;
		protected var market:int;
		
		/* -------------------------------------------------------
			CONSTRUCTOR
		------------------------------------------------------- */
		public function History(historyArray:HistoryArray, code:String, name:String, market:int)
		{
			this.historyArray = historyArray;
			this.code = code;
			this.name = name;
			this.market = market;
			
			//historyArray.dictionary[code] = this;
		}
		public function getHistoryArray():HistoryArray	{	return historyArray;	}
		public function getCode():String				{	return code;			}
		public function getName():String				{	return name;			}
		public function getMarket():int					{	return market;			}
		public function getCandleArray():CandleArray	{	return candleArray;		}
		public function getIndexArray(standard:int, period:int = -1):IndexArray
		{
			if(indexArrayArray == null)
				return null;
			else
				return indexArrayArray.getIndexArray(standard, period);
		}
		
		/* -------------------------------------------------------
			SIMULATE - FOR ABSTRACTION
		------------------------------------------------------- */
		public function determine():void
		{
			for(var count:Number = 0; count < 100000000; count++) 
			{
				
			}
		}
		public function simulate():void
		{
			for(var count:Number = 0; count < 100000000; count++) 
			{
				
			}
		}
		
		/* -------------------------------------------------------
			TO_XML
		------------------------------------------------------- */
		public function toXML(x:int = 0):String
		{
			return "";
		}
		public function toHTML(x:int = 0):String
		{
			return "";
		}
		
		/* -------------------------------------------------------
			LOAD REGRESSIVE-DATA
		------------------------------------------------------- */
		protected var httpService:HTTPService = new HTTPService(URL.HISTORY_HISTORY);
		protected var parameter:SMRequestParameter = null;
		
		public function load(parameter:SMRequestParameter):void
		{
			if(parameter.getNeedToRequest(this.parameter) == true)
			{
				httpService.addEventListener(Event.COMPLETE, handleReply);
				
				var formData:Object = parameter.getFormData();
				formData.code = this.code;
				formData.name = this.name;
				
				httpService.send(formData);
			}
			else
				historyArray.loadCompleted();
			this.parameter = parameter;
		}
		protected function handleReply(event:Event):void
		{
			httpService.removeEventListener(Event.COMPLETE, handleReply);
			var xml:XML = new XML(httpService.data);
			
			//CANDLE_LIST
			candleArray = new CandleArray(xml.candleList[0]);
			candleArray.calc();
			
			//INDEX_LIST_LIST
			if(xml.hasOwnProperty("indexListList"))
			{
				indexArrayArray = new IndexArrayArray();
				
				var xmlList:XMLList = xml.indexListList.indexList;
				for(var i:int = 0; i < xmlList.length(); i++)
					indexArrayArray.push( new IndexArray( xmlList[i] ) );
			}
			
			//LOAD_COMPLETED
			historyArray.loadCompleted();
		}
	}
}