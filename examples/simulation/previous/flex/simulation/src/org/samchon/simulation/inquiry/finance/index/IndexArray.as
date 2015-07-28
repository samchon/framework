package org.samchon.simulation.inquiry.finance.index
{
	import mx.controls.Alert;

	public dynamic class IndexArray extends Array
	{
		protected var standard:int;
		protected var period:int;
		
		public function IndexArray( xml:XML)
		{
			super();
			
			this.standard = xml.@standard;
			this.period = xml.@period;
			
			if(xml.hasOwnProperty("index") == false)
				return;
			
			var xmlList:XMLList = xml.index;
			for(var i:int = 0; i < xmlList.length(); i++)
				this.push( new Index( xmlList[i] as XML ) );
		}
		public function at(x:int):Index
		{
			return this[x];
		}
		
		public function getStandard():int	{	return this.standard;	}
		public function getPeriod():int		{	return this.period;		}
	}
}