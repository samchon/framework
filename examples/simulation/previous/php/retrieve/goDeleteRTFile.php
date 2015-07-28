<?

	function goDeleteRTFile($owner, $fidList)
	{
		global $stmt;
		
		//DELETE FROM NamTree.file
		$stmt->prepare("DELETE FROM Retrieve.file
						WHERE fileID IN
						(
							SELECT fileID FROM FileTree.file2
							WHERE 
								owner = ? AND 
								fileID IN ({$fidList})
						)");
		$stmt->bind_param("s", $owner);
		$stmt->execute();
	}
	
?>