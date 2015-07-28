package org.samchon.namTree.fileTree.file
{
	import mx.collections.ArrayList;
	
	import org.samchon.fileTree.file.FTFile;
	import org.samchon.fileTree.file.FTFileList;
	import org.samchon.utils.StringUtil;
	
	public class NTFile extends FTFile
	{
		public function get ntFileList():NTFileList	{	return this.fileList as NTFileList;	}
		[Bindable]public var parameterList:NTParameterList;
		
		protected var header:String;
		protected var getFunction:String;
		protected var composerFunction:String;
		protected var returnType:String;
		protected var otherside:int;
		
		//public function NTFile(fileList:FTFileList, fileID:int, parentID:int, name:String, header:String = "", getFunction:String = "", composerFunction:String = "", returnType:String = "Number", otherside:int = Global.NULL)
		//{
		public function NTFile
			(
				fileList:FTFileList, 
				fileID:int, 
				parentID:int, 
				name:String = "", 
				header:String="", 
				getFunction:String="", 
				composerFunction:String="", 
				returnType:String="Number",
				otherside:int = Global.NULL
			)
		{
			super(fileList, fileID, parentID, name, "ntr", "");
			
			this.header = header;
			this.getFunction = getFunction;
			this.composerFunction = composerFunction;
			this.returnType = returnType;
			this.otherside = otherside;
			
			parameterList = new NTParameterList();
		}
		
		public function getHeader():String				{	return this.header;				}
		public function getGetFunction():String			{	return this.getFunction;		}
		public function getComposerFunction():String	{	return this.composerFunction;	}
		public function getReturnType():String			{	return this.returnType;			}
		public function getOtherside():NTFile
		{	
			return fileList.getItemByFID( otherside ) as NTFile;
		}
		
		public function setHeader(val:String):void				{	this.header = val;				}
		public function setGetFunction(val:String):void			{	this.getFunction = val;			}
		public function setComposerFunction(val:String):void	{	this.composerFunction = val;	}
		public function setReturnType(val:String):void			{	this.returnType = val;			}
		public function setOtherside(file:NTFile):void			{	this.otherside = file.fileID;	}
		
		//TO FORM_DATA
		override public function toFormData():Object
		{
			var formData:Object = super.toFormData();
			delete formData["content"];
			
			var i:int; var j:int;
			
			formData.header = this.header;
			formData.getFunction = this.getFunction;
			formData.composerFunction = this.composerFunction;
			formData.returnType = this.returnType;
			if(otherside != Global.NULL)
				formData.otherside = this.otherside;
			
			if(this.parameterList.length > 0)
			{
				var parameter:NTParameter;
				
				var param:String = "";
				var determined:String = "";
				
				for(i = 0; i < parameterList.length; i++)
				{
					//SET PARAMETER'S MEATADATA
					parameter = parameterList.getParamterAt(i);
					param += parameter.toFormData();
					
					for(j = 0; j < parameter.length; j++)
					{
						//SET PARAMETER'S CHILD ITEM FOR COMBO_BOX
						
						determined += parameter.getParameterDeterminedAt(j).toFormData();
						if(j < parameter.length - 1)
							determined += "||";
					}
					
					//TAILER HANDLER
					if(i < parameterList.length - 1)
					{
						param += "\n";
						determined += "\n";
					}
				}
				formData.parameterList = param;
				formData.parameterDeterminedList = determined;
			}
			return formData;
		}
		
		/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			TO AS3
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
		public function toAS3_getFunctionHeader():String
		{
			var script:String = toAS3_composerFunctionHeader();
			script = script.replace("composerFunction", "getFunction");
			
			script = StringUtil.between(script, null, "\n\t)");

			var i:int;
			for(i = 0; i < ntFileList.commonParameterList.length; i++)
				script += ",\n\t\t" + ntFileList.commonParameterList.getParamterAt(i).toHeader();
			
			for(i = 0; i < parameterList.length; i++)
				script += ",\n\t\t" + parameterList.getParamterAt(i).toHeader();
			
			script += "\n\t):" + this.returnType;
			
			return script;
		}
		public function toAS3_composerFunctionHeader():String
		{
			var script:String = "function composerFunction" + this.fileID + "\n\t(\n";
			var i:int;
			
			script += "\t\t" + ntFileList.dataParameterList.getParamterAt(0).toHeader();
			for(i = 1; i < ntFileList.dataParameterList.length; i++)
				script += ",\n\t\t" + ntFileList.dataParameterList.getParamterAt(i).toHeader();
			
			script += "\n\t):void";
			
			return script;
		}
		
		public function toAS3():String
		{
			var script:String = "//FILE" + this.fileID + "\n";
			
			script += this.header + "\n";
			script += toAS3_getFunction() + "\n";
			script += toAS3_composerFunction() + "\n";
			
			return script;
		}
		protected function toAS3_getFunction():String
		{
			//HEAD
			var script:String = toAS3_getFunctionHeader() + "\n{\n";
			
			//BODY
			script += getTabbed( this.getFunction ) + "\n";
		
			//TAIL
			script += "}";
			
			return script;
		}
		protected function toAS3_composerFunction():String
		{
			//HEAD
			var script:String = toAS3_composerFunctionHeader() + "\n{\n";
			
			//BODY
			script += getTabbed( this.composerFunction ) + "\n";
			
			//TAIL
			script += "}";
			
			return script;
		}
		protected function getTabbed(script:String):String
		{
			if(script.indexOf("\n") == -1)
				return "\t" + script;
			
			var lineArray:Array = script.split("\n");
			script = "\t" + lineArray[0];
			for(var i:int = 1; i < lineArray.length; i++)
				script += "\n\t" + lineArray[i];
			
			return script;
		}
	}
}