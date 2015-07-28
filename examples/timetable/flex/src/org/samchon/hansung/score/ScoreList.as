package org.samchon.hansung.score
{
	import mx.collections.ArrayList;
	
	import org.samchon.hansung.HistorySubjectList;
	import org.samchon.utils.StringUtil;
	
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class ScoreList extends ArrayList
	{
		public function ScoreList(source:Array=null)
		{
			super(source);
		}
		public function at(x:int):Score
		{
			return this.getItemAt(x) as Score;
		}
		
		public function toXMLList(year:int, semester:int = -1):XMLList
		{	
			var x:int;
			var i:int;
			
			if(semester == -1)
				x = year;
			else
				for(x = 0; x < Root.timetable.length; x++)
					if( Root.timetable.at(x).getYear() == year && Root.timetable.at(x).getSemester() )
						break;
			
			/* ----------------------------------------------------
				이전-전체 수강과목 리스트  및 Score 구성
			---------------------------------------------------- */
			var prevScore:Score = getTotalScore("기존 학점", x - 1);
			var totalScore:Score = getTotalScore("총 학점", x);
			
			/* ----------------------------------------------------
				XML 문자열 구성
			---------------------------------------------------- */
			var xml:String = 
				"<score>\n" +
				"	" + prevScore.toXML(true) + "\n";
			
			///과거 학점 구성
			for(i = 0; i < x; i++)
				xml += "\t\t" + this.at(i).toXML() + "\n";
			xml += "	</score>\n";
			
			//마지막은 그 title을 현재 학점으로 변경
			var lastXML:String = this.at(i).toXML();
			lastXML = lastXML.replace( StringUtil.between(lastXML, "label='", "'"), "현재 학점" );
			xml += "	" + lastXML + "\n";
			
			xml += "	" + totalScore.toXML() + "\n";
			xml += "</score>";
			
			var xmlList:XMLList = new XML(xml).score;
			return xmlList;
		}
		protected function getTotalScore(label:String, x:int):Score
		{
			var totalList:ArrayList = new ArrayList();
			
			//모든 학기의 멤버를 한 리스트에 다 합침
			for(var i:int = 0; i <= x; i++)
				totalList.addAll( this.at(i).applyList );
			
			var score:Score = new Score(label);
			score.construct(totalList);
			
			return score;
		}
	}
}