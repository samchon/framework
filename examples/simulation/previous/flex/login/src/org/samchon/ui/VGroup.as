package org.samchon.ui
{
	import spark.components.VGroup;
	
	public class VGroup extends spark.components.VGroup
	{
		public function VGroup() {
			super();
		}
		public function set padding(padding:int):void {
			this.paddingTop		= padding;
			this.paddingLeft	= padding;
			this.paddingRight	= padding;
			this.paddingBottom	= padding;
		}
	}
}