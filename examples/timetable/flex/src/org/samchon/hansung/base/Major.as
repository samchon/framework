package org.samchon.hansung.base 
{
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class Major 
	{
		protected var no:int;
		protected var name:String;
		protected var code:String;
		protected var url:String;
		protected var parent:Major;
		
		public function Major(no:int, name:String, code:String, url:String, parent:Major = null) 
		{
			this.no = no;
			this.name = name;
			this.code = code;
			this.url = url;
			this.parent = parent;
		}
		
		//METHODS FOR GET
		public function getNo():int			{	return no;		}
		public function getName():String	{	return name;	}
		public function getCode():String	{	return code;	}
		public function getURL():String		{	return url;		}
		public function getParent():Major	{	return parent;	}
		
		//METHODS FOR BINDING
		public function get $name():String	{	return getName();	}
		public function get $code():String	{	return getCode();	}
		public function get $url():String	{	return getURL();	}
	}

}