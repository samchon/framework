package org.samchon.namtree.file
{
	import org.samchon.protocol.entity.Entity;
	
	public class NTParameterDetermined extends Entity
	{
		/* -----------------------------------------------------
			TAGS
		----------------------------------------------------- */
		override public function get TAG():String
		{
			return "determined";
		}
		
		/* -----------------------------------------------------
			VARIABLES
		----------------------------------------------------- */
		protected var label:String;
		protected var value:Number;
		
		/* -----------------------------------------------------
			CONSTRUCTORS
		----------------------------------------------------- */
		public function NTParameterDetermined()
		{
			super();
		}
		override public function construct(xml:XML):void
		{
			label = xml.@label;
			value = xml.@value;
		}
		
		/* -----------------------------------------------------
			ACCESSORS
		----------------------------------------------------- */
		public function get $label():String
		{
			return label;
		}
		public function get $value():Number
		{
			return value;
		}
		
		public function set $label(val:String):void
		{
			this.label = val;
		}
		public function set $value(val:Number):void
		{
			this.value = val;
		}
		
		/* -----------------------------------------------------
			EXPORTS
		----------------------------------------------------- */
		override public function toXML():XML
		{
			var xml:XML = super.toXML();
			xml.@label = label;
			xml.@value = value;
			
			return xml;
		}
	}
}