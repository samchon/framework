<?

	class IndexList extends ArrayObject
	{
		public $standard;
		public $period;
		
		public function __construct($standard, $period)
		{
			parent::__construct();
			
			$this->standard = $standard;
			$this->period = $period;
		}
		public function toXML()
		{;
			$xml = "			<indexList standard='{$this->standard}' period='{$this->period}'>\n";
			for($i = 0; $i < $this->count(); $i++)
			{
				$xml.= "				<index ";
				foreach( $this[$i] as $key=>$val )
					$xml.= "{$key}='{$val}' ";
				$xml.= "/>\n";
			}
			$xml.= "			</indexList>";
			
			return $xml;
		}
	}

?>