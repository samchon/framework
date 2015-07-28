package org.samchon.simulation.inquiry.price.candle
{
	import mx.collections.ArrayCollection;

	public dynamic class CandleArray extends Array {
		protected var N:int;
		protected var doSplice:Boolean;
		protected var diffVolume:int;
		
		public function CandleArray(xml:XML = null, $N:int = 20, $doSplice:Boolean = false) {
			super();
			
			N = $N;
			doSplice = $doSplice;
			if(xml != null)
				data = xml;
		}
		public function set data(xml:XML):void {
			removeAll();
			
			var xmlList:XMLList = xml.candle;
			for(var i:int = 0; i < xmlList.length(); i++)
				this.push(
					new Candle
					(
						xmlList[i] as XML
					)
				);
			//calc( int( xml["diffVolume"] ) );
		}
		
		/*
		========================
			LIST METHOD
		========================
		*/
		public function removeAll():void 
		{
			this.splice(0, this.length);
		}
		public function at(x:int):Candle
		{
			return this[x];
		}

		/*
		========================
			CALCULATION
		========================
		*/
		public function calc(diffVolume:int = 0):void {
			//upRise Ratio and Price
			for(var i:int = 1; i < this.length; i++)
				this.at( i ).setUprisePrice( this.at( i ).close - this.at( i-1 ).close );
			
			//Technical Indicies
			getMA	(  	  5	);
			getMA	( 	 20	);
			getMA	( 	 60	);
			getMA	(	120	);
			getMA	(	200 );
			
			getCCI	(	  N	);
			getOBV	(		);
			getVR	(	  N	);
			getPL	(		);
			getStochastics(	);
			
			getMACD	(		);
			
			//adjust volume(차감)
			splice(0, diffVolume);
		}
		
		protected function getMA(N:int):void {
			var numerator:Number = 0;
			var denominator:Number = N;

			for(var i:int = 0; i < this.length; i++) {
				if(i < N - 1)
					numerator += this.at( i ).close;
				else{
					if(i != N - 1)
						numerator -= this.at( i-N ).close;
					numerator += this.at( i ).close;
					
					this.at( i ).setMA(N, numerator / denominator);
				}
			}
		}
		protected function getCCI(N:int):void {
			var M:Number;
			var m:Number;
			var d:Number;
			var i:int;
			
			var MArray:Array = [];
			var mArray:Array = []; //N moving average of M
			var absArray:Array = [];
			
			var numerator:Number = 0;
			var denominator:Number = N;
			
			for(i = 0; i < this.length; i++) {
				M = (this.at( i ).high + this.at( i ).low + this.at( i ).close) / 3; // M
				MArray.push(M); //MArray
				
				//Moving Average of M : m
				if(i < N) {
					numerator += M;
					mArray.push(Global.NULL);
					absArray.push(Global.NULL);
				}else{
					numerator -= MArray[i - N];
					numerator += M;
					m = numerator / denominator;
					mArray.push(m);
					absArray.push(Math.abs(M - m) * .015);
				}
			}
			var k:int = 0;
			numerator = 0;
			for(i = 0; i < this.length; i++) 
				if(mArray[i] != Global.NULL) {
					if(k < N)
						numerator += absArray[i];
					else{
						numerator -= absArray[i - N];
						numerator += absArray[i];
						//dArray.push(numerator / denominator);
						//res = (MArray[i] - mArray[i]) / (d / denominator * .015);
						this.at( i ).setCCI( (MArray[i] - mArray[i]) / (numerator / denominator) );
					}
					k++;
				}
		}
		protected function getOBV():void {
			var res:Number = 0;
			
			//after
			for(var i:int = 1; i < this.length; i++) {
				if(this.at( i ).close > this.at( i-1 ).close)
					res += this.at( i ).volume;
				else if(this.at( i ).close < this.at( i-1 ).close)
					res -= this.at( i ).volume;
				
				this.at( i ).setOBV( res );
			}
		}
		protected function getVR(n:int = 20):void {
			var numerator:Number = 0;
			var denominator:Number = 0;
			
			var res:Number;
			var volume:Number;
			
			for(var i:int = n; i < this.length; i++)
				this.at( i ).setVR( getEachVR(i, n) );
		}
		protected function getEachVR(start:int, n:int):Number {
			var numerator:Number = 0;
			var denominator:Number = 0;
			
			for(var i:int = start - n + 1; i < start + 1; i++) {
				if(this.at( i ).close > this.at( i-1 ).close) //problem is here maybe by [i - 1]
					numerator += this.at( i ).volume;
				else if(this.at( i ).close == this.at( i-1 ).close) {
					numerator += this.at( i ).volume / 2;
					denominator += this.at( i ).volume / 2;
				}else
					denominator += this.at( i ).volume;
			}
			return numerator / denominator;// * 100;
		}
		protected function getPL():void {
			var n:int = 0;
			
			for(var i:int = 1; i < this.length; i++) {
				if(this.at( i ).close > this.at( i-1 ).close)
					n++;
				
				if(i == 10)
					this.at( i ).setPL( n / 10 );
				else if(i > 10) {
					if(this.at( i-10 ).close > this.at( i-11 ).close)
						n--;
					this.at( i ).setPL( n / 10 );
				}
			}
		}
		protected function getStochastics():void {
			var k:Number;
			var d:Number;
			var lowest:Number;
			var highest:Number;
			
			for(var i:int = 5; i < this.length; i++) {
				lowest  = Math.min(this.at( i ).low, this.at( i-1 ).low, this.at( i-2 ).low, this.at( i-3 ).low, this.at( i-4 ).low);
				highest = Math.max(this.at( i ).high, this.at( i-1 ).high, this.at( i-2 ).high, this.at( i-3 ).high, this.at( i-4 ).high);
					
				if(highest == lowest)
					k = 0;
				else
					k = (this.at( i ).close - lowest) / (highest - lowest);// * 100;
				this.at( i ).setStochasticsK( k );
					
				if(i > 5 + 2) {
					d = (this.at( i ).stochasticsK + this.at( i-1 ).stochasticsK + this.at( i-2 ).stochasticsK) / 3;
					this.at( i ).setStochasticsD( d );
				}
			}
		}
		protected function getMACD():void {
			getMA(12);
			getMA(26);
			
			var i:int = 0;
			var j:int = 0;
			var line:Number = 0;
			
			for(i = 25; i < this.length; i++) {
				this.at( i ).setMACD( this.at( i ).ma12 - this.at( i ).ma26 );
				line += this.at( i ).macd;
				
				if(++j == 9)
					this.at( i ).setMACDLine( line / 9 );
				else if(j > 9) {
					line -= this.at( i-9 ).macd;
					this.at( i ).setMACDLine( line / 9 );
				}
			}
		}
		/*
		========================
			TO STRING
		========================
		*/
		public function toXML():XML {
			var xml:String = "<candleList>\n";
			for(var i:int = 0; i < this.length; i++)
				xml += "\t" + this.at( i ).toXML() + "\n";
			xml += "</candleList>";
			
			return new XML(xml);
		}
		public function toHTML():String {
			if(this.length == 0)
				return "";
			
			var html:String= 
				"<table border='1'>\n" + 
				"	<tr>\n" + 
				"		<th rowspan='2'>Date</th>\n" + 
				"		<th colspan='7'>Price Information</th>\n" + 
				"		<th colspan='10'>Moving Average</th>\n" + 
				"		<th colspan='8'>Technical Indices</th>\n" + 
				"	</tr>\n" + 
				"	<tr>\n" + 
				"		<th>Close</th>\n" + 
				"		<th>Open</th>\n" + 
				"		<th>Low</th>\n" + 
				"		<th>High</th>\n" + 
				"		<th>Volume</th>\n" + 
				"		<th colspan='2'>Net change</th>\n" + 
				"		<th>MA 5</th>\n" + 
				"		<th>MA 20</th>\n" + 
				"		<th>MA 60</th>\n" + 
				"		<th>MA 120</th>\n" + 
				"		<th>MA 200</th>\n" + 
				"		<th>Disparity 5</th>\n" + 
				"		<th>Disparity 20</th>\n" + 
				"		<th>Disparity 60</th>\n" + 
				"		<th>Disparity 120</th>\n" + 
				"		<th>Disparity 200</th>\n" + 
				"		<th>CCI</th>\n" + 
				"		<th>OBV</th>\n" + 
				"		<th>VR</th>\n" + 
				"		<th>PL</th>\n" + 
				"		<th>Stochastics K</th>\n" + 
				"		<th>Stochastics D</th>\n" + 
				"		<th>MACD</th>\n" + 
				"		<th>MACD Line</th>\n" +
				"	</tr>";
			
			for(var i:int = 0; i < this.length; i++)
				html += this.at( i ).toHTML();
			
			html += "</table>\n<br><br><br>\n";
			return html;
		}
	}
}