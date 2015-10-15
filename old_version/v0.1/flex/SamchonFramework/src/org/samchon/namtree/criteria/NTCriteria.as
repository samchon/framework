package org.samchon.namtree.criteria
{
	import mx.collections.ArrayList;
	
	import org.samchon.fileTree.file.FTFileList;
	import org.samchon.namtree.criteria.data.NTAggregation;
	import org.samchon.namtree.criteria.data.NTOperator;
	import org.samchon.namtree.filetree.file.NTFile;
	import org.samchon.namtree.filetree.file.NTFileList;
	import org.samchon.namtree.filetree.file.NTParameterList;
	import org.samchon.namtree.iterator.NTIterator;
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
			leftItem = getNewItem();
			rightItem = getNewItem();
			operator = 0;
			weight = 1.0;
		}
		public function constructXML(xml:XML, fileList:NTFileList):void
		{
			this.removeAll();
			
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
		protected function getNewItem():NTItem
		{
			return new NTItem();
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
		public function getFile():NTFile
		{
			if(leftItem.getFile() != null)
				return leftItem.getFile();
			else if(rightItem.getFile() != null)
				return rightItem.getFile();
			else
				return null;
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
		public function getParentItem():NTCriteria	{	return parentItem;	}
		public function getLeftItem():NTItem		{	return leftItem;	}
		public function getRightItem():NTItem		{	return rightItem;	}
		public function getOperator():int			{	return operator;	}
		public function getWeight():int				{	return weight;		}
		
		public function setParentItem(item:NTCriteria):void	{	parentItem = item;	}
		public function setLeftItem(item:NTItem):void		{	leftItem = item;	}
		public function setRightItem(item:NTItem):void		{	rightItem = item;	}
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
			
			var leftValue:*;
			var rightValue:*;
			
			rightValue = rightItem.getRetrieved(args);
			
			if(leftItem.getType() == "Filter")
			{
				leftValue = 0.0;
				if(rightValue is String || rightValue == null)
					return 0.0;
				
				if(this.length > 0)
					for(var i:int = 0; i < this.length; i++)
						leftValue += this.at(i).getRetrieved(args);
				else
					return 0.0;
				
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
				else
					value = 1;
				
				return value * weight;
			}
				
			leftValue = leftItem.getRetrieved(args);
			//rightValue = rightItem.getRetrieved(args);
			
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
		override public function toString():String
		{
			return "NTCriteria";
		}
	}
}