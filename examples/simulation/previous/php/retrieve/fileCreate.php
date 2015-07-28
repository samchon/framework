<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<fileTree>\n";

	include("../../../ConDBi.php");
	include("../../../fileTree/goCreateFile.php");
	include("../../../namTree/goDeleteNTParameter.php");
	include("../../../namTree/goCreateNTFile.php");
	include("goCreateRTFile.php");
	
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
	
	$priceLength = $_POST["priceLength"];
	$indexLength = $_POST["indexLength"];
	
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
	goCreateRTFile($fileID, $priceLength, $indexLength);
	
	echo "</fileTree>";
	
	$stmt -> close();
	$mysqli -> close();

?>