package org.samchon.ui.axis
{
	import mx.charts.AxisRenderer;
	import mx.core.ClassFactory;
	
	public class WidthAxisRenderer extends AxisRenderer
	{
		protected static const numberClassFactory:ClassFactory = new ClassFactory(WidthAxisRendererNumber);
		protected static const percentClassFactory:ClassFactory = new ClassFactory(WidthAxisRendererPercent);
		
		protected var _labelFormat:int = 1;
		public static const NUMBER:int = 1;
		public static const PERCENT:int = 2;
		
		public function set labelFormat(value:int):void {
			_labelFormat = value;
			if(value == NUMBER)
				this.labelRenderer = numberClassFactory;
			else
				this.labelRenderer = percentClassFactory;
		}
		public function WidthAxisRenderer()
		{
			super();
			
			//default is NUMBER
			labelFormat = _labelFormat;
		}
	}
}