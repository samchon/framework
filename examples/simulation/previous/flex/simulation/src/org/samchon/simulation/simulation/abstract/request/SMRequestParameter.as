package org.samchon.simulation.simulation.abstract.request
{
	import org.samchon.simulation.simulation.retrieve.CorporateList;
	import org.samchon.utils.StringUtil;

	public class SMRequestParameter
	{
		protected var corporateList:CorporateList;
		protected var startDate:String;
		protected var endDate:String;
		protected var standard:int;
		protected var period:int;
		protected var threadCount:int;
		
		public function SMRequestParameter
			(
				corporateList:CorporateList,
				startDate:String, 
				endDate:String, 
				standard:int, 
				period:int,
				threadCount:int
			)
		{
			this.corporateList = corporateList;
			this.startDate = startDate;
			this.endDate = endDate;
			this.standard = standard;
			this.period = period;
			this.threadCount = threadCount;
		}
		
		//GET METHODS
		public function getCorporateList():CorporateList	{	return this.corporateList;	}
		public function getStartDate():String	{	return startDate;	}
		public function getEndDate():String		{	return endDate;		}
		public function getStandard():int		{	return standard;	}
		public function getPeriod():int			{	return period;		}
		public function getThreadCount():int	{	return threadCount;	}
		
		//GET METHOD FOR REQUEST
		public function getNeedToRequest(param:SMRequestParameter):Boolean
		{
			return !(param != null && this.startDate == param.startDate && this.endDate == param.endDate && this.standard == param.standard && this.period == param.period);
		}
		public function getFormData():Object
		{
			var formData:Object = new Object();
			formData.startDate = startDate;
			formData.endDate = endDate;
			formData.standard = standard;
			formData.period = period;
			
			return formData;
		}
		
		public function toHTML():String
		{
			var standardText:String = "";
			var periodText:String = "";
			
			if(standard == 1) 		standardText = "GAAP";
			else if(standard == 2)	standardText = "IFRS";
			else if(standard == 3)	standardText = "GAAP, IFRS";
			else					standardText = periodText = "None";
			
			if(period == 1) 		periodText = "YEAR";
			else if(period == 2)	periodText = "QUARTER";
			else if(period == 5)	periodText = "YEAR, QUARTER";
			
			var html:String = 
				StringUtil.sprintf
				(
					"<h3>Parameters</h3><br>\n" +
					"Date between {0} and {1}<br>\n" +
					"Standard: {2}<br>\n" +
					"Period: {3}",
					
					startDate, endDate, 
					standardText, 
					periodText
				);
			return html;
		}
	}
}