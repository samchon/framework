package org.samchon.namtree.filetree.window.grid
{
	import flash.events.Event;
	
	import mx.controls.TextInput;

	public class NTParameterNameDGEditor extends TextInput
	{
		public function NTParameterNameDGEditor()
		{
			super();
			
			this.restrict = "^\\\\/*?\"'<>|";
		}
	}
}