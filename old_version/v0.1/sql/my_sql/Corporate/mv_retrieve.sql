CREATE TABLE Company.mv_retrieve
AS
SELECT
	C.code, replace(C.name, "&", "앤") name, C.market, #COMPANY INFO
	P1.close price, P1.close-P2.close upRisePrice, P1.close/P2.close-1 upRiseRatio, #TODAY, YESTERDAY
	M.disparity5, M.disparity20, M.disparity60, M.disparity120, #DISPARITY 
	P1.close * I.volume marketCap, #MARKET CAPITALIZATION

	/*
	==============================================
		INDEX COMPONENTS
	==============================================
	*/
	Y.standard, Y.operatingProfitRatio, Y.netProfitRatio, Y.ROE, Y.ROA, Y.ROIC,
	Y.saleGrowth, Y.operatingProfitGrowth, Y.netProfitGrowth,
	Y.totalAssetGrowth, Y.currentAssetGrowth, Y.tangibleAssetGrowth, Y.capitalGrowth,
	Q.debtRatio, Q.currentDebtRatio, Q.illiquidDebtRatio, Q.netDebtRatio, Q.currentRatio,
	Q.quickRatio, Y.interestCoverageRatio, Y.financialCostRatio, Q.reverseRatio,
	Y.totalAssetTurnoverRatio, Y.receivableTurnoverRatio, Y.inventoryTurnoverRatio, Y.payableTurnoverRatio,
	Y.EPS, Y.BPS, Y.CFPS, Y.SPS,
	P1.close / Y.EPS PER, P1.close / Y.BPS PBR, P1.close / Y.CFPS PCR, P1.close / Y.SPS PSR, #CALCULATED VALUE
	Y.EV_EBITDA, Y.modifiedDPS, Y.commonStockDividentRatio, Y.payOutRatio,
	Y.date dateYear, Q.date dateQuarter

FROM
	Price.daily P1, Price.daily P2, Price.v_ma M,
	Company.list C, Company.info I,
	Index.v_reportRecent Y, Index.v_reportRecent Q

WHERE
	P1.date = (SELECT date FROM Price.daily WHERE code='005930' ORDER BY date DESC LIMIT 0, 1) AND
	P2.date = (SELECT date FROM Price.daily WHERE code='005930' ORDER BY date DESC LIMIT 1, 1) AND
	Y.period = 4 AND Q.period = 1 AND
	Y.standard = Q.standard AND
	P1.code = P2.code AND P2.code = M.code AND M.code = C.code AND C.code = I.code AND I.code = Y.code AND Y.code = Q.code;