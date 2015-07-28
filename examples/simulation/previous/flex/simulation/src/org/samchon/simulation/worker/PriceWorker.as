package org.samchon.simulation.worker
{
	import flash.events.Event;
	import flash.net.FileReference;
	import flash.system.System;
	
	import mx.collections.XMLListCollection;
	
	import org.samchon.simulation.movie.InquiryMovie;
	import org.samchon.simulation.movie.PriceMovie;
	import org.samchon.simulation.inquiry.price.CandleChart;
	import org.samchon.simulation.inquiry.price.PriceSummaryMovie;
	import org.samchon.simulation.inquiry.price.TodayChart;
	import org.samchon.simulation.inquiry.price.candle.CandleArray;
	import org.samchon.simulation.inquiry.price.today.Today;
	import org.samchon.simulation.inquiry.price.today.TodayArray;
	import org.samchon.simulation.worker.InquiryWorker;
	import org.samchon.socket.HTTPService;
	import org.samchon.utils.HTML;
	
	public class PriceWorker extends InquiryWorker
	{
		//HTTPSERVICE
		protected var daily_httpService:HTTPService;
		protected var summary_httpService:HTTPService;
		
		//CONTAINER
		[Bindable]protected var todayArray:TodayArray;
		protected var dailyArray:CandleArray;
		
		protected var todayLoadCompleted:int;
		
		//GET MOVIE POINTER
		protected function get priceMovie():PriceMovie
		{
			return movie as PriceMovie;
		}
		protected function get summaryMovie():PriceSummaryMovie 
		{
			return priceMovie.summaryMovie;
		}
		
		//CONSTRUCTOR
		public function PriceWorker(movie:InquiryMovie)
		{
			super(movie);
			
			daily_httpService	=	new HTTPService(	URL.PRICE_CANDLE	);
			summary_httpService	=	new HTTPService(	URL.PRICE_SUMMARY	);
			
			daily_httpService.addEventListener(Event.COMPLETE, handleDaily);
			summary_httpService.addEventListener(Event.COMPLETE, handleSummary);
		}
		
		/* -----------------------------------------------------------
		PUBLIC METHOD CALLED BY WINDOW
		----------------------------------------------------------- */
		override public function goCorporate(code:String = null, map:Object=null):void 
		{
			if(code)
				this.code = code;
			else if(this.code)
				code = this.code;
			else
				return;
			
			var startDate:String = map["startDate"];
			var endDate:String = map["endDate"];
			
			todayLoadCompleted = 0;
			movie.setEnabled( false );
			
			goToday(code);
			goDaily(code, startDate, endDate);
			goSummary(code);
		}
		
		//GO TODAY
		protected function goToday(code:String):void 
		{
			todayArray = new TodayArray();
			
			for(var i:int = 1; i <= 13; i++) {
				var httpService:HTTPService = new HTTPService(URL.FSOCKET);
				
				httpService.addEventListener(Event.COMPLETE, handleToday);
				httpService.send({url : "http://stock.daum.net/item/quote_hhmm_sub.daum?page=" + i + "&code=" + code});
			}
		}
		protected function handleToday(event:Event):void 
		{
			var httpService:HTTPService = event.target as HTTPService;
			httpService.removeEventListener(Event.COMPLETE, handleToday);
			
			//PARSING
			var replyData:String = httpService.data;
			todayArray.insert( replyData );
			
			//FINISHING - SORTING AND CALCULATING
			if(++todayLoadCompleted == 13)
			{
				todayArray.sortOn("time", Array.NUMERIC);
				todayArray.calc();
				todayArray.getIntervalVolume();
			}
			PriceMovie(movie).todayXMLList = todayArray.toXML().today;
			movie.setEnabled( true );
		}
		
		//GO CANDLE
		protected function goDaily(code:String, startDate:String, endDate:String):void 
		{
			daily_httpService.send({code:code, startDate:startDate, endDate:endDate});
		}
		protected function handleDaily(event:Event):void 
		{
			//PARSING
			var replyData:String = event.target.data;
			var xmlReplyData:XML = new XML(replyData);
			
			//CONSTRUCTING CANDLELIST
			dailyArray = new CandleArray( xmlReplyData, 20, true );
			dailyArray.calc( xmlReplyData["diffVolume"] );
			
			//BINDING DATA
			priceMovie.dailyXMLList = dailyArray.toXML().candle;
			movie.setEnabled( true );
		}
		
		//GO SUMMARY
		protected function goSummary(code:String):void 
		{
			summary_httpService.send( {code: code} );
		}
		protected function handleSummary(event:Event):void 
		{
			var xml:XML = new XML(event.target.data);
			summaryMovie.source = xml;
			
			movie.setEnabled( true );
		}
		
		/* -----------------------------------------------------------
			SAVE HANDLER
		----------------------------------------------------------- */
		override public function getFileName():String 
		{
			if(code == null)
				return null;
			else
				return "price_" + code;
		}
		override protected function toHTML():String 
		{
			var html:String = super.toHTML() + "\n";
			
			html += todayArray.toHTML();
			html += dailyArray.toHTML();
			html += HTML.TAIL;
			
			return html;
		}
		
	}
}