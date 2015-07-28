<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<fileList>\n";

	include("../../../ConDBi.php");
	
//INCLUDE PARENTS' CLASS
	include("../../../fileTree/FTFolder.php");
	include("../../../fileTree/FTFile.php");
	include("../../../fileTree/FTFileList.php");
	
//NAMTREES' CLASS
	include("../../../namTree/NTParameter.php");
	include("../../../namTree/NTParameterDetermined.php");
	include("../../../namTree/NTFile.php");
	include("../../../namTree/NTFileList.php");
	
//CURRENTS
	include("BTFileList.php");
	include("BTFile.php");

//POST VARS
	$application = $_POST["application"];
	$category = $_POST["category"];
	$owner = getID($application);
	
	if(!$application)	$application = 1;
	if(!$category)		$category = 1003;
	if(!$owner)			$owner = "test";

//CONTENTS
	$fileList = new BTFileList();
	$fileList->load();
	
	echo $fileList->toXML();
	echo "</fileList>";
	
	$stmt -> close();
	$mysqli -> close();

?>