package org.samchon.namtree.filetree.file
{
	public class NTParameterDetermined
	{
		public var label:String;
		public var data:String;
		
		public function NTParameterDetermined(label:String, data:String)
		{
			this.label = label;
			this.data = data;
		}
		public function toFormData():String
		{
			return this.label + ":" + this.data;
		}
	}
}