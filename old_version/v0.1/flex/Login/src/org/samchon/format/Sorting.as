package org.samchon.format
{
	import mx.collections.Sort;
	
	import spark.collections.SortField;

	public class Sorting
	{
		public static function todaySort():Sort {
			var sort:Sort = new Sort();
			sort.fields = [new SortField("time", false, true)]; //column, 내림차순여부, 숫자인가
			
			return sort;
		}
	}
}