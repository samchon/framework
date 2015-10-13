package org.samchon.fileTree.file
{
	public dynamic class FTFileMap extends Object
	{
		public function FTFileMap()
		{
			super();
		}
		public function composeTree():void
		{
			for(var targetFID:String in this)
				for(var candidateFID:String in this)
					if( this[targetFID].getParentID() == this[candidateFID].getFileID() )
						this[candidateFID].addItem( this[targetFID] );
		}
		
		public function setItemByFID(file:FTFolder, fileID:int):void
		{
			this[ String(fileID) ] = file;
		}
		public function getItemByFID(fileID:int):FTFolder
		{
			var key:String = String(fileID);
			
			if(this.hasOwnProperty(key) == true)
				return this[key] as FTFolder;
			else
				return null;
		}
		public function removeItemByFID(fileID:int):Array
		{	
			var item:FTFolder = this.getItemByFID(fileID);
			var fidArray:Array = [fileID];
			
			//REMOVE CHILDS FROM MAP
			for(var i:int = 0; i < item.length; i++)
				fidArray = fidArray.concat( removeItemByFID(item.getFileAt(i).getFileID()) );
			
			//REMOVE FROM PARENT
			if(item.getParent() != null)
				item.getParent().removeItem(item);
			
			//REMOVE ITSELF FROM MAP;
			delete this[String(fileID)];
			return fidArray;
		}
	}
}