package org.samchon.hansung.lecture 
{
	import mx.collections.ArrayList;
	
	import org.samchon.hansung.SubjectList;
	import org.samchon.hansung.base.Major;
	import org.samchon.hansung.base.SecondMajor;
	import org.samchon.utils.StringUtil;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public dynamic class Subject extends ArrayList 
	{
		protected var major:Major;
		protected var code:String;
		protected var name:String;
		protected var kind:String;
		protected var grade:int;
		protected var credit:int;
		
		/* ------------------------------------------------------------
			CONSTRUCTOR AND LIST METHODS
		------------------------------------------------------------ */
		public function Subject(major:Major, code:String, name:String, kind:String, grade:int, credit:int) 
		{
			super();
			
			//전공과목에 대한 적절한 분류 -> 전공, 다전공, 일선
			if(major != Root.majorList.at("GEN")) //교양이 아닐 때
			{
				var studentMajor:Major;
				var i:int;
				
				for(i = 0; i < Root.student.length; i++)
				{
					//학생의 전공정보 객체
					studentMajor = Root.student.at(i).getMajor();
					
					//해당 과목이 전공 내지 다전공에 해당할 時,
					if( major == studentMajor || major == studentMajor.getParent() )
					{
						switch( Root.student.at(i).getType() )
						{
							case SecondMajor.PLURAL:
								kind = "복수" + kind;
								break;
							case SecondMajor.MINOR:
								kind = "부" + kind;
								break;
						}
						break;
					}
				}
				if(i == Root.student.length)
					kind = "일선";
			}
			this.major = major;
			this.code = code;
			this.name = name;
			this.kind = kind;
			this.grade = grade;
			this.credit = credit;
		}
		public override function addItem(item:Object):void
		{
			var lecture:Lecture = item as Lecture;
			
			super.addItem(lecture);
			this[lecture.getDivide()] = lecture;
		}
		public function at(x:*):Lecture 
		{
			if(x is int)			return getItemAt(x) as Lecture;
			else if(x is String)	return this[x] as Lecture;
			else					return null;
		}
		
		/* ------------------------------------------------------------
			자식 구성 -> Lecture
		------------------------------------------------------------ */
		public function constructChilds(rowArray:Array):void
		{
			//파싱에 쓸 변수
			var colArray:Array;
			
			var lecture:Lecture = null;
			var divide:String; //5열
			var professor:String; //8열
			var mid:int; //6열
			var link:String; //5열 분반의 링크
			
			for(var i:int = 0; i < rowArray.length; i++)
			{
				colArray = StringUtil.betweens( rowArray[i], "<td", "/td>" );

				//lecture가 없다면, 계속 진행
				if( colArray[5].indexOf("title='강의계획서조회'>") == -1 )
				{
					//이게 rowArray의 마지막일 경우,
					if(i == rowArray.length - 1)
						lecture.constructChilds(rowArray);
					continue;
				}
				
				//멤버 변수 정의
				divide = getValue( StringUtil.between(colArray[5], "title='강의계획서조회'>", "</a>") );
				professor = getValue( colArray[8] );
				mid = ( getValue( colArray[6] ) == "주" ) ? 1 : 2;
				link = StringUtil.between(colArray[5], "Javascript:letturerplanview('", "'");
				
				//기존 lecture가 있다면, 기존 lecture에 constructChilds에 기록하고,
				if(lecture != null)
				{
					lecture.constructChilds(rowArray.splice(0, i));
					i = 0;
				}
				
				//새 lecture를 구성한다
				lecture = new Lecture(this, divide, professor, mid, link);
				this.addItem(lecture);
				
				//새 lecture를 구성했는데 이게 마지막 번호였다면, -> 1시간짜리 과목
				//바로 constructChilds 구성
				if(i == rowArray.length - 1)
					lecture.constructChilds(rowArray);
			}
		}
		protected function getValue(col:String):String
		{
			return SubjectList.getValue(col);
		}
		
		/* ------------------------------------------------------------
			GET METHODS
		------------------------------------------------------------ */
		public function getMajor():Major	{	return major;	}
		public function getCode():String	{	return code;	}
		public function getName():String	{	return name;	}
		public function getKind():String	{	return kind;	}
		public function getGrade():int		{	return grade;	}
		public function getCredit():int		{	return credit;	}
	}
}