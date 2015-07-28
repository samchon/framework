package org.samchon.simulation.simulation.backtesting.history.trader
{
	import org.samchon.format.Format;

	public class BTTradeReturn
	{
		public var profit:Number;
		public var simpleReturn:Number;
		public var yearReturn:Number;
		
		public function BTTradeReturn()
		{
			profit = Global.NULL;
			simpleReturn = Global.NULL;
			yearReturn = Global.NULL;
		}
		public function init():void
		{
			//FOR AVERAGE
			profit = 0.0;
			simpleReturn = 0.0;
			yearReturn = 0.0;
		}
		public function getExploratoryProfit():Number
		{
			//return profit * (simpleReturn + 1.0) * (yearReturn + 1.0);
			return (simpleReturn + 1.0);
		}
		
		public function divideBy(size:int):void
		{
			if(size == 0)
				return;
			
			if(profit != Global.NULL)		profit /= size;
			if(simpleReturn != Global.NULL)	simpleReturn /= size;
			if(yearReturn != Global.NULL)	yearReturn /= size;
		}
		
		public function toXML(type:String, tail:String = ""):String
		{
			var xml:String = "";
			xml += getXML(type + "Profit" + tail, profit);
			xml += getXML(type + "SimpleReturn" + tail, simpleReturn);
			xml += getXML(type + "YearReturn" + tail, yearReturn);
			
			return xml;
		}
		public function toHTML():String
		{
			var html:String = 
				"		<td align='right'>" + Format.colorIntFormat( profit ) + "</td>\n" +
				"		<td align='right'>" + Format.colorPercentFormat( simpleReturn ) + "</td>\n" +
				"		<td align='right'>" + Format.colorPercentFormat( yearReturn ) + "</td>";
			return html;
		}
		protected function getXML(name:String, val:Number):String
		{
			if(val == Global.NULL)
				return "";
			else
				return name + "='" + val + "' ";
		}
	}
}