package org.samchon.ui
{
	import mx.containers.Form;
	import mx.containers.FormHeading;
	
	public class Form extends mx.containers.Form
	{
		protected var formHeading:FormHeading;
		public function Form()
		{
			super();
			this.setStyle("paddingLeft", 40);
			
			formHeading = new FormHeading();
			formHeading.setStyle("paddingLeft", -40);
			
			this.addElement( formHeading );
		}
		public override function set label(value:String):void {
			formHeading.label = value;
		}
	}
}