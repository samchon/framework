<?

	class RTFile extends NTFile
	{
		//it contains parameter
		
		protected $priceLength;
		protected $indexLength;
		
		public function __construct($fileID, $parentID, $name, $priceLength, $indexLength, $header, $getFunction, $composerFunction, $returnType, $otherside, $comment)
		{
			parent::__construct($fileID, $parentID, $name, $header, $getFunction, $composerFunction, $returnType, $otherside, $comment);
			$this->priceLength = $priceLength;
			$this->indexLength = $indexLength;
		}
		public function toXML()
		{
			$xml = "\t<file fileID='{$this->fileID}' parentID='{$this->parentID}' name='{$this->name}' extension='{$this->extension}' ";
			$xml.= "priceLength='{$this->priceLength}' indexLength='{$this->indexLength}' ";
			$xml.= "header='".urlencode($this->header)."' getFunction='".urlencode($this->getFunction)."' composerFunction='".urlencode($this->composerFunction)."' ";
			$xml.= "returnType='{$this->returnType}' otherside='{$this->otherside}' comment='{$this->comment}'>\n";
			
			foreach($this as $key=>$val)
				$xml.= $val->toXML()."\n";
			
			$xml.= "\t</file>";
			return $xml;
		}
	}

?>