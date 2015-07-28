package org.samchon.simulation.simulation.montecarlo.result.detail
{
	import mx.collections.XMLListCollection;
	
	import org.samchon.format.Format;
	import org.samchon.utils.HTML;
	import org.samchon.utils.StringUtil;
	
	public dynamic class MCXMLListCollection extends XMLListCollection
	{
		protected var repeat:int;
		
		public function MCXMLListCollection(source:XMLList, repeat:int)
		{
			super(source);
			this.repeat = repeat;
		}
		public function toHTML():String
		{
			var html:String;
			var i:int;
			var j:int;
			
			html =
				HTML.TABLE_HEAD + "\n" +
				"	<tr>" +
				"		<th>Date</th>";
				
			//th -> X'th 
			for(j = 0; j < repeat; j++)
				html += "		<th>" + StringUtil.int2th(j + 1) + " Simulation</th>\n";
			html += "	</tr>\n";
			
			//A DATE AND MULTIPLE PRICES
			for(i = 0; i < this.length; i++)
			{
				html +=
					"	<tr>\n" +
					"		<td>" + getItemAt(i).@date + "</td>\n";
				
				for(j = 0; j < repeat; j++)
					html += "		<td>" + Format.intFormat( getItemAt(i)["@price" + j] ) + "</td>\n";
				
				html += "	</tr>\n";
			}
			html += "</table>";
			return html;
		}
	}
}