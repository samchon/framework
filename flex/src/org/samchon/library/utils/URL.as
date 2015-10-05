package org.samchon.library.utils
{
	import flash.external.ExternalInterface;
	import flash.net.URLVariables;

	/**
	 * <p>URL is a utility class gathering interaction functions with web (browser-side containing Flex SWF file).</p>
	 * 
	 * @author Jeongho Nam<br/>
	 * <a href="http://samchon.org" target="_blank">http://samchon.org</a>
	 */
	public class URL
	{
		/**
		 * <p>Get the URL which is containing Flex swf file</p>
		 * <p>Alert) MOVIE_URL doesn't contain the URLVariables</p>
		 */
		public static function get THIS_URL():String
		{
			var url:String = ExternalInterface.call("window.location.href.toString");
			if(url.indexOf("#") != -1)	url = url.substr(0, url.indexOf("#"));
			if(url.indexOf("?") != -1)	url = url.substr(0, url.indexOf("?"));
			
			url = url.substr(url.lastIndexOf("/") + 1);
			return url;
		}
		
		/**
		 * <p>Get the URLVariables (GET method) from URL</p>
		 * <p>ex) http://samchon.org/simulation/index.html?movie=montecarlo&amp;type=4&amp;code=005930</p>
		 * ---- -> returns "movie=montecarlo&amp;type=4&amp;code=005930";
		 */
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
		
		/**
		 * <p>Flash's original navigateToURL does not act in Internet Explorer.</p>
		 * <p>Instead, URL::navigateToURL calls the javascript's window.open</p>
		 */
		public static function navigateToURL(url:String, method:String = "_self"):void
		{
			ExternalInterface.call("window.open", url, method);
		}
		
		/**
		 * <p>Close the browser, literally</p>
		 */
		public static function closeWindow():void
		{
			ExternalInterface.call("close");
		}
		
		/**
		 * <p>Get the "movie" property from URLVariables in URL</p>
		 */
		public static function getMovieName():String
		{
			var uv:URLVariables = getParameters();
			if(uv == null || uv.hasOwnProperty("movie") == false)
				return null;
			else
				return uv["movie"];
		}
		/**
		 * <p>Navigate this window to another movie</p>
		 */
		public static function goWindow(movie:String):void
		{
			navigateToURL(THIS_URL + "?movie=" + movie);
		}
		/**
		 * <p>Create a new window having same movie</p>
		 */
		public static function goNewWindow():void
		{
			if(getMovieName() == null)
				navigateToURL(THIS_URL, "_blank");
			else
				navigateToURL(THIS_URL + "?movie=" + getMovieName(), "_blank");
		}
	}
}