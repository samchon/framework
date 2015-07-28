package org.samchon.socket
{
	import flash.net.*;
	import flash.utils.ByteArray;
	
	import org.samchon.utils.StringUtil;
	
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class HTTPService extends URLLoader
	{
		protected var urlRequest:URLRequest;
		public var addiction:Object;
		
		public function HTTPService(url:String = null, method:String = URLRequestMethod.POST)
		{
			super();
			if(url)	urlRequest = new URLRequest(url);
			else	urlRequest = new URLRequest();
			urlRequest.method = method;
		}
		public function send(object:Object = null):void {
			if(object != null)
			{
				var formData:URLVariables = new URLVariables();
				for (var field:String in object)
					formData[field] = object[field];
				
				urlRequest.data = formData;
			}
			this.load(urlRequest);
		}
		public function get url():String				{	return urlRequest.url;		}
		public function get method():String				{	return urlRequest.method;	}
		
		public function set url(value:String):void		{	urlRequest.url = value;		}
		public function set method(value:String):void	{	urlRequest.method = value;	}
	}
}