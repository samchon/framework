package
{
	public class DateUtil
	{
		public static function parse(text:String):Date
		{
			var dateArray:Array = text.split("-");
			
			return new Date( int(dateArray[0]), int(dateArray[1]), int(dateArray[2]) );
		}
		
		private static function _getDateGap(big:Date, small:Date):Date
		{
			return new Date(big.time - small.time);
		}
		
		public static function getYearGap(big:Date, small:Date):int
		{
			return _getDateGap(big, small).fullYear - 1970;
		}
		public static function getMonthGap(big:Date, small:Date):int
		{
			return _getDateGap(big, small).month;
		}
		public static function getDateGap(big:Date, small:Date):int
		{
			return _getDateGap(big, small).date;
		}
	}
}