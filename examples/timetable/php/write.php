<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<board>\n";

	include("../ConDBi.php");
	
	/*
	==============================================
		POST VARS
	==============================================
	*/
	$category = $_POST["category"];
	$id = getID($application);
	$title = $_POST["title"];
	$content = $_POST["content"];
	
	$stmt->prepare("INSERT INTO Board.board
					SELECT
						'', #auto_increment
						(SELECT IFNULL(max(pid), 0) + 1 FROM Board.board),
						?, #--> application
						?, #--> category
						
						?, #--> id,
						?, #--> title,
						?, #--> content,
						now(), #timestamp,
						
						0, #hit
						'A', #depth
						1 #live");
	$stmt -> bind_param("ddsss", $application, $category, $id, $title, $content);
	$stmt -> execute();
	
	$result = getResult($stmt);
	
	echo "	<result>".$result."</result>\n";
	echo "</board>";
	
	$stmt -> close();
	$mysqli -> close();

?>