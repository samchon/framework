package  
{
	import flash.external.ExternalInterface;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class URL 
	{
		//ROOT
		public static const HOST:String = "http://www.samchon.org/";
		public static const ROOT:String = HOST + "simulation/";
		public static const WINDOW:String = ROOT + "index.php";
		public static const PHP:String = ROOT + "php/";
		
		//APPLICATION
		public static const APPLICATION:String = HOST + "application/";
		public static const APPLICATION_ABOUT:String = APPLICATION + "about.php";
		public static const APPLICATION_POPUP:String = APPLICATION + "popUp.php";
		
		//FSOCKET
		public static const FSOCKET:String = HOST + "fsocket.php";
		
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
		
		//DOWNLOAD
		public static const DOWNLOAD:String = HOST + "download/hansung/";
		public static const DOWNLOAD_MANUAL:String = DOWNLOAD + "manual.pdf";
		public static const DOWNLOAD_POSTER:String = DOWNLOAD + "poster.png";
		
		public static function navigateToURL(url:String, method:String):void 
		{
			ExternalInterface.call("navigateToURL", url, method);
		}
		public static function openNewWindow(url:String):void {
			navigateToURL(url, "_blank");
		}
		
		//HANSUNG INFORMATION SYSTEM
		public static const LOGIN:String = "http://info.hansung.ac.kr/servlet/s_gong.gong_login_ssl";			//로그인
		public static const SEMESTER:String = "http://info.hansung.ac.kr/servlet/s_jik.jik_siganpyo_s_up";		//년도, 학기를 알아보기 위한 공간
		public static const PROFILE:String = "http://info.hansung.ac.kr/fuz/common/include/default/top.jsp";	//이름, 전공을 알아보기 위한 공간
		public static const LECTURE:String = "http://info.hansung.ac.kr/servlet/s_jik.jik_siganpyo_s_list";		//강의계획서 조회
			//http://info.hansung.ac.kr/servlet/s_jik.jik_siganpyo_s_list?year=2013&semester=1&majorcode=K131
		
		public static const DIVIDE:String = "http://info.hansung.ac.kr/jsp/suup_pyunga/suup_pyunga_result_h.jsp";	//강의만족도 - 과거 시간표의 분반을 여기서 구한다.
		public static const HISTORY:String = "http://info.hansung.ac.kr/fuz/seongjeok/seongjeok.jsp";				//성적조회(누적) - 과목 코드를 구함
		
		//ETC
		public static const HANSUNG:String = HOST + "hansung/";														//게시판, 업데이터 정보
		public static const VERSION:String = HOST + "application/version.php";
		public static const GET_SEMESTER:String = HANSUNG + "semester.php";

	}
}