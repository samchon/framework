package org.samchon.hansung.apply
{
	import org.samchon.hansung.base.Major;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class ApplyCandidate
	{
		protected var major:Major = null;
		
		protected var code:String;
		protected var name:String;
		protected var divide:String = null;
		protected var kind:String;
		protected var credit:int;
		
		public function ApplyCandidate(code:String, name:String, kind:String, credit:int)
		{
			if( Root.majorList.hasOwnProperty( code.substr(0, 3) ) == true)
				major = Root.majorList.at( code.substr(0, 3) );
			
			this.code = code;
			this.name = name;
			//this.divide = divide;
			//DIVIDE는 성적누적조회에 정보가 없어 따로이 찾아야 함
			this.kind = kind;
			this.credit = credit;
		}
		public function getMajor():Major	{	return this.major;	}
		public function getName():String	{	return this.name;	}
		public function getCode():String	{	return this.code;	}
		public function getDivide():String	{	return this.divide;	}
		public function getKind():String	{	return this.kind;	}
		public function getCredit():int		{	return this.credit;	}
		
		public function setKind(value:String):void
		{
			this.kind = value;
		}
		public function setDivide(value:String):void
		{
			this.divide = value;
		}
	}
}