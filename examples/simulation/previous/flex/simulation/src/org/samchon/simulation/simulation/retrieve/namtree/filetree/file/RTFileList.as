package org.samchon.simulation.simulation.retrieve.namtree.filetree.file
{
	import mx.controls.Alert;
	
	import org.samchon.namtree.filetree.file.*;
	import org.samchon.utils.StringUtil;
	
	public class RTFileList extends NTFileList
	{
		override protected function get listURL():String	{	return URL.RETRIEVE_TREE_LIST;		}
		override protected function get deleteURL():String	{	return URL.RETRIEVE_TREE_DELETE;	}
		
		public function RTFileList(application:int, category:int)
		{
			super(application, category);
		}
		override protected function constructFile(xml:XML):void
		{
			if(xml.hasOwnProperty("@header") == true)
			{
				//TARGET VIRTUAL
				var file:RTFile;
				
				var fileID:int = xml.@fileID;
				var parentID:int = xml.@parentID;
				var name:String = StringUtil.decodeURI( xml.@name );
				
				var priceLength:int = xml.@priceLength;
				var indexLength:int = xml.@indexLength;
				
				var header:String = StringUtil.decodeURI( xml.@header );
				var getFunction:String = StringUtil.decodeURI( xml.@getFunction );
				var composerFunction:String = StringUtil.decodeURI( xml.@composerFunction );
				var returnType:String = xml.@returnType;
				var otherside:int = (xml.@otherside == "") ? Global.NULL : int(xml.@otherside);
				
				file = new RTFile(this, fileID, parentID, name, priceLength, indexLength, header, getFunction, composerFunction, returnType, otherside);
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
	}
}