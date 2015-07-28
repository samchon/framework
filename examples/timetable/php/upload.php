<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<upload>\n";

	include("../ConDBi.php");
	
	$currentPath = "http://samchon.org/board/";
	$uploadPath = "upload/".$application."/".getID($application);
	if(is_dir($uploadPath) == false)
		mkdir($uploadPath);
	
	$fileName = basename($_FILES['Filedata']['name']);
	$finalName = $uploadPath."/".time()."_".rand()."_".$fileName;
	$exportName = $currentPath.$finalName;

	if(move_uploaded_file($_FILES['Filedata']['tmp_name'], $finalName)) {
		echo "	<result>1</result>\n";
		echo "	<fileName>".$fileName."</fileName>\n";
		echo "	<filePath>".$exportName."</filePath>\n";
	}else
		echo "	<result>0</result>\n";
		
	echo "</upload>\n";
	
?>