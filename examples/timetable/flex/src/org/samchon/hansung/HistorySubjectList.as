package org.samchon.hansung
{
	import flash.events.Event;
	import flash.events.ProgressEvent;
	import flash.net.URLRequestMethod;
	
	import mx.collections.ArrayList;
	
	import org.samchon.hansung.apply.ApplyCandidate;
	import org.samchon.hansung.apply.ApplyCandidateList;
	import org.samchon.hansung.apply.ApplyList;
	import org.samchon.hansung.apply.TargetMajorURLList;
	import org.samchon.hansung.base.Major;
	import org.samchon.hansung.base.SecondMajor;
	import org.samchon.hansung.score.Score;
	import org.samchon.socket.BytesHTTPService;
	import org.samchon.utils.StringUtil;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public dynamic class HistorySubjectList extends SubjectList
	{
		public var applyCandidateList:ApplyCandidateList = new ApplyCandidateList();
		protected var targetMajorURLList:TargetMajorURLList = new TargetMajorURLList();
		protected var targetVacationMajorURLList:TargetMajorURLList = new TargetMajorURLList();
		
		public function HistorySubjectList(year:int, semester:int, rowArray:Array)
		{
			super(year, semester);
			construct(rowArray);
		}
		protected function construct(rowArray:Array):void
		{
			var colArray:Array;
			var year:int;
			var semester:int;
			var name:String;
			var code:String;
			var kind:String;
			var credit:int;
			
			var major:Major;
			var studentMajor:Major;
			
			for(var i:int = 0; i < rowArray.length; i++)
			{
				colArray = StringUtil.betweens(rowArray[i], "<td align=\"center\"><font size=\"2\" face=\"굴림\">", "</td>");
				name = StringUtil.between(rowArray[i], null, "</td>");
				code = colArray[0];
				kind = colArray[1];
				credit = int( colArray[2] );
				
				applyCandidateList.addItem( new ApplyCandidate(code, name, kind, credit) );
				
				//kind가 일선이며, 이 과목이 다전공에 해당할 경우, targetMajorURLList에 추가한다.
				if(kind != "일선")
					continue;
				
				major = Root.majorList.at( code.substr(0, 3) );
				for(var j:int = 0; j < student.length; j++)
				{
					studentMajor = student.at(j).getMajor();
					
					if( major == studentMajor || major == studentMajor.getParent() )
					{
						//TargetMajorURLList는 중복방지가 걸려있는 ArrayList다.
						targetMajorURLList.addItem( major );
						break;
					}
				}
			}
			
			//TargetMajorURLList의 길이가 0이면, score를 construct해줘야 함
			if(targetMajorURLList.length == 0)
			{
				score.construct( applyCandidateList );
			}
		}
		
		/* ------------------------------------------------------------
			강의정보 불러오기 - 일선의 자리찾기
		------------------------------------------------------------ */
		protected var loadAskedCount:int = 0;
		protected var loadedCount:int;
		
		public override function getLoadLength():int
		{
			return targetMajorURLList.length;
		}
		public override function load():void
		{
			loadedCount = 0;
			if(++loadAskedCount == 1)
				loadOmitted();
			else
				loadDivide();
		}
		
		//누락과목 로드
		protected function loadOmitted():void
		{
			for (var i:int = 0; i < targetMajorURLList.length; i++)
			{
				var httpService:BytesHTTPService = new BytesHTTPService(URL.LECTURE, URLRequestMethod.GET);
				var major:Major = targetMajorURLList.at(i);
				
				httpService.addEventListener(Event.COMPLETE, handleOmitted);
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
		protected function loadVacation():void
		{
			loadedCount = 0;
			for (var i:int = 0; i < targetVacationMajorURLList.length; i++)
			{
				var httpService:BytesHTTPService = new BytesHTTPService(URL.LECTURE, URLRequestMethod.GET);
				var major:Major = targetVacationMajorURLList.at(i);
				
				httpService.addEventListener(Event.COMPLETE, handleVacation);
				httpService.addiction = major;
				httpService.send
				(
					{
						year: this.year, 
						semester: this.semester + 2,
						majorcode: major.getURL()
					}
				);
			}
		}
		
		//누락 소켓 핸들러
		protected function handleOmitted(event:Event):void
		{
			super.handleReply(event);
			
			if(++loadedCount < this.getLoadLength())
				return;
			
			//일선 누락 로드가 모두 끝났으면,
			var applyCandidate:ApplyCandidate;
				
			//수강신청후보과목 중,
			for(var i:int = 0; i < applyCandidateList.length; i++)
			{
				applyCandidate = applyCandidateList.at(i);
					
				//일선 과목을 해당 과목의 분류로 바꿔준다.
				if( applyCandidate.getKind() == "일선" )
					if( this.hasOwnProperty( applyCandidate.getCode() ) == true )
						applyCandidate.setKind( this.at(applyCandidate.getCode()).getKind() );
					else //계절학기에 들은 경우라, 정규학기에서 그 강의정보를을 찾지 못하는 경우가 있다.
						targetVacationMajorURLList.addItem( Root.majorList.at( applyCandidate.getCode().substr(0, 3) ) );
			}
			
			if(targetVacationMajorURLList.length > 0)
			{
				timetable.addLoadLength( targetVacationMajorURLList.length );
				loadVacation();
			}else{
				score.construct( applyCandidateList );
				timetable.scoreList.toXMLList(this.year, this.semester);
			}
		}
		protected function handleVacation(event:Event):void
		{
			var httpService:BytesHTTPService = event.target as BytesHTTPService;
			httpService.removeEventListener(Event.COMPLETE, handleDivide);
			
			var replyData:String = httpService.replyData;
			var section:String;
			var kind:String;
			
			for(var i:int = 0; i < applyCandidateList.length; i++)
			{
				if(replyData.indexOf(applyCandidateList.at(i).getCode()) == -1 || applyCandidateList.at(i).getKind() != "일선")
					continue;
				
				section = StringUtil.between(replyData, applyCandidateList.at(i).getCode(), "</tr>");
				kind = StringUtil.trim( StringUtil.between(section, "align=center>", "</td>") );
				applyCandidateList.at(i).setKind(kind);
			}
			
			if(++loadedCount < this.getLoadLength())
			{
				timetable.loaded();
				return;
			}
			score.construct( applyCandidateList );
			timetable.scoreList.toXMLList(this.year, this.semester);
			timetable.loaded();
		}
		
		/* ------------------------------------------------------------
			강의정보 불러오기 - 시간표 구성
		------------------------------------------------------------ */
		protected var loadLength:int;
		
		protected var progressFunction:Function;
		protected var completeFunction:Function;
		
		protected override function loaded():void
		{
			if( loadAskedCount == 1)
				timetable.loaded();
			else{
				//APPLYLIST 구성
				if(++loadedCount >= loadLength) 
				{
					if(loadAskedCount == 2)
					{
						var applyCandidate:ApplyCandidate;
						for(var i:int = 0; i < applyCandidateList.length; i++)
						{
							applyCandidate = applyCandidateList.at(i);
							if( applyCandidate.getDivide() == null)
								continue;
							
							applyList.apply( applyCandidate.getCode(), applyCandidate.getDivide() );
						}
					}
					completeFunction.apply( null, [new Event(Event.COMPLETE)] );
				}
				progressFunction.apply( null, [ new ProgressEvent(ProgressEvent.PROGRESS, false, false, loadedCount, loadLength) ] );
			}
		}
		
		public override function addEventListener(type:String, listener:Function, useCapture:Boolean=false, priority:int=0, useWeakReference:Boolean=false):void
		{
			if(type == ProgressEvent.PROGRESS)	progressFunction = listener;
			else if(type == Event.COMPLETE)		completeFunction = listener;
			else
				super.addEventListener(type, listener, useCapture, priority, useWeakReference);
		}
		protected function loadDivide():void
		{
			if(loadAskedCount > 2)
			{
				loaded();
				
				return;
			}
			var httpService:BytesHTTPService = new BytesHTTPService(URL.DIVIDE);
			httpService.addEventListener(Event.COMPLETE, handleDivide);
			httpService.send({hakneando: year, hakgi: semester});
		}
		protected function loadLecture():void
		{
			var isDuplicated:Boolean;
			var major:Major;
			var i:int;	var j:int;
			
			//ApplyList를 통해 targetURLList 구성
			targetMajorURLList.removeAll();
			for (i = 0; i < applyCandidateList.length; i++)
				if(applyCandidateList.at(i).getMajor() == null)
					continue;
				else
					targetMajorURLList.addItem( applyCandidateList.at(i).getMajor() );
			
			this.loadLength = targetMajorURLList.length;
			if(targetMajorURLList.length == 0)
			{
				loaded();
				return;
			}
			
			for (i = 0; i < targetMajorURLList.length; i++)
			{
				var httpService:BytesHTTPService = new BytesHTTPService(URL.LECTURE, URLRequestMethod.GET);
				major = targetMajorURLList.at(i);
				
				httpService.addEventListener(Event.COMPLETE, handleLecture);
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
		
		protected function handleDivide(event:Event):void
		{
			var httpService:BytesHTTPService = event.target as BytesHTTPService;
			httpService.removeEventListener(Event.COMPLETE, handleDivide);
			
			var replyData:String = httpService.replyData;
			replyData = StringUtil.between(replyData, "<select name=gwamok", "</select>");
			
			var lectureArray:Array = StringUtil.betweens(replyData, "<option value=\"", "\"");
			var code:String;
			var divide:String;
			
			//applyCandidateList의 divide 입력
			for(var i:int = 0; i < lectureArray.length; i++)
			{
				code = lectureArray[i].substr(0, 7);
				divide = lectureArray[i].substr(-1, 1);
				
				for(var j:int = 0; j < applyCandidateList.length; j++)
					if(code == applyCandidateList.at(j).getCode())
						applyCandidateList.at(j).setDivide(divide);
			}
			loadLecture();
		}
		protected function handleLecture(event:Event):void
		{
			super.handleReply(event);
		}
	}
}