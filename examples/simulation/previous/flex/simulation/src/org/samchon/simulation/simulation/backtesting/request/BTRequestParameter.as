package org.samchon.simulation.simulation.backtesting.request
{
	import org.samchon.format.Format;
	import org.samchon.simulation.simulation.retrieve.CorporateList;
	import org.samchon.simulation.simulation.abstract.request.SMRequestParameter;
	import org.samchon.utils.HTML;
	import org.samchon.utils.StringUtil;
	
	public class BTRequestParameter extends SMRequestParameter
	{
		protected var buyingCommission:Number;
		protected var sellingCommission:Number;
		
		public function BTRequestParameter(smParam:SMRequestParameter, buyingCommission:Number, sellingCommission:Number)
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
			
			this.buyingCommission = buyingCommission;
			this.sellingCommission = sellingCommission;
		}
		public function getBuyingCommission():Number	{	return buyingCommission;	}
		public function getSellingCommission():Number	{	return sellingCommission;	}
		
		override public function toHTML():String
		{
			var html:String = super.toHTML();
			html += 
				StringUtil.sprintf
				(
					"<br>\n" +
					"Commission:<br>\n" +
					"{0}buying : {1}<br>\n" +
					"{0}selling: {2}",
					HTML.getTab(1), 
					Format.percentFormat(buyingCommission), Format.percentFormat(sellingCommission)
				);
			return html;
		}
	}
}