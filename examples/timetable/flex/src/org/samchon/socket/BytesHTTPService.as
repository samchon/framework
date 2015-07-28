package org.samchon.socket
{
	import flash.net.*;
	import flash.utils.ByteArray;
	
	import org.samchon.utils.StringUtil;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class BytesHTTPService extends HTTPService
	{
		public function BytesHTTPService(url:String = null, method:String = URLRequestMethod.POST)
		{
			super(url, method);
			this.dataFormat = URLLoaderDataFormat.BINARY;
		}
		public function get replyData():String
		{
			var text:String = encode(super.data);
			text = StringUtil.replace(text, "&nbsp;", " ");
			
			return text;
		}
		protected static function encode(bytes:ByteArray):String {
			if(
				(bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF) ||						//UTF-8 with BOM
				(bytes[0] == 0xFE && bytes[1] == 0xFF) ||											//UTF-16 Big Endian
				(bytes[0] == 0xFF && bytes[1] == 0xFE) ||											//UTF-16 Little Endian
				(bytes[0] == 0x0  && bytes[1] == 0x0  && bytes[2] == 0xFE && bytes[3] == 0xFF) ||	//UTF-32 Big Endian
				(bytes[0] == 0xFF && bytes[1] == 0xFE && bytes[2] == 0x0  && bytes[3] == 0x0)
			)
				return bytes.toString();
			
			//기타
			var ansiStr:String = bytes.readMultiByte(bytes.bytesAvailable, "ANSI");
			var unicodeStr:String = bytes.toString();
			
			if(ansiStr.length < unicodeStr.length)
				return ansiStr;
			else
				return unicodeStr;
		}
	}
}