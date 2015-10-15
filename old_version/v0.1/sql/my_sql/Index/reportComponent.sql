CREATE TABLE Index.reportComponent
(
	uid		SMALLINT	PRIMARY KEY	AUTO_INCREMENT,
	pid		SMALLINT,
	field		VARCHAR(100),
	name		VARCHAR(100)	NOT NULL,
	engName		VARCHAR(100)	NOT NULL
);

#수익성
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	NULL,	NULL,				'수익성',		'Profitability Index');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	1,	'operatingProfitRatio',		'영업이익률',	'Operating Profit Ratio');	
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	1,	'netProfitRatio',		'순이익률',	'Net Profit Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	1,	'ROE',				'ROE',		'ROE');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	1,	'ROA',				'ROA',		'ROA');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	1,	'ROIC',				'ROIC',		'ROIC');

#성장성
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	NULL,	NULL,				'성장성',		'Growth Index');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	7,	'saleGrowth',			'매출액성장률',	'Sales Growth Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	7,	'operatingProfitGrowth',	'영업이익성장률',	'Operating Profit Growth Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	7,	'netProfitGrowth',		'순이익성장률',	'Net Profit Growth Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	7,	'totalAssetGrowth',		'총자산성장률',	'Total Asset Growth Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	7,	'currentAssetGrowth',		'유동자산성장률',	'Current Asset Growth Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	7,	'tangibleAssetGrowth',		'유형자산성장률',	'Tangible Asset Growth Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	7,	'capitalGrowth',		'자기자본성장률',	'Capital Growth Ratio');

#안정성
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	NULL,	NULL,				'안정성',		'Safety Index');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	15,	'debtRatio',			'부채비율',	'Liability Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	15,	'currentDebtRatio',		'유동부채비율',	'Current Liability Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	15,	'illiquidDebtRatio',		'고정부채비율',	'Illiquid Liability Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	15,	'netDebtRatio',			'순부채비율',	'Net Liability Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	15,	'currentRatio',			'유동비율',	'Liquidity Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	15,	'quickRatio',			'당좌비율',	'Quick Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	15,	'interestCoverageRatio',	'이자보상비율',	'Interest Coverage Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	15,	'financialCostRatio',		'금융비용부담비율',	'Financial Cost Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	15,	'reverseRatio',			'유보율',		'Reverse Ratio');

#활동성
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	NULL,	NULL,				'활동성',		'Activity Index');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	25,	'totalAssetTurnoverRatio',	'총자산회전율',	'Total Asset Turnover Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	25,	'receivableTurnoverRatio',	'매출채권회전율',	'Receivable Turnover Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	25,	'inventoryTurnoverRatio',	'재고자산회전율',	'Inventory Turnover Ratio');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	25,	'payableTurnoverRatio',		'매입채무회전율',	'Payable Turnover Ratio');

#가치지표
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	NULL,	NULL,				'가치지표',	'Valuation Index');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	30,	'EPS',				'EPS',		'EPS');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	30,	'BPS',				'BPS',		'BPS');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	30,	'CFPS',				'CFPS',		'CFPS');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	30,	'SPS',				'SPS',		'SPS');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	30,	'PER',				'PER',		'PER');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	30,	'PBR',				'PBR',		'PBR');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	30,	'PCR',				'PCR',		'PCR');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	30,	'PSR',				'PSR',		'PSR');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	30,	'EV_EBITDA',			'EV/EBITDA',	'EV/EBITDA');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	30,	'modifiedDPS',			'수정DPS',	'Modified DPS');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	30,	'commonStockDividentRatio',	'보통주배당률',	'Dividend Ratio(comm.)');
INSERT INTO Index.reportComponent(uid, pid, field, name, engName) VALUES('',	30,	'payOutRatio',			'현금배당성향',	'Payout Ratio');