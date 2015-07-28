package org.samchon.simulation.simulation.abstract.boundary.group
{
	import spark.components.VGroup;
	
	public class SMContentGroup extends VGroup
	{
		public function SMContentGroup()
		{
			super();
		}
		
		//FOR OVERRIDING
		public function getContent():String
		{
			return "";
		}
		public function setContent(val:String):void
		{
			
		}
	}
}