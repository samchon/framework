package org.samchon.fileTree.file
{
	import flash.events.Event;
	
	import mx.collections.ArrayCollection;
	import mx.controls.Alert;
	
	import org.samchon.socket.HTTPService;
	import org.samchon.utils.StringUtil;
	
	public class FTFileList extends ArrayCollection
	{
		protected var completeHandler:Function = null;
		protected var map:FTFileMap = new FTFileMap();
		
		protected var application:int;
		protected var category:int;
		
		/* --------------------------------------------------------------
			CONSTRUCTOR AND COMPLETE LISTENER
		-------------------------------------------------------------- */
		public function FTFileList(application:int, category:int)
		{
			super();
			
			this.application = application;
			this.category = category;
		}
		protected function constructFile(xml:XML):void
		{
			//TARGET VIRTUAL
			var file:FTFolder;
			var fileID:int = xml.@fileID;
			var parentID:int = (xml.@parentID != "") ? xml.@parentID : Global.NULL;
			var name:String = StringUtil.decodeURI( xml.@name );
			var extension:String = (xml.hasOwnProperty("@extension") == true) ? xml.@extension : null;
			var content:String = (xml.hasOwnProperty("@extension") == true) ? StringUtil.decodeURI( xml.@content ) : null;
			var comment:String = (xml.hasOwnProperty("@extension") == true) ? StringUtil.decodeURI( xml.@comment ) : null;
			
			if(extension == null)
				file = new FTFolder(this, fileID, parentID, name);
			else
				file = new FTFile(this, fileID, parentID, name, extension, content, comment);
			map.setItemByFID(file, file.getFileID());
		}
		override public function addEventListener(type:String, listener:Function, useCapture:Boolean=false, priority:int=0, useWeakReference:Boolean=false):void
		{
			if(type == Event.COMPLETE)
				completeHandler = listener;
			else
				super.addEventListener(type, listener, useCapture, priority, useWeakReference);
		}
		
		/* --------------------------------------------------------------
			LOAD LIST AND DELETE
		-------------------------------------------------------------- */
		protected function get listURL():String		{	return URL.FILETREE_LIST;	}
		protected function get deleteURL():String	{	return URL.FILETREE_DELETE;	}	
		
		public function load():void
		{
			loadFile();
		}
		protected function loadFile():void
		{
			var httpService:HTTPService = new HTTPService(this.listURL);
			httpService.addEventListener(Event.COMPLETE, fileReply);
			httpService.send( {application: this.application, category: this.category} );
		}
		protected function fileReply(event:Event):void
		{
			var httpService:HTTPService = event.target as HTTPService;
			httpService.removeEventListener(Event.COMPLETE, fileReply);
			
			var xmlList:XMLList = new XML(httpService.data).file;
			var uid:int;
			var parentID:int;
			var name:String;
			var extension:String;
			var content:String;
			
			for(var i:int = 0; i < xmlList.length(); i++)
				constructFile( xmlList[i] );
			
			map.composeTree();
			this.addItem( map.getItemByFID(-1) );
			this.addItem( map.getItemByFID(0) );
			
			if( completeHandler != null )
				completeHandler.apply(null, [null]);
		}
		
		
		/* ---------------------------------------------------------
			INTERACTION WITH MAP
		--------------------------------------------------------- */
		public function getItemByFID(fileID:int):FTFolder
		{
			if(map.hasOwnProperty( String(fileID) ) == false)
				return null;
			else
				return map.getItemByFID(fileID);
		}
		public function removeItemByFID(fileID:int):void
		{
			var deletedItems:Array = map.removeItemByFID(fileID);
			
			var httpService:HTTPService = new HTTPService(this.deleteURL);
			httpService.send( {application:this.application, fidList: deletedItems.toString()} );
		}
		public function addFile(file:FTFolder):void
		{
			map.setItemByFID(file, file.getFileID());
			
			if( map.hasOwnProperty( String(file.getParentID()) ) == true )
				this.getItemByFID(file.getParentID()).addItem( file );
		}
		
		/* ---------------------------------------------------------
			INTERACTION WITH FILE CREATION
		--------------------------------------------------------- */
		public function getApplication():int
		{
			return this.application;
		}
		public function getCategory():int	
		{
			return this.category;
		}
	}
}



