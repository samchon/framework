CREATE VIEW Price.v_priceToday
AS
SELECT * FROM Price.v_price
WHERE date = (SELECT MAX(date) FROM Price.candle);