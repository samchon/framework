package org.samchon.fileTree
{
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import mx.collections.ArrayCollection;
	
	import org.samchon.socket.HTTPService;
	import org.samchon.ui.Tree;
	import org.samchon.utils.StringUtil;
	import org.samchon.fileTree.file.FTFolder;
	
	public class FileTree extends Tree
	{
		public function FileTree()
		{
			super();
			
			this.doubleClickEnabled = true;
			this.addEventListener(MouseEvent.DOUBLE_CLICK, handleDoubleClicked);
		}
		public function get selectedFile():FTFolder
		{
			return this.selectedItem as FTFolder;
		}
		
		protected function handleDoubleClicked(event:MouseEvent):void
		{
			var file:FTFolder = this.selectedFile;
			if(file == null || file.getChildren() == null)
				return;
			
			this.expandItem(file, !this.isItemOpen(file), true );
		}
	}
}