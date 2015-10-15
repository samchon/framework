package org.samchon.namtree.file
{
	import org.samchon.protocol.entity.EntityArray;
	
	public class NTParameter extends EntityArray
	{
		/* -----------------------------------------------------
			TAGS
		----------------------------------------------------- */
		override public function get TAG():String
		{
			return "parameter";
		}
		override public function get CHILD_TAG():String
		{
			return "determined";
		}
		
		/* -----------------------------------------------------
			VARIABLES
		----------------------------------------------------- */
		protected var name:String;
		protected var initialValue:Number;
		protected var exploreParameter:NTExploreParameter;
		
		/* -----------------------------------------------------
			CONSTRUCTORS
		----------------------------------------------------- */
		public function NTParameter()
		{
			super();
			
			exploreParameter = null;
		}
		override public function construct(xml:XML):void
		{
			super.construct(xml);
			
			name = xml.@name;
			initialValue = xml.@initialValue;
			
			if(xml.hasOwnProperty("exploreParameter"))
			{
				exploreParameter = new NTExploreParameter();
				exploreParameter.construct(xml.exploreParameter);
			}
			else
				exploreParameter = null;
		}
		
		/* -----------------------------------------------------
			ACCESSORS
		----------------------------------------------------- */
		//KEY
		override public function get key():*
		{
			return name;
		}
		
		//GETTERS
		public function getExploreParameter():NTExploreParameter
		{
			return exploreParameter;
		}
		public function hasExploreParameter():Boolean
		{
			return (exploreParameter != null);
		}
		
		//SETTERS
		public function setHasExploreParameter(flag:Boolean):void
		{
			if(flag == true)
			{
				if(exploreParameter == null)
					exploreParameter = new NTExploreParameter();
				removeAll();
			}
			else
				exploreParameter = null;
		}
		
		//GRID - GETTERS
		public function get $name():String
		{
			return name;
		}
		public function get $initialValue():Number
		{
			return initialValue;
		}
		
		//GRID - SETTERS
		public function set $name(val:String):void
		{
			this.name = val;
		}
		public function set $initialValue(val:Number):void
		{
			this.initialValue = val;
		}
		
		/* -----------------------------------------------------
			EXPORTS
		----------------------------------------------------- */
		override public function toXML():XML
		{
			var xml:XML = super.toXML();
			xml.@name = name;
			xml.@initialValue = initialValue;
		
			if(exploreParameter != null)
				xml.exploreParameter = exploreParameter.toXML();
			
			return xml;
		}
	}
}