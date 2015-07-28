package org.samchon.simulation.worker
{
	import flash.events.Event;
	import flash.net.FileReference;
	
	import org.samchon.format.Format;
	import org.samchon.utils.HTML;
	import org.samchon.simulation.movie.FinanceMovie;
	import org.samchon.simulation.movie.InquiryMovie;
	import org.samchon.socket.HTTPService;
	
	public class FinanceWorker extends InquiryWorker
	{
		//CONTAINER
		protected var xml:XML;
		
		//SOCKET
		protected var httpService:HTTPService = new HTTPService(URL.REPORT_REPORT);
		
		public function FinanceWorker(movie:InquiryMovie)
		{
			super(movie);
			httpService.addEventListener(Event.COMPLETE, handleReport);
		}
		override public function goCorporate(code:String = null, map:Object=null):void {
			if(code)
				this.code = code;
			else if(this.code)
				code = this.code;
			else
				return;
			
			movie.setEnabled( false );
			goReport(code, map.standard, map.period, map.length);
		}
		protected function goReport(code:String, standard:int, period:int, length:int):void {
			var formData:Object = new Object();
			formData.code = code;
			formData.standard = standard;
			formData.period = period;
			formData.length = length;
			
			httpService.send( formData );
		}
		protected function handleReport(event:Event):void {
			xml = new XML(event.target.data);
			FinanceMovie(movie).source = xml;
			
			movie.setEnabled( true );
		}
		
		/* --------------------------------------------------------------------------
			SAVE HANDLER
		-------------------------------------------------------------------------- */
		protected function get dateLength():int 
		{
			return xml.date.date.length();
		}
		override public function getFileName():String 
		{
			if(code == null)
				return null;
			else
				return "finance_" + code;
		}
		override protected function toHTML():String 
		{
			var html:String = super.toHTML() + "\n";
			
			html += getPartHTML(xml.report[0], "Financial Index");
			html += getPartHTML(xml.report[1], "Balanced Sheet");
			html += getPartHTML(xml.report[2], "Profit and Losses");
			html += getPartHTML(xml.report[3], "Cash Flow");
			html += HTML.TAIL;
			
			return html;
		}
		protected function getPartHTML(xml:XML, title:String):String {
			var html:String;
			var i:int;
			
			//HEAD
			html = "<h1>" + title + "</h1>\n" +
				"<table border='1'>\n" +
				"	<tr>\n" +
				"		<th>Components</th>\n";
			for(i = 0; i < dateLength; i++)
				html += "		<th>" + this.xml.date.date[i] + "</th>\n";
			html += "	</tr>\n";
			
			//CONTENT
			html += getChildHTML( xml, 0 );
			
			//FOOT
			html += "</table>\n";
			return html;
		}
		protected function getChildHTML(xml:XML, level:int):String {
			var html:String = "";
			var i:int;
			var j:int;
			
			for(i = 0; i < xml.report.length(); i++) {
				html += "	<tr>\n" +
					"		<td>" + HTML.getTab(level) + xml.report[i].@label + "</td>\n";
				if(xml.report[i].hasOwnProperty("@date0") == true)
					for(j = 0; j < dateLength; j++)
						html += "		<td>" + Format.numberFormat(xml.report[i]["@date" + j], false) + "</td>\n";
				
				html += "	</tr>\n";
				
				if(xml.report[i].length())
					html += getChildHTML(xml.report[i], level+1);
			}
			return html;
		}
	}
}