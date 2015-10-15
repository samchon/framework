package org.samchon.socket
{
	import flash.net.*;

	public class HTTPService extends URLLoader
	{
		protected var urlRequest:URLRequest;
		public var addiction:Object;
		
		public function HTTPService(url:String = null, method:String = URLRequestMethod.POST)
		{
			super();
			urlRequest = new URLRequest();
			
			this.url = url;
			this.method = method;
			this.dataFormat = URLLoaderDataFormat.TEXT;
		}
		public function send(object:Object):void {
			var formData:URLVariables = new URLVariables();
			for (var field:String in object)
				formData[field] = object[field];
			
			urlRequest.data = formData;
			this.load(urlRequest);
		}
		
		public function get url():String				{	return urlRequest.url;		}
		public function get method():String				{	return urlRequest.method;	}
		
		public function set url(value:String):void		{	urlRequest.url = value;		}
		public function set method(value:String):void	{	urlRequest.method = value;	}
	}
}