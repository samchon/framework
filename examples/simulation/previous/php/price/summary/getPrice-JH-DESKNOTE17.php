<?

function getPrice() {
	global $stmt, $code, $price;
	
	$stmt->prepare("SELECT
						L.code,
						L.name,
						P.close,
						Y.close yesterday,
						C.face,
						C.volume,
						P.close*C.volume marketCap
					FROM	
						(
							SELECT code, close FROM Price.price
							WHERE code = ?
							ORDER BY date DESC LIMIT 0, 1
						) P,
						Company.info C,
						(
							SELECT code, close FROM Price.price
							WHERE code = ?
							ORDER BY date DESC LIMIT 1, 1
						) Y,
						Company.list L
					WHERE
						P.code = C.code AND C.code = Y.code AND Y.code = L.code");
	$stmt->bind_param ("ss", $code, $code);
	$stmt->execute();
	$stmt->bind_result($code, $name, $price, $yesterday, $face, $volume, $marketCap);
	$stmt->fetch();
	
	$upRisePrice = $price - $yesterday;
	$upRiseRatio = $upRisePrice / $yesterday;
	
	return sprintf(
"	<company>
		<code>%s</code>
		<name>%s</name>
		<volume>%d</volume>
		<face>%d</face>
	</company>
	<price>
		<price>%d</price>
		<yesterday>%d</yesterday>
		<upRisePrice>%d</upRisePrice>
		<upRiseRatio>%f</upRiseRatio>
		<marketCap>%d</marketCap>
	</price>\n", 
		$code, $name, $volume, $face, $price, $yesterday, $upRisePrice, $upRiseRatio, $marketCap
	);
}

?>