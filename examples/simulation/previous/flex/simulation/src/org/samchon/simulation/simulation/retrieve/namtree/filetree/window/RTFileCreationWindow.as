package org.samchon.simulation.simulation.retrieve.namtree.filetree.window
{
	import mx.events.CollectionEvent;
	import mx.events.FlexEvent;
	
	import org.samchon.fileTree.file.FTFolder;
	import org.samchon.namtree.filetree.window.NTFileCreationWindow;
	import org.samchon.simulation.simulation.retrieve.namtree.filetree.file.RTFile;
	import org.samchon.ui.NumberInput;
	
	import spark.components.HGroup;
	import spark.components.Label;
	
	public class RTFileCreationWindow extends NTFileCreationWindow
	{
		protected var priceLengthText:NumberInput = new NumberInput("int");
		protected var indexLengthText:NumberInput = new NumberInput("int");
		
		protected function get rtFile():RTFile				{	return this.file as RTFile;			}
		protected override function get createURL():String	{	return URL.RETRIEVE_TREE_CREATE;	}
		
		public function RTFileCreationWindow()
		{
			super();
		}
		override protected function creationCompleted(event:FlexEvent):void
		{
			super.creationCompleted(event);
			
			if(parentFile is RTFile)
			{
				priceLengthText.text = String( rtFile.priceLength );
				indexLengthText.text = String( rtFile.indexLength );
			}
			else
			{
				//CHANGE NT_FILE TO RT_FILE
				file = new RTFile(fileList, Global.NULL, parentFile.getFileID());
				file.parameterList.addEventListener(CollectionEvent.COLLECTION_CHANGE, parameterListChanged);
				
				priceLengthText.text = "0";
				indexLengthText.text = "0";
			}
			addHGroup("#Financial Index: ", indexLengthText);
			addHGroup("#Daily Price: ", priceLengthText);
			
			function addHGroup(name:String, numberInput:NumberInput):void
			{
				var hGroup:HGroup = new HGroup();
				hGroup.horizontalAlign = "middle";
				
				var label:Label = new Label();
				label.text = name;
				label.width = LABEL_WIDTH;
				label.setStyle("fontWeight", "bold");
				
				hGroup.addElement(label);
				hGroup.addElement(numberInput);
				
				vGroup.addElementAt( hGroup, 2 );
			}
		}
		override protected function getFile():FTFolder
		{
			super.getFile();
			rtFile.priceLength = int( priceLengthText.text );
			rtFile.indexLength = int( indexLengthText.text );
			
			return file;
		}
	}
}