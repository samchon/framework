package org.samchon.namTree.iterator
{
	public dynamic class NTIterator extends Array
	{
		public function NTIterator(length:int)
		{
			super();
			
			for(var i:int = 0; i < length; i++)
				this.push( 0 );
		}
		public function begin(param:Array):Boolean
		{
			for(var i:int = 0; i < this.length; i++)
			{
				this[i] = 0;
				param[i+1] = param[i].at( this[i] );
			}
			return true;
		}
		public function toNext(param:Array):Boolean
		{
			
			for(var i:int = 0; i < this.length; i++)
				if( this[i] < param[i].length - 1 )
				{
					this[i] = this[i] + 1;
					param[i+1] = param[i].at( this[i] );
					
					return true;
				}
			return false;
		}
		public static function end():Boolean
		{
			return false;
		}
	}
}