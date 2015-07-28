package org.samchon.simulation.inquiry.price.today
{
	import org.samchon.format.Format;

	public class Today {
		public var price:int;
		public var volume:int;
		public var time:int;
		public var yesterday:int;
		
		public var upRisePrice:int;
		public var upRiseRatio:Number;
		
		public function Today(price:int, volume:int, time:int) {
			this.price		=	price;
			this.volume		=	volume;
			this.time		=	time;
		}
		public function calc():void {
			this.upRisePrice = price - yesterday;
			this.upRiseRatio = (price - yesterday) / Number(yesterday);
		}
		
		//Exporting
		public function toXML():String {
			var xml:String =
				"	<today>\n" +
				"		<price>"		+	this.price			+ "</price>\n"			+
				"		<yesterday>"	+	this.yesterday		+ "</yesterday>\n"		+
				"		<volume>"		+	this.volume			+ "</volume>\n"			+
				"		<time>"			+	this.time			+ "</time>\n"			+
				"		<upRisePrice>"	+	this.upRisePrice	+ "</upRisePrice>\n"	+
				"		<upRiseRatio>"	+	this.upRiseRatio	+ "</upRiseRatio>\n"	+ 
				"	</today>\n";
			
			return xml;
		}
		public function toHTML():String {
			var color:String;
			if(upRisePrice > 0)
				color = "RED";
			else if(upRisePrice < 0)
				color = "BLUE";
			else
				color = "BLACK";
			
			var row:String = 
				"	<tr>\n" +
				"		<td>"								+ Format.getTime(time)				+	"</td>\n" +
				"		<td>"								+ Format.numberFormat(price)		+	"</td>\n" + 
				"		<td><font color='" + color + "'>"	+ Format.numberFormat(upRisePrice)	+	"</font></td>\n" + 
				"		<td><font color='" + color + "'>"	+ Format.percentFormat(upRiseRatio)	+	"</font></td>\n" + 
				"		<td>"								+ Format.numberFormat(volume)		+	"</td>\n" +
				"	</tr>\n";
			
			return row;
		}
	}
}