package org.samchon.simulation.simulation.retrieve
{
	import mx.collections.ArrayList;
	import mx.controls.Alert;
	
	import org.samchon.utils.StringUtil;

	public class Corporate extends ArrayList
	{
		public var index:int;
		protected var code:String;
		protected var name:String;
		protected var market:int;
		protected var price:Number;
		protected var yesterday:Number;
		protected var volume:Number
		
		public function Corporate(code:String, name:String, market:int, price:Number = int.MIN_VALUE, yesterday:Number = int.MIN_VALUE, volume:Number = int.MIN_VALUE)
		{
			this.code = code;
			this.name = name;
			this.market = market;
			
			this.price = price;
			this.yesterday = yesterday;
			this.volume = volume;
		}
		public function at(x:int):Corporate
		{	
			return this.getItemAt(x) as Corporate;
		}
		public function getCode():String		{	return this.code;							}
		public function getName():String		{	return this.name;							}
		public function getMarket():int			{	return this.market;							}
		public function getPrice():Number		{	return this.price;							}
		public function getYesterday():Number	{	return this.yesterday;						}
		public function getVolume():Number		{	return this.volume;							}
		public function getUprisePrice():Number	
		{	
			return (yesterday == int.MIN_VALUE) ? int.MIN_VALUE : price - yesterday;	
		}
		public function getUpriseRatio():Number
		{
			return (yesterday == int.MIN_VALUE) ? int.MIN_VALUE : getUprisePrice() / yesterday;
		}
		public function getMarketCap():Number
		{
			return (volume == int.MIN_VALUE) ? int.MIN_VALUE : price * volume;
		}
		
		public function get $name():String			{	return this.name;				}
		public function get $upriseRatio():Number	{	return getUpriseRatio();		}
		public function get children():Array		{	return length ? source : null;	}
		
		public function orderByName():void
		{
			var array:Array = this.source;
			var temp:Corporate;
			
			for(var i:int = 0; i < array.length - 1; i++)
				for(var j:int = i + 1; j < array.length; j++)
					if( array[i].getName() > array[j].getName() )
					{
						temp = array[i];
						array[i] = array[j];
						array[j] = temp;
					}
			for(i = 0; i < array.length; i++)
				array[i].index = i + 1;
			this.source = array;
		}
		public function orderByMarketCap():void
		{
			var array:Array = this.source;
			var temp:Corporate;
			
			for(var i:int = 0; i < array.length - 1; i++)
				for(var j:int = i + 1; j < array.length; j++)
					if( array[i].getMarketCap() < array[j].getMarketCap() )
					{
						temp = array[i];
						array[i] = array[j];
						array[j] = temp;
					}
			for(i = 0; i < array.length; i++)
				array[i].index = i + 1;
			this.source = array;
		}
		
		override public function toString():String
		{
			return this.code;
		}
		public function toXML():String
		{
			return StringUtil.sprintf("<corporate code='{0}' name='{1}' market='{2}' />", code, name, market);
		}
	}
}