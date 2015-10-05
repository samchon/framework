package org.samchon.namtree.criteria
{
	import flash.utils.Dictionary;
	
	import org.samchon.namtree.NTFactory;
	import org.samchon.namtree.file.NTFile;
	import org.samchon.protocol.entity.Entity;
	
	public class NTSide 
		extends Entity
	{
		/* ---------------------------------------------------------------------
			TAGS
		--------------------------------------------------------------------- */
		override public function get TAG():String
		{
			return "side";
		}
		
		/* ---------------------------------------------------------------------
			VARIABLES
		--------------------------------------------------------------------- */
		protected var factory:NTFactory;
		
		protected var aggregation:int;
		protected var file:NTFile;
		protected var parameterArray:NTSideParameterArray;
		
		/* ---------------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------------- */
		public function NTSide(factory:NTFactory)
		{
			super();
			
			this.factory = factory;
			parameterArray = new NTSideParameterArray(this);
		}
		override public function construct(xml:XML):void
		{
			aggregation = xml.@aggregation;
			
			file = factory.getFile( xml.@fileUID ) as NTFile;
			parameterArray.construct( xml[parameterArray.TAG] );
		}
		
		/* ---------------------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------------------- */
		//GETTERS
		public function getAggregation():int
		{
			return aggregation;
		}
		public function getFile():NTFile
		{
			return file;
		}
		public function getParameterArray():NTSideParameterArray
		{
			return parameterArray;
		}
		
		//SETTERS
		public function setAggregation(val:int):void
		{
			this.aggregation = val;
		}
		public function setFile(file:NTFile):void
		{
			this.file = file;
		}
		
		/* ---------------------------------------------------------------------
			EXPORTS
		--------------------------------------------------------------------- */
		override public function toXML():XML
		{
			var xml:XML = super.toXML();
			xml.@aggregation = aggregation;
			xml.@file = file.getUID();
			xml.parameterArray = parameterArray.toXML();
			
			return xml;
		}
	}
}