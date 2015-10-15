package org.samchon.ui.label
{
	import org.samchon.format.Format;
	
	import mx.controls.Label;
	
	public class DataGridCompanyLabel extends Label
	{
		public function DataGridCompanyLabel()
		{
			super();
		}
		public override function set data(item:Object):void {
			super.data = item;
			if(listData == null || item == null)
				return;
			
			var name:String = listData.label;
			if(name == "Average")
				super.htmlText = "<b><u>" + name + "</u></b>";
			else
				super.htmlText = name;
		}
	}
}