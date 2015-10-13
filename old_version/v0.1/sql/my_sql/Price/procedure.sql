UPDATE Price.daily
SET date = date - interval 100 year
WHERE date > '2050-01-01'