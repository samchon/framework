package org.samchon.hansung.base 
{
	import mx.collections.ArrayList;
	
	import org.samchon.utils.StringUtil;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class Student extends ArrayList
	{
		protected var id:String;
		protected var name:String;
		
		public function Student(id:String, secondMajorList:ArrayList) 
		{
			super();
			this.addAll( secondMajorList );
			this.id = id;
		}
		public function at(x:int):SecondMajor
		{
			return this.getItemAt(x) as SecondMajor;
		}
		
		public function setName(name:String):void {
			this.name = name;
		}
		public function getID():String {
			return this.id;
		}
		public function getName():String {
			return name;
		}
		
		public function toXML():XML
		{
			var xml:String = "<student>\n";
			xml += "	<id>" + this.id +"</id>\n";
			for(var i:int = 0; i < this.length; i++)
				xml += StringUtil.sprintf("	<secondMajor type='{0}' major='{1}' />", at(i).getType(), at(i).getMajorNo() ) + "\n";
			xml += "</student>";
			
			return new XML(xml);
		}
	}
}