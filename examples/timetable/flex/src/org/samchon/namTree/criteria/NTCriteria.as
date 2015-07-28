package org.samchon.namTree.criteria
{
	import mx.collections.ArrayList;
	
	import org.samchon.fileTree.file.FTFileList;
	import org.samchon.namTree.criteria.data.NTAggregation;
	import org.samchon.namTree.criteria.data.NTOperator;
	import org.samchon.namTree.fileTree.file.NTFile;
	import org.samchon.namTree.fileTree.file.NTFileList;
	import org.samchon.namTree.fileTree.file.NTParameterList;
	import org.samchon.namTree.iterator.NTIterator;
	import org.samchon.utils.StringUtil;
	
	public class NTCriteria extends ArrayList
	{
		protected var parentItem:NTCriteria = null;
		
		protected var leftItem:NTItem;
		protected var rightItem:NTItem;
		protected var operator:int;
		protected var weight:Number;
		
		public function NTCriteria()
		{
			super(null);
			
			//PRIMARY CONSTRUCTOR
			leftItem = new NTItem(NTAggregation.ATOMIC, null, "int", "1");
			rightItem = new NTItem(NTAggregation.ATOMIC, null, "int", "1");
			operator = 0;
			weight = 1.0;
		}
		public function constructXML(xml:XML, fileList:NTFileList):void
		{
			this.operator = xml.@operator;
			this.weight = xml.@weight;
			
			leftItem.constructXML(xml.item[0], fileList);
			rightItem.constructXML(xml.item[1], fileList);
			
			if(xml.hasOwnProperty("criteria") == true)
			{
				var xmlList:XMLList = xml.criteria;
				var criteria:NTCriteria;
				
				for(var i:int = 0; i < xmlList.length(); i++)
				{
					criteria = getNewCriteria();
					criteria.constructXML(xmlList[i], fileList);
					this.addItem( criteria );
				}
			}
		}
		protected function getNewCriteria():NTCriteria
		{
			return new NTCriteria();
		}
		
		override public function addItem(item:Object):void
		{
			NTCriteria(item).parentItem = this;
			super.addItem( item );
		}
		
		public function at(x:int):NTCriteria
		{
			return this.getItemAt(x) as NTCriteria;
		}
		public function getCriteriaAt(x:int):NTCriteria
		{
			return this.at(x);
		}	
		public function getFiles():Array
		{
			var array:Array = [];
			var i:int;
			var j:int;
			
			//THIS FILES
			if(leftItem.getFile() != null)
				array.push( leftItem.getFile() );
			if(rightItem.getFile() != null)
				array.push( rightItem.getFile() );
			
			//FILES OF CHILDS
			if(this.length > 0)
				for(i = 0; i < this.length; i++)
					array = array.concat( this.getCriteriaAt(i).getFiles() );
			
			//UNIQUE
			for(i = array.length - 1; i >= 0; i--)
				for(j = 0; j < array.length; j++)
					if(i != j && array[i] == array[j])
					{
						array.splice(i, 1);
						break;
					}
			return array;
		}
		
		/* ------------------------------------------------------------------------------
			GETTER AND SETTER
		------------------------------------------------------------------------------ */
		public function getParentItem():NTCriteria		{	return parentItem;	}
		public function getLeftItem():NTItem	{	return leftItem;	}
		public function getRightItem():NTItem	{	return rightItem;	}
		public function getOperator():int			{	return operator;	}
		public function getWeight():int				{	return weight;		}
		
		public function setParentItem(item:NTCriteria):void		{	parentItem = item;	}
		public function setLeftItem(item:NTItem):void	{	leftItem = item;	}
		public function setRightItem(item:NTItem):void	{	rightItem = item;	}
		public function setOperator(val:int):void			{	operator = val;		}
		public function setWeight(val:Number):void			{	weight = val;		}
		
		//TO GRID
		public function get children():Array
		{
			if(this.length > 0)
				return this.source;
			else
				return null;
		}
		
		public function get $operator():String	
		{	
			return NTOperator.operatorList.getItemAt(operator).label;
		}
		public function get $leftAggregation():String	{	return leftItem.$aggregation;	}
		public function get $leftType():String			{	return leftItem.$type;			}
		public function get $leftData():String			{	return leftItem.$data;			}
		public function get $leftOption():String		{	return leftItem.$option;		}
		public function get $rightAggregation():String	{	return rightItem.$aggregation;	}
		public function get $rightType():String			{	return rightItem.$type;			}
		public function get $rightData():String			{	return rightItem.$data;			}
		public function get $rightOption():String		{	return rightItem.$option;		}
		public function get $weight():Number			{	return weight;					}
		
		/* ------------------------------------------------------------------------------
			TO AS3 -> PROGRAMMING
		------------------------------------------------------------------------------ */
		public function toAS3(fileList:NTFileList):String
		{
			var script:String = toAS3_header(fileList);	//HEADER'S PART
			//script += toAS3_retrieve() + ";\n";			//COMPOSE FUNCTION-TREE
			//script += toAS3_tailer();					//TAIL'S PART
			
			return script;
		}
		
		protected function toAS3_header(fileList:NTFileList):String
		{
			var dataParameterList:NTParameterList = fileList.dataParameterList;
			var composingParameter:String = "";
			var files:Array = this.getFiles();
			var i:int;
			
			//HEAD
			var script:String =
				"var NULL:int = Global.NULL;\n" +
				"\n" +
				"//DISPATCH EVENT\n" +
				"Compiler.handleCompileCompleted(this);\n" +
				"\n";
			
			//(GET, COMPOSER)FUNCTION OF FILES
			for(i = 0; i < files.length; i++)
				script += files[i].toAS3() + "\n\n";
			/*
			//FUNCTION OF GO_RETRIEVE
			script += 
				"function getRetrieved(";
			
			//COMPOSING PARAMETER AND ITS TYPE
			script += dataParameterList.getParamterAt(0).name + ":" + dataParameterList.getParamterAt(0).type;
			composingParameter += dataParameterList.getParamterAt(0).name;
			for(i = 1; i < dataParameterList.length; i++)
			{
				script += ", " + dataParameterList.getParamterAt(i).name + ":" + dataParameterList.getParamterAt(i).type;
				composingParameter += ", " + dataParameterList.getParamterAt(i).name;
			}
			
			script += 
				"):Number\n" +
				"{\n";
			
			for(i = 0; i < files.length; i++)
				script += "	composerFunction" + files[i].getFileID() + "(" + composingParameter + ");\n";
			script += 
				"\n" +
				"	return ";
			*/
			return script;
		}
		protected function toAS3_retrieve():String
		{
			var script:String;
			
			if(leftItem.getType() == "Group")
			{
				if(this.length == 0)
					return "0";
				
				script = "retriever.getGroupped(";
				script += toAS3_retrieve_children();
				
				script += 
					StringUtil.sprintf
					(
						", {0}, {1}, {2}",
						rightItem.toAS3(), operator, weight
					);
				script += " )";
			}
			else
			{
				script = 
					StringUtil.sprintf
					(
						"retriever.getRetrieved({0}, {1}, {2}, {3})",
						leftItem.toAS3(), rightItem.toAS3(), 
						operator, weight
					);
				
				//ITERATING
				if(this.length > 0)
				{
					script += " *";
					script += toAS3_retrieve_children();
				}
			}
			return script;
		}
		protected function toAS3_retrieve_children():String
		{
			var script:String = this.getCriteriaAt(0).toAS3_retrieve();
			for(var i:int = 1; i < this.length; i++)
				script += " + " + this.getCriteriaAt(i).toAS3_retrieve();
			
			return " ( " + script + " ) ";
		}
		protected function toAS3_tailer():String
		{
			return "}";
		}
	
		/* ------------------------------------------------------------------------------
			GET RETRIEVED
		------------------------------------------------------------------------------ */
		public function initRetrieve():void
		{
			leftItem.initRetrieve();
			rightItem.initRetrieve();
			
			for(var i:int = 0; i < this.length; i++)
				this.at(i).initRetrieve();
		}
		public function getRetrieved(args:Array):Number
		{
			var value:Number = 0.0;
			
			var leftValue:* = leftItem.getRetrieved(args);
			var rightValue:* = rightItem.getRetrieved(args);
			
			//NULL일 때는 바로 FALSE
			if(leftValue is String && leftValue == null)
				return 0.0;
			else if(rightValue is String && rightValue == null)
				return 0.0;
			else if( !(leftValue is String) && leftValue == Global.NULL )
				return 0.0;
			else if( !(rightValue is String) && rightValue == Global.NULL )
				return 0.0;
			
			/* -------------------------- 
				잘못된 연산자 사용
			-------------------------- */
			//글자와 숫자의 비교
			if(( leftValue is String && !(rightValue is String) ) || ( !(leftValue is String) && rightValue is String ))
				return 0.0;
			//글자에 숫자 연산자를 사용
			else if( leftValue is String && NTOperator.SMALLER <= operator && operator <= NTOperator.BIGGER_EQUAL )
				return 0.0;
			//숫자에 글자 연산자를 사용
			else if( !(leftValue is String) && operator == NTOperator.LIKE )
				return 0.0;
			
			//비교 연산 실시
			if
			(
				!(
					(operator == NTOperator.EQUAL && leftValue == rightValue) ||
					(operator == NTOperator.DIFFERENT && leftValue != rightValue) ||
					
					(operator == NTOperator.SMALLER && leftValue < rightValue) ||
					(operator == NTOperator.SMALLER_EQUAL && leftValue <= rightValue) ||
					(operator == NTOperator.BIGGER_EQUAL && leftValue >= rightValue) ||
					(operator == NTOperator.BIGGER && leftValue > rightValue) ||
					
					(operator == NTOperator.LIKE && leftValue.indexOf(rightValue) != -1)
				)
			)
				return 0.0;
			
			//자식 연산자를 합함
			if(this.length > 0)
				for(var i:int = 0; i < this.length; i++)
					value += this.at(i).getRetrieved(args);
			else
				value = 1.0;
			
			return value * weight;
		}
		
		/* ------------------------------------------------------------------------------
			TO XML
		------------------------------------------------------------------------------ */
		public function toXML(level:int = 0):String
		{
			var tab:String = getTabbed(level);
			var xml:String = tab;
			xml += StringUtil.sprintf("<criteria operator='{0}' weight='{1}'>\n", operator, weight);
			xml += leftItem.toXML(level) + "\n";
			xml += rightItem.toXML(level) + "\n";
			
			for(var i:int = 0; i < this.length; i++)
				xml += this.at(i).toXML(level + 1) + "\n";
			
			xml += tab + "</criteria>";
			return xml;
		}
		protected function getTabbed(length:int):String
		{
			var tab:String = "";
			for(var i:int = 0; i < length; i++)
				tab += "\t";
			
			return tab;
		}
	}
}