package org.samchon.simulation.worker
{
	import flash.events.Event;
	import flash.net.LocalConnection;
	
	import mx.controls.Alert;
	
	import org.samchon.namtree.criteria.NTCriteria;
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	import org.samchon.simulation.movie.InquiryMovie;
	import org.samchon.simulation.movie.RetrieveMovie;
	import org.samchon.simulation.simulation.retrieve.history.RTHistory;
	import org.samchon.simulation.simulation.retrieve.history.RTHistoryArray;
	import org.samchon.simulation.simulation.retrieve.namtree.RetrieveTreeMovie;
	import org.samchon.socket.HTTPService;
	
	public class RetrieveWorker extends SimulationWorker
	{
		protected function get rtHistoryArray():RTHistoryArray
		{
			return historyArray as RTHistoryArray;
		}
		protected function get namTree():RetrieveTreeMovie
		{
			return RetrieveMovie(movie).namTree;
		}
		protected function get criteria():NTCriteria
		{
			return namTree.criteriaGridArray[0].getTopCriteria();
		}
		
		override protected function getNewHistoryArray():HistoryArray	{	return new RTHistoryArray(this);	}
		public function RetrieveWorker(movie:InquiryMovie)
		{
			super(movie);
			
			corporateService.addEventListener(Event.COMPLETE, handleCorporateList);
		}
		
		/* -----------------------------------------------------------
			INTERACTION WITH COMPILER
		----------------------------------------------------------- */
		public function simulate():void
		{
			movie.setEnabled( false );
			
			namTree.goCompile();
		}
		override protected function handleCompiled(compiled:Object):void
		{
			//super.handleCompiled(compiled);
			
			//LOAD격
			var priceLength:int = namTree.getMaxPriceLength();
			var indexLength:int = namTree.getMaxIndexLength();
			
			rtHistoryArray.addEventListener(Event.COMPLETE, handleHistoryArrayReply);
			rtHistoryArray.loadWithLength(priceLength, indexLength);
		}
		protected function handleHistoryArrayReply(event:Event):void
		{
			var history:RTHistory;
			
			var codes:String = "vain";
			var result:Number;
			var message:String = "";
			var count:int = 0;
			
			for(var i:int = 0; i < historyArray.length; i++)
			{
				history = historyArray.at(i) as RTHistory;
				result = 0.0;
				
				criteria.initRetrieve();
				
				try
				{
					result = criteria.getRetrieved([historyArray, history]); //compiled.getRetrieved(historyArray, history);
				}
				catch(error:Error)
				{
					Alert.show(error.message, error.errorID + ": " + error.name);
					break;
				}
				
				//ADD TO LIST
				if( result > 0.0 )
				{
					codes += "|" + history.getCode();
					message += history.getName() + ": " + history.getCode() + "\n";
					count++;
				}
			}
			Alert.show( message, count + " of " + historyArray.length );
			
			goCorporateList(codes);
			movie.setEnabled( true );
		}
			
		/* -----------------------------------------------------------
			GET RETRIEVED CORPORATES
		----------------------------------------------------------- */
		protected var corporateService:HTTPService = new HTTPService(URL.CORPORATE_LIST);
		protected var sock:LocalConnection = new LocalConnection();
		
		protected function goCorporateList(codes:String):void
		{
			corporateService.send({field: "code", value:codes});
		}
		protected function handleCorporateList(event:Event):void
		{
			var xml:XML = new XML(event.target.data);
			var length:int = xml.simulationLength;
			
			for(var i:int = 0; i < length; i++)
			{
				try
				{
					sock.send("org.samchon.simulation" + i, "constructCorporateList", event.target.data);
				}
				catch(error:Error)
				{
					//DO NOTHING
				}
			}
		}
		
		
		override public function getFileName():String
		{
			return "retrieve";
		}
	}
}