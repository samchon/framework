package org.samchon.namTree.criteria
{
	import mx.controls.Alert;
	
	import org.samchon.fileTree.file.FTFileList;
	import org.samchon.namTree.criteria.data.NTAggregation;
	import org.samchon.namTree.fileTree.file.NTFile;
	import org.samchon.namTree.fileTree.file.NTFileList;
	import org.samchon.namTree.fileTree.file.NTParameter;
	import org.samchon.namTree.fileTree.file.NTParameterList;
	import org.samchon.namTree.iterator.NTIterator;
	import org.samchon.utils.StringUtil;

	public class NTItem
	{
		//members
		protected function get fileList():NTFileList
		{
			return file.fileList as NTFileList;
		}
		protected function get dataParameterList():NTParameterList
		{
			return fileList.dataParameterList;
		}
		
		//SEQUENCE
		protected static var sequence:int = 1;
		
		protected var pieceID:int;	//KEY
		protected var aggregation:int;
		protected var file:NTFile;
		protected var type:String;
		protected var value:String;
		protected var parameterMap:Object;
		
		public function NTItem(aggregation:int = 0, file:NTFile = null, type:String = null, value:String = null, parameterMap:Object = null)
		{
			//KEY
			this.aggregation = aggregation;
			this.pieceID = sequence++;
			
			this.file = file;
			this.type = type;
			this.value = value;
			this.parameterMap = parameterMap;
			
			//NOTHING TO DO IN CONSTRUCTOR IF IT IS NOT LOADED, BUT CREATED
		}
		public function constructXML(xml:XML, fileList:NTFileList):void
		{
			parameterMap = new Object();
			file = null;
			type = value = null;
			
			if(xml.hasOwnProperty("@file") == true)
			{//IS FILE
				this.aggregation = xml.@aggregation;
				this.file = fileList.getItemByFID( xml.@file ) as NTFile;
			}
			else
			{//IS NOT FILE
				this.type = xml.@type;
				this.value = xml.@value;
			}
			//SETTING PARAMETERS
			if( xml.parameterList.hasOwnProperty("parameter") == true )
			{
				var xmlList:XMLList = xml.parameterList.parameter;
				for(var i:int = 0; i < xmlList.length(); i++)
					parameterMap[ xmlList[i].@key ] = xmlList[i].@value;
			}
		}
		
		//SETTER, GETTER
		public function setAggregation(val:int):void
		{
			this.aggregation = val;
		}
		public function setType(type:String):void
		{
			this.type = type;
		}
		public function setFile(file:NTFile):void
		{
			this.file = file;
			if(file == null)
				return;
			
			this.type = this.value = null;
			
			//SET PARAMETERS TO DEFAULT
			parameterMap = new Object();
			setParameterMap( fileList.commonParameterList );
			setParameterMap( file.parameterList );
			
			function setParameterMap(parameterList:NTParameterList):void
			{
				var parameter:NTParameter;
				for(var i:int; i < parameterList.length; i++)
				{
					parameter = parameterList.getParamterAt(i);
					
					parameterMap[ parameter.name ] = parameter.initialValue;
				}
			}
		}
		public function setValue(value:String):void
		{
			file = null;
			this.value = value;
		}
		
		public function getAggregation():int
		{
			return this.aggregation;
		}
		public function getType():String
		{
			return this.type;
		}
		public function getFile():NTFile
		{	
			return this.file;	
		}
		public function getValue():String
		{
			return this.value;
		}
		public function getParameterMap():Object
		{
			return this.parameterMap;
		}

		//TO GRID
		public function get $aggregation():String
		{
			return NTAggregation.aggregationList.getItemAt(aggregation).label;
		}
		public function get $type():String		{	return (file == null) ? type : "File";			}
		public function get $data():String		{	return (file == null) ? value : file.getName();	}
		public function get $option():String
		{
			if(file == null)
				return "";
			
			var args:Vector.<String> = new Vector.<String>();
			var i:int;
			
			for(i = 0; i < fileList.commonParameterList.length; i++)
				args.push( parameterMap[ fileList.commonParameterList.getParamterAt(i).name ] );
			for(i = 0; i < file.parameterList.length; i++)
				args.push( parameterMap[ file.parameterList.getParamterAt(i).name ] );
			
			return args.toString();
		}
		
		//TO AS3
		public function toAS3():String
		{
			function toAS3_parameter(parameterList:NTParameterList):String
			{
				var parameter:NTParameter;
				var script:String = "";
				
				for(var i:int = 0; i < parameterList.length; i++)
				{
					parameter = parameterList.getParamterAt(i);
					script += ", ";
					if(parameter.type == "String")
						script += "'" + parameterMap[ parameter.name ] + "'";
					else
						script += parameterMap[ parameter.name ];
				}
				return script;
			}
			
			//left:*, leftFunction:Function, leftParam:Array
			var val:String;
			var procedure:String;
			var param:String;
			
			var script:String;
			
			if(file == null)
			{
				if(type == "String")
					val = "'" + this.value + "'";
				else
					val = this.value;
				procedure = "null";
				param = "null";
			}
			else
			{
				val = "null";
				procedure = "getFunction" + file.getFileID();
				
				param = "[" + dataParameterList.getParamterAt(0).name;
				for(var i:int = 1; i < dataParameterList.length; i++)
					param += ", " + dataParameterList.getParamterAt(i).name;
				param += toAS3_parameter(fileList.commonParameterList);
				param += toAS3_parameter(file.parameterList) + "]";
			}
			return (this.pieceID + ", " + this.aggregation + ", " +  val + ", " + procedure + ", " + param);
		}
		
		//TO XML
		public function toXML(level:int = 0):String
		{
			var tab:String = getTabbed(level + 1);
			var xml:String = tab + "<item ";
			
			//BODY
			if(this.file == null)
				xml += StringUtil.sprintf("type='{0}' value='{1}'", this.type, this.value);
			else
				xml += StringUtil.sprintf("aggregation='{0}' file='{1}'", this.aggregation, file.getFileID());
			xml += ">\n";
			
			//PARAMETER_LIST
			xml += tab + "\t<parameterList>\n";
			for( var key:String in parameterMap)
				xml += tab + StringUtil.sprintf("\t\t<parameter key='{0}' value='{1}' />\n", key, parameterMap[key]);
			xml += tab + "\t</parameterList>\n";
			
			//TAIL
			xml += tab + "</item>";
			return xml;
		}
		protected function getTabbed(length:int):String
		{
			var tab:String = "";
			for(var i:int = 0; i < length; i++)
				tab += "\t";
			
			return tab;
		}
	
		//FROM GET_RETRIVED
		protected var average:Number;
		protected var minimum:Number;
		protected var maximum:Number;
		protected var rankArray:Array;
		
		public function initRetrieve():void
		{
			average = Global.NULL;
			minimum = Global.NULL;
			maximum = Global.NULL;
			
			rankArray = null;
		}
		public function getRetrieved(args:Array):*
		{
			if(file == null)
				if(type == "int")
					return int(value);
				else if(type == "Number")
					return Number(value);
				else
					return value;
			
			var fileID:int = file.getFileID();
			var compiled:Object = Compiler.getCompiled();
			
			var getFunction:Function = compiled["getFunction" + fileID];
			var composerFunction:Function = compiled["composerFunction" + fileID];
			
			//구성 함수 호출
			composerFunction.apply(null, args);
			
			//인수 구성
			var param:Array = [];
			for(var i:int = 0; i < args.length; i++)
				param.push( args[i] );
			addParam(fileList.commonParameterList);
			addParam(file.parameterList);
			
			
			//함수에 적용
			if(aggregation == NTAggregation.ATOMIC)
				return getFunction.apply(null, param);
			
			//집합연산일 時,
			else
				return getGroupped(composerFunction, getFunction, param);
			
			function addParam(paramList:NTParameterList):void
			{
				var parameter:NTParameter;
				var value:String;
				
				for(var i:int = 0; i < paramList.length; i++)
				{
					parameter = paramList.at(i);
					if(parameterMap.hasOwnProperty(parameter.name) == false)
					{
						if(parameter.type == "String")
							param.push( null );
						else
							param.push( Global.NULL );
					}
					else
					{
						value = parameterMap[parameter.name];
						
						if(parameter.type == "int")
							param.push( int( value ) );
						else if(parameter.type == "Number")
							param.push( Number( value ) );
						else if(parameter.type == "String")
							param.push( value );
					}
				}
			}
		}
		protected function getGroupped(composer:Function, getter:Function, args:Array):Number
		{
			if(this.type == "String")
				return Global.NULL;
			
			var iterator:NTIterator = new NTIterator(fileList.dataParameterList.length - 1);
			var itFlag:Boolean;
			var param:Array = [];
			var value:Number;
			var i:int;
			
			//COPY ARGS TO PARAM
			for(i = 0; i < args.length; i++)
				param.push( args[i] );
			
			
			//평균
			if(aggregation == NTAggregation.AVERAGE)
			{
				if(average != Global.NULL)
					return average;
				
				value = 0.0;
				var length:int = 0;
				
				for(itFlag = iterator.begin(param); itFlag == true; itFlag = iterator.toNext(param))
				{
					composer.apply(null, param);
					value += getter.apply(null, param);
					length++;
				}
				average = value / Number(length);
				return average;
			}
				
				//랭크
			else if(aggregation == NTAggregation.RANK)
			{
				//랭크 배열 구성(내림차순)
				if(rankArray == null)
				{
					rankArray = new Array();
					
					for(itFlag = iterator.begin(param); itFlag == true; itFlag = iterator.toNext(param))
					{
						composer.apply(null, param);
						rankArray.push( getter.apply(null, param) );
					}
					rankArray = rankArray.sort(Array.NUMERIC|Array.DESCENDING);
				}
				
				//순위 추출
				composer.apply(null, args);
				value = getter.apply(null, args);
				
				for(i = 0; i < rankArray.length; i++)
					if(value == rankArray[i])
						return i + 1;
			}
				
				//최저
			else if(aggregation == NTAggregation.MINIMUM)
			{
				if(minimum == Global.NULL)
				{
					minimum = Number.MAX_VALUE;
					for(itFlag = iterator.begin(param); itFlag == true; itFlag = iterator.toNext(param))
					{
						value = getter.apply(null, param);
						if(value == Global.NULL)
							continue;
						
						if(value < minimum)
							minimum = value;
					}
				}
				return minimum;
			}
				
				//최대
			else if(aggregation == NTAggregation.MAXIMUM)
			{
				if(maximum == Global.NULL)
				{
					maximum = Number.MIN_VALUE;
					for(itFlag = iterator.begin(param); itFlag == true; itFlag = iterator.toNext(param))
					{
						value = getter.apply(null, param);
						if(value == Global.NULL)
							continue;
						
						if(value > maximum)
							maximum = value;
					}
				}
				return maximum;
			}
			
			return Global.NULL;
		}
	}
}