package org.samchon.library.utils
{
	import org.samchon.protocol.entity.Entity;
	
	public class GAParameters extends Entity
	{
		protected var generation:int;
		protected var population:int;
		protected var tournament:int;
		protected var mutationRate:Number;
		
		/* -----------------------------------------------------------
			CONSTRUCTORS
		----------------------------------------------------------- */
		public function GAParameters(generation:int = 1000, population:int = 200, tournament:int = 50, mutationRate:Number = .05)
		{
			super();
			
			this.generation = generation;
			this.population = population;
			this.tournament = tournament;
			this.mutationRate = mutationRate;
		}
		
		override public function construct(xml:XML):void
		{
			generation = xml.@generation;
			population = xml.@population;
			tournament = xml.@tournament;
			mutationRate = xml.@mutationRate;
		}
		
		/* -----------------------------------------------------------
			GETTERS
		----------------------------------------------------------- */
		public function getGeneration():int
		{
			return generation;
		}
		public function getPopulation():int
		{
			return population;
		}
		public function getTournament():int
		{
			return tournament;
		}
		public function getMutationRate():Number
		{
			return mutationRate;
		}
		
		/* -----------------------------------------------------------
			EXPORTERS
		----------------------------------------------------------- */
		override public function get TAG():String
		{
			return "gaParameters";
		}
		
		override public function toXML():XML
		{
			var xml:XML = super.toXML();
			xml.@generation = generation;
			xml.@population = population;
			xml.@tournament = tournament;
			xml.@mutationRate = mutationRate;
			
			return xml;
		}
	}
}