package org.samchon.namTree.criteria.data
{
	import mx.collections.ArrayList;

	public class NTOperator
	{
		public var label:String;
		public var data:int;
		
		public function NTOperator(label:String, data:int)
		{
			this.label = label;
			this.data = data;
		}
		
		//CONSTANTS
		public static const EQUAL:int = 0;
		public static const DIFFERENT:int = 1;
		public static const SMALLER:int = 2;
		public static const SMALLER_EQUAL:int = 3;
		public static const BIGGER:int = 4;
		public static const BIGGER_EQUAL:int = 5;
		public static const LIKE:int = 6;
		
		public static const operatorList:ArrayList = new ArrayList
		([
			new NTOperator("=", EQUAL),
			new NTOperator("≠", DIFFERENT),
			new NTOperator("<", SMALLER),
			new NTOperator("≤", SMALLER_EQUAL),
			new NTOperator(">", BIGGER),
			new NTOperator("≥", BIGGER_EQUAL),
			new NTOperator("LIKE", LIKE)
		])
	}
}