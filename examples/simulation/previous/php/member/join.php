<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<join>\n";

	include("../../../ConDBi.php");
	
	/*
	===============================================
		POST PARAM
	===============================================
	*/
	$application = APPLICATION_SIMULATION;
	$id = $_POST["id"];
	$name = $_POST["name"];
	$pass = $_POST["pass"];
	$comment = $_POST["comment"];
	
	//id, name, pass
	$stmt->prepare("INSERT INTO Member.list VALUES (?, ?, ?, ?)");
	$stmt->bind_param("dsss", $application, $id, $name, $pass);
	$stmt->execute();
	
	$result = $stmt->affected_rows;
	if($result == -1)	$result = 0;
	
	if($result == 1) {
		$category = "greet";
		
		$stmt->prepare("INSERT INTO Member.comment VALUES (?, ?, ?, ?)");
		$stmt->bind_param("dsss", $application, $category, $id, $comment);
		$stmt->execute();

		$_SESSION["id"] = $id;
	}
	echo sprintf("	<result>%d</result>\n", $result);
	echo "</join>";
	
	$stmt -> close();
	$mysqli -> close();

?>