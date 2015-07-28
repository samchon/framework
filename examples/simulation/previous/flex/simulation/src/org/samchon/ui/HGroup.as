package org.samchon.ui
{
	import spark.components.HGroup;
	
	public class HGroup extends spark.components.HGroup
	{
		public function HGroup()
		{
			super();
			this.verticalAlign = "middle";
		}
		public function set padding(padding:int):void {
			this.paddingTop		= padding;
			this.paddingLeft	= padding;
			this.paddingRight	= padding;
			this.paddingBottom	= padding;
		}
	}
}