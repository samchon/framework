package org.samchon.simulation.simulation.retrieve
{
	import mx.collections.ArrayList;
	import mx.collections.IList;
	
	public class CorporateList extends ArrayList
	{
		public function CorporateList()
		{
			super(null);
		}
		public function constructXML(xml:XML):void
		{
			this.removeAll();
			if(xml.hasOwnProperty("corporate") == false)
				return;
			
			var xmlList:XMLList = xml.corporate;
			for(var i:int = 0; i < xmlList.length(); i++)
				this.addItem
				(
					new Corporate(xmlList[i].@code, xmlList[i].@name, xmlList[i].@market)
				);
		}
		public function at(x:int):Corporate
		{
			return this.getItemAt(x) as Corporate;
		}
		
		override public function addItem(item:Object):void
		{
			var corp:Corporate = item as Corporate;
			var isSame:Boolean = false;
			
			for(var i:int = 0; i < this.length; i++)
				if( corp.getCode() == this.at(i).getCode() )
				{
					isSame = true;
					break;
				}
			if(isSame == false)
				super.addItem( corp );
		}
		override public function addAll(addList:IList):void
		{
			var corporateList:CorporateList = addList as CorporateList;
			var i:int;
			
			for(i = 0; i < corporateList.length; i++)
				this.addItem( corporateList.at(i) );
		}
		
		public function isDuplicated(corporateList:CorporateList):Boolean
		{
			if(this.length == corporateList.length)
			{
				for(var i:int = 0; this.length; i++)
					if( this.at(i).getCode() != corporateList.at(i).getCode() )
						return false;
				return true;
			}
			return false;
		}
		
		public function sort():void
		{
			var array:Array = this.source;
			array.sortOn("index");
			
			this.source = array;
		}
		
		override public function toString():String
		{
			var val:String = "";
			
			for(var i:int = 0; i < this.length; i++)
				if(i == this.length - 1)
					val += this.at(i).toString();
				else
					val += this.at(i).toString() + "||";
			
			return val;
		}
		public function toXML():String
		{
			var xml:String = "<corporateList>\n";
			for(var i:int = 0; i < this.length; i++)
				xml += "	" + this.at(i).toXML() + "\n";
			xml += "</corporateList>";
			
			return xml;
		}
	}
}