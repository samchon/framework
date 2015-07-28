package org.samchon.hansung.score
{
	import mx.collections.ArrayList;
	
	import org.samchon.hansung.base.Major;
	import org.samchon.hansung.lecture.Lecture;
	import org.samchon.utils.StringUtil;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class MajorScore
	{
		protected var essential:int;
		protected var designated:int;
		protected var free:int;
		
		public function getTotal():int		{	return this.total;	}
		protected function get total():int	{	return essential + designated + free;	}
		
		protected var x:int;
		
		public function MajorScore(applyList:ArrayList, x:int)
		{
			this.x = x;
			compose(applyList, x);
		}
		protected function compose(applyList:ArrayList, x:int):void
		{
			essential = designated = free = 0;
			
			//학생정보에 기인한 전공정보 및 각각의 과목에서 딴 전공정보
			var studentMajor:Major = Root.student.at(x).getMajor();
			var major:Major;
			
			var lecture:*; //LECTURE가 될 수도 있고, APPLYCANDIDATE가 될 수도 있다.
			var lectureMajorCode:String;
			var kind:String;
			var credit:int;
			
			for(var i:int = 0; i < applyList.length; i++)
			{
				lecture = applyList.getItemAt(i);
				major = Root.majorList.at( lecture.getCode().substr(0, 3) );
				
				//해당 전공 내지 학부 전공이 아니면 무시
				if( major != studentMajor && major != studentMajor.getParent() )
					continue;
				
				credit = lecture.getCredit();
				kind = lecture.getKind();
				kind = kind.replace("복수", "").replace("복", "").replace("부", "");
				
				if(kind == "전기")		essential += credit;
				else if(kind == "전지")	designated += credit;
				else if(kind == "전선")	free += credit;
			}
		}
		
		public function toXML():String
		{
			return StringUtil.sprintf
				(
					"total{0}='{1}' essential{0}='{2}' designated{0}='{3}' free{0}='{4}'",
						x, total, essential, designated, free
				);
		}
	}
}