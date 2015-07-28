package org.samchon.utils
{
	public class Timestamp
	{
		protected var $date:Date;
		
		public function Timestamp(year:*=null, month:*=null, date:*=null, hours:*=null, minutes:*=null, seconds:*=null, ms:*=null)
		{
			this.$date = new Date(year, month, date, hours, minutes, seconds, ms);
		}
		
		//SET METHOD
		public function set ymd(value:String):void {
			if(value.indexOf("-") == -1)
				return;
			var valueArray:Array = value.split("-");
			$date.fullYear = valueArray[0];
			$date.month = valueArray[1] - 1;
			$date.date = valueArray[2];
		}
		
		//GET METHOD
		public function get ymd():String {
			return $date.fullYear + "-" + ($date.month+1) + "-" + $date.date;
		}
		
		//ONLY FOR MONTECARLO TODAY SIMULATION CHART'S HORIZONTAL AXIS(TIME)
		public function get hm():int	{	return $date.hours * 100 + $date.minutes;	}
		
		//CALCULATE
		public function set addYear(value:int):void		{	$date.fullYear += value;		}
		public function set addMonth(value:int):void 	{	$date.month += value;			}
		public function set addDate(value:int):void		{	$date.date += value;			}
		public function set diffYear(value:int):void	{	this.addYear = -1 * value;		}
		public function set diffMonth(value:int):void	{	this.addMonth = -1 * value;		}
		public function set diffDate(value:int):void	{	this.addDate = -1 * value;		}
		
		public function set addHour(value:int):void		{	$date.hours += value;			}
		public function set addMinute(value:int):void	{	$date.minutes += value;			}
		public function set addSecond(value:int):void	{	$date.seconds += value;			}
		public function set diffHour(value:int):void	{	this.addHour = -1 * value;		}
		public function set diffMinute(value:int):void	{	this.addMinute = -1 * value;	}
		public function set diffSecond(value:int):void	{	this.addSecond = -1 * value;	}
		
		
		/*
		============================================================
			METHODS OF DATE
		============================================================
		*/
		//SET
		public function get fullYearUTC():Number		{	return $date.fullYearUTC;		}
		public function get monthUTC():Number			{	return $date.monthUTC;			}
		public function get dateUTC():Number			{	return $date.dateUTC;			}
		public function get hoursUTC():Number			{	return $date.hoursUTC;			}
		public function get minutesUTC():Number			{	return $date.minutesUTC;		}
		public function get secondsUTC():Number			{	return $date.secondsUTC;		}
		public function get millisecondsUTC():Number	{	return $date.millisecondsUTC;	}
		public function get dayUTC():Number 			{	return $date.dayUTC;			}
		public function get fullYear():Number			{	return $date.fullYear;		}
		public function get month():Number				{	return $date.month;		}
		public function get date():Number				{	return $date.date;			}
		public function get hours():Number				{	return $date.hours;		}
		public function get minutes():Number			{	return $date.minutes;		}
		public function get seconds():Number			{	return $date.seconds;		}
		public function get milliseconds():Number		{	return $date.milliseconds;	}
		public function get time():Number				{	return $date.time;			}
		public function get day():Number 				{	return $date.day;			}
		
		//SET
		public function set fullYearUTC(value:Number):void		{	$date.fullYearUTC = value;		}
		public function set monthUTC(value:Number):void			{	$date.monthUTC = value;			}
		public function set dateUTC(value:Number):void			{	$date.dateUTC = value;			}
		public function set hoursUTC(value:Number):void			{	$date.hoursUTC = value;			}
		public function set minutesUTC(value:Number):void		{	$date.minutesUTC = value;		}
		public function set secondsUTC(value:Number):void		{	$date.secondsUTC = value;		}
		public function set millisecondsUTC(value:Number):void	{	$date.millisecondsUTC = value;	}
		public function set fullYear(value:Number):void		{	$date.fullYear = value;		}
		public function set month(value:Number):void		{	$date.month = value;		}
		public function set date(value:Number):void			{	$date.date = value;			}
		public function set hours(value:Number):void		{	$date.hours = value;		}
		public function set minutes(value:Number):void		{	$date.minutes = value;		}
		public function set seconds(value:Number):void		{	$date.seconds = value;		}
		public function set milliseconds(value:Number):void	{	$date.milliseconds = value;	}
		public function set time(value:Number):void			{	$date.time = value;			}
		
		//DAY property is read-only
		
		public static function getDateDiff(start:String, end:String):int {
			var startDate:Timestamp = new Timestamp();
			var endDate:Timestamp   = new Timestamp();
			
			startDate.ymd = start;	endDate.ymd = end;
			return (endDate.time - startDate.time) / (1000*60*60*24)
		}
		
	}
}