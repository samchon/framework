package org.samchon.namtree.filetree.window.explorer
{
	import org.samchon.fileTree.window.explorer.ExplorerOpenWindow;
	import org.samchon.namtree.filetree.file.NTFileList;
	
	public class NTExplorerOpenWindow extends ExplorerOpenWindow
	{
		public var openType:int;
		
		public function NTExplorerOpenWindow()
		{
			super();
		}
		override protected function constructXML(xml:XML):void
		{
			parentObject.constructXML(xml, openType);
		}
	}
}