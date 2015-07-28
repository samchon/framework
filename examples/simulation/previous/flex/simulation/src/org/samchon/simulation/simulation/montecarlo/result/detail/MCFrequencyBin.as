package org.samchon.simulation.simulation.montecarlo.result.detail
{
	import org.samchon.format.Format;
	import org.samchon.utils.StringUtil;

	public class MCFrequencyBin
	{
		protected var parentList:MCFrequencyBinList;
		
		protected var beginPrice:int;
		protected var endPrice:int;
		protected var volume:int;
		
		public function MCFrequencyBin(beginPrice:int, endPrice:int, volume:int)
		{
			this.beginPrice = beginPrice;
			this.endPrice = endPrice;
			this.volume = volume;
		}
		public function setParentList(parentList:MCFrequencyBinList):void
		{
			this.parentList = parentList;
		}
		
		public function getBeginPrice():int	{	return beginPrice;	}
		public function getEndPrice():int	{	return endPrice;	}
		public function getVolume():int		{	return volume;		}
		public function getBeginUpriseRatio():Number
		{
			return beginPrice / Number(parentList.getBasePrice()) - 1.0;
		}
		public function getEndUpriseRatio():Number
		{
			return endPrice / Number(parentList.getBasePrice()) - 1.0;
		}
		public function get $upriseRatio():Number	{	return getBeginUpriseRatio();	}
		public function get $volume():int			{	return volume;					}
		
		public function toHTML():String
		{
			var html:String =
				StringUtil.sprintf
				(
					"	<tr>\n" +
					"		<td>{0} ~ {1}</td>\n" +
					"		<td>{2} ~ {3}</td>\n" +
					"		<td>{4}</td>\n" +
					"	</tr>",
					Format.colorPercentFormat( getBeginUpriseRatio() ), Format.colorPercentFormat( getEndUpriseRatio() ),
					Format.intFormat( beginPrice ), Format.intFormat( endPrice ),
					Format.intFormat( volume )
				);
			return html;
		}
	}
}