<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<board>\n";

	include("../ConDBi.php");
	
	/*
	==============================================
		POST VARS
	==============================================
	*/
	//application info
	$category = $_POST["category"];
	
	//retrieve
	$retrieveField = $_POST["retrieveField"];
	$retrieveValue  = $_POST["retrieveValue"];
	
	//page information
	$a_pagenum = $_POST["a_pagenum"];	if(!$a_pagenum)	$a_pagenum = 100;
	$page = $_POST["page"];				if(!$page)		$page = 1;
	
	/*
	==============================================
		GET TOTAL RECORD NUMBER
	==============================================
	*/
	if($retrieveField)
		$stmt->prepare("SELECT count(*) FROM Board.board 
						WHERE application = ? AND category = ? AND live = 1 AND
								{$retrieveField} LIKE '%{$retrieveValue}%'");
	else
		$stmt->prepare("SELECT count(*) FROM Board.board 
						WHERE application = ? AND category = ? AND live = 1");
	
	$stmt -> bind_param("dd", $application, $category);
	$stmt -> execute();
	$stmt -> bind_result($total_num); //--> count(*) to $total_num
	$stmt -> fetch();
	
	$totalPage = ceil($total_num/$a_pagenum);
	$first = $a_pagenum*($page-1);
	
	/*
	==============================================
		GET RECORDS
	==============================================
	*/
	$query = "
			SELECT	B.uid, concat(M.name, '(', M.id, ')') nickname,
					CONCAT( LPAD('', LENGTH(B.depth) - 1, '\t'), B.title ) title,
					CASE date_format(B.timestamp, '%Y-%m-%d') != date_format(now(), '%Y-%m-%d')
						WHEN TRUE THEN 
							date_format(B.timestamp, '%Y-%m-%d')
						ELSE 
							date_format(B.timestamp, '%H:%i:%s')
					END timestamp,
					B.hit
					
			FROM	Board.board B, Member.list M
					
			WHERE	B.id = M.id AND
					B.application = ? AND B.category = ? AND B.live = 1";
			
	if($retrieveField)
		$query.= " AND {$retrieveField} LIKE '%{$retrieveValue}%'";
	$query.= "\nORDER BY B.pid DESC, B.depth ASC LIMIT ?, ?";

	$stmt -> prepare($query);
	$stmt -> bind_param("dddd", $application, $category, $first, $a_pagenum);
	$stmt -> execute();
	
	//TO XML
	echo getRecordXML($stmt, "list", 1, false, true, true);
	echo "	<totalPage>".$totalPage."</totalPage>\n";
	echo "</board>";
	
	$stmt -> close();
	$mysqli -> close();

?>