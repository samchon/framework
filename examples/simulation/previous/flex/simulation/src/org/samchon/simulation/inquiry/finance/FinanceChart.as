package org.samchon.simulation.inquiry.finance 
{
	import org.samchon.simulation.inquiry.finance.FinanceChartItem;

	public class FinanceChart {
		private var items:Vector.<FinanceChartItem>;
		private var xmlList:XMLList;
		
		public function FinanceChart(arr:Array, xmlList:XMLList) {
			items = new Vector.<FinanceChartItem>();
			this.xmlList = xmlList;
			var values:Vector.<Number>;
			var i:int;
			var j:int;
			
			for(i = 0; i < arr.length; i++)  {
				values = new Vector.<Number>();
				for(j = 0; j < xmlList.date.length(); j++)
					values.push( arr[i]["@date" + j] );
				items.push( new FinanceChartItem(arr[i]["@label"], values) );
			}
		}
		public function toVolumeXML():XML {
			var text:String = "<volume>\n";
			var i:int;
			var j:int;
			for(i = 0; i < xmlList.date.length(); i++) {
				text += "	<volume>\n";
				text += "		<date>" + xmlList.date[i] + "</date>\n";
				for(j = 0; j < items.length; j++)
					text += "		<" + items[j].label + ">" + items[j].values[i] + "</" + items[j].label + ">\n";
				text += "	</volume>\n"
			}
			text += "</volume>";
			return new XML(text);
		}
		public function toGrowthXML():XML {
			var text:String = "<growth>\n";
			var i:int;
			var j:int;
			
			for(i = 1; i < xmlList.date.length(); i++) {
				text += 
							"	<growth>\n" +
							"		<date>" + xmlList.date[i] + "</date>\n";
				for(j = 0; j < items.length; j++)
					text += "		<" + items[j].label + ">" + ((items[j].values[i] - items[j].values[i-1]) / items[j].values[i-1] )  + "</" + items[j].label + ">\n";
				text += "	</growth>\n";
			}
			text += "</growth>\n";
			
			return new XML(text);
		}
	}
}