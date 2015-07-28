<?

	function goCreateBTFile($fileID, $buyingMinimum, $buyingMaximum, $sellingMinimum, $sellingMaximum, $accuracy)
	{
		global $stmt;
		
		//INSERT FILE
		$stmt->prepare("INSERT INTO BackTesting.file 
						VALUES 
						(
							?,
							?,
							?, 
							?, 
							?,
							?
						)
						ON DUPLICATE KEY UPDATE
							buyingMinimum	=	VALUES(buyingMinimum),
							buyingMaximum	=	VALUES(buyingMaximum),
							sellingMinimum	=	VALUES(sellingMinimum),
							sellingMaximum	=	VALUES(sellingMaximum),
							accuracy		=	VALUES(accuracy)");
		$stmt->bind_param("dddddd", $fileID, $buyingMinimum, $buyingMaximum, $sellingMinimum, $sellingMaximum, $accuracy);
		$stmt->execute();
	}

?>