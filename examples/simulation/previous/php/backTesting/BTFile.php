<?

	class BTFile extends NTFile
	{
		//it contains parameter
		
		protected $buyingMinimum;
		protected $buyingMaximum;
		protected $sellingMinimum;
		protected $sellingMaximum;
		protected $accuracy;
		
		public function __construct
			(
				$fileID, $parentID, $name, $header, $getFunction, $composerFunction, $returnType, $otherside, $comment,
				$buyingMinimum, $buyingMaximum, $sellingMinimum, $sellingMaximum, $accuracy
			)
		{
			parent::__construct($fileID, $parentID, $name, $header, $getFunction, $composerFunction, $returnType, $otherside, $comment);
			
			$this->buyingMinimum = $buyingMinimum;
			$this->buyingMaximum = $buyingMaximum;
			$this->sellingMinimum = $sellingMinimum;
			$this->sellingMaximum = $sellingMaximum;
			$this->accuracy = $accuracy;
		}
		public function toXML()
		{
			$xml = "\t<file fileID='{$this->fileID}' parentID='{$this->parentID}' name='{$this->name}' extension='{$this->extension}' ";;
			$xml.= "header='".urlencode($this->header)."' getFunction='".urlencode($this->getFunction)."' composerFunction='".urlencode($this->composerFunction)."' ";
			$xml.= "returnType='{$this->returnType}' otherside='{$this->otherside}' comment='{$this->comment}' ";
			$xml.= "buyingMinimum='{$this->buyingMinimum}' buyingMaximum='{$this->buyingMaximum}' sellingMinimum='{$this->sellingMinimum}' sellingMaximum='{$this->sellingMaximum}' accuracy='{$this->accuracy}'>\n";
			
			foreach($this as $key=>$val)
				$xml.= $val->toXML()."\n";
			
			$xml.= "\t</file>";
			return $xml;
		}
	}

?>