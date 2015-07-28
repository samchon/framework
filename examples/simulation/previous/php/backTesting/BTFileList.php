<?
	
	/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		FILE_LIST
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	class BTFileList extends NTFileList
	{
		public function __construct()
		{
			parent::__construct();
		}
		
		/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			LOADER
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
		public function loadList()
		{
			global $stmt;
			global $application;
			global $category;
			global $owner;
			
			$stmt->prepare("SELECT * FROM BackTesting.v_file
								WHERE 
									owner IN ('example', ?) AND
									application = ? AND category = ?
							UNION ALL
							SELECT ?, ?, -1, NULL, 'example', 'example', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
							UNION ALL
							SELECT ?, ?, 0, NULL, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
							ORDER BY fileID");
			$stmt->bind_param("sddddddss", $owner, $application, $category, $application, $category, $application, $category, $owner, $owner);
			$mapArray = getRecordMaps($stmt);
			
			$this->listReply($mapArray);
		}
		
		/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			LOAD HANDLER
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
		protected function listReply($mapArray)
		{
			for($i = 0; $i < count($mapArray); $i++)
			{
				$map = $mapArray[$i];
				if( $map->extension == "ntr" )
					$this[ $map->fileID ] = 
						new BTFile
						(
							$map->fileID, $map->parentID, $map->name, $map->header, $map->getFunction, $map->composerFunction, $map->returnType, $map->otherside, $map->comment,
							$map->buyingMinimum, $map->buyingMaximum, $map->sellingMinimum, $map->sellingMaximum, $map->accuracy
						);
			}
			parent::loadReply($mapArray);
		}
	}

?>