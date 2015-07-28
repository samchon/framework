<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<fileTree>\n";

	include("../../../ConDBi.php");
	include("../../../fileTree/goCreateFile.php");
	include("../../../namTree/goDeleteNTParameter.php");
	include("../../../namTree/goCreateNTFile.php");
	include("goCreateBTFile.php");
	
	$owner = "samchon";
	$result = 1;
	
	/*
	===========================================================
		POST VARS
	===========================================================
	*/
	$fileID = $_POST["fileID"];
	$parentID = $_POST["parentID"];
	$application = $_POST["application"];
	$category = $_POST["category"];
	
	$name = $_POST["name"];
	//$extension = $_POST["extension"]; //*.ntr
	//$content = $_POST["comtent"]; -> NULL
	$comment = $_POST["comment"];
	
	$header = $_POST["header"];
	$getFunction = $_POST["getFunction"];
	$composerFunction = $_POST["composerFunction"];
	$returnType = $_POST["returnType"]; //Number, String
	$otherside = $_POST["otherside"];
	
	$parameterList = $_POST["parameterList"];
	$parameterDeterminedList = $_POST["parameterDeterminedList"];
	
	$buyingMinimum = $_POST["buyingMinimum"];
	$buyingMaximum = $_POST["buyingMaximum"];
	$sellingMinimum = $_POST["sellingMinimum"];
	$sellingMaximum = $_POST["sellingMaximum"];
	$accuracy = $_POST["accuracy"];
	
	$application = $_POST["application"];
	$owner = getID($application);
	
	if(!$application)	$application = 1;
	if(!$owner)			$owner = "test";
	
	/*
	===========================================================
		CALL THE FUNCTION
	===========================================================
	*/
	$fileID = goCreateFile($application, $category, $fileID, $parentID, $owner, $name, "ntr", $content, $comment);
	goDeleteNTParameter($owner, $fileID);
	
	goCreateNTFile($fileID, $header, $getFunction, $composerFunction, $returnType, $otherside, $parameterList, $parameterDeterminedList);
	
	if($buyingMinimum)
		goCreateBTFile($fileID, $buyingMinimum, $buyingMaximum, $sellingMinimum, $sellingMaximum, $accuracy);
	
	echo "</fileTree>";
	
	$stmt -> close();
	$mysqli -> close();

?>