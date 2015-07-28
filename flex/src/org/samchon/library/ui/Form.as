package org.samchon.library.ui
{	
	import spark.components.Form;

	public class Form 
		extends spark.components.Form
		implements IPadding
	{
		public function Form()
		{
			super();
		}
		public function set padding(val:int):void
		{
			this.setStyle("paddingTop", val);
			this.setStyle("paddingLeft", val);
			this.setStyle("paddingRight", val);
			this.setStyle("paddingBottom", val);
		}
	}
}