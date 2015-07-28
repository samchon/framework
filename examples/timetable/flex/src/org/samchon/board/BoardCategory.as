package org.samchon.board
{
	import org.samchon.utils.StringUtil;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class BoardCategory
	{
		protected var _name:String;
		protected var _category:int;
		
		public function BoardCategory(xml:XML)
		{
			_name = StringUtil.decodeURI(xml.@name);
			_category = xml.@category;
		}
		public function get name():String	{	return _name;		}
		public function get category():int	{	return _category;	}
	}
}