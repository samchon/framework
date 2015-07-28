<?

	class HistoryMap extends ArrayObject
	{
		public function __construct()
		{
			global $priceLength, $indexLength;
			global $indexGY, $indexGQ, $indexIY, $indexIQ;
			
			parent::__construct();
			$this->loadCorporate();
			
			if($startDate)
			{
				
			}
			else
			{
				if($priceLength)	$this->loadPriceByVolume($priceLength);
				if($indexGY)		$this->loadIndexByVolume(1, 4, $indexLength);
				if($indexGQ)		$this->loadIndexByVolume(1, 1, $indexLength);
				if($indexIY)		$this->loadIndexByVolume(2, 4, $indexLength);
				if($indexIQ)		$this->loadIndexByVolume(2, 1, $indexLength);
			}
		}
		
		/* ---------------------------------------------------------
			LOAD FROM DATABASE
		--------------------------------------------------------- */
		protected function loadCorporate()
		{
			global $stmt;
			$stmt->prepare("SELECT code, name
							FROM Company.list
							ORDER BY name");
			$stmt->execute();
			$stmt->bind_result($code, $name);
			
			while($stmt -> fetch())
			{
				$this[$code] = new History($code, $name);
			}
		}
		protected function loadPriceByVolume($volume) 
		{
			global $stmt;
			
			$stmt->prepare("SELECT min(date), max(date)
							FROM 
							(
								SELECT DISTINCT date
								FROM Price.price
								ORDER BY date DESC LIMIT {$volume}
							) T");
			$stmt->execute();
			$stmt->bind_result($startDate, $endDate);
			$stmt->fetch();
			
			$this->loadPriceByDate($startDate, $endDate);
		}
		protected function loadPriceByDate($startDate, $endDate)
		{
			global $stmt;
			
			$stmt->prepare("SELECT T.*, P.high, P.low, P.open, P.close, P.volume
							FROM Price.price P, Price.techIndex T
							WHERE P.date BETWEEN ? AND ? AND
								T.code = P.code AND T.date = P.date
							ORDER BY code, date");
			$stmt->bind_param("ss", $startDate, $endDate);
			$mapArray = getRecordMaps($stmt);
			
			for($i = 0; $i < count($mapArray); $i++)
			{
				$code = $mapArray[$i]->code;
				if( $this->offsetExists($code) == true )
					$this[$code]->priceList[] = $mapArray[$i];
			}
		}
		protected function loadIndexByVolume($standard, $period, $volume)
		{
			global $stmt;
			
			$volume = $volume - 1;
			$stmt->prepare("SELECT I.* 
							FROM Index.report I
							WHERE 
								I.date >= 
								(
									SELECT date FROM Index.report R 
									WHERE R.code = I.code AND 
										R.standard = I.standard AND 
										R.period = I.period
									ORDER BY DATE DESC LIMIT {$volume}, 1
								) AND
								standard = ? AND period = ?
							ORDER BY code, date");
			$stmt->bind_param("dd", $standard, $period);
			$mapArray = getRecordMaps($stmt);
			
			for($i = 0; $i < count($mapArray); $i++)
			{
				$code = $mapArray[$i]->code;
				if( $this->offsetExists($code) == true )
					$this[$code]->pushIndex( $mapArray[$i] );
			}
		}
		protected function loadIndexByDate($standard, $period, $startDate, $endDate)
		{
			global $stmt;
		}
		
		/* ---------------------------------------------------------
			TO_XML
		--------------------------------------------------------- */
		public function toXML()
		{
			$xml = "";
			foreach($this as $key=>$val)
				$xml.= $val->toXML()."\n";
			
			return $xml;
		}
	}

?>