package org.samchon.board
{
	import org.samchon.utils.StringUtil;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class BoardList
	{
		protected var _uid:int;
		protected var _title:String;
		protected var _nickname:String;
		protected var _hit:int;
		protected var _timestamp:String;
		
		public function BoardList(xml:XML)
		{
			_uid		=							xml.@uid;
			_title	=	StringUtil.decodeURI(	xml.@title	);
			_nickname	=	StringUtil.decodeURI(	xml.@nickname	);
			_hit		=							xml.@hit;
			_timestamp	=	StringUtil.decodeURI(	xml.@timestamp	);
		}
		public function get uid():int			{	return _uid;		}
		public function get title():String		{	return _title;		}
		public function get nickname():String	{	return _nickname;	}
		public function get hit():int			{	return _hit;		}
		public function get timestamp():String	{	return _timestamp;	}
	}
}