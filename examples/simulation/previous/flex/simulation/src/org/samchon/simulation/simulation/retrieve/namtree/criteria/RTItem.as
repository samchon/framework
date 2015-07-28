package org.samchon.simulation.simulation.retrieve.namtree.criteria
{
	import org.samchon.namtree.filetree.file.NTFile;
	import org.samchon.namtree.criteria.NTItem;
	import org.samchon.simulation.simulation.retrieve.namtree.filetree.file.RTFile;
	
	public class RTItem extends NTItem
	{
		public function RTItem(aggregation:int = 0, file:NTFile=null, type:String="Number", value:String="0.0", parameterMap:Object=null)
		{
			super(aggregation, file, type, value, parameterMap);
		}
		
		public function getPriceLength():int
		{
			if(this.file == null || RTFile(file).priceLength == 0)
				return 0;
			else
				return RTFile(file).priceLength + int(parameterMap.priceTimePoint);
		}
		public function getIndexLength():int
		{
			if(this.file == null || RTFile(file).indexLength == 0)
				return 0;
			else
				return RTFile(file).indexLength + int(parameterMap.indexTimePoint);
		}
	}
}