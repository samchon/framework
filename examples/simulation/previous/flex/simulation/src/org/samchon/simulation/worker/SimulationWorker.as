package org.samchon.simulation.worker
{
	import flash.events.Event;
	import flash.events.ProgressEvent;
	
	import org.samchon.simulation.movie.InquiryMovie;
	import org.samchon.simulation.movie.SimulationMovie;
	import org.samchon.simulation.simulation.retrieve.CorporateList;
	import org.samchon.simulation.simulation.abstract.boundary.SMBoundary;
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	import org.samchon.simulation.simulation.abstract.request.SMRequestParameter;
	
	public class SimulationWorker extends InquiryWorker
	{
		protected var historyArray:HistoryArray;
		protected function getNewHistoryArray():HistoryArray		{	return new HistoryArray(this);	}
		protected function get simulationMovie():SimulationMovie	{	return SimulationMovie(movie);	}
		
		public function SimulationWorker(movie:InquiryMovie)
		{
			super(movie);
			
			Compiler.addCompilerListener(handleCompiled);
			historyArray = getNewHistoryArray();
		}
		public function getHistoryArray():HistoryArray
		{
			return this.historyArray;
		}
		
		/* -----------------------------------------------------------
			LOAD AND SIMULATE
		----------------------------------------------------------- */
		protected var parameter:SMRequestParameter;
		protected var progress_type:int;
		
		protected static const PROGRESS_LOAD:int = 0;
		protected static const PROGRESS_DETERMINE:int = 1;
		protected static const PROGRESS_SIMULATE:int = 2;
		
		public function getBoundaryType():int		{	return simulationMovie.getBoundaryType();	}
		public function getBoundary():SMBoundary	{	return simulationMovie.getBoundary();		}
		
		public function goSimulate(parameter:SMRequestParameter):void
		{
			this.parameter = parameter;
			
			if( getBoundary().goCompile() == false )
				simulationMovie.closeProgress();
		}
		protected function handleCompiled(compiled:Object):void
		{
			historyArray.addEventListener(ProgressEvent.PROGRESS, handleProgress);
			historyArray.addEventListener(Event.COMPLETE, handleCompleted);
			
			progress_type = PROGRESS_LOAD;
			historyArray.load(parameter);
		}
		
		protected function handleProgress(event:ProgressEvent):void
		{
			simulationMovie.setProgress(event.bytesLoaded, event.bytesTotal);
		}
		protected function handleCompleted(event:Event):void
		{
			if(progress_type == PROGRESS_LOAD)
				simulationMovie.setProgressComment("Determining ...", "Now determining by your own alogirthm.");
			else if(progress_type == PROGRESS_DETERMINE)
				simulationMovie.setProgressComment("Simulating ...", "Now simulating by your own algorithm");
			else if(progress_type == PROGRESS_SIMULATE)
			{
				setResult();
				simulationMovie.closeProgress();
			}
			progress_type++;
		}
		protected function setResult():void
		{
			simulationMovie.setResult( historyArray.toXML() );
		}
		
		//SAVE
		override public function goSave(extension:String):void
		{
			if(historyArray.length == 0)
				return;
			else
				super.goSave(extension);
		}
		override protected function toHTML():String
		{
			return historyArray.toHTML();
		}
	}
}