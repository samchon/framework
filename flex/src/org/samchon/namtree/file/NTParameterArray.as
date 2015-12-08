package org.samchon.namtree.file
{
	import org.samchon.protocol.entity.EntityArray;
	import org.samchon.protocol.entity.IEntity;
	
	public class NTParameterArray extends EntityArray
	{
		public function NTParameterArray()
		{
			super();
		}
		override protected function createChild(xml:XML):IEntity
		{
			return new NTParameter();
		}
		
		public function at(index:int):NTParameter
		{
			return super._at(index) as NTParameter;
		}
		public function get(key:*):NTParameter
		{
			return super._get(key) as NTParameter;
		}
	}
}