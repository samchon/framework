package org.samchon.namtree.file
{
	import org.samchon.protocol.entity.Entity;

	public class NTExploreParameter extends Entity
	{
		/* -----------------------------------------------------
			TAGS
		----------------------------------------------------- */
		override public function get TAG():String
		{
			return "explore";
		}
		
		/* -----------------------------------------------------
			VARIABLES
		----------------------------------------------------- */
		protected var minimum:Number;
		protected var maximum:Number;
		protected var bin:Number;
		
		/* -----------------------------------------------------
			CONSTRUCTORS
		----------------------------------------------------- */
		public function NTExploreParameter()
		{
		}
		override public function construct(xml:XML):void
		{
			minimum = xml.@minimum;
			maximum = xml.@maximum;
			bin = xml.@bin;
		}
		
		/* -----------------------------------------------------
			ACCESSORS
		----------------------------------------------------- */
		//GETTERS
		public function getMinimum():Number
		{
			return minimum;
		}
		public function getMaximum():Number
		{
			return maximum;
		}
		public function getBin():Number
		{
			return bin;
		}
		
		//SETTERS
		public function setMinimum(val:Number):void
		{
			this.minimum = val;
		}
		public function setMaximum(val:Number):void
		{
			this.maximum = val;
		}
		public function setBin(val:Number):void	
		{
			this.bin = val;
		}
		
		/* -----------------------------------------------------
			EXPORTS
		----------------------------------------------------- */
		override public function toXML():XML
		{
			var xml:XML = super.toXML();
			xml.@minimum = minimum;
			xml.@maximum = maximum;
			xml.@bin = bin;
			
			return xml;
		}
	}
}