package org.samchon.hansung 
{
	import flash.errors.IOError;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	import flash.net.dns.AAAARecord;
	
	import flashx.textLayout.formats.ITabStopFormat;
	
	import mx.collections.ArrayList;
	
	import org.samchon.hansung.apply.ApplyCandidate;
	import org.samchon.hansung.base.MajorList;
	import org.samchon.hansung.base.SecondMajor;
	import org.samchon.hansung.base.Student;
	import org.samchon.hansung.score.Score;
	import org.samchon.hansung.score.ScoreList;
	import org.samchon.socket.BytesHTTPService;
	import org.samchon.socket.HTTPService;
	import org.samchon.utils.StringUtil;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class Timetable extends ArrayList
	{
		public var student:Student;
		public var scoreList:ScoreList;
		
		public function Timetable(id:String, secondMajorList:ArrayList) 
		{
			super();
			student = new Student(id, secondMajorList);
			scoreList = new ScoreList();
		}
		
		public function at(x:int):SubjectList
		{
			return this.getItemAt(x) as SubjectList;
		}
		public override function addItem(item:Object):void
		{
			var subjectList:SubjectList = item as SubjectList;
			scoreList.addItem( subjectList.score );
			
			super.addItem( item );
		}
		public override function addItemAt(item:Object, x:int):void
		{
			var subjectList:SubjectList = item as SubjectList;
			scoreList.addItemAt( subjectList.score, x );
			
			super.addItemAt(item, x);
		}
		
		/*
		=========================================================
			학생정보 구성 및 강의목록 구성
		=========================================================
		*/
		protected var loadedCount:int;
		protected var loadLength:int;
		
		protected var progressFunction:Function;
		protected var completeFunction:Function;
		
		/* ------------------------------------------------------
			불러오기
		------------------------------------------------------ */
		public function load():void
		{
			//성적조회(누적) 페이지 + 프로필 페이지(이름 및 전공) + 현재 학기 페이지 
			loadLength = 3 + Root.majorList.length;
			loadedCount = 0;
			
			loadInfo(URL.PROFILE, URLRequestMethod.POST, profileReply);
			//loadInfo(URL.SEMESTER, semesterReply, false);
			//loadInfo(URL.HISTORY, historyReply);
		}
		protected function loadInfo(url:String, method:String, handleReply:Function, handleError:Function = null):void
		{
			var httpService:HTTPService = new BytesHTTPService(url, method);
			httpService.addEventListener(Event.COMPLETE, handleReply);
			if(handleError != null)
				httpService.addEventListener(IOErrorEvent.IO_ERROR, handleError);
			httpService.send();
		}
		protected function loadSemester2(errorEvent:IOErrorEvent):void
		{
			var httpService:HTTPService = new HTTPService(URL.GET_SEMESTER);
			httpService.addEventListener(Event.COMPLETE, semesterReply2);
			
			httpService.send();
		}
		protected function loadLecture():void
		{
			var i:int;
			for(i = 0; i < this.length - 1; i++)
				//this.length - 1인 이유; 어차피 마지막 loadLength는 전공과목 수와 같음
				loadLength += this.at(i).getLoadLength();
			
			for(i = 0; i < this.length; i++)
				this.at(i).load();
		}
		
		/* ------------------------------------------------------
			불러오기 핸들러 - 기록
		------------------------------------------------------ */
		protected function profileReply(event:Event):void
		{
			var httpService:HTTPService = event.target as BytesHTTPService;
			httpService.removeEventListener(Event.COMPLETE, profileReply);
			
			var replyData:String = BytesHTTPService(httpService).replyData;
			var name:String = StringUtil.between(replyData, "<li>이름 : ", "</li>");
			var majorParentName:String  = StringUtil.between(replyData, "<li>학부(과) : ", "</li>");
			var majorName:String = StringUtil.between(replyData, "<li>전공 : ", "</li>");
			
			var x:int;
			
			//먼저 전공 이름으로 찾고
			for(x = 0; x < Root.majorList.length; x++)
				if( majorName == Root.majorList.at(x).getName() )
					break;
			
			//못 찾으면 학부 이름으로 찾는다
			if(x == Root.majorList.length)
				for(x = 0; x < Root.majorList.length; x++)
					if( majorParentName == Root.majorList.at(x).getName() )
						break;
			
			//이름, 전공 설정
			if(Root.student.getID() == "guest")
				name = "손님";
			
			this.student.setName(name);
			this.student.addItemAt( new SecondMajor(SecondMajor.MAIN, x), 0 );
			
			loaded();
			loadInfo(URL.SEMESTER, URLRequestMethod.GET, semesterReply, loadSemester2);
			//loadSemester();
		}
		protected function semesterReply(event:Event):void
		{
			event.target.removeEventListener(Event.COMPLETE, semesterReply);
			var replyData:String = event.target.data;
			
			var year:int = fetchNumber("year");
			var semester:int = fetchNumber("semester");
			
			//학기 기록
			setSemester(year, semester);
			trace(year, semester);
			
			function fetchNumber(name:String):int
			{
				var data:String = StringUtil.between(StringUtil.between(replyData, "<select name=" + name, "</select>"), "<option", ">") + " ";
				data = StringUtil.between(data, "value=", " ");
				
				trace("'" + data + "'");
				return int(data);
			}
		}
		protected function semesterReply2(event:Event):void
		{
			event.target.removeEventListener(Event.COMPLETE, semesterReply2);
			var xml:XML = new XML(event.target.data);
			
			//학기 기록
			setSemester(xml.year, xml.semester);
		}
		protected function historyReply(event:Event):void
		{
			var httpService:BytesHTTPService = event.target as BytesHTTPService;
			httpService.removeEventListener(Event.COMPLETE, historyReply);
			
			var replyData:String = httpService.replyData;
			
			if(replyData.indexOf("<td align=\"left\"  width=\"300\"><font size=\"3\" face=\"굴림\">") != -1)
			{
				var semesterArray:Array = StringUtil.betweens(replyData, "<td align=\"left\"  width=\"300\"><font size=\"3\" face=\"굴림\">");
				var subjectArray:Array;
				
				var year:int;
				var semester:int;
				
				for(var i:int = 0; i < semesterArray.length; i++)
				{
					year = int( StringUtil.between(semesterArray[i], null, " 학년도 ") );
					semester = int( StringUtil.between(semesterArray[i], "학년도 ", " 학기") );
					
					subjectArray = StringUtil.betweens(semesterArray[i], "<td><font size=\"2\" face=\"굴림\">");
					this.addItemAt( new HistorySubjectList(year, semester, subjectArray), this.length - 1 );
				}
			}
			loaded();
			loadLecture();
		}
		
		protected function setSemester(year:int, semester:int):void
		{
			this.addItem( new SubjectList(year, semester) );
			
			//로그인 기록
			new HTTPService(URL.HANSUNG + "login.php").send( {id: student.getID(), name: student.getName(), year:year, semester:semester} );
			
			loaded();
			loadInfo(URL.HISTORY, URLRequestMethod.POST, historyReply);
		}
		
		/* ------------------------------------------------------
			진행과정 핸들러
		------------------------------------------------------ */
		public function addLoadLength(value:int):void
		{
			this.loadLength += value;
		}
		public function loaded():void
		{
			loadedCount++;
			progressFunction.apply(null, [ new ProgressEvent(ProgressEvent.PROGRESS, false, false, loadedCount, loadLength) ]);
			
			if(loadedCount == loadLength)
			{
				var event:Event = new Event(Event.COMPLETE);
				completeFunction.apply(null, [event]);
			}
		}
		public override function addEventListener(type:String, listener:Function, useCapture:Boolean=false, priority:int=0, useWeakReference:Boolean=false):void
		{
			if(type == ProgressEvent.PROGRESS)	progressFunction = listener;
			else if(type == Event.COMPLETE)		completeFunction = listener;
			else
				super.addEventListener(type, listener, useCapture, priority, useWeakReference);
		}
	}
}