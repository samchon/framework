package org.samchon.namtree.criteria
{
	import org.samchon.namtree.NTFactory;
	import org.samchon.protocol.entity.EntityArray;
	import org.samchon.protocol.entity.IEntity;
	
	public class NTCriteria 
		extends EntityArray
	{
		/* ---------------------------------------------------------------------
			TAGS
		--------------------------------------------------------------------- */
		override public function get TAG():String
		{
			return "criteria";
		}
		override public function get CHILD_TAG():String
		{
			return "criteria";
		}
		
		/* ---------------------------------------------------------------------
			VARIABLES
		--------------------------------------------------------------------- */
		/**
		 * 
		 */
		protected var factory:NTFactory;
		/**
		 * Parent NTCriteria
		 * @default null
		 */
		protected var parent:NTCriteria;
		
		/**
		 * 
		 */
		protected var uid:int;
		/**
		 * 
		 */
		protected var leftSide:NTSide;
		/**
		 * 
		 */
		protected var rightSide:NTSide;
		/**
		 * <table>
		 * 	<tr>
		 * 		<th>Operator</td>
		 * 		<th>Enumeration</td>
		 * 	</tr>
		 * 	<tr>
		 * 		<td>&lt;</td>
		 * 		<td>-2</td>
		 * 	</tr>
		 * 	<tr>
		 * 		<td>&lt;=</td>
		 * 		<td>-1</td>
		 * 	</tr>
		 * 	<tr>
		 * 		<td>=</td>
		 * 		<td>0</td>
		 * 	</tr>
		 * 	<tr>
		 * 		<td>&gt;</td>
		 * 		<td>1</td>
		 * 	</tr>
		 * 	<tr>
		 * 		<td>&gt;=</td>
		 * 		<td>2</td>
		 * 	</tr>
		 * </table>
		 */
		protected var operator:int;
		/**
		 * The value multiplied to the comparison result
		 * @default 1.0
		 */
		protected var weight:Number;
		
		/* ---------------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------------- */
		public function NTCriteria(factory:NTFactory, parent:NTCriteria)
		{
			super();
			
			this.factory = factory;
			this.parent = parent;
			
			leftSide = factory.createSide();
			rightSide = factory.createSide();
		}
		override public function construct(xml:XML):void
		{
			super.construct(xml);
			
			uid = xml.@uid;
			
			leftSide.construct( xml.side[0] as XML );
			rightSide.construct( xml.side[1] as XML );
			
			operator = xml.@operator;
			weight = xml.@weight;
		}
		override protected function createChild(xml:XML):IEntity
		{
			return factory.createCriteria(this, xml);
		}
		
		/* ---------------------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------------------- */
		//KEY
		override public function get key():*
		{
			return uid;
		}
		
		//GRID GETTERS - BASIC
		public function get $operator():int
		{
			return operator;
		}
		public function get $weight():Number
		{
			return weight;
		}
		
		//LEFT
		public function get $leftAggregation():int
		{
			return leftSide.getAggregation();
		}
		public function get $leftFile():String
		{
			return leftSide.getFile().getName();
		}
		public function get $leftParameters():String
		{
			var parameterArray:NTSideParameterArray = leftSide.getParameterArray();
			if(parameterArray.length == 0)
				return "";
			
			var str:String = (parameterArray.at(0) as NTSideParameter).$value.toString();
			for(var i:int = 1; i < parameterArray.length; i++)
				str += ", " + (parameterArray.at(0) as NTSideParameter).$value;
			
			return str;
		}
		
		//RIGHT
		public function get $rightAggregation():int
		{
			return rightSide.getAggregation();
		}
		public function get $rightFile():String
		{
			return rightSide.getFile().getName();
		}
		public function get $rightParameters():String
		{
			var parameterArray:NTSideParameterArray = rightSide.getParameterArray();
			if(parameterArray.length == 0)
				return "";
			
			var str:String = (parameterArray.at(0) as NTSideParameter).$value.toString();
			for(var i:int = 1; i < parameterArray.length; i++)
				str += ", " + (parameterArray.at(0) as NTSideParameter).$value;
			
			return str;
		}
		
		//GRID SETTERS - BASIC
		public function set $operator(val:int):void
		{
			this.operator = val;
		}
		public function set $weight(val:Number):void
		{
			this.weight = val;
		}
		
		/* ---------------------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------------------- */
		override public function toXML():XML
		{
			var xml:XML = super.toXML();
			xml.@uid = uid;
			if(parent != null)
				xml.@fid = parent.uid;
			
			xml.side = new XMLList();
			xml.side[0] = leftSide.toXML();
			xml.side[1] = rightSide.toXML();
			
			xml.@operator = operator;
			xml.@weight = weight;
			
			return xml;
		}
	}
}