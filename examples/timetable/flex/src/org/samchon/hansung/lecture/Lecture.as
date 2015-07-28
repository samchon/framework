package org.samchon.hansung.lecture 
{
	import mx.collections.ArrayList;
	
	import org.samchon.hansung.SubjectList;
	import org.samchon.hansung.base.Major;
	import org.samchon.utils.StringUtil;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class Lecture extends ArrayList
	{
		protected var subject:Subject;
		protected var divide:String;
		protected var professor:String;
		protected var mid:int;
		protected var link:String;
		
		/* ------------------------------------------------------------
			CONSTRUCTOR AND LIST METHODS
		------------------------------------------------------------ */
		public function Lecture(subject:Subject, divide:String, professor:String, mid:int, link:String) 
		{
			super();
			setSubject(subject);
			
			this.divide = divide;
			this.professor = professor;
			this.mid = mid;
			this.link = link;
		}
		public function setSubject(subject:Subject):void {
			this.subject = subject;
		}
		public function at(x:*):LectureTime 
		{
			return getItemAt(x) as LectureTime;
		}
		
		/* ------------------------------------------------------------
			자식 구성 -> Lecture
		------------------------------------------------------------ */
		public function constructChilds(rowArray:Array):void
		{
			//파싱에 쓸 변수
			var colArray:Array;
			
			var day:int; //9열
			var hour:int; //10열
			var classroom:String; //11열
			
			var i:int;
			for(i = 0; i < rowArray.length; i++)
			{
				colArray = StringUtil.betweens( rowArray[i], "<td", "/td>" );
				switch( getValue(colArray[9]) )
				{
					case "월":
						day = 1;
						break;
					case "화":
						day = 2;
						break;
					case "수":
						day = 3;
						break;
					case "목":
						day = 4;
						break;
					case "금":
						day = 5;
						break;
				}
				hour = int( getValue(colArray[10]) );
				classroom = getValue(colArray[11]);
				
				this.addItem( new LectureTime(this, day, hour, classroom) );
			}
			
			//주간일 경우, 시간 정정
			//8, 9, 1교시같은 경우
			if(this.mid == 1)
			{
				var is9:Boolean = false;
				for(i = 0; i < this.length; i++)
					if(this.at(i).getHour() == 9)
						is9 = true;
				if(is9)
					for(i = 0; i < this.length; i++)
						this.at(i).switchDaytoNight();
			}
			
			//야간일 경우, 5교시 이하면 야간으로 바꾸되,
			if(this.mid == 2)
			{
				for(i = 0; i < this.length; i++)
					if( this.at(i).getHour() <= 5)
						at(i).switchDaytoNight();
			}			
			//5,6,7이 연속되는 상황이면 답이 없다.
		}
		protected function getValue(col:String):String
		{
			return SubjectList.getValue(col);
		}
		
		/* -------------------------------------------------------------------------
			GET METHODS
		------------------------------------------------------------------------- */
		//FROM SUBJECT
		public function getMajor():Major	{	return subject.getMajor();		}
		public function getCode():String	{	return subject.getCode();		}
		public function getName():String	{	return subject.getName();		}
		public function getKind():String	{	return subject.getKind();		}
		public function getGrade():int		{	return subject.getGrade();		}
		public function getCredit():int		{	return subject.getCredit();		}
		
		//FROM ITSELF
		public function getDivide():String		{	return divide;		}
		public function getProfessor():String	{	return professor;	}
		public function getMid():int			{	return mid;			}
		public function getLink():String		{	return link;		}
		
		/* -------------------------------------------------------------------------
			DATAGRID에 보여질 항목
		------------------------------------------------------------------------- */
		//FROM SUBJECT
		public function get $code():String	{	return getCode();		}
		public function get $name():String	{	return getName();		}
		public function get $kind():String	{	return getKind();		}
		public function get $grade():int	{	return getGrade();		}
		public function get $credit():int	{	return getCredit();		}
		
		//FROM ITSELF
		public function get $divide():String	{	return getDivide();		}
		public function get $professor():String	{	return getProfessor();	}
		public function get $mid():String		{	return (getMid() == 1) ? "주" : "야";		}
		public function get $link():String		{	return getLink();		}
		
		public function get $day():String
		{
			var value:String = "";
			var i:int;
			
			for(i = 0; i < this.length; i++)
				value += dayArray[ this.at(i).getDay() ] + "\n";
			
			return value;
		}
		public function get $hour():String
		{
			var value:String = "";
			var i:int;
			
			for(i = 0; i < this.length; i++)
				value += this.at(i).getHour() + "\n";
			
			return value;
		}
		public function get $classroom():String
		{
			var value:String = "";
			var i:int;
			
			for(i = 0; i < this.length; i++)
				value += this.at(i).getClassroom() + "\n";
			
			return value;
		}
		
		protected static var dayArray:Array = ["", "월", "화", "수", "목", "금"];
	}
}