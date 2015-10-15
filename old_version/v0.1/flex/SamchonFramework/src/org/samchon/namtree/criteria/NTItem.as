package org.samchon.namtree.criteria
{
	//import flash.concurrent.Mutex;
	
	import mx.controls.Alert;
	
	import org.samchon.fileTree.file.FTFileList;
	import org.samchon.namtree.criteria.data.NTAggregation;
	import org.samchon.namtree.filetree.file.NTFile;
	import org.samchon.namtree.filetree.file.NTFileList;
	import org.samchon.namtree.filetree.file.NTParameter;
	import org.samchon.namtree.filetree.file.NTParameterList;
	import org.samchon.namtree.iterator.NTIterator;
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
		protected function get indexParameterList():NTParameterList
		{
			return null;
		}
		
		//SEQUENCE
		protected var aggregation:int;
		protected var file:NTFile;
		protected var type:String;
		protected var value:String;
		protected var parameterMap:Object;
		
		public function NTItem(aggregation:int = 0, file:NTFile = null, type:String = "Number", value:String = "0.0", parameterMap:Object = null)
		{
			//KEY
			this.aggregation = aggregation;
			
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
		
		public function initRetrieve():void
		{
			average = Global.NULL;
			minimum = Global.NULL;
			maximum = Global.NULL;
			rankArray = null;
			
			averageArray = [];
			minimumArray = [];
			maximumArray = [];
			//rankArray = [];
		}
		public function getRetrieved(args:Array):*
		{
			if(file == null)
				if(type == "int")
					return int(value);
				else if(type == "Number")
					return Number(value);
				else if(type == "String")
					return value;
				else
					return Global.NULL;
			
			var fileID:int = file.getFileID();
			var compiled:Object = Compiler.getCompiled();
			
			var getFunction:Function = compiled["getFunction" + fileID];
			var composerFunction:Function = compiled["composerFunction" + fileID];
			var i:int;
			
			//구성 함수 호출
			if(aggregation != NTAggregation.ATOMIC)
				composerFunction.apply(null, args);
			
			//인수 구성
			var param:Array = [];
			for(i = 0; i < args.length; i++)
				param.push( args[i] );
			addParameterListToArgs(fileList.commonParameterList, param);
			addParameterListToArgs(file.parameterList, param);
			
			
			//함수에 적용
			if(aggregation == NTAggregation.ATOMIC)
				return getFunction.apply(null, param);
			
			//집합연산일 時,
			else
			{
				//groupMutex.lock();
				var value:Number = getGroupped(composerFunction, getFunction, args, param);
				//groupMutex.unlock();
				
				return value;
			}
		}
					
		protected function addParameterListToArgs(paramList:NTParameterList, args:Array):void
		{
			var parameter:NTParameter;
			var value:String;
			
			for(var i:int = 0; i < paramList.length; i++)
			{
				parameter = paramList.at(i);
				if(parameterMap.hasOwnProperty(parameter.name) == false)
				{
					if(parameter.type == "String")
						args.push( null );
					else
						args.push( Global.NULL );
				}
				else
				{
					value = parameterMap[parameter.name];
					
					if(parameter.type == "int")
						args.push( int( value ) );
					else if(parameter.type == "Number")
						args.push( Number( value ) );
					else if(parameter.type == "String")
						args.push( value );
				}
			}
		}
		
		//VARIABLES FOR GET_GROUPPED
		//protected var groupMutex:Mutex = new Mutex();
		protected var average:Number;
		protected var minimum:Number;
		protected var maximum:Number;
		protected var rankArray:Array;
		
		protected var averageArray:Array;
		protected var minimumArray:Array;
		protected var maximumArray:Array;
		//protected var rankArrayArray:Array;
		
		protected function hasGroupResult(targetArray:Array, indexArray:Array):*
		{
			var array:Array = targetArray;
			var dimension:int = indexParameterList.length;
			
			for(var i:int = 0; i < indexArray.length - 1; i++)
				if( array.length < indexArray[i] )
					return false;
				else
					array = array[ indexArray[i] ];
			
			return array.length >= indexArray[i];
		}
		protected function getGroupResult(targetArray:Array, indexArray:Array):*
		{
			var array:Array = targetArray;
			var dimension:int = indexParameterList.length;
			
			for(var i:int = 0; i < indexArray.length - 1; i++)
				array = array[ indexArray[i] ];
			return array[ indexArray[i] ];
		}
		protected function setGroupResult(value:*, targetArray:Array, indexArray:Array):void
		{
			var array:Array = targetArray;
			var dimension:int = indexParameterList.length;
			
			for(var i:int = 0; i < indexArray.length - 1; i++)
			{
				if( array.length < indexArray[i] )
					array.push( new Array() );
				array = array[ indexArray[i] ];
			}
			if( array.length < indexArray[i] )
				array.push( value );
			else
				array[ indexArray[i] ] = value;
		}
		
		protected function getGroupped(composer:Function, getter:Function, composerArgs:Array, getterArgs:Array):Number
		{
			if(this.type == "String")
				return Global.NULL;
			
			var iterator:NTIterator = new NTIterator(fileList.dataParameterList.length - 1);
			var itFlag:Boolean;
			
			var param:Array = [];
			
			var value:Number;
			var i:int;
			
			//COPY ARGS TO PARAM
			for(i = 0; i < getterArgs.length; i++)
				param.push( getterArgs[i] );
			
			//평균
			if(aggregation == NTAggregation.AVERAGE)
			{
				if(average != Global.NULL)
					return average;
				
				value = 0.0;
				var length:int = 0;
				
				for(itFlag = iterator.begin(param); itFlag == true; itFlag = iterator.toNext(param))
				{
					//Call composerFunction
					composer.apply(null, composerArgs);
					
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
						//Call composerFunction
						composer.apply(null, composerArgs);
						
						rankArray.push( getter.apply(null, param) );
					}
					rankArray = rankArray.sort(Array.NUMERIC|Array.DESCENDING);
				}
				
				//순위 추출
				value = getter.apply(null, getterArgs);
				
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
						//Call composerFunction
						composer.apply(null, composerArgs);
						
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
						//Call composerFunction
						composer.apply(null, composerArgs);
						
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