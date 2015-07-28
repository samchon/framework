<?
	function getCategory() {
		global $stmt, $code;
		
		$stmt->prepare("SELECT * FROM Report.component
					WHERE code = ? AND report = 2 AND standard = 1 AND
						  name IN ('매출액', '매출액(수익)')");
		$stmt->bind_param("s", $code);
		getRecordMaps($stmt, false);
		
		if($stmt->num_rows)
			$category = 1;
		else
			$category = 2;
			
		$stmt->free_result();
		return $category;
	}

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<summary>\n";

	include("../../../ConDBi.php");
	include("summary/getPrice.php");
	include("summary/getIndex.php");
	include("summary/getBS.php");
	include("summary/getPNL.php");
	
	/*
	===============================================
		POST PARAM and GLOBAL VARIABLE
	===============================================
	*/
	//$stmt;
	$code		=	$_POST["code"];
	if(!$code)	$code = "005930";
	
	/*
	===============================================
		To construct XMLList
	===============================================
	*/
	$category = getCategory();
	echo getPrice();		//COMPANY & PRICE
	echo "	<gaap>\n";
		echo getIndex(1);
		echo getBS(1);
		echo getPNL(1);
	echo "	</gaap>\n";
	echo "	<ifrs>\n";
		echo getIndex(2);
		echo getBS(2);
		echo getPNL(2);
	echo "	</ifrs>\n";
	//getPrice -> getIndex($price)
	
	/*
	===============================================
		TERMINATING
	===============================================
	*/
	echo "</summary>";
	$stmt -> close();
	$mysqli -> close();
	
?>