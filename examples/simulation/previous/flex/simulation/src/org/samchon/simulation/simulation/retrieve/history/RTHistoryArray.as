package org.samchon.simulation.simulation.retrieve.history
{
	import flash.events.Event;
	
	import mx.controls.Alert;
	
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	import org.samchon.simulation.worker.SimulationWorker;
	import org.samchon.socket.HTTPService;
	import org.samchon.utils.StringUtil;
	
	public dynamic class RTHistoryArray extends HistoryArray
	{
		protected var priceLength:int;
		protected var indexLength:int;
		
		protected var httpService:HTTPService = new HTTPService(URL.RETRIEVE_HISTORY_LIST);
		
		public function RTHistoryArray(worker:SimulationWorker)
		{
			super(worker);
			
			this.priceLength = 0;
			this.indexLength = 0;
			
			httpService.addEventListener(Event.COMPLETE, handleReply);
		}
		public function loadWithLength(priceLength:int, indexLength:int):void
		{
			if(priceLength == this.priceLength && indexLength == this.indexLength)
			{
				if(completeListener != null)
					completeListener.apply(null, [null]);
			}
			else
				httpService.send( {priceLength: priceLength, indexLength: indexLength} );
			
			this.priceLength = priceLength;
			this.indexLength = indexLength;
		}
		
		protected function handleReply(event:Event):void
		{
			//POP_FRONT ALL
			this.splice(0, this.length);
			
			var xml:XML = new XML(httpService.data);
			var xmlList:XMLList = xml.history;
			var i:int;
			
			for(i = 0; i < xmlList.length(); i++)
				this.push
					( 
						new RTHistory
						(
							this,
							xmlList[i].@code, 
							StringUtil.decodeURI(xmlList[i].@name),
							xmlList[i].@market,
							xmlList[i] as XML
						)
					);
			if(completeListener != null)
				completeListener.apply(null, [null]);
		}
	}
}