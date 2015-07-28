<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<ReportList>\n";

	include("../../../ConDBi.php");
	include("getIndex.php");
	include("getReport.php");
	
	/*
	========================================================
		POST VARS
	========================================================
	*/
	$code = $_POST["code"];
	$standard = $_POST["standard"];
	$period = $_POST["period"];
	$length = $_POST["length"];

	if(!$code)	$code = "005930";
	if(!$standard)	$standard = 1;
	if(!$period)	$period = 4;
	if(!$length)	$length = 5;
	
	/*
	========================================================
		GET INDEX, REPORT
	========================================================
	*/
	echo getIndex();
	echo getReport(1);
	echo getReport(2);
	echo getReport(3);
	
	echo "</ReportList>";

?>