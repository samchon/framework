package org.samchon.simulation.inquiry.price.candle
{
	import org.samchon.format.Format;

	public class Candle
	{
		/* -------------------------------------------------------
			BASE-DATA
		------------------------------------------------------- */
		//Constructed
		protected var _date:String;
		protected var _high:int;
		protected var _low:int;
		protected var _open:int;
		protected var _close:int;
		protected var _volume:int;
		
		//Up-Down
		protected var _uprisePrice:int;
		
		//Calced
		protected var _ma5:Number;
		protected var _ma20:Number;
		protected var _ma60:Number;
		protected var _ma120:Number;
		protected var _ma200:Number;
		
		protected var _cci:Number;
		protected var _obv:int;
		protected var _vr:Number;
		protected var _pl:Number;
		
		protected var _stochasticsD:Number;
		protected var _stochasticsK:Number;
		
		//For MACD Oscillator
		protected var _macd:Number;
		protected var _macdLine:Number;
		protected var _ma12:Number;
		protected var _ma26:Number;
		
		//FOR RETRIEVE
		protected var _marketCap:Number;
		
		public static const componentArray:Array = 
		[
			"close", "open", "low", "high", "volume", //PRICE INFO
			"uprisePrice", "upriseRatio", //NET CHANGE
			"ma5", "ma20", "ma60", "ma120", "ma200", //MA
			"disparity5", "disparity20", "disparity60", "disparity120", "disparity200",
			"cci", "obv", "vr", "pl", "stochasticsK", "stochasticsD", "macd", "macdLine" //TECHs
		];
		
		public function Candle(xml:XML) {
			var i:int;
			var comp:String;
			var name:String;
			
			//SET NULL AS DEFAULT
			for(i = 0; i < componentArray.length; i++)
			{
				name = "_" + comp;
				if( this.hasOwnVariable(name) == true )
					this[name] = Global.NULL;
			}
			this._ma12 = Global.NULL;
			this._ma26 = Global.NULL;
			
			if(xml == null)
				return;
			
			var attributes:XMLList = xml.attributes();
			
			for(i = 0; i < attributes.length(); i++)
			{
				comp = attributes[i].name();
				name = "_" + comp;
				
				if(this.hasOwnVariable(name) == true)
					this[name] = attributes[i];
			}
			
			//SET BASIS-DATA
			/*
			this._date = xml.@date;
			this._high = xml.@high;
			this._low = xml.@low;
			this._open = xml.@open;
			this._close = xml.@close;
			this._volume = xml.@volume;
			*/
		}
		public function hasOwnVariable(key:String):Boolean
		{
			try 
			{ 
				this[key]; 
			} 
			catch(e:Error) 
			{ 
				return false; 
			}
			return true;
		}
		
		/* -------------------------------------------------------
			GET METHODS
		------------------------------------------------------- */
		//Constructed
		public function get date():String	{	return _date;	}
		public function get high():int		{	return _high;	}
		public function get low():int		{	return _low;	}
		public function get open():int		{	return _open;	}
		public function get close():int		{	return _close;	}
		public function get volume():int	{	return _volume;	}
		
		//Up-Down
		public function get uprisePrice():int		{	return _uprisePrice;	}
		public function get upriseRatio():Number	{	return (uprisePrice == Global.NULL) ? Global.NULL : (uprisePrice / Number(close));	}
		
		//Calced
		public function get ma5():Number	{	return _ma5;	}
		public function get ma20():Number	{	return _ma20;	}
		public function get ma60():Number	{	return _ma60;	}
		public function get ma120():Number	{	return _ma120;	}
		public function get ma200():Number	{	return _ma200;	}
		public function get disparity5():Number		{	return (	_ma5 == Global.NULL		)	?	Global.NULL : (close / _ma5)	};
		public function get disparity20():Number	{	return (	_ma20 == Global.NULL	)	?	Global.NULL : (close / _ma20)	};
		public function get disparity60():Number	{	return (	_ma60 == Global.NULL	)	?	Global.NULL : (close / _ma60)	};
		public function get disparity120():Number	{	return (	_ma120 == Global.NULL	)	?	Global.NULL : (close / _ma120)	};
		public function get disparity200():Number	{	return (	_ma200 == Global.NULL	)	?	Global.NULL : (close / _ma200)	};
		
		public function get cci():Number	{	return _cci;	}
		public function get obv():int		{	return _obv;	}
		public function get vr():Number		{	return _vr;		}
		public function get pl():Number		{	return _pl;		}
		
		public function get stochasticsD():Number	{	return _stochasticsD;	}
		public function get stochasticsK():Number	{	return _stochasticsK;	}
		
		//For MACD Oscillator
		public function get macd():Number		{	return _macd;		}
		public function get macdLine():Number	{	return _macdLine;	}	
		public function get ma12():Number		{	return _ma12;		}
		public function get ma26():Number		{	return _ma26;		}
		
		//For Retrieve
		public function get marketCap():Number	{	return _marketCap;	}
		
		/* -------------------------------------------------------
			SET METHODS
		------------------------------------------------------- */
		public function setUprisePrice(val:int):void		{	this._uprisePrice = val;	}
		public function setMA(day:int, val:Number):void		{	this["_ma" + day] = val;	}
		
		public function setCCI(val:Number):void				{	this._cci = val;			}
		public function setOBV(val:int):void				{	this._obv = val;			}
		public function setVR(val:Number):void				{	this._vr = val;				}
		public function setPL(val:Number):void				{	this._pl = val;				}
		public function setStochasticsD(val:Number):void	{	this._stochasticsD = val;	}
		public function setStochasticsK(val:Number):void	{	this._stochasticsK = val;	}
		public function setMACD(val:Number):void			{	this._macd = val;			}
		public function setMACDLine(val:Number):void		{	this._macdLine = val;		}
		
		/* -------------------------------------------------------
			EXPORT
		------------------------------------------------------- */
		public function toXML():String {
			var xml:String = "<candle date='" + this.date + "' ";
			
			for(var i:int = 0; i < componentArray.length; i++)
				if(this[componentArray[i]] != Global.NULL)
					xml += componentArray[i] + "='" + this[ componentArray[i] ] + "' ";
			xml += "/>";
			
			return xml;
		}
		public function toHTML():String {
			var comp:String;
			var html:String = 
				"	<tr>\n" +
				"		<td>" + this.date + "</td>\n";
			
			for(var i:int = 0; i < componentArray.length; i++)
			{
				if(this[componentArray[i]] == Global.NULL)
					comp = "";
				else
					comp = Format.numberFormat(this[componentArray[i]] as Number);
				
				//Color Changing
				if(componentArray[i] == "close") {
					if(this.close > this.open)
						comp = "<font color='red'>" + comp + "</font>";
					else if(this.close < this.open)
						comp = "<font color='blue'>" + comp + "</font>";
				}else if(componentArray[i] == "uprisePrice" || componentArray[i] == "upriseRatio") {
					if(this.uprisePrice > 0)
						comp = "<font color='red'>" + comp + "</font>";
					else if(this.uprisePrice < 0)
						comp = "<font color='blue'>" + comp + "</font>";
				}
				html += "		<td>" + comp + "</td>\n";
			}
			html += "	</tr>\n";
			return html;
		}
	}
}