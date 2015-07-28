package org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree.window
{
	import mx.events.FlexEvent;
	
	import org.samchon.fileTree.file.FTFolder;
	import org.samchon.namtree.filetree.window.NTFileCreationWindow;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree.file.BTFile;
	
	public class BTFileCreationWindow extends NTFileCreationWindow
	{
		override protected function get createURL():String	{	return URL.BACKTESTING_FILE_CREATE;	}
		protected function get btFile():BTFile	{	return this.file as BTFile;	}
		
		protected var exploratoryMovie:BTFileCreationMovie;
		
		public function BTFileCreationWindow()
		{
			super();
		}
		override protected function creationCompleted(event:FlexEvent):void
		{
			super.creationCompleted(event);
			
			exploratoryMovie = new BTFileCreationMovie();
			hGroup.addElement( exploratoryMovie );
			
			if(parentFile is BTFile)
			{
				if( btFile.getBuyingMinimum() == Global.NULL )
					return;
				
				exploratoryMovie.checkBox.selected = true;
				
				exploratoryMovie.buyingMinimumTI.text = btFile.getBuyingMinimum().toString();
				exploratoryMovie.buyingMaximumTI.text = btFile.getBuyingMaximum().toString();
				exploratoryMovie.sellingMinimumTI.text = btFile.getSellingMinimum().toString();
				exploratoryMovie.sellingMaximumTI.text = btFile.getSellingMaximum().toString();
				exploratoryMovie.accuracyStepper.value = btFile.getAccuracy();
			}
			else
				file = new BTFile(fileList, Global.NULL, parentFile.getFileID(), "");
		}
		
		override protected function getFile():FTFolder
		{
			super.getFile();
			
			var bMin:Number = Global.NULL;
			var bMax:Number = Global.NULL;
			var sMin:Number = Global.NULL;
			var sMax:Number = Global.NULL;
			var accuracy:int = Global.NULL;
			
			if( exploratoryMovie.checkBox.selected == true )
			{
				bMin = Number( exploratoryMovie.buyingMinimumTI.text );
				bMax = Number( exploratoryMovie.buyingMaximumTI.text );
				sMin = Number( exploratoryMovie.sellingMinimumTI.text );
				sMax = Number( exploratoryMovie.sellingMaximumTI.text );
				accuracy = exploratoryMovie.accuracyStepper.value;
			}
			btFile.setExplore(bMin, bMax, sMin, sMax, accuracy);	
			
			return file;
		}
	}
}