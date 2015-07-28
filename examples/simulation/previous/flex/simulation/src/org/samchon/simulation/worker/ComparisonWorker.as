package org.samchon.simulation.worker
{
	import flash.events.Event;
	import flash.net.FileReference;
	
	import mx.collections.XMLListCollection;
	
	import org.samchon.format.Format;
	import org.samchon.simulation.movie.ComparisonMovie;
	import org.samchon.simulation.movie.InquiryMovie;
	import org.samchon.simulation.simulation.retrieve.Corporate;
	import org.samchon.simulation.simulation.retrieve.CorporateList;
	import org.samchon.socket.HTTPService;
	import org.samchon.utils.HTML;
	
	public class ComparisonWorker extends InquiryWorker
	{
		protected var httpService:HTTPService = new HTTPService(URL.COMPARISON_COMPARISON);
		protected var example_httpService:HTTPService = new HTTPService(URL.COMPARISON_EXAMPLE);
		
		protected var xml:XML = null;
		protected function get targetList():CorporateList	{	return ComparisonMovie(movie).targetList;	}
		
		public function ComparisonWorker(movie:InquiryMovie)
		{
			super(movie);
			
			example_httpService.addEventListener(Event.COMPLETE, handleExample);
			httpService.addEventListener(Event.COMPLETE, handleComparison);
		}
		public function getXML():XML {
			return xml;
		}
		
		/* -----------------------------------------------------------------
			GET EXAMPLE CANDIDATES BY DOUBLE-CLICK
		----------------------------------------------------------------- */
		public override function goCorporateDoubleClicked(code:String=null, map:Object=null):void {
			goExample(code);
		}
		protected function goExample(code:String):void {
			example_httpService.send({code: code});
		}
		protected function handleExample(event:Event):void {
			var replyData:String = event.target.data;
			var xml:XML = new XML(replyData);
			
			targetList.constructXML(xml);
			ComparisonMovie(movie).goCompare();
		}
		
		/* -----------------------------------------------------------------
			GET COMPARISON DATA
		----------------------------------------------------------------- */
		public function goComparison(codeArray:String, startDate:String, endDate:String):void {
			movie.setEnabled( false );
			httpService.send({codeArray: codeArray, startDate: startDate, endDate: endDate});
		}
		protected function handleComparison(event:Event):void {
			xml = new XML(event.target.data);
			ComparisonMovie(movie).setSource(xml);
			
			movie.setEnabled( true );
		}
		
		/* -----------------------------------------------------------------
			SAVE HANDLER
		----------------------------------------------------------------- */
		public override function getFileName():String {
			if(xml == null)
				return null;
			else
				return "comparison";
		}
		protected function getCompanyHTML(comp:String):String {
			var movie:ComparisonMovie = this.movie as ComparisonMovie;
			var html:String =
				"	<tr>\n" +
				"		<th>" + comp + "</th>\n";
			
			for(var i:int = 0; i < targetList.length; i++)
				html += "		<th>" + targetList.at(i).getName() + "</th>";
			
			html += "	</tr>";
			return html;
		}
		override protected function toHTML():String {
			var html:String = super.toHTML() + "\n";
			
			var i:int;
			var j:int;
			
			/*----------------------------------------------
			PRICE
			----------------------------------------------*/
			var priceList:XMLList = xml.price.price;
			html += "<h1>Relative Price</h1>\n" +
				"<table border='1'>";
			html += getCompanyHTML("Date") + "\n";
			
			for(i = 0; i < priceList.length(); i++) {
				html += "	<tr>\n";
				html += "		<td>" + priceList[i].@date + "</td>\n";
				for(j = 0; j < targetList.length; j++) {
					html += "		<td align='right'>"
						+ Format.percentFormat( priceList[i]["@company" + j] )
						+ "</td>\n";
				}
				html += "	</tr>\n";
			}
			html += "</table>\n<br>\n<br>\n\n";
			
			/*----------------------------------------------
			INDEX
			----------------------------------------------*/
			var indexList:XMLList = xml.index;
			var indexSubList:XMLList;
			var k:int;
			
			html += "<h1>Relative Index</h1>\n" +
				"<table border='1'>";
			html += getCompanyHTML("Component") + "\n";
			
			for(i = 0; i < indexList.index.length(); i++) {
				html += "	<tr>\n" +
					"		<td>" + indexList.index[i].@label + "</td>\n" +
					"	</tr>";
				
				//sub items
				indexSubList = indexList.index[i].index;
				for(j = 0; j < indexSubList.length(); j++) {
					html += "	<tr>\n" +
						"		<td>" + HTML.getTab(1) + indexSubList[j].@label + "</td>\n";
					
					for(k = 0; k < targetList.length; k++) {
						html += "		<td align='right'>"
							+ Format.numberFormat( indexSubList[j]["@company" + k] )
							+ "</td>\n";
					}
					html += "	</tr>\n";
				}
			}
			html += "</table>\n";
			html += HTML.TAIL;
			
			return html;
		}
	}
}