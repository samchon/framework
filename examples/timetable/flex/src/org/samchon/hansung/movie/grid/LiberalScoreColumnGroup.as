package org.samchon.hansung.movie.grid
{
	import mx.controls.advancedDataGridClasses.AdvancedDataGridColumnGroup;
	
	import org.samchon.ui.advDg.AdvDgColumn;
	
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class LiberalScoreColumnGroup extends AdvancedDataGridColumnGroup
	{
		protected static const fieldArray:Array =
			[
				{label: "총점", field: "liberalTotal"},
				{label: "필교", field: "liberalEssential"},
				{label: "핵교A", field: "liberalCoreA"},
				{label: "핵교B", field: "liberalCoreB"},
				{label: "일교", field: "liberalFree"},
				{label: "일선", field: "normalSelection"}
			];
		
		public function LiberalScoreColumnGroup(columnName:String=null)
		{
			super(columnName);
			this.headerText = "교양 / 일선";
			
			//자식 컬럼 결정
			var columnArray:Array = [];
			
			for(var i:int = 0; i < fieldArray.length; i++)
				columnArray.push( new AdvDgColumn(fieldArray[i].label, "@" + fieldArray[i].field) );
			
			this.children = columnArray;
		}
	}
}