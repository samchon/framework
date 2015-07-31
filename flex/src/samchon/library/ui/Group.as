package samchon.library.ui
{
	import samchon.library.ui.IPadding;
	
	import spark.components.Group;
	
	public class Group 
		extends spark.components.Group
		implements IPadding
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