package org.samchon.hansung.movie
{
	import flash.events.Event;
	import flash.events.ProgressEvent;
	
	import mx.collections.ArrayList;
	import mx.events.FlexEvent;
	import mx.managers.PopUpManager;
	
	import org.samchon.hansung.HistorySubjectList;
	
	import spark.components.ComboBox;
	import spark.events.IndexChangeEvent;
	
	public class HistoryMovie extends TimetableMovie
	{
		protected var semesterComboBox:ComboBox;
		
		protected override function get idx():int	{	return semesterComboBox.selectedIndex;	}
		
		/*
		========================================================================
			구성자
		========================================================================
		*/
		public function HistoryMovie()
		{
			super();
		}
		protected override function creationCompleted(event:FlexEvent):void
		{
			scoreGrid.construct();
			composeUI();
			
			super.creationCompleted(event);
		}
		override protected function goPopUp():void
		{
			//DO NOTHING
		}
		
		/*
		========================================================================
			로드
		========================================================================
		*/
		protected override function load():void
		{
			if( this.idx == -1 )
				return;
			
			progressMovie = PopUpManager.createPopUp(this, ProgressMovie, true) as ProgressMovie;
			PopUpManager.centerPopUp(progressMovie);
			
			subjectList.addEventListener(ProgressEvent.PROGRESS, loadProgressed);
			subjectList.addEventListener(Event.COMPLETE, loadCompleted);
			
			subjectList.load();
		}
		protected override function loadCompleted(event:Event):void
		{
			PopUpManager.removePopUp(progressMovie);
			
			applyGrid.dataProvider = applyList;
			scoreList.source = timetable.scoreList.toXMLList( idx );
			tableHTMLText = applyList.toHTML();
		}
		
		
		/*
		========================================================================
			UI 구성 및 핸들러
		========================================================================
		*/
		protected function composeUI():void
		{
			//상위 클래스(TimetableMovie)에서 불필요한 메뉴(MAIN) 삭제
			menuNavigator.removeElementAt(0);
			this.currentState = "TABLE";
			
			//semsetrList 구성
			var semesterList:ArrayList = new ArrayList();
			for(var i:int = 0; i < Root.timetable.length - 1; i++)
			{
				var year:int = Root.timetable.at(i).getYear();
				var semester:int = Root.timetable.at(i).getSemester();
				
				semesterList.addItem
				(
					{
						label: year + "학년도 " + semester + "학기",
						year: year,
						semester: semester
					}
				);
			}
			
			//semesterComboBox 구성
			semesterComboBox = new ComboBox();
			semesterComboBox.addEventListener(IndexChangeEvent.CHANGE, handleSemesterChanged);
			semesterComboBox.dataProvider = semesterList;
			semesterComboBox.prompt = "학기를 선택하세오.";
			semesterComboBox.selectedIndex = -1;
			
			//왼쪽 Panel의 VGroup 위 아래 제거 후, 윗단에 ComboBox 삽입
			leftVGroup.removeElementAt(2);
			leftVGroup.removeElementAt(0);
			leftVGroup.addElementAt(semesterComboBox, 0);
		}
		protected function handleSemesterChanged(event:IndexChangeEvent):void
		{
			load();
		}
	}
}