package org.samchon.ui
{
	import spark.components.Group;
	
	public class Group extends spark.components.Group
	{
		public function Group()
		{
			super();
		}
		public function set padding(value:int):void 
		{
			this.setStyle("paddingTop", value);
			this.setStyle("paddingLeft", value);
			this.setStyle("paddingRight", value);
			this.setStyle("paddingBottom", value);
		}
	}
}