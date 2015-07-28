package org.samchon.simulation.inquiry.finance.index
{
	public dynamic class IndexArrayArray extends Array
	{
		public function IndexArrayArray(...parameters)
		{
			super(parameters);
		}
		public function at(x:int):IndexArray
		{
			return this[x] as IndexArray;
		}
		public function getIndexArray(standard:int, period:int):IndexArray
		{
			for(var i:int = 0; i < this.length; i++)
				if(this.at(i).getStandard() == standard && this.at(i).getPeriod() == period)
					return this.at(i);
			return null;
		}
	}
}