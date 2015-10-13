package org.samchon.container
{
	import mx.collections.ArrayCollection;
	
	public class ArrayCollection extends mx.collections.ArrayCollection
	{
		public function ArrayCollection(source:Array=null)
		{
			super(source);
		}
		
		override public function refresh():Boolean
		{
			addItem(null);
			removeItemAt(this.length - 1);
			
			return super.refresh();
		}
	}
}