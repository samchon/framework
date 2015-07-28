package org.samchon.simulation.inquiry.finance.index
{
	import mx.controls.Alert;

	public dynamic class Index
	{
		//public var code:String;
		//public var standard:int;
		//public var period:int;
		public var date:String;
		
		//PROFITABILITY
		public var operatingProfitRatio:Number;
		public var netProfitRatio:Number;
		public var ROE:Number;
		public var ROA:Number;
		public var ROIC:Number;
		
		//GROWTH
		public var saleGrowth:Number;
		public var operatingProfitGrowth:Number;
		public var netProfitGrowth:Number;
		public var totalAssetGrowth:Number;
		public var currentAssetGrowth:Number;
		public var tangibleAssetGrowth:Number;
		public var capitalGrowth:Number;
		
		//SAFETY
		public var debtRatio:Number;
		public var currentDebtRatio:Number;
		public var illiquidDebtRatio:Number;
		public var netDebtRatio:Number;
		public var currentRatio:Number;
		public var quickRatio:Number;
		public var interestCoverageRatio:Number;
		public var financialCostRatio:Number;
		public var reverseRatio:Number;
		
		//ACTIVITY
		public var totalAssetTurnoverRatio:Number;
		public var receivableTurnoverRatio:Number;
		public var inventoryTurnoverRatio:Number;
		public var payableTurnoverRatio:Number;
		
		//VALUE INDEX
		public var EPS:Number;
		public var BPS:Number;
		public var CFPS:Number;
		public var SPS:Number;
		public var PER:Number;
		public var PBR:Number;
		public var PCR:Number;
		public var PSR:Number;
		public var EV_EBITDA:Number;
		public var modifiedDPS:Number;
		public var commonStockDividendRatio:Number;
		public var payOutRatio:Number;
		
		public function Index(xml:XML)
		{
			var attributes:XMLList = xml.attributes();
			var name:String;
			
			for(var i:int = 0; i < attributes.length(); i++)
			{
				name = attributes[i].name();
				if(this.hasOwnProperty(name) == true)
					this[name] = attributes[i];
			}
		}
	}
}








