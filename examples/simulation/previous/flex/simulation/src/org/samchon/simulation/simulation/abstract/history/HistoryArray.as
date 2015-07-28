package org.samchon.simulation.simulation.abstract.history
{
	import flash.events.Event;
	import flash.events.ProgressEvent;
	import flash.utils.Dictionary;
	
	import org.samchon.simulation.movie.SimulationMovie;
	import org.samchon.simulation.simulation.retrieve.Corporate;
	import org.samchon.simulation.simulation.retrieve.CorporateList;
	import org.samchon.simulation.simulation.abstract.request.SMRequestParameter;
	import org.samchon.simulation.worker.SimulationWorker;
	import org.samchon.socket.HTTPService;
	import org.samchon.utils.HTML;
	import org.samchon.utils.StringUtil;

	public dynamic class HistoryArray extends Array
	{
		public var worker:SimulationWorker;
		
		protected var dictionary:Dictionary = new Dictionary();
		protected var selectedCorporates:Array;
		protected var completeListener:Function = null;
		protected var progressListener:Function = null;
		
		/* -------------------------------------------------------
			CONSTRUCTOR
		------------------------------------------------------- */
		public function HistoryArray(worker:SimulationWorker)
		{
			super();
			this.worker = worker;
		}
		public function at(x:int):History
		{
			return this[x] as History;
		}
		public function getItemIndex(history:History):int
		{
			var idx:int = -1;
			for(var i:int = 0; i < this.length; i++)
				if(history == this[i])
				{
					idx = i;
					break;
				}
			return idx;
		}
		public function get(code:String):History
		{
			return dictionary[code] as History;
		}
		
		public function addEventListener(type:String, listener:Function):void
		{
			if(type == Event.COMPLETE)
				completeListener = listener;
			else if(type == ProgressEvent.PROGRESS)
				progressListener = listener;
		}
		
		//FOR ABSTRACTION
		protected function getNewHistory(code:String, name:String, market:int):History
		{
			return new History(this, code, name, market);
		}
		
		/* -------------------------------------------------------
			DO SIMULATE
				CYCLE:
					LOAD -> DETERMINE -> SIMULATE
		------------------------------------------------------- */
		protected var simulate_i:int;
		protected var simulate_type:int;
		//protected var progressMutex:Mutex = new Mutex();
		
		public function getCompiled():Object	{	return Compiler.getCompiled();		}
		public function getBoundaryType():int	{	return worker.getBoundaryType();	}
		
		protected function determine():void
		{
			for(var i:int =	0; i < this.length; i++)
				Global.callLater( _determine, [i]);
		}
		protected function simulate():void
		{
			for(var i:int =	0; i < this.length; i++)
				Global.callLater( _simulate, [i]);
		}
		protected function _determine(x:int):void
		{
			at(x).determine();
			progressListener.apply( null, [ new ProgressEvent(ProgressEvent.PROGRESS, false, false, x + 1, this.length) ] );
			
			if( x + 1 == this.length )
			{
				completeListener.apply(null, [null]);
				simulate();
			}
		}
		protected function _simulate(x:int):void
		{
			at(x).simulate();
			progressListener.apply( null, [ new ProgressEvent(ProgressEvent.PROGRESS, false, false, x + 1, this.length) ] );
			
			if( x + 1 == this.length )
				completeListener.apply(null, [null]);
		}
		
		/* -------------------------------------------------------
			TO XML
		------------------------------------------------------- */
		public function toXML():XML
		{
			var xml:String = "<resultList>\n";
			for(var i:int = 0; i < this.length; i++)
				xml += StringUtil.getTabbed(this.at(i).toXML(), 1) + "\n";
			xml += "</resultList>";
			
			return new XML(xml);
		}
		public function toHTML():String
		{
			var html:String = HTML.HEAD;
			return html;
		}
		
		/* -------------------------------------------------------
			LOAD REGRESSIVE-DATA
		------------------------------------------------------- */
		protected var parameter:SMRequestParameter;
		protected var load_i:int;
		protected var threadCount:int;
		
		public function load(parameter:SMRequestParameter):void
		{	
			var corporateList:CorporateList = parameter.getCorporateList();
			
			var i:int;
			var j:int;
			
			//기존 historyArray 중 corporateList에 없는 것을 지워야 한다.
			for(i = this.length - 1; i >= 0; i--)
			{
				for(j = 0; j < corporateList.length; j++)
					if( this.at(i).getCode() == corporateList.at(j).getCode() )
						break;
				if(j == corporateList.length)
					delete dictionary[ this.at(i).getCode() ];
			}
			
			//corporateList에 따라 정렬하기 위해, 일단 다 지우고 다시 입력한다.
			this.splice(0, this.length);
			
			var code:String;
			for(i = 0; i < corporateList.length; i++)
			{
				code = corporateList.at(i).getCode();
				
				//없으면 새로 만듦
				if(dictionary.hasOwnProperty(code) == false)
					dictionary[code] = getNewHistory(code, corporateList.at(i).getName(), corporateList.at(i).getMarket());
				
				this.push( dictionary[code] );
			}
			
			//회귀데이터 불러오기 시작
			this.parameter = parameter;
			this.threadCount = parameter.getThreadCount();
			
			loadHistory(0);
		}
		public function loadCompleted():void
		{
			progressListener.apply( null, [ new ProgressEvent(ProgressEvent.PROGRESS, false, false, ++load_i, this.length) ] );
			
			if(load_i < this.length)
				loadHistory(load_i);
			else
			{
				completeListener.apply(null, [null]);
				determine();
			}
		}
		protected function loadHistory(x:int):void
		{
			this.load_i = x;
			this.at(x).load(parameter);
		}
	}
}