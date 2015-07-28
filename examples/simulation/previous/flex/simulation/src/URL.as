package
{
	import flash.external.ExternalInterface;
	import flash.net.URLRequest;
	import flash.net.navigateToURL;

	public class URL
	{
		//ROOT
		public static const HOST:String = "http://www.samchon.org/";
		public static const ROOT:String = HOST + "simulation/";
		public static const WINDOW:String = ROOT + "index.php";
		public static const PHP:String = ROOT + "php/";
		
		//FSOCKET
		public static const FSOCKET:String = HOST + "fsocket.php";
		
		//APPLICATION
		public static const APPLICATION:String = HOST + "application/";
		public static const APPLICATION_ABOUT:String = APPLICATION + "about.php";
		
		//MEMBER
		public static const MEMBER:String = PHP + "member/";
		public static const MEMBER_JOIN:String = MEMBER + "join.php";
		public static const MEMBER_INTRO:String = MEMBER + "intro.php";
		public static const MEMBER_LOGIN:String = MEMBER + "login.php";
		public static const MEMBER_LOGOUT:String = MEMBER + "logout.php";
		
		//CORPORATE
		public static const CORPORATE:String = PHP + "corporate/";
		public static const CORPORATE_LIST:String = CORPORATE + "list.php";
		
		//PRICE
		public static const PRICE:String = PHP + "price/";
		public static const PRICE_TODAY:String = "http://stock.daum.net/item/quote_hhmm_sub.daum";
		public static const PRICE_CANDLE:String = PRICE + "candle.php";
		public static const PRICE_SUMMARY:String = PRICE + "summary.php";
		
		//REPORT
		public static const REPORT:String = PHP + "report/";
		public static const REPORT_REPORT:String = REPORT + "report.php";
		
		//COMPARISON
		public static const COMPARISON:String = PHP + "comparison/";
		public static const COMPARISON_COMPARISON:String = COMPARISON + "comparison.php";
		public static const COMPARISON_EXAMPLE:String = COMPARISON + "example.php";
		
		//HISTORY
		public static const HISTORY:String = PHP + "history/";
		public static const HISTORY_LIST:String = HISTORY + "historyList.php";
		public static const HISTORY_HISTORY:String = HISTORY + "history.php";
		
		//DOWNLOAD
		public static const DOWNLOAD:String = HOST + "download/simulation/";
		public static const DOWNLOAD_MANUAL:String = DOWNLOAD + "manual.pdf";
		
		//BOARD
		public static const BOARD:String = HOST + "board/";
		public static const BOARD_CATEGORY:String = BOARD + "category.php";
		public static const BOARD_LIST:String = BOARD + "list.php";
		public static const BOARD_READ:String = BOARD + "read.php";
		public static const BOARD_WRITE:String = BOARD + "write.php";
		public static const BOARD_REPLY:String = BOARD + "reply.php";
		public static const BOARD_MODIFY:String = BOARD + "modify.php";
		public static const BOARD_DELETE:String = BOARD + "delete.php";
		public static const BOARD_UPLOAD:String = BOARD + "upload.php";
		
		public static function navigateToURL(url:String, method:String):void 
		{
			if(Compiler.LOCAL_FLAG == true)
				flash.net.navigateToURL( new URLRequest(url), method );
			else
				ExternalInterface.call("navigateToURL", url, method);
		}
		public static function openNewWindow(url:String):void {
			navigateToURL(url, "_blank");
		}
		
		/* 
		=============================================================
			NAM-TREE SET
		=============================================================
		*/
		//FILE-TREE
		public static const FILETREE:String = HOST + "fileTree/";
		public static const FILETREE_LIST:String = FILETREE + "fileList.php";
		public static const FILETREE_CREATE:String = FILETREE + "fileCreate.php";
		public static const FILETREE_DELETE:String = FILETREE + "fileDelete.php";
		public static const FILETREE_SAVE:String = FILETREE + "fileSave";
		
		//NAM-FILE-TREE
		public static const NAMTREE:String = HOST + "namTree/";
		public static const NAMTREE_FILE_LIST:String = NAMTREE + "fileList.php";
		public static const NAMTREE_FILE_CREATE:String = NAMTREE + "fileCreate.php";
		public static const NAMTREE_FILE_DELETE:String = NAMTREE + "fileDelete.php";
		public static const NAMTREE_SAVE:String = NAMTREE + "fileSave.php";
		public static const NAMTREE_BASE_PARAMETER_LIST:String = NAMTREE + "baseParameterList.php";
		public static const NAMTREE_COMMON_PARAMTER_LIST:String = NAMTREE + "commonParameterList.php";
		
		//RETRIEVE-FILE-TREE
		public static const RETRIEVE:String = PHP + "retrieve/";
		public static const RETRIEVE_TREE_LIST:String = RETRIEVE + "fileList.php";
		public static const RETRIEVE_TREE_CREATE:String = RETRIEVE + "fileCreate.php";
		public static const RETRIEVE_TREE_DELETE:String = RETRIEVE + "fileDelete.php";
		public static const RETRIEVE_TREE_SAVE:String = RETRIEVE + "fileSave.php";
		public static const RETRIEVE_HISTORY_LIST:String = RETRIEVE + "historyList.php";
		
		//BACKTESTING-FILE-TREE
		public static const BACKTESTING:String = PHP + "backTesting/";
		public static const BACKTESTING_FILE_LIST:String = BACKTESTING + "fileList.php";
		public static const BACKTESTING_FILE_CREATE:String = BACKTESTING + "fileCreate.php";
		public static const BACKTESTING_FILE_DELETE:String = BACKTESTING + "fileDelete.php";
		public static const BACKTESTING_FILE_SAVE:String = BACKTESTING + "fileSave.php";
	}
}