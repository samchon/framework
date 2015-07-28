package org.samchon.ui.series
{
	import mx.charts.series.LineSeries;
	import mx.graphics.SolidColorStroke;
	
	import org.samchon.utils.Color;
	
	public class MASeries extends LineSeries {
		
		protected static const colorArray:Array = 
		[
			Color.GREEN, Color.RED, Color.BLUE, Color.PURPLE
		];
		
		public function MASeries(day:int) {
			super();
			
			var i:int;
			
			if(day == 5)		i = 0;
			else if(day == 20)	i = 1;
			else if(day == 60)	i = 2;
			else if(day == 120)	i = 3;
			
			this.xField = "date";
			this.yField = "ma" + day;
			this.setStyle( "lineStroke", new SolidColorStroke(colorArray[i], 1, .5) );
		}
	}
}