package org.samchon.simulation.simulation.montecarlo.result.detail
{
	import mx.collections.ArrayList;
	
	import org.samchon.format.Format;
	import org.samchon.utils.HTML;
	
	public class MCFrequencyList extends ArrayList
	{
		protected var basePrice:int;
		protected var mean:Number = Global.NULL;
		protected var stdev:Number = Global.NULL;
		
		//CONSTRUCTORS
		public function MCFrequencyList(basePrice:int)
		{
			super(null);
			
			this.basePrice = basePrice;
		}
		public function at(x:int):MCFrequency
		{
			return this.getItemAt(x) as MCFrequency
		}
		override public function addItem(item:Object):void
		{
			MCFrequency(item).setParentList( this );
			super.addItem( item );
		}
		override public function addItemAt(item:Object, index:int):void
		{
			MCFrequency(item).setParentList( this );
			return super.addItemAt(item, index);
		}
		public function getBasePrice():int
		{
			return basePrice;
		}
		
		//STATISTICS
		public function getMean():Number
		{
			if(mean != Global.NULL)
				return mean;
			
			var value:Number = 0.0;
			for(var i:int = 0; i < this.length; i++)
				value += at(i).getUpriseRatio() / Number(length);
			
			this.mean = value;
			return value;
		}
		public function getStdev():Number
		{
			if(stdev != Global.NULL)
				return stdev;
			
			var mean:Number = getMean();
			
			var value:Number = 0.0;
			for(var i:int = 0; i < this.length; i++)
				value +=Math.pow(at(i).getUpriseRatio() - mean, 2) / Number(this.length);
			
			this.stdev = value;
			return value;
		}
		
		//TO_HTML
		public function toHTML():String
		{
			var html:String = 
				"<h3>Frequency</h3>\n" +
					//HTML.getTab(1) + "Mean: " + Format.colorPercentFormat( getMean() ) + "\n" +
					//HTML.getTab(1) + "Stdev: " + Format.percentFormat( getMean() ) + "\n" +
				HTML.TABLE_HEAD + "\n" +
				"	<tr>\n" +
				"		<th>Frequency</th>\n" +
				"		<th>Uprise(%)</th>\n" +
				"		<th>Price</th>\n" +
				"	</tr>\n";
			
			for(var i:int = 0; i < this.length; i++)
				html += at(i).toHTML() + "\n";
			
			html += "</table>";
			return html;
		}
	}
}