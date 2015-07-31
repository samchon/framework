package samchon.namtree.criteria
{
	import samchon.namtree.file.NTParameterArray;
	import samchon.protocol.entity.EntityArray;
	import samchon.protocol.entity.IEntity;
	
	public class NTSideParameterArray extends EntityArray
	{
		/* ---------------------------------------------------------------------
			TAGS
		--------------------------------------------------------------------- */
		override public function get TAG():String
		{
			return "parameterArray";
		}
		override public function get CHILD_TAG():String
		{
			return "parameter";
		}
		
		/* ---------------------------------------------------------------------
			VARIABLES
		--------------------------------------------------------------------- */
		protected var side:NTSide;
		protected function get parameterArray():NTParameterArray
		{
			return side.getFile().getParameterArray();
		}
		
		/* ---------------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------------- */
		public function NTSideParameterArray(side:NTSide)
		{
			super();
			
			this.side = side;
		}
		override protected function createChild(xml:XML):IEntity
		{
			if(parameterArray.has(xml.@name) == false)
				return null;
			else
				return new NTSideParameter(this); 
		}
		
		/* ---------------------------------------------------------------------
			GETTERS
		--------------------------------------------------------------------- */
		public function getSide():NTSide
		{
			return side;
		}
	}
}