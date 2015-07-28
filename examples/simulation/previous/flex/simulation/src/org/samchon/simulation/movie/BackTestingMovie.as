package org.samchon.simulation.movie
{
	import mx.controls.Alert;
	import mx.events.FlexEvent;
	
	import org.samchon.simulation.menu.BackTestingMenu;
	import org.samchon.simulation.menu.InquiryMenu;
	import org.samchon.simulation.simulation.abstract.boundary.SMProgrammingBoundary;
	import org.samchon.simulation.simulation.abstract.result.SMResultMovie;
	import org.samchon.simulation.simulation.backtesting.boundary.BTNamTreeBoundary;
	import org.samchon.simulation.simulation.backtesting.boundary.BTProgrammingBoundary;
	import org.samchon.simulation.simulation.backtesting.request.BTRequestWindow;
	import org.samchon.simulation.simulation.backtesting.result.BTResultMovie;
	import org.samchon.simulation.worker.BackTestingWorker;
	import org.samchon.simulation.worker.InquiryWorker;

	public class BackTestingMovie extends SimulationMovie
	{
		override public function get category():int	{	return Category.BACK_TESTING;	}
		override protected function getNewTopMenu():InquiryMenu		{	return new BackTestingMenu();		}
		override protected function getNewWorker():InquiryWorker	{	return new BackTestingWorker(this);	}
		
		public function BackTestingMovie()
		{
			super();
		}
		
		override protected function getNewResultMovie():SMResultMovie					{	return new BTResultMovie();			}
		override protected function getNewNamTreeBoundary():BTNamTreeBoundary			{	return new BTNamTreeBoundary();		}
		override protected function getNewProgrammingBoundary():SMProgrammingBoundary	{	return new BTProgrammingBoundary();	}
		
		override protected function get RequestWindow():Class	{	return BTRequestWindow;	}
		
		//잠시간 PROGRAMMING PASSAGE 차단
		override public function set currentState(value:String):void
		{
			if(value == "PROGRAMMING_STATE")
				Alert.show("Programming-Passage is under construction");
			else
				super.currentState = value;
		}
	}
}