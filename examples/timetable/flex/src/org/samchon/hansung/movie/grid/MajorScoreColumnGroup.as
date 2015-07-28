package org.samchon.hansung.movie.grid
{
	import mx.controls.advancedDataGridClasses.AdvancedDataGridColumnGroup;
	
	import org.samchon.hansung.base.SecondMajor;
	import org.samchon.ui.advDg.AdvDgColumn;
	
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class MajorScoreColumnGroup extends AdvancedDataGridColumnGroup
	{
		protected static const fieldArray:Array =
		[
			{label: "총점", field: "total"},
			{label: "전기", field: "essential"},
			{label: "전지", field: "designated"},
			{label: "전선", field: "free"}
		];
		
		public function MajorScoreColumnGroup(x:int)
		{
			super(null);
			
			var secondMajor:SecondMajor = Root.timetable.student.at(x);
			
			//헤더 텍스트 결정
			var headerText:String;
			switch(secondMajor.getType())
			{
				case SecondMajor.MAIN:
					headerText = "주";
					break;
				case SecondMajor.PLURAL:
					headerText = "복수";
					break;
				case SecondMajor.MINOR:
					headerText = "부";
					break;
			}
			headerText += " 전공 (" + secondMajor.getMajor().getName() + ")";
			this.headerText = headerText;
			
			//자식 컬럼 결정
			var columnArray:Array = [];
			for(var i:int = 0; i < fieldArray.length; i++)
				columnArray.push( new AdvDgColumn(fieldArray[i].label, "@" + fieldArray[i].field + x) );
			
			this.children = columnArray;
		}
	}
}