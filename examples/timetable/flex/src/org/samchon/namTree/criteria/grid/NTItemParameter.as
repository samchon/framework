package org.samchon.namTree.criteria.grid
{
	import org.samchon.namTree.NTGrid;
	import org.samchon.namTree.fileTree.file.NTParameter;

	public class NTItemParameter
	{
		//MEMBER POINTERS USED GLOBALLY
		protected var criteriaGrid:NTGrid;
		protected var parameterMap:Object;
		
		//THIS OWN MEMBERS
		public var parameter:NTParameter;
		public var name:String;
		public var type:String;
		public var value:String;
		
		public function NTItemParameter(criteriaGrid:NTGrid, parameterMap:Object, parameter:NTParameter)
		{
			this.criteriaGrid = criteriaGrid;
			this.parameterMap = parameterMap;
			
			this.parameter = parameter;
			
			this.name = parameter.name;
			this.type = parameter.type;
			this.value = parameterMap[ parameter.name ];
		}
		public function setValue(value:String):void
		{
			parameterMap[name] = value;
			this.value = value;
			
			criteriaGrid.refresh();
		}
		public function toString():String
		{
			return "NTItemParameter";
		}
	}
}