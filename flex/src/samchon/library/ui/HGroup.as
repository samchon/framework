package samchon.library.ui
{
	import spark.components.HGroup;
	
	public class HGroup 
		extends spark.components.HGroup
		implements IPadding
	{
		public function HGroup()
		{
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