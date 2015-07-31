package samchon.library.ui
{
	import spark.components.VGroup;
	
	public class VGroup 
		extends spark.components.VGroup
		implements IPadding
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