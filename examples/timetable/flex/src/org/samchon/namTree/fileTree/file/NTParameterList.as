package org.samchon.namTree.fileTree.file
{
	import mx.collections.ArrayList;
	
	public class NTParameterList extends ArrayList
	{
		public function NTParameterList(source:Array=null)
		{
			super(source);
		}
		public function getParamterAt(x:int):NTParameter
		{
			return this.getItemAt(x) as NTParameter;
		}
		public function at(x:int):NTParameter
		{
			return this.getItemAt(x) as NTParameter;
		}
	}
}