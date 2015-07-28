package org.samchon.hansung.base 
{
	import mx.collections.ArrayCollection;
	import mx.collections.ArrayList;
	
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public dynamic class MajorList extends ArrayList 
	{
		
		public function MajorList() 
		{
			super();
			
			this.addItem( new Major(0, "한국어문학부", "KOR", "A030") ); //0
			this.addItem( new Major(1, "영어영문학부", "ENG", "A040") ); //1
			this.addItem( new Major(2, "역사문화학부", "HIS", "A050") ); //2
			this.addItem( new Major(3, "지식정보학부", "LIS", "A060") ); //3
			this.addItem( new Major(4, "경영학부", "MGT", "D040") ); //4
			this.addItem( new Major(5, "무역학과", "TRA", "D121") ); //5
			this.addItem( new Major(6, "경제학과", "ECM", "D132") ); //6
			this.addItem( new Major(7, "행정학과", "PUB", "D142") ); //7
			this.addItem( new Major(8, "부동산학과", "EST", "D172") ); //8
			this.addItem( new Major(9, "부동산경영학과", "REM", "D181") ); //9
			this.addItem( new Major(10, "의생활학부", "DFB", "G010") ); //10
			this.addItem( new Major(11, "의류패션산업전공", "AFB", "G012", this.at("DFB")) ); //11
			this.addItem( new Major(12, "패션디자인전공", "FAS", "G013", this.at("DFB")) ); //12
			this.addItem( new Major(13, "인테리어디자인전공", "INT", "G033") ); //13
			this.addItem( new Major(14, "시각·영상디자인전공", "VIS", "G036") ); //14
			this.addItem( new Major(15, "인터랙티브엔터테인먼트", "ITA", "G038") ); //15
			this.addItem( new Major(16, "애니메이션·제품디자인전공", "ANP", "G039") ); //16
			this.addItem( new Major(17, "무용학과", "DAN", "G111") ); //17
			this.addItem( new Major(18, "회화과", "PAI", "G161") ); //18
			this.addItem( new Major(19, "멀티미디어공학과", "MME", "K101") ); //19
			this.addItem( new Major(20,"컴퓨터공학과", "COM", "K111") ); //20
			this.addItem( new Major(21, "정보 통신공학과", "ICE", "K121") ); //21
			this.addItem( new Major(22, "정보시스템공학과", "ISE", "K131") ); //22
			this.addItem( new Major(23, "기계시스템공학과", "MEC", "K151") ); //23
			this.addItem( new Major(24, "산업경영공학과", "IND", "K161") ); //24
			this.addItem( new Major(25, "지식서비스·컨설팅연계전공", "KSC", "K511") ); //25
			this.addItem( new Major(26, "교직", "EDU", "N110") ); //26
			this.addItem( new Major(27, "교양", "GEN", "L110") ); //27
		}
		public override function addItem(object:Object):void {
			var major:Major = object as Major;
			
			this[major.getCode()] = major;
			super.addItem(major);
			
			if(major.getCode() == "GEN") {
				this["REQ"] = major;
				this["CAE"] = major; 
				this["CBE"] = major;
				this["CAA"] = major;
				this["CBA"] = major;
				this["CAH"] = major;
				this["CBH"] = major;
				this["CAS"] = major;
				this["CBS"] = major;
			}
		}
		public function at(x:*):Major
		{
			if(x is int)			return getItemAt(x) as Major;
			else if(x is String)	return this[x] as Major;
			else					return null;
		}
	}

}