package org.samchon.simulation.simulation.montecarlo.result.detail
{
	import mx.collections.ArrayList;
	
	import org.samchon.utils.HTML;
	
	public class MCFrequencyBinList extends ArrayList
	{
		protected var frequencyList:MCFrequencyList;
		
		//CONSTRUCTORS
		public function MCFrequencyBinList(frequencyList:MCFrequencyList, bins:int)
		{
			super(source);
			
			this.frequencyList = frequencyList;
			this.constructBins(bins);
		}
		public function at(x:int):MCFrequencyBin
		{
			return getItemAt(x) as MCFrequencyBin;
		}
		public function getBasePrice():int	
		{
			return frequencyList.getBasePrice();
		}
		override public function addItem(item:Object):void
		{
			var bin:MCFrequencyBin = item as MCFrequencyBin;
			
			super.addItem(bin);
			bin.setParentList(this);
		}
		override public function addItemAt(item:Object, index:int):void
		{
			var bin:MCFrequencyBin = item as MCFrequencyBin;
			
			super.addItemAt(bin, index);
			bin.setParentList(this);
		}
		
		//CONSTRUCT CHILDS
		public function constructBins(bins:int):void
		{
			this.removeAll();
			
			var endX:int = frequencyList.length - 1;
			var gap:Number = (frequencyList.at(endX).getPrice() - frequencyList.at(0).getPrice()) / Number(bins);
			
			var beginPrice:int = frequencyList.at(0).getPrice();
			var endPrice:int;
			var volume:int;
			
			var b:int = 0;
			var i:int = 0;
			
			while(b < bins)
			{
				if(i >= frequencyList.length)
					break;
				
				volume = 0;
				endPrice = beginPrice + gap;
				
				for(; i < frequencyList.length; i++)
				{
					if( i != endX && frequencyList.at(i).getPrice() >= endPrice )
						break;
					else
						volume++;
				}
				this.addItem( new MCFrequencyBin(beginPrice, endPrice, volume) );
				
				beginPrice += gap;
				b++;
			}
		}
		
		//TO_HTML
		public function toHTML():String
		{
			var html:String =
				"<h3>Frequeny Histogram</h3>\n" +
				HTML.TABLE_HEAD + "\n" +
				"	<tr>\n" +
				"		<th colspan='2'>Bins</th>\n" +
				"		<th rowspan='2'>Volume</th>\n" +
				"	</tr>\n" +
				"	<tr>\n" +
				"		<th>Uprise(%)</th>\n" +
				"		<th>Price</th>\n" +
				"	</tr>\n";
			
			for(var i:int = 0; i < this.length; i++)
				html += at(i).toHTML() + "\n";
			
			html += HTML.TABLE_TAIL;
			return html;
		}
	}
}