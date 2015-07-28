package org.samchon.simulation.simulation.retrieve.namtree.criteria
{
	import org.samchon.namtree.criteria.NTCriteria;
	import org.samchon.namtree.criteria.NTItem;
	import org.samchon.namtree.criteria.data.NTAggregation;
	import org.samchon.simulation.simulation.retrieve.namtree.filetree.file.RTFile;
	
	public class RTCriteria extends NTCriteria
	{
		public function RTCriteria()
		{
			super();
		}
		override protected function getNewCriteria():NTCriteria
		{
			return new RTCriteria();
		}
		override protected function getNewItem():NTItem
		{
			return new RTItem();
		}
		
		public function getMaxPriceLength():int
		{
			var max:int = Math.max( RTItem(leftItem).getPriceLength(), RTItem(rightItem).getPriceLength() );
			var value:int;
			
			for(var i:int = 0; i < this.length; i++)
			{
				value = RTCriteria(this.at(i)).getMaxPriceLength();
				if(value > max)
					max = value;
			}
			return max;
		}
		public function getMaxIndexLength():int
		{
			var max:int = Math.max( RTItem(leftItem).getIndexLength(), RTItem(rightItem).getIndexLength() );
			var value:int;
			
			for(var i:int = 0; i < this.length; i++)
			{
				value = RTCriteria(this.at(i)).getMaxIndexLength();
				if(value > max)
					max = value;
			}
			return max;
		}
	}
}