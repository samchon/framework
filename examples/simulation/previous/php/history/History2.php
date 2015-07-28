<?

	class History
	{
		public $code;
		public $name;
		public $priceList;
		public $indexListArray;
		
		public function __construct($code, $name)
		{
			global $indexGY, $indexGQ, $indexIY, $indexIQ;
			
			$this->code = $code;
			$this->name = $name;
			
			$this->priceList = new ArrayObject();
			$this->indexListArray = new ArrayObject();
			
			if($indexGY == 1)	$this->indexListArray[] = new IndexList(1, 4);
			if($indexGQ == 1)	$this->indexListArray[] = new IndexList(1, 1);
			if($indexIY == 1)	$this->indexListArray[] = new IndexList(2, 4);
			if($iqindexIQ== 1)	$this->indexListArray[] = new IndexList(2, 1);
		}
		public function pushIndex($index)
		{
			$standard = $index->standard;
			$period = $index->period;
			
			for($i = 0; $i < $this->indexListArray->count(); $i++)
				if(	$this->indexListArray[$i]->standard == $standard && $this->indexListArray[$i]->period == $period )
				{
					$this->indexListArray[$i][] = $index;
					break;
				}
		}
		
		public function toXML()
		{
			$name = urlencode($this->name);
			$xml = "	<history code='{$this->code}' name='{$name}'>\n";
			
			//PRICE
			if($this->priceList->count() > 0)
			{
				$xml.= "		<candleList>\n";
				for($i = 0; $i < $this->priceList->count(); $i++)
				{
					$xml.= "			<candle ";
					foreach( $this->priceList[$i] as $key=>$val )
						$xml.= "{$key}='{$val}' ";
					$xml.= "/>\n";
				}
				$xml.= "		</candleList>\n";
			}
			
			//INDEX
			if($this->indexListArray->count() > 0)
			{
				$xml.= "		<indexListList>\n";
				for($i = 0; $i < $this->indexListArray->count(); $i++)
					$xml.= $this->indexListArray[$i]->toXML()."\n";
				$xml.= "		</indexListList>\n";
			}
			$xml.= "	</history>";
			return $xml;
		}
	}

?>