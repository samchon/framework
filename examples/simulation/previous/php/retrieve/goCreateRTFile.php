<?

	function goCreateRTFile($fileID, $priceLength, $indexLength)
	{
		global $stmt;
		
		//INSERT FILE
		$stmt->prepare("INSERT INTO Retrieve.file 
						VALUES 
						(
							?, 
							?, 
							?
						)");
		$stmt->bind_param("ddd", $fileID, $priceLength, $indexLength);
		$stmt->execute();
	}

?>