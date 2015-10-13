##################################################
# 회사목록 FROM 다트
##################################################
INSERT INTO Company.list
	SELECT code, summaryName, engName, 1
	FROM Dart.corporation
	WHERE market = '유가증권시장'
ON DUPLICATE KEY UPDATE
	name = VALUES(name),
	engName = VALUES(engName),
	market = VALUES(market);

INSERT INTO Company.list
	SELECT code, summaryName, engName, 2
	FROM Dart.corporation
	WHERE market = '코스닥시장'
ON DUPLICATE KEY UPDATE
	name = VALUES(name),
	engName = VALUES(engName),
	market = VALUES(market);

##################################################
# 가격누락 찾기
##################################################
SELECT C.name, C.code 
FROM Company.list C LEFT OUTER JOIN
(
	SELECT code FROM Price.daily
	WHERE date = (SELECT max(date) FROM Price.daily)
) P ON C.code = P.code
WHERE P.code IS NULL;

##################################################
# 회사목록 mv_retrieve 업데이트
##################################################
TRUNCATE Company.mv_retrieve;
INSERT INTO Company.mv_retrieve
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
	P1.code = P2.code AND P2.code = M.code AND M.code = C.code AND C.code = I.code AND I.code = Y.code AND Y.code = Q.code
ON DUPLICATE KEY UPDATE
	name = VALUES(name),
	market = VALUES(market),
	price = VALUES(price),
	upRisePrice = VALUES(upRisePrice),
	upRiseRatio = VALUES(upRiseRatio),
	disparity5 = VALUES(disparity5),
	disparity20 = VALUES(disparity20),
	disparity60 = VALUES(disparity60),
	disparity120 = VALUES(disparity120),
	marketCap = VALUES(marketCap),
	operatingProfitRatio = VALUES(operatingProfitRatio),
	netProfitRatio = VALUES(netProfitRatio),
	ROE = VALUES(ROE),
	ROA = VALUES(ROA),
	ROIC = VALUES(ROIC),
	saleGrowth = VALUES(saleGrowth),
	operatingProfitGrowth = VALUES(operatingProfitGrowth),
	netProfitGrowth = VALUES(netProfitGrowth),
	totalAssetGrowth = VALUES(totalAssetGrowth),
	currentAssetGrowth = VALUES(currentAssetGrowth),
	tangibleAssetGrowth = VALUES(tangibleAssetGrowth),
	capitalGrowth = VALUES(capitalGrowth),
	debtRatio = VALUES(debtRatio),
	currentDebtRatio = VALUES(currentDebtRatio),
	illiquidDebtRatio = VALUES(illiquidDebtRatio),
	netDebtRatio = VALUES(netDebtRatio),
	currentRatio = VALUES(currentRatio),
	quickRatio = VALUES(quickRatio),
	interestCoverageRatio = VALUES(interestCoverageRatio),
	financialCostRatio = VALUES(financialCostRatio),
	reverseRatio = VALUES(reverseRatio),
	totalAssetTurnoverRatio = VALUES(totalAssetTurnoverRatio),
	receivableTurnoverRatio = VALUES(receivableTurnoverRatio),
	inventoryTurnoverRatio = VALUES(inventoryTurnoverRatio),
	payableTurnoverRatio = VALUES(payableTurnoverRatio),
	EPS = VALUES(EPS),
	BPS = VALUES(BPS),
	CFPS = VALUES(CFPS),
	SPS = VALUES(SPS),
	PER = VALUES(PER),
	PBR = VALUES(PBR),
	PCR = VALUES(PCR),
	PSR = VALUES(PSR),
	EV_EBITDA = VALUES(EV_EBITDA),
	modifiedDPS = VALUES(modifiedDPS),
	commonStockDividentRatio = VALUES(commonStockDividentRatio),
	payOutRatio = VALUES(payOutRatio),
	dateYear = VALUES(dateYear),
	dateQuarter = VALUES(dateQuarter);