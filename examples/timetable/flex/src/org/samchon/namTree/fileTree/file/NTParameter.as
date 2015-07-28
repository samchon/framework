package org.samchon.namTree.fileTree.file
{
	import mx.collections.ArrayList;

	public class NTParameter extends ArrayList
	{
		public static const typeParameterList:ArrayList = 
			new ArrayList
			(
				[
					{label: "Number", data:"Number"},
					{label: "int", data:"int"},
					{label: "String", data:"String"}
				]
			);
		
		public var name:String;
		public var type:String;
		public var initialValue:String;
		
		public function NTParameter(name:String, type:String, initialValue:String = null)
		{
			super();
			
			this.name = name;
			this.type = type;
			this.initialValue = initialValue;
		}
		public function getParameterDeterminedAt(x:int):NTParameterDetermined
		{
			return this.getItemAt(x) as NTParameterDetermined;
		}
		
		public function toHeader():String
		{
			return this.name + ":" + this.type;
		}
		public function toFormData():String
		{
			return this.name + ":" + this.type + ":" + this.initialValue;
		}
	}
}