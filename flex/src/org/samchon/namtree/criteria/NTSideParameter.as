package org.samchon.namtree.criteria
{
	import org.samchon.namtree.file.NTFile;
	import org.samchon.namtree.file.NTParameter;
	import org.samchon.namtree.file.NTParameterArray;
	import org.samchon.protocol.entity.Entity;
	
	public class NTSideParameter extends Entity
	{
		/* ---------------------------------------------------------------------
			TAGS
		--------------------------------------------------------------------- */
		override public function get TAG():String
		{
			return "parameter";
		}
		
		/* ---------------------------------------------------------------------
			VARIABLES
		--------------------------------------------------------------------- */
		protected var sideParameterArray:NTSideParameterArray;
		protected var parameter:NTParameter;
		
		protected function get name():String 
		{ 
			return parameter.$name; 
		}
		protected var value:Number;
		
		/* ---------------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------------- */
		public function NTSideParameter(sideParameterArray:NTSideParameterArray)
		{
			super();
			
			this.sideParameterArray = sideParameterArray;
		}
		override public function construct(xml:XML):void
		{
			var name:String = xml.@name;
			var file:NTFile = sideParameterArray.getSide().getFile();
			var parameterArray:NTParameterArray = file.getParameterArray();
			
			this.parameter = parameterArray.get(name) as NTParameter;
			this.value = xml.@value;
		}
		
		/* ---------------------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------------------- */
		public function get $name():String
		{
			return parameter.$name;
		}
		public function get $value():Number
		{
			return value;
		}
		
		public function set $value(val:Number):void
		{
			this.value = val;
		}
		
		/* ---------------------------------------------------------------------
			EXPORTS
		--------------------------------------------------------------------- */
		override public function toXML():XML
		{
			var xml:XML = super.toXML();
			xml.@name = parameter.$name;
			xml.@value = value;
			
			return xml;
		}
	}
}