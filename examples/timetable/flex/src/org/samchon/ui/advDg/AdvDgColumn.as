package org.samchon.ui.advDg
{
	import mx.controls.advancedDataGridClasses.AdvancedDataGridColumn;
	
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class AdvDgColumn extends mx.controls.advancedDataGridClasses.AdvancedDataGridColumn
	{
		public function AdvDgColumn(headerText:String = "", dataField:String = "", width:int = int.MIN_VALUE)
		{
			super(null);
			
			this.headerText = headerText;
			this.dataField = dataField;
			
			if(width != Global.NULL)
			{
				this.width = width;
				this.minWidth = width;
			}
		}
	}
}