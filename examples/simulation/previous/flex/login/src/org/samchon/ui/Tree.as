package org.samchon.ui
{
	import mx.controls.Tree;
	
	public class Tree extends mx.controls.Tree
	{
		public function Tree()
		{
			super();
		}
		public function expandAll():void
		{
			for (var i:int = 0; i < this.dataProvider.length; i++)
				this.expandChildrenOf(this.dataProvider[i], true);
		}
	}
}