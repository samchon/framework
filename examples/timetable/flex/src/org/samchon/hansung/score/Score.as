package org.samchon.hansung.score
{
	import mx.collections.ArrayList;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class Score extends ArrayList
	{
		public var applyList:ArrayList;
		protected var label:String;
		
		public function Score(label:String)
		{
			this.label = label;
			construct( new ArrayList() );
		}
		public function construct(applyList:ArrayList):void
		{
			this.removeAll();
			
			//중복을 검사하여 제거함
			//같은 학기 간에도 중복이 생길 수 있음 -> 정규학기 + 계절학기
			var i:int;	var j:int;
			for(i = applyList.length - 1; i >= 0; i--)
				for(j = 0; j < i; j++)
					if( applyList.getItemAt(i).getCode() == applyList.getItemAt(j).getCode() )
					{
						applyList.removeItemAt(i);
						break;
					}
					
			for(i = 0; i < Root.timetable.student.length; i++)
				this.addItem( new MajorScore(applyList, i) );
			this.addItem( new LiberalScore(applyList) );
			
			this.applyList = applyList;
		}
		public function at(x:int):MajorScore
		{
			return this.getItemAt(x) as MajorScore;
		}
		
		public function get total():int
		{
			var value:int = 0;
			for(var i:int = 0; i < this.length; i++)
				value += this.at(i).getTotal();
			
			return value;
		}
		public function toXML(hasChild:Boolean = false):String
		{
			/* -----------------------------------------------
				기존 학점의 경우,
					기존 학점의 총점을 부모로 하여,
					각 학기의 학점을 자식으로 가지게 된다
			----------------------------------------------- */
			var xml:String = "<score label='" + label + "' total='" + this.total + "'";
			
			//기록
			for(var i:int = 0; i < this.length; i++)
				xml += " " + this.at(i).toXML();
			
			//자식이 있냐 없냐에 따라 노드를 여냐 닫냐를 결정함
			if(hasChild == true)
				xml += ">";
			else
				xml += " />";
			
			return xml;
		}
	}
}