package org.samchon.simulation.simulation.montecarlo.request
{
	import org.samchon.simulation.simulation.retrieve.CorporateList;
	import org.samchon.simulation.simulation.abstract.request.SMRequestParameter;
	
	public class MCRequestParameter extends SMRequestParameter
	{
		protected var repeat:int;
		protected var predict:int;
		
		public function MCRequestParameter(smParam:SMRequestParameter, repeat:int, predict:int)
		{
			super
			(
				smParam.getCorporateList(), 
				smParam.getStartDate(), 
				smParam.getEndDate(), 
				smParam.getStandard(), 
				smParam.getPeriod(), 
				smParam.getThreadCount()
			);
			this.repeat = repeat;
			this.predict = predict;
		}
		public function getRepeat():int		{	return repeat;	}
		public function getPredict():int	{	return predict;	}
	}
}