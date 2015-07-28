package org.samchon.simulation.simulation.backtesting.history.trader
{
	import org.samchon.format.Format;
	import org.samchon.utils.StringUtil;

	public class BTTradeTotal
	{
		protected var amount:Number;
		protected var volume:int;
		
		public function BTTradeTotal()
		{
			amount = 0;
			volume = 0;
		}
		public function getAmount():Number	{	return this.amount;	}
		public function getVolume():int		{	return this.volume;	}
		public function getAverage():Number
		{
			if(volume == 0)
				return Global.NULL;
			return amount / Number(volume);
		}
		
		public function add(price:int, volume:int):void
		{
			this.volume += volume;
			this.amount += price*volume;
		}
		
		public function toXML(type:String):String
		{
			var xml:String = "";
			if(volume > 0)
				xml +=
					StringUtil.sprintf
					(
						"{0}Average='{1}' {0}Volume='{2}' {0}Amount='{3}'",
						type, getAverage(), volume, amount
					);
			return xml;
		}
		public function toHTML():String
		{
			var html:String = 
				"		<td align='right'>" + Format.colorIntFormat( getAverage() ) + "</td>\n" +
				"		<td align='right'>" + Format.colorIntFormat( volume ) + "</td>\n" +
				"		<td align='right'>" + Format.colorIntFormat( amount ) + "</td>";
			return html;
		}
	}
}