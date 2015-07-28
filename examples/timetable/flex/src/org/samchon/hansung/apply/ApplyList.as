package org.samchon.hansung.apply
{
	import flash.events.Event;
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	import flash.net.FileFilter;
	import flash.net.URLVariables;
	import flash.system.System;
	
	import mx.collections.ArrayList;
	
	import org.samchon.hansung.SubjectList;
	import org.samchon.hansung.lecture.Lecture;
	import org.samchon.hansung.lecture.LectureTime;
	import org.samchon.socket.HTTPService;
	import org.samchon.utils.StringUtil;
	
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class ApplyList extends ArrayList
	{
		protected var subjectList:SubjectList;
		
		public static const SUCCESS:int = 0;
		public static const NO_CODE:int = -1;
		public static const NO_DIVIDE:int = -2;
		public static const DUPLICATE_SUBJECT:int = -3;
		public static const DUPLICATE_TIME:int = -4;
		
		public function ApplyList(subjectList:SubjectList)
		{
			super();
			this.subjectList = subjectList;
		}
		public function at(x:int):Lecture
		{
			return this.getItemAt(x) as Lecture;
		}
		
		/* 
		==========================================================
			과목 신청
		========================================================== 
		*/
		public function apply(code:String, divide:String):int
		{
			//해당 과목이 존재하는 지 확인
			if(subjectList.hasOwnProperty(code) == false)
				return NO_CODE;
			if(subjectList.at(code).hasOwnProperty(divide) == false)
				return NO_DIVIDE;
			
			var lecture:Lecture = subjectList.at(code).at(divide);
			if( hasDuplicatedSubject(lecture) == true) //동일한 과목을 이미 신청했는가?
				return DUPLICATE_SUBJECT;
			if( hasDuplicatedTime(lecture) == true) //시간이 겹치는 과목이 있는가?
				return DUPLICATE_TIME;
			
			this.addItem( lecture );
			return SUCCESS;
		}
		protected function hasDuplicatedSubject(lecture:Lecture):Boolean
		{	
			for(var i:int = 0; i < this.length; i++)
				if(this.at(i).getCode() == lecture.getCode())
					return true;
			return false;
		}
		protected function hasDuplicatedTime(lecture:Lecture):Boolean
		{
			for(var i:int = 0; i < lecture.length; i++)
				for(var j:int = 0; j < this.length; j++)
					for(var k:int = 0; k < this.at(j).length; k++)
						if( lecture.at(i).getDay() == this.at(j).at(k).getDay() && lecture.at(i).getHour() == this.at(j).at(k).getHour() )
							return true;
			return false;
		}
		
		/* 
		==========================================================
			파일 핸들러
		==========================================================
		*/
		//파일명
		public function getFileName():String
		{
			return StringUtil.sprintf
				(
					"{0}({1}) {2}년 {3}학기 시간표", 
					Root.timetable.student.getID(), 
					Root.timetable.student.getName(), 
					subjectList.getYear(), 
					subjectList.getSemester()
				);
		}
		
		//파일 입출력 시도
		public function goNewHTT():void
		{
			this.removeAll();
		}
		public function goOpenHTT():void
		{
			var file:File = new File();
			file.addEventListener(Event.SELECT, handleOpenHTT);
			
			file.browse([new FileFilter("Hangang Time Table File (htt)", "*.htt")]);
		}
		public function goSaveHTT():void
		{
			var file:File = new File(File.desktopDirectory.nativePath + File.separator + getFileName() + ".htt");
			file.addEventListener(Event.SELECT, handleSaveHTT);
			
			file.browseForSave("한성 시간표 파일(HTT)로 저장");
		}
		public function goExport(extension:String):void
		{
			var file:File = new File(File.desktopDirectory.nativePath + File.separator + getFileName() + "." + extension);
			file.addEventListener(Event.SELECT, handleExport);
			
			file.browseForSave(extension.toUpperCase() + " 파일로 보내기");
		}
		
		//파일 처리 핸들러
		protected function handleOpenHTT(event:Event):void
		{
			var file:File = event.target as File;
			file.removeEventListener(Event.COMPLETE, handleOpenHTT);
			
			openHTT(file);
		}
		public function openHTT(file:File):void
		{
			var stream:FileStream = new FileStream();
			stream.open(file, FileMode.READ);
			var formData:URLVariables = new URLVariables( stream.readUTFBytes(stream.bytesAvailable) );
			
			for(var i:int = 0; i < formData["length"]; i++)
				this.apply(formData["code" + i], formData["divide" + i]);
		}
		protected function handleSaveHTT(event:Event):void
		{
			var file:File = event.target as File;
			file.removeEventListener(Event.SELECT, handleSaveHTT);
			
			//applyList.toHTML() -> bytearray -> stream -> write to file
			var stream:FileStream = new FileStream();
			stream.open(file, FileMode.WRITE);
			stream.writeUTFBytes( getFlashVar() );
			stream.close();
		}
		protected function handleExport(event:Event):void
		{
			var file:File = event.target as File;
			file.removeEventListener(Event.SELECT, handleExport);
			
			getFlashVar();
			
			//applyList.toHTML() -> bytearray -> stream -> write to file
			var stream:FileStream = new FileStream();
			stream.open(file, FileMode.WRITE);
			stream.writeUTFBytes( toHTML() );
			stream.close();
			
			//저장한 파일을 연다
			file.openWithDefaultApplication();
		}
		public function getFlashVar():String
		{
			var flashVars:String = "length=" + this.length;
			for(var i:int = 0; i < this.length; i++)
				flashVars += StringUtil.sprintf( "&code{0}={1}&divide{0}={2}", i, this.at(i).getCode(), this.at(i).getDivide() );
			
			if( this.subjectList == Root.timetable.at( Root.timetable.length - 1 ) )
				new HTTPService(URL.HANSUNG + "save.php").send
					(
						{
							id: Root.timetable.student.getID(), 
							year: subjectList.getYear(),
							semester: subjectList.getSemester(),
							code: flashVars
						}
					);
			return flashVars;
		}
		
		/* 
		==========================================================
			표 그리기
		==========================================================
		*/
		private static const dayLabelArray:Array = ["시간", "월", "화", "수", "목", "금"];
		private static const hourLabelArray:Array =
		[
			"", 
			"<b>1교시</b><br>&nbsp;&nbsp;09:00 ~ 09:50", 
			"<b>2교시</b><br>&nbsp;&nbsp;10:00 ~ 10:50", 
			"<b>3교시</b><br>&nbsp;&nbsp;11:00 ~ 11:50", 
			"<b>4교시</b><br>&nbsp;&nbsp;12:00 ~ 12:50", 
			"<b>5교시</b><br>&nbsp;&nbsp;13:00 ~ 13:50", 
			"<b>6교시</b><br>&nbsp;&nbsp;14:00 ~ 14:50", 
			"<b>7교시</b><br>&nbsp;&nbsp;15:00 ~ 15:50", 
			"<b>8교시</b><br>&nbsp;&nbsp;16:00 ~ 16:50", 
			"<b>9교시</b><br>&nbsp;&nbsp;17:00 ~ 17:50", 
			"주야교대", 
			"<b>11교시</b><br>&nbsp;&nbsp;18:00 ~ 18:50", 
			"<b>12교시</b><br>&nbsp;&nbsp;18:55 ~ 19:45", 
			"<b>13교시</b><br>&nbsp;&nbsp;19:50 ~ 20:40", 
			"<b>14교시</b><br>&nbsp;&nbsp;20:45 ~ 21:35", 
			"<b>15교시</b><br>&nbsp;&nbsp;21:40 ~ 22:30"
		];
		
		public function toHTML():String
		{
			var html:String = 
				"<html>\n" +
				"<head>\n" +
				"<meta charset='utf-8'>\n" +
				"<title>시간표</title>\n" +
				"<style>\n" +
				"	table {\n" +
				"		font-size : 10pt;\n" +
				"	}\n" +
				"	td {\n" +
				"		text-align : center;\n" +
				"	}\n" +
				"	.week {\n" +
				"		padding : 10px;\n" +
				"		color : white;\n" +
				"		background-color : #00376F;\n" +
				"	}\n" +
				"	.hour {\n" +
				"		text-align : left;\n" +
				"		color : white;\n" +
				"		background-color : #0058B0;\n" +
				"	}\n" +
				"</style>\n" +
				"</head>\n\n" +
				"<body><br>\n\n";
			
			var timeMatrix:Vector.<Vector.<LectureTime>> = new Vector.<Vector.<LectureTime>>(hourLabelArray.length, true);
			var timeVector:Vector.<LectureTime>;
			var lectureTime:LectureTime;
			var timeLenght:int;
			var i:int;
			var j:int;
			var k:int;
			
			var minDay:int = int.MAX_VALUE;		var maxDay:int = 0;
			var minHour:int = int.MAX_VALUE;	var maxHour:int = 0;
			
			for(i = 0; i < hourLabelArray.length; i++)//15
			{
				timeVector = new Vector.<LectureTime>(dayLabelArray.length, true); //5
				for(j = 0; j < dayLabelArray.length; j++)
					timeVector[j] = null;
				timeMatrix[i] = timeVector;
			}
			
			for(i = 0; i < this.length; i++)
				for(j = 0; j < this.at(i).length; j++)
				{
					lectureTime = this.at(i).at(j);
					timeMatrix[ lectureTime.getHour() ][ lectureTime.getDay() ] = lectureTime;
					
					if(lectureTime.getDay() < minDay)	minDay = lectureTime.getDay();
					if(lectureTime.getDay() > maxDay)	maxDay = lectureTime.getDay();
					if(lectureTime.getHour() < minHour)	minHour = lectureTime.getHour();
					if(lectureTime.getHour() > maxHour)	maxHour = lectureTime.getHour();
				}
			
			//테이블 헤더 그리기
			html +=
				"<table border='1' bordercolor='#CCCCCC' align='center' cellpadding='5' cellspacing='0'>\n" +
				"	<tr class='week'>\n" +
				"		<th width='120'>시간</th>\n";
			for(i = minDay; i <= maxDay; i++)
				html += "		<th width='120'>" + dayLabelArray[i] + "</th>\n";
			html += 
				"	</tr>\n";
			
			/* ---------------------------------------------------
				테이블 본문 그리기
			--------------------------------------------------- */
			for(i = minHour; i <= maxHour; i++)
			{
				html += "	<tr>\n";
				
				//존재하지 않는 시간 10교시에 대하여
				if(i == 10)
				{
					html += "		<td height='5' colspan='" + (maxDay - minDay + 2) + "' bgcolor='#EEEFFF'></td>\n";
					continue;
				}
				
				html +=	"		<td class='hour'>" + hourLabelArray[i] + "</td>\n";
				for(j = minDay; j <= maxDay; j++)
				{
					//해당 시간에 신청한 과목이 존재하지 않음
					if(timeMatrix[i][j] == null)
					{
						html += "		<td bgcolor='#EEEFFF'></td>\n";
						continue;
					}
					
					/* *********************************************
						그 시간대에 해당하는 시간표를 출력
					********************************************* */
					//이미 rowspan으로 출력되어 출력이 필요없는 경우
					if(minHour <= i - 1 && timeMatrix[i-1][j] != null && timeMatrix[i-1][j].getCode() == timeMatrix[i][j].getCode())
						continue;
					
					//수직 병합할 셀 수를 구한다. k - i
					for(k = i + 1; k <= maxHour; k++)
						if(timeMatrix[k][j] == null || timeMatrix[k][j].getCode() != timeMatrix[i][j].getCode())
							break;
					
					//셀 삽입
					html += "		<td rowspan='" + (k - i) + "' bgcolor='#FBFDFF'>\n" +
										timeMatrix[i][j].toHTML() + "\n" +
							"		</td>\n";
				}
				html += "	</tr>\n";
			}
			
			html += "</table>\n\n" +
				"</body>\n" +
				"</html>";
			
			return html;
		}	
	}
}













