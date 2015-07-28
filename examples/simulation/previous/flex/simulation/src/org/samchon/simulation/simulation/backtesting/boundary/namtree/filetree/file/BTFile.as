package org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree.file
{
	import org.samchon.fileTree.file.FTFileList;
	import org.samchon.namtree.filetree.file.NTFile;
	
	public class BTFile extends NTFile
	{
		protected var buyingMinimum:Number;
		protected var buyingMaximum:Number;
		protected var sellingMinimum:Number;
		protected var sellingMaximum:Number;
		protected var accuracy:int;
		
		public function BTFile
			(	fileList:FTFileList, 
				fileID:int, 
				parentID:int, 
				name:String="", 
				header:String="", 
				getFunction:String="", 
				composerFunction:String="", 
				returnType:String = "Number", 
				otherside:int = Global.NULL,
				buyingMinimum:Number = Global.NULL,
				buyingMaximum:Number = Global.NULL,
				sellingMinimum:Number = Global.NULL,
				sellingMaximum:Number = Global.NULL,
				accuracy:int = Global.NULL
			)
		{
			super(fileList, fileID, parentID, name, header, getFunction, composerFunction, returnType, otherside);
			
			this.buyingMinimum = buyingMinimum;
			this.buyingMaximum = buyingMaximum;
			this.sellingMinimum = sellingMinimum;
			this.sellingMaximum = sellingMaximum;
			this.accuracy = accuracy;
		}
		public function setExplore(bMin:Number, bMax:Number, sMin:Number, sMax:Number, accuracy:int):void
		{
			this.buyingMinimum = bMin;
			this.buyingMaximum = bMax;
			this.sellingMinimum = sMin;
			this.sellingMaximum = sMax;
			this.accuracy = accuracy;
		}
		
		public function getBuyingMinimum():Number	{	return this.buyingMinimum;	}
		public function getBuyingMaximum():Number	{	return this.buyingMaximum;	}
		public function getSellingMinimum():Number	{	return this.sellingMinimum;	}
		public function getSellingMaximum():Number	{	return this.sellingMaximum;	}
		public function getAccuracy():int			{	return this.accuracy;		}
		
		public function getMinimum(direction:int):Number	{	return (direction == 1) ? buyingMinimum : sellingMinimum;	}
		public function getMaximum(direction:int):Number	{	return (direction == 1) ? buyingMaximum : sellingMaximum;	}
		
		override public function toFormData():Object
		{
			var formData:Object = super.toFormData();
			
			if(buyingMinimum != Global.NULL)
			{
				formData.buyingMinimum = buyingMinimum;
				formData.buyingMaximum = buyingMaximum;
				formData.sellingMinimum = sellingMinimum;
				formData.sellingMaximum = sellingMaximum;
				formData.accuracy = accuracy;
			}
			return formData;
		}
		override public function toString():String
		{
			return "BTFile";
		}
	}
}