<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<login>\n";

	$application = APPLICATION_SIMULATION;
	include("../../../ConDBi.php");
	
	/*
	===============================================
		POST PARAM
	===============================================
	*/
	$id = $_POST["id"];
	$pass = $_POST["pass"];
	
	//INSPECT
	$stmt->prepare("SELECT pass FROM Member.list 
					WHERE id = ?");
	$stmt->bind_param("s", $id);
	$resultMaps = getRecordMaps($stmt);
	
	if(count($resultMaps) == 0) {
		$result = 0;
		$reason = "id";
	} else {
		if($pass == $resultMaps[0]->pass) {
			//SUCCESSED
			$result = 1;
			$_SESSION["simulationID"] = $id;
			$reason = $id;
		}
		else {
			$result = 0;
			$reason = "password";
		}
	}
	//TO XML
	echo sprintf("	<result>%d</result>\n", $result);
	//if($result == 0)
		echo sprintf("	<reason>%s</reason>\n", $reason);
	echo "</login>";
	
	//RECORD LOGIN HISTORY
	if($reason != "id") {
		$stmt->prepare("INSERT INTO Member.login VALUES(?, ?, now(), ?, ?)");
		$stmt->bind_param("dssd", $application, $id, $ip, $result);
		$stmt->execute();
	}
	
	$stmt -> close();
	$mysqli -> close();
?>