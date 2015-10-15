CREATE VIEW Corporate.v_retrieve
AS
SELECT
	C.name, P.*,
	P.close / P.ma5 disparity5,
	P.close / P.ma20 disparity20,
	P.close / P.ma60 disparity60,
	P.close / P.ma120 disparity120,
	P.close / P.ma200 disparity200,

	/*
	==============================================
		INDEX COMPONENTS
	==============================================
	*/
	Y.standard, Y.operatingProfitRatio, Y.netProfitRatio, Y.ROE, Y.ROA, Y.ROIC,
	Y.salesGrowth, Y.operatingProfitGrowth, Y.netProfitGrowth,
	Y.totalAssetGrowth, Y.currentAssetGrowth, Y.tangibleAssetGrowth, Y.capitalGrowth,
	Q.debtRatio, Q.currentDebtRatio, Q.illiquidDebtRatio, Q.netDebtRatio, Q.currentRatio,
	Q.quickRatio, Y.interestCoverageRatio, Y.financialCostRatio, Q.reverseRatio,
	Y.totalAssetTurnoverRatio, Y.receivableTurnoverRatio, Y.inventoryTurnoverRatio, Y.payableTurnoverRatio,
	Y.EPS, Y.BPS, Y.CFPS, Y.SPS,
	P.close / Y.EPS PER, P.close / Y.BPS PBR, P.close / Y.CFPS PCR, P.close / Y.SPS PSR, #CALCULATED VALUE
	Y.EV_EBITDA, Y.modifiedDPS, Y.commonStockDividendRatio, Y.payOutRatio,
	Y.date dateYear, Q.date dateQuarter

FROM
	Price.v_priceToday P, Corporate.list C, Company.info I,
	Index.v_reportRecent Y, Index.v_reportRecent Q

WHERE
	Y.period = 4 AND Q.period = 1 AND
	Y.standard = Q.standard AND
	P.code = C.code AND C.code = I.code AND I.code = Y.code AND Y.code = Q.code;