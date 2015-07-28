package org.samchon.fileTree.window
{
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.net.URLRequestMethod;
	
	import mx.controls.Alert;
	import mx.managers.PopUpManager;
	
	import org.samchon.fileTree.FileTreeManager;
	import org.samchon.fileTree.file.FTFileList;
	import org.samchon.fileTree.file.FTFolder;
	import org.samchon.socket.HTTPService;
	import org.samchon.ui.TitleWindow;
	import org.samchon.utils.StringUtil;
	
	public class FTCreationWindow extends TitleWindow
	{
		public var fileList:FTFileList;
		[Bindable]public var parentFile:FTFolder;
		
		protected var completeHandler:Function = null;
		
		protected function get parentID():int		{	return parentFile.getFileID();		}
		protected function get application():int	{	return fileList.getApplication();	}
		protected function get category():int		{	return fileList.getCategory();		}
		
		protected function get createURL():String	{	return URL.FILETREE_CREATE;			}
		
		public function FTCreationWindow()
		{
			super();
		}
		override public function addEventListener(type:String, listener:Function, useCapture:Boolean=false, priority:int=0, useWeakReference:Boolean=false):void
		{
			if(type == Event.COMPLETE)
				completeHandler = listener;
			super.addEventListener(type, listener, useCapture, priority, useWeakReference);
		}
		
		protected function goCreate(event:MouseEvent):void
		{
			var httpService:HTTPService = new HTTPService(this.createURL);
			var file:FTFolder = getFile();
				
			var formData:Object = file.toFormData();
			formData.application = this.application;
			formData.category = this.category;
				
			httpService.addiction = file;
			httpService.addEventListener(Event.COMPLETE, handleCreation);
			httpService.send( formData );
		}
		protected function handleCreation(event:Event):void
		{
			var httpService:HTTPService = event.target as HTTPService;
			httpService.removeEventListener(Event.COMPLETE, handleCreation);
			
			var xml:XML = new XML(httpService.data);
			if(xml.result == 1)
			{
				doCreate(xml.fileID, httpService.addiction as FTFolder);
				if(completeHandler != null)
					completeHandler.apply(null, [null]);
				
				this.close();
			}
			else
				Alert.show( StringUtil.decodeURI(xml.reason), "Creation Error");
		}
		
		//TARGET OF VIRTUALS
		protected function getFile():FTFolder
		{
			return null;
		}
		protected function doCreate(fid:int, file:FTFolder):void
		{
			if(fileList.getItemByFID(fid) != null)
				return;
			
			file.setFileID( fid );
			fileList.addFile( file );
			
			this.close();
		}
	}
}