package 
{
	public dynamic class Algorithm
	{
		protected var name:String;
		
		public function Algorithm(name:String)
		{
			this.name = name;
		}
		public function getName():String			{	return this.name;	}
		public function setName(val:String):void	{	this.name = val;	}
		
		public function get $name():String			{	return this.name;	}
		
		public function toXML():String
		{
			var xml:String = "<algorithm name='" + name + "' />";
			return xml;
		}
	}
}