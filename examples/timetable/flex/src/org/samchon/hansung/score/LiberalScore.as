package org.samchon.hansung.score
{
	import mx.collections.ArrayList;
	
	import org.samchon.hansung.lecture.Lecture;
	import org.samchon.utils.StringUtil;
	
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class LiberalScore extends MajorScore
	{
		protected var coreA:int;
		protected var coreB:int;
		protected var normalSelection:int;
		protected override function get total():int	{	return essential + coreA + coreB + free + normalSelection;	}
		
		public function LiberalScore(applyList:ArrayList)
		{
			super(applyList, -1);
		}
		protected override function compose(applyList:ArrayList, x:int):void
		{
			essential = coreA = coreB = free = normalSelection = 0;
			
			var lecture:*;
			var kind:String;
			var credit:int;
			
			for(var i:int = 0; i < applyList.length; i++)
			{
				lecture = applyList.getItemAt(i);
				
				credit = lecture.getCredit();
				kind = lecture.getKind();
				
				if(kind == "교필")		essential += credit;
				else if(kind == "핵교A")	coreA += credit;
				else if(kind == "핵교B")	coreB += credit;
				else if(kind == "일교")	free += credit;
				else if(kind == "일선")	normalSelection += credit;
			}
		}
		
		public override function toXML():String
		{
			return StringUtil.sprintf
				(
					"liberalTotal='{0}' liberalEssential='{1}' liberalCoreA='{2}' liberalCoreB='{3}' liberalFree='{4}' normalSelection='{5}'",
					total, essential, coreA, coreB, free, normalSelection
				);
		}
	}
}