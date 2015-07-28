package org.samchon.utils
{
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	
	public class AddedURLLoader extends URLLoader
	{
		public function AddedURLLoader(request:URLRequest=null)
		{
			super(request);
		}
	}
}