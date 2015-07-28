package org.samchon.simulation.simulation.montecarlo.result.detail
{
	import org.samchon.format.Format;
	import org.samchon.utils.StringUtil;

	public class MCFrequency
	{
		protected var parentList:MCFrequencyList;
		
		protected var price:int;
		protected var frequency:Number;
		
		public function MCFrequency(frequency:Number, price:int)
		{
			this.frequency = frequency;
			this.price = price;
		}
		public function setParentList(parentList:MCFrequencyList):void
		{
			this.parentList = parentList;
		}
		
		public function getFrequency():Number	{	return frequency;		}
		public function getPrice():int			{	return price;			}
		public function getUpriseRatio():Number
		{
			return this.price / Number( parentList.getBasePrice() ) - 1.0;
		}
		
		public function get $frequency():Number		{	return getFrequency();		}
		public function get $upriseRatio():Number	{	return getUpriseRatio();	}
		public function get $price():int			{	return getPrice();			}
		
		public function toHTML():String
		{
			var html:String =
				StringUtil.sprintf
				(
					"	<tr>\n" +
					"		<td>{0}</td>\n" +
					"		<td>{1}</td>\n" +
					"		<td>{2}</td>\n" +
					"	</tr>",
					Format.percentFormat( frequency ),
					Format.colorPercentFormat( getUpriseRatio() ),
					Format.intFormat( price )
				);
			return html;
		}
	}
}