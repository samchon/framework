package org.samchon.hansung.base 
{
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class SecondMajor 
	{
		public static const MAIN:int = 0;
		public static const PLURAL:int = 1;
		public static const MINOR:int = 2;
		
		protected var type:int;
		protected var majorNo:int;
		
		public function SecondMajor(type:int, majorNo:int) 
		{
			this.type = type;
			this.majorNo = majorNo;
		}
		public function getType():int {
			return type;
		}
		public function getMajor():Major {
			return Root.majorList.at( majorNo );
		}
		public function getMajorNo():int {
			return majorNo;
		}
		
	}

}