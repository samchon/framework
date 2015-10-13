CREATE TABLE report
(
	code 				CHAR(10)	NOT NULL,
	standard			SMALLINT	NOT NULL,
	period				SMALLINT	NOT NULL,
	date				DATE,
#standard -> 0:GAAP, 1:IFRS
#period   -> 1:YEAR, 2:HALF, 4:QUARTER

#수익성
	operatingProfitRatio		FLOAT,	#영업이익률
	netProfitRatio			FLOAT,	#순이익률
	ROE				FLOAT,	#ROE
	ROA				FLOAT,	#ROA
	ROIC				FLOAT,	#ROIC

#성장성
	saleGrowth			FLOAT,	#매출액성장률
	operatingProfitGrowth		FLOAT,	#영업이익률
	netProfitGrowth			FLOAT,	#순이익성장률
	totalAssetGrowth		FLOAT,	#총자산성장률
	currentAssetGrowth		FLOAT,	#유동자산성장률
	tangibleAssetGrowth		FLOAT,	#유형자산성장률
	capitalGrowth			FLOAT,	#자기자본성장률

#안정성
	debtRatio			FLOAT,	#부채비율
	currentDebtRatio		FLOAT,	#유동부채비율
	illiquidDebtRatio		FLOAT,	#고정부채비
	netDebtRatio			FLOAT,	#순부채비율
	currentRatio			FLOAT,	#유동비율
	quickRatio			FLOAT,	#당좌비율
	interestCoverageRatio		FLOAT,	#이자보상비율
	financialCostRatio		FLOAT,	#금융비용부담비율
	reverseRatio			FLOAT,	#유보율

#활동성
	totalAssetTurnoverRatio		FLOAT,	#총자산회전율
	receivableTurnoverRatio		FLOAT,	#매출채권회전율
	inventoryTurnoverRatio		FLOAT,	#재고자산회전율
	payableTurnoverRatio		FLOAT,	#매입채무회전율

#가치지표
	EPS				FLOAT,
	BPS				FLOAT,
	CFPS				FLOAT,
	SPS				FLOAT,
	PER				FLOAT,
	PBR				FLOAT,
	PCR				FLOAT,
	PSR				FLOAT,
	EV_EBITDA			FLOAT,	#EV/EBITDA
	modifiedDPS			FLOAT,	#수정DPS
	commonStockDividentRatio	FLOAT,	#보통주현금배당률
	payOutRatio			FLOAT,	#현금배당성향

	PRIMARY KEY(code, standard, period, date),
	KEY code(code)
);