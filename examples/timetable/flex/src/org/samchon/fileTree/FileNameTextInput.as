package org.samchon.fileTree
{
	import spark.components.TextInput;
	
	public class FileNameTextInput extends TextInput
	{
		public function FileNameTextInput()
		{
			super();
			this.restrict = "^\\\\/*?\"'<>|";
		}
	}
}