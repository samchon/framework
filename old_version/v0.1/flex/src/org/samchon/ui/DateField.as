package org.samchon.ui
{
	import mx.controls.DateField;
	
	public class DateField extends mx.controls.DateField
	{
		public function DateField()
		{
			super();
			this.selectedDate = new Date();
			this.formatString="YYYY-MM-DD";
			this.yearNavigationEnabled = true;
			this.setStyle("textAlign", "right");		
		}
		public function get date():String {
			var _date:Date = this.selectedDate;
			return _date.fullYear + "-" + (_date.month+1) + "-" + _date.date;
		}
		public function set date(str:String):void {
			var array:Array = str.split("-");
			var year:int = int(array[0]);
			var month:int = int(array[1]) - 1;
			var day:int = int(array[2]);
				
			this.selectedDate = new Date(year, month, day);

		}
		public function set addYear(value:int):void {
			var _date:Date = this.selectedDate;
			this.selectedDate = new Date(_date.fullYear + value, _date.month, _date.date);
		}
		public function set addMonth(value:int):void {
			var _date:Date = this.selectedDate;
			this.selectedDate = new Date(_date.fullYear, _date.month + value, _date.date);
		}
		public function set addDate(vaue:int):void {
			var _date:Date = this.selectedDate;
			this.selectedDate = new Date(_date.fullYear, _date.month, _date.date + Number(value));
		}
		public function set diffYear(value:int):void {
			this.addYear = -1 * value;
		}
		public function set diffMonth(value:int):void {
			this.addMonth = -1 * value;
		}
		public function set diffDate(value:int):void {
			this.addDate = -1 * value;
		}
	}
}