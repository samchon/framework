package org.samchon.library.utils
{
	import mx.controls.DateField;

	public class DateUtil
	{
		public static function toDate(str:String):Date
		{
			if (str == null)
				return null;
			
			var date:Date = DateField.stringToDate(str, "YYYY-MM-DD");
			if (str.indexOf(" ") != -1)
			{
				var elements:Array = str.substr(str.indexOf(" ") + 1).split(":");
				
				if (elements.length >= 1)
					date.hours = elements[0];
				if (elements.length >= 2)
					date.minutes = elements[1];
				if (elements.length == 3)
					date.seconds = elements[2];
			}
			
			return date;
		}
		public static function toString(date:Date):String
		{
			return StringUtil.substitute
				(
					"{0}-{1}-{2} {3}:{4}:{5}",
					date.fullYear, date.month + 1, date.date,
					date.hours, date.minutes, date.seconds
				);
		}
	}
}