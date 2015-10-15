package org.samchon.utils
{
	import flash.external.ExternalInterface;
	import flash.net.URLVariables;

	public class URL
	{
		public static function get MOVIE_URL():String
		{
			var url:String = ExternalInterface.call("window.location.href.toString");
			if(url.indexOf("#") != -1)	url = url.substr(0, url.indexOf("#"));
			if(url.indexOf("?") != -1)	url = url.substr(0, url.indexOf("?"));
			
			url = url.substr(url.lastIndexOf("/") + 1);
			return url;
		}
		
		public static function getParameters():URLVariables
		{
			var url:String = ExternalInterface.call("window.location.href.toString");
			if(url.lastIndexOf("?") == -1)
				return null;
			else if(url.lastIndexOf("#") != -1)
				url = url.substr(0, url.lastIndexOf("#"));
			
			url = url.substr( url.lastIndexOf("?") + 1);
			return new URLVariables(url);
		}
		public static function navigateToURL(url:String, method:String = "_self"):void
		{
			ExternalInterface.call("window.open", url, method);
		}
		public static function closeWindow():void
		{
			ExternalInterface.call("close");
		}
		
		public static function getMovieName():String
		{
			var uv:URLVariables = getParameters();
			if(uv == null || uv.hasOwnProperty("movie") == false)
				return null;
			else
				return uv["movie"];
		}
		public static function goWindow(movie:String):void
		{
			navigateToURL(MOVIE_URL + "?movie=" + movie);
		}
		public static function goNewWindow():void
		{
			if(getMovieName() == null)
				navigateToURL(MOVIE_URL, "_blank");
			else
				navigateToURL(MOVIE_URL + "?movie=" + getMovieName(), "_blank");
		}
	}
}