package org.samchon.simulation.inquiry.price.today
{
	import mx.collections.ArrayCollection;
	import mx.collections.Sort;
	import mx.collections.SortField;
	
	import org.samchon.format.Format;
	
	public dynamic class TodayArray extends Array
	{
		protected var _yesteraday:int;
		
		/* ----------------------------------------
			CONSTRUCTOR
		---------------------------------------- */
		public function TodayArray() {
			super();
		}
		public function at(x:int):Today
		{
			return this[x] as Today;
		}
		
		public function set yesterday(value:int):void {
			_yesteraday = value;
		}
		public function get yesterday():int {
			return _yesteraday;
		}
		public function get price():int {
			return this[this.length - 1].price;
		}
		
		/* ----------------------------------------
			PARSING
		---------------------------------------- */
		public function insert(replyData:String):void {
			var today:Today;
			
			var MainString:String;
			var Price:int;
			
			if(replyData.indexOf("<tr onmouseout=\"highlight(this,false)\" onmouseover=\"highlight(this,true)\">") != -1) {
				var TotalArray:Array = replyData.split("<tr onmouseout=\"highlight(this,false)\" onmouseover=\"highlight(this,true)\">");
				TotalArray.splice(0, 1);
				
				if(replyData.indexOf("datetime2") != -1) {
					var yesterdayPriceUpDown:int = 0;
					MainString = replyData.split("<td class=\"datetime2\">")[1].split("</tr>")[0];
					Price = Format.getValue(MainString.split("<td class=\"num\">")[1].split("</td>")[0]);
					
					if(MainString.indexOf("<em>▲</em>") != -1) {
						yesterdayPriceUpDown = Format.getValue(MainString.split("<em>▲</em>")[1].split("</span></td>")[0]);
						yesterday = int(Price) - int(yesterdayPriceUpDown);
					}else if(MainString.indexOf("<em>↑</em>") != -1) {
						yesterdayPriceUpDown = Format.getValue(MainString.split("<em>↑</em>")[1].split("</span></td>")[0]);
						yesterday = int(Price) - int(yesterdayPriceUpDown);
					}else if(MainString.indexOf("<em>▼</em>") != -1){
						yesterdayPriceUpDown = Format.getValue(MainString.split("<em>▼</em>")[1].split("</span></td>")[0]);
						yesterday = int(Price) + int(yesterdayPriceUpDown);
						//echo(yesterdayPrice, "어제랑 등락");
					}else if(MainString.indexOf("<em>↓</em>") != -1){
						yesterdayPriceUpDown = Format.getValue(MainString.split("<em>↓</em>")[1].split("</span></td>")[0]);
						yesterday = int(Price) + int(yesterdayPriceUpDown);
					}else if(MainString.indexOf("<em>-</em>") != -1){
						yesterday = int(Price);
					}
				}
				
				var TimeString:String;
				var Time:int;
				var VolumeAccumulated:int;
				var $i:int
				var Volume:int;
				//var exp:String = "";
				for (var i:int = TotalArray.length - 1; i >= 0; i--) {
					TimeString = TotalArray[i].split("<td class=\"datetime2\">")[1].split("</td>")[0];
					Time = int(TimeString.split(":")[0]) * 100 + int(TimeString.split(":")[1]);
					Price = Format.getValue(TotalArray[i].split("<td class=\"num\">")[1].split("</td>")[0]);
					VolumeAccumulated = Format.getValue(TotalArray[i].split("<td class=\"num\">")[4].split("</td>")[0]);
					
					if(Time >= 900 && Time <= 1500)
						this.push( new Today(Price, VolumeAccumulated, Time) );
				}
			}
		}
		
		/* ----------------------------------------
			ARRAY METHODS
		---------------------------------------- */
		/*public function sortOn(field:String):void {
			var sort:Sort = new Sort();
			sort.fields = [new SortField(field, true, false, true)];
			
			this.sort = sort;
			this.refresh();
		}*/
		
		//CALC METHODS
		public function getIntervalVolume():void {
			for(var i:int = this.length - 1; i >= 1; i--)
				this[i].volume -= this[i-1].volume;
		}
		public function calc():void {
			var i:int;
			for(i = 0; i < this.length; i++) {
				this[i].yesterday = _yesteraday;
				this[i].calc();
			}
		}
		
		/* ----------------------------------------
			STRING METHODS
		---------------------------------------- */
		public function toXML():XML {
			var xml:String = "<today>\n";
			for(var i:int = 0; i < this.length; i++)
				xml += this[i].toXML();
			xml += "</today>";
			
			return new XML(xml);
		}
		public function toHTML():String {
			if(this.length == 0)
				return "";
			var str:String = 
				"<table border='1' bordercolor='black' cellpadding='5' cellspacing='0'>\n" +
				"	<tr>\n" +
				"		<th>Time</th>\n" +
				"		<th>Price</th>\n" +
				"		<th colspan='2'>Net change</th>\n" +
				"		<th>Volume</th>\n" +
				"	</tr>\n";
			
			for(var i:int = 0; i < this.length; i++)
				str += this[i].toHTML();
			
			str += "</table>\n<br><br><br>\n";
			
			return str;
		}
	}
}