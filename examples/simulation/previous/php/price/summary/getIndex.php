<?

function getIndex($standard) {
	global $stmt, $code, $price;
	
	$stmt->prepare("SELECT
						Y.EPS, Y.BPS, Y.SPS,
						Q.debtRatio, Q.currentRatio
					FROM
						(
							SELECT code, EPS, BPS, SPS, PER, PBR, PSR
							FROM Index.report
							WHERE code = ? AND standard=? AND period=4
							ORDER BY date DESC LIMIT 1
						) Y,
						(
							SELECT code, debtRatio, currentRatio
							FROM Index.report
							WHERE code = ? AND standard=? AND period=1
							ORDER BY date DESC LIMIT 1
						) Q
					WHERE
						Y.code = Q.code");
	$stmt->bind_param("sdsd", $code, $standard, $code, $standard);
	$stmt->execute();
	$stmt->bind_result($EPS, $BPS, $SPS, $debtRatio, $currentRatio);
	$stmt->fetch();
	
	$PER = $price / $EPS;
	$PBR = $price / $BPS;
	$PSR = $price / $SPS;
	
	return sprintf(
"		<index>
			<EPS>%f</EPS>
			<BPS>%f</BPS>
			<SPS>%f</SPS>
			<PER>%f</PER>
			<PBR>%f</PBR>
			<PSR>%f</PSR>
			<debtRatio>%f</debtRatio>
			<currentRatio>%f</currentRatio>
		</index>\n",
		$EPS, $BPS, $SPS, $PER, $PBR, $PSR, $debtRatio, $currentRatio
	);
}

?>