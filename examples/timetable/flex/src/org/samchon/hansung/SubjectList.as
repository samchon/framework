package org.samchon.hansung 
{
	import flash.events.Event;
	import flash.net.URLRequestMethod;
	
	import mx.collections.ArrayCollection;
	import mx.collections.ArrayList;
	
	import org.samchon.hansung.apply.ApplyList;
	import org.samchon.hansung.base.Major;
	import org.samchon.hansung.base.Student;
	import org.samchon.hansung.lecture.Subject;
	import org.samchon.hansung.score.Score;
	import org.samchon.socket.BytesHTTPService;
	import org.samchon.utils.StringUtil;
	
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public dynamic class SubjectList extends ArrayList
	{
		//Semester의 역할도 겸함
		//class SubjectList : public ArrayList<Subject>, public Semester
		protected function get timetable():Timetable	{	return Root.timetable;	}
		protected function get student():Student		{	return timetable.student;	}
		
		protected var year:int;
		protected var semester:int;
		
		public var applyList:ApplyList;
		public var score:Score;
		
		/* ------------------------------------------------------------
			CONSTRUCTOR METHODS ABOUT LIST
		------------------------------------------------------------ */
		public function SubjectList(year:int, semester:int) 
		{
			super(source);
			
			this.year = year;
			this.semester = semester;
			
			applyList = new ApplyList(this);
			this.score = new Score(year + "년도 " + semester + "학기");
			
			//score.construct(applyList);
		}
		public override function addItem(item:Object):void
		{
			var subject:Subject = item as Subject;
			
			super.addItem( subject );
			this[subject.getCode()] = subject;
		}
		public function at(x:*):Subject 
		{
			if(x is int)			return getItemAt(x) as Subject;
			else if(x is String)	return this[x] as Subject;
			else					return null;
		}
		public function getYear():int		{	return this.year;		}
		public function getSemester():int	{	return this.semester;	}
		
		/* ------------------------------------------------------------
			시간표 불러오기 및 파싱
		------------------------------------------------------------ */
		public function getLoadLength():int
		{
			return Root.majorList.length;
		}
		protected function loaded():void
		{
			timetable.loaded();
		}
		
		public function load():void
		{
			for (var i:int = 0; i < Root.majorList.length; i++)
			{
				var httpService:BytesHTTPService = new BytesHTTPService(URL.LECTURE, URLRequestMethod.GET);
				var major:Major = Root.majorList.at(i);
				
				httpService.addEventListener(Event.COMPLETE, handleReply);
				httpService.addiction = major;	
				httpService.send
				(
					{
						year: this.year, 
						semester: this.semester,
						majorcode: major.getURL()
					}
				);
			}
		}
		protected function handleReply(event:Event, isFromHistoryWindow:Boolean = false):void 
		{
			var httpService:BytesHTTPService = event.target as BytesHTTPService;
			httpService.removeEventListener(Event.COMPLETE, handleReply);
			
			//가장 마지막 TABLE만 취함
			var replyData:String = httpService.replyData;
			replyData = replyData.substr( replyData.lastIndexOf("<table") );
			replyData = StringUtil.between(replyData, null, "</table>");
			
			//파싱에 쓸 변수들
			var rowArray:Array;
			var colArray:Array;
			
			var major:Major = httpService.addiction as Major;
			var subject:Subject = null;
			var code:String = "";//0열
			var name:String;	//1열
			var kind:String;	//3열
			var grade:int;		//7열
			var credit:int;		//4열
			
			rowArray = StringUtil.betweens(replyData, "<tr", "</tr>");
			rowArray.splice(0, 1); //pop_front: 첫 행(테이블 헤더)을 버린다.
			
			for(var i:int = 0; i < rowArray.length; i++)
			{
				colArray = StringUtil.betweens( rowArray[i], "<td", "/td>" );
				code = getValue( colArray[0] );
				
				//코드가 없다면, 계속 진행
				if(code == "")
				{
					//이게 rowArray의 마지막일 경우,
					if(i == rowArray.length - 1)
						subject.constructChilds(rowArray);
					continue;
				}
				
				//다른 멤버 변수 정의
				name = getValue( colArray[1] );
				kind = getValue( colArray[3] );
				grade = int( getValue( colArray[7] ) );
				credit = int( getValue( colArray[4] ) );
				
				//기존에 subject가 있다면, 기존 subject에 기록하며
				if(subject != null)
				{
					subject.constructChilds(rowArray.splice(0, i));
					i = 0;
						/*
							만일 6개(0, 1, 2, 3, 4, 5번)가 한 과목을 이루는 레코드라면,
							이 것에 subject로 넘어갈 때,i = 6
							즉, 7번 행을 미리 취한 상태아다.
								때문에, 다음 행을 0이 아닌 1번 행으로 시작키 위해
								i가 -1이 아닌 0으로 설정하는 것이다.
							
						*/
					subject = null;
				}
				if( this.hasOwnProperty(code) == false )
				{
					subject = new Subject(major, code, name, kind, grade, credit);
					this.addItem( subject );
				}
				else
					subject = this[ code ];
			}
			loaded();
		}
		public static function getValue(col:String):String
		{
			var value:String = col;
			if(value.indexOf(">") != -1)
				value = value.substring( value.lastIndexOf(">") + 1, value.lastIndexOf("<") ); //">[ value ]<"
			value = StringUtil.trim(value); //" [value] "
			
			return value;
		}
		
		/* ------------------------------------------------------------
			전공과목 조회 및 간편 검색
		------------------------------------------------------------ */
		public function getRetrievedLectureArray(field:String, value:*):Array
		{
			var array:Array = [];
			
			var i:int;
			var j:int;
			
			//field명이 majorNo일 경우, field와 value를 major형으로 변환
			if(field == "majorNo")
			{
				field = "major";
				value = Root.majorList.at(value as int);
			}
			
			if(field == "major")
			{
				var major:Major = value as Major;
				
				for (i = 0; i < this.length; i++) //SubjectList
					for (j = 0; j < this.at(i).length; j++) //Subject : ArrayList<Lecture
						if(this.at(i).at(j).getMajor() == major)
							array.push( this.at(i).at(j) );
			}
			else
			{
				var record:String;
				var string:String = value as String;
				string = string.toUpperCase();
				
				for (i = 0; i < this.length; i++) //SubjectList
					for (j = 0; j < this.at(i).length; j++) //Subject : ArrayList<Lecture
					{
						record = this.at(i).at(j)["$" + field];
						record = record.toUpperCase();
						
						if( record.indexOf(string) != -1 )
							array.push( this.at(i).at(j) );
					}
			}
			return array;
		}
	}
}