package org.samchon.namTree.criteria.data
{
	import mx.collections.ArrayList;

	public class NTAggregation
	{
		public var label:String;
		public var data:int;
		
		public function NTAggregation(label:String, data:int)
		{
			this.label = label;
			this.data = data;
		}
		
		//CONSTANTS
		public static const ATOMIC:int = 0;
		public static const AVERAGE:int = 1;
		public static const MINIMUM:int = 2;
		public static const MAXIMUM:int = 3;
		public static const RANK:int = 4;
		
		public static const aggregationList:ArrayList = new ArrayList
		([
			new NTAggregation("Atomic", ATOMIC),
			new NTAggregation("Average", AVERAGE),
			new NTAggregation("Minimum", MINIMUM),
			new NTAggregation("Maximum", MAXIMUM),
			new NTAggregation("Rank", RANK)
		]);
	}
}