package org.samchon.hansung.lecture
{
	import flashx.textLayout.formats.LeadingModel;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class LectureTime
	{
		protected var lecture:Lecture;
		protected var day:int;
		protected var hour:int;
		protected var classroom:String;
		
		public function LectureTime(lecture:Lecture, day:int, hour:int, classroom:String)
		{
			this.lecture = lecture;
			
			this.day = day;
			this.hour = hour;
			this.classroom = classroom;
			
			//주간수업인데 강의실에 야간이라 찍혀있거나, 야간수업인데 시간이 5 이하인 경우,
			if(((lecture.getMid() == 1 && classroom.indexOf("야") != -1) || lecture.getMid() == 2) && hour <= 5)
				switchDaytoNight();
		}
		public function switchDaytoNight():void
		{
			if(this.hour <= 5)
				this.hour += 10;
		}
		public function switchNightToDay():void
		{
			if(this.hour >= 11)
				this.hour -= 10;
		}
		
		public function getCode():String		{	return lecture.getCode();	}
		public function getDay():int			{	return this.day;			}
		public function getHour():int			{	return this.hour;			}
		public function getClassroom():String	{	return this.classroom;		}
		
		public function toHTML():String 
		{
			var html:String =	
				"			<b>" + lecture.getName() + " - " + lecture.getDivide() + "</b><br>\n" +
				"			" + lecture.getProfessor() + "<br>\n" +
				"			" + this.classroom + "\n";
			return html;
		}
	}
}