package org.samchon.utils
{
	public class HTML
	{
		public static const HEAD:String = 
			"<html>\n" +
			"<head>\n" +
			"	<title>Auto-generated Document from Samchon Simulation</title>\n" +
			"<META http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n" +
			"<style>\n" +
			"	th {\n" +
			"		padding : 10px;\n" +
			"		color : white;\n" +
			"		background-color : #00376F;\n" +
			"	}\n" +
			"</style>\n" +
			"</head>\n\n" +
			"<body>\n";
		public static const TAIL:String = 
			"</body>\n" +
			"</html>";
		
		public static function getTab(count:int):String {
			var tab:String = "";
			for(var i:int = 0; i < count; i++)
				tab += "&nbsp;&nbsp;&nbsp;&nbsp;";
			
			return tab;
		}
	}
}