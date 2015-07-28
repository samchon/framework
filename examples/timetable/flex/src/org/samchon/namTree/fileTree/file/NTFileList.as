package org.samchon.namTree.fileTree.file
{
	import flash.events.Event;
	
	import mx.controls.Alert;
	
	import org.samchon.fileTree.file.FTFileList;
	import org.samchon.socket.HTTPService;
	import org.samchon.utils.StringUtil;
	
	public class NTFileList extends FTFileList
	{
		public var dataParameterList:NTParameterList = new NTParameterList();
		public var commonParameterList:NTParameterList = new NTParameterList();
		
		override protected function get listURL():String	{	return URL.NAMTREE_FILE_LIST;	}
		override protected function get deleteURL():String	{	return URL.NAMTREE_FILE_DELETE;	}
		
		public function NTFileList(application:int, category:int)
		{
			super(application, category);
		}
		override protected function constructFile(xml:XML):void
		{
			if(xml.hasOwnProperty("@header") == true)
			{
				//TARGET VIRTUAL
				var file:NTFile;
				
				var fileID:int = xml.@fileID;
				var parentID:int = xml.@parentID;
				var name:String = StringUtil.decodeURI( xml.@name );
				
				var header:String = StringUtil.decodeURI( xml.@header );
				var getFunction:String = StringUtil.decodeURI( xml.@getFunction );
				var composerFunction:String = StringUtil.decodeURI( xml.@composerFunction );
				var returnType:String = xml.@returnType;
				var otherside:int = (xml.@otherside == "") ? Global.NULL : int(xml.@otherside);
				
				file = new NTFile(this, fileID, parentID, name, header, getFunction, composerFunction, returnType, otherside);
				map.setItemByFID(file, fileID);
				
				if(xml.hasOwnProperty("parameter") == false)
					return;
				
				//SET PARAMETERS
				var parameterList:XMLList = xml.parameter;
				var parameterDeterminedList:XMLList;
				var parameter:NTParameter;
				//var name:String
				var type:String;
				var initialValue:String;
				var label:String;
				var data:String;
				var i:int;
				var j:int;
				
				for(i = 0; i < parameterList.length(); i++)
				{
					name = parameterList[i].@name;
					type = parameterList[i].@type;
					initialValue = parameterList[i].@initialValue;
					
					parameter = new NTParameter(name, type, initialValue);
					file.parameterList.addItem( parameter );
					
					if(parameterList[i].hasOwnProperty("parameterDetermined") == false)
						continue;
					
					//SET PARAMETER_DETERMINEDS
					parameterDeterminedList = parameterList[i].parameterDetermined;
					for(j = 0; j < parameterDeterminedList.length(); j++)
					{
						label = parameterDeterminedList[j].@label;
						data = parameterDeterminedList[j].@data;
						
						parameter.addItem
						( 
							new NTParameterDetermined
							(
								label, 
								data
							)
						);
					}
				}
			}else
				super.constructFile(xml);
		}
		
		
		/* ---------------------------------------------------------------------------
			LOAD
		--------------------------------------------------------------------------- */
		//LOAD
		override public function load():void
		{
			super.load(); //loadFile();
			loadBaseParameter();
		}
		protected function loadBaseParameter():void
		{
			var httpService:HTTPService = new HTTPService(URL.NAMTREE_BASE_PARAMETER_LIST);
			httpService.addEventListener(Event.COMPLETE, baseParameterReply);
			
			httpService.send({application: application, category: category});
		}
		protected function baseParameterReply(event:Event):void
		{
			var httpService:HTTPService = event.target as HTTPService;
			httpService.removeEventListener(Event.COMPLETE, baseParameterReply);
			
			var xml:XML = new XML(httpService.data);
			var xmlList:XMLList;
			var i:int;
			
			if(xml.dataParameterList.hasOwnProperty("parameter") == true)
			{
				xmlList = xml.dataParameterList.parameter;
				for(i = 0; i < xmlList.length(); i++)
					dataParameterList.addItem( new NTParameter( xmlList[i].@name, xmlList[i].@type ) );
			}
			if(xml.commonParameterList.hasOwnProperty("parameter") == true)
			{
				xmlList = xml.commonParameterList.parameter;
				for(i = 0; i < xmlList.length(); i++)
					commonParameterList.addItem( new NTParameter( xmlList[i].@name, xmlList[i].@type, xmlList.@initialValue ) );
			}
		}
	}
}