package org.samchon.namtree.criteria.grid
{
	import org.samchon.namtree.NTCriteriaGrid;
	import org.samchon.namtree.filetree.file.NTParameter;

	public class NTItemParameter
	{
		//MEMBER POINTERS USED GLOBALLY
		protected var criteriaGrid:NTCriteriaGrid;
		protected var parameterMap:Object;
		
		//THIS OWN MEMBERS
		public var parameter:NTParameter;
		public var name:String;
		public var type:String;
		public var value:String;
		
		public function NTItemParameter(criteriaGrid:NTCriteriaGrid, parameterMap:Object, parameter:NTParameter)
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