package org.samchon.simulation.simulation.montecarlo.request
{
	import mx.events.FlexEvent;
	
	import org.samchon.simulation.simulation.abstract.request.SMRequestParameter;
	import org.samchon.simulation.simulation.abstract.request.SMRequestWindow;
	
	import spark.components.NumericStepper;
	
	public class MCRequestWindow extends SMRequestWindow
	{
		protected var requestMovie:MCRequestMovie = new MCRequestMovie();
		
		protected function get repeatStepper():NumericStepper	{	return requestMovie.repeatStepper;	}
		protected function get predictStepper():NumericStepper	{	return requestMovie.predictStepper;	}
		
		protected function get mcRequestParameter():MCRequestParameter	{	return requestParameter as MCRequestParameter;	}
		
		public function MCRequestWindow()
		{
			super();
		}
		
		override protected function creationCompleted(event:FlexEvent):void
		{
			super.creationCompleted(event);
			formGroup.addElementAt(requestMovie, 0);
			
			if(requestParameter == null)
				return;
			
			repeatStepper.value = mcRequestParameter.getRepeat();
			predictStepper.value = mcRequestParameter.getPredict();
		}
		
		override protected function getNewRequestParameter():SMRequestParameter
		{
			requestParameter = super.getNewRequestParameter();
			
			requestParameter = new MCRequestParameter(requestParameter, repeatStepper.value, predictStepper.value);
			return requestParameter;
		}
	}
}