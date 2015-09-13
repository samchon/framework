package org.samchon.container
{
	public dynamic class Dictionary
	{
		public function Dictionary()
		{
			
		}
		
		public function has(key:*):Boolean
		{
			return this.hasOwnProperty(key);
		}
		public function get(key:*):*
		{
			return this[key];
		}
		public function set(key:*, val:*):void
		{
			this[key] = val;
		}
		public function erase(key:*):void
		{
			delete this[key];
		}
	}
}