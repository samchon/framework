package org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree.file
{
	import org.samchon.namtree.filetree.file.NTFileList;
	import org.samchon.namtree.filetree.file.NTParameter;
	import org.samchon.namtree.filetree.file.NTParameterDetermined;
	import org.samchon.utils.StringUtil;
	
	public class BTFileList extends NTFileList
	{
		override protected function get listURL():String	{	return URL.BACKTESTING_FILE_LIST;	}
		override protected function get deleteURL():String	{	return URL.BACKTESTING_FILE_DELETE;	}
		
		public function BTFileList(application:int, category:int)
		{
			super(application, category);
		}
		
		override protected function constructFile(xml:XML):void
		{
			if(xml.hasOwnProperty("@header") == true)
			{
				//TARGET VIRTUAL
				var file:BTFile;
				
				var fileID:int = xml.@fileID;
				var parentID:int = xml.@parentID;
				var name:String = StringUtil.decodeURI( xml.@name );
				
				var header:String = StringUtil.decodeURI( xml.@header );
				var getFunction:String = StringUtil.decodeURI( xml.@getFunction );
				var composerFunction:String = StringUtil.decodeURI( xml.@composerFunction );
				var returnType:String = xml.@returnType;
				var otherside:int = (xml.@otherside == "") ? Global.NULL : int(xml.@otherside);
				
				var buyingMinimum:Number = Global.NULL;
				var buyingMaximum:Number = Global.NULL;
				var sellingMinimum:Number = Global.NULL;
				var sellingMaximum:Number = Global.NULL;
				var accuracy:int = Global.NULL;
				
				//EXPLORATORY VARIABLES
				if( xml.@buyingMinimum != "" )
				{
					buyingMinimum = xml.@buyingMinimum;
					buyingMaximum = xml.@buyingMaximum;
					sellingMinimum = xml.@sellingMinimum;
					sellingMaximum = xml.@sellingMaximum;
					accuracy = xml.@accuracy;
				}
				
				file =
					new BTFile
					(
						this, fileID, parentID, name, header, getFunction, composerFunction, returnType, otherside, 
						buyingMinimum, buyingMaximum, sellingMinimum, sellingMaximum, accuracy
					);
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