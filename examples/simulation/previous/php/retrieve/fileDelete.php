<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<fileTree>\n";

	include("../../../ConDBi.php");
	include("../../../fileTree/goDeleteFile.php");
	include("../../../namTree/goDeleteNTFile.php");
	include("goDeleteRTFile.php");
	include("../../../namTree/goDeleteNTParameter.php");
	
	$fidList = $_POST["fidList"];
	$application = $_POST["application"];
	$owner = getID($application);
	
	if(!$application)	$application = 1;
	if(!$owner)			$owner = "test";
	
	goDeleteFile($owner, $fidList);
	goDeleteNTFile($owner, $fidList);
	goDeleteRTFile($owner, $fidList);
	goDeleteNTParameter($owner, $fidList);
	
	echo "	<result>1</result>\n";
	echo "</fileTree>";
	
	$stmt -> close();
	$mysqli -> close();

?>