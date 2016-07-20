/// <reference path="../API.ts" />

namespace samchon.library
{
	/**
	 * <p> URLVariables class is for representing variables of HTTP. </p>
	 * 
	 * <p> URLVariables class allows you to transfer variables between an application and server.
	 * When transfering, URLVariables will be converted to a URI string. </p>
	 * 
	 * <ul>
	 *	<li> URI: Uniform Resource Identifier </li>
	 * </ul>
	 * 
	 * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/URLVariables.html
	 * @author Migrated by Jeongho Nam <http://samchon.org>
	 */
	export class URLVariables
		extends std.HashMap<string, string>
	{
		/**
		 * Default Constructor.
		 */
		public constructor();

		/**
		 * <p> Construct from a URL-encoded string. </p>
		 * 
		 * <p> The {@link decode decode()} method is automatically called to convert the string to properties of the {@link URLVariables} object. </p>
		 * 
		 * @param str A URL-encoded string containing name/value pairs.
		 */
		public constructor(str: string);

		public constructor(str: string = "")
		{
			super();

			if (str != "")
				this.decode(str);
		}

		/**
		 * Converts the variable string to properties of the specified URLVariables object.
		 * 
		 * @param str A URL-encoded query string containing name/value pairs.
		 */
		public decode(str: string): void
		{
			this.clear();

			if (str.trim() == "")
				return;
			if (str.indexOf("?") != -1)
				str = str.substr(str.indexOf("?") + 1);

			var var_pairs: string[] = str.split("&");
			for (let i: number = 0; i < var_pairs.length; i++)
			{
				let equal_index: number = var_pairs[i].indexOf("=");
				let key: string;
				let value: string;

				if (equal_index == -1)
				{
					key = var_pairs[i];
					value = "";
				}
				else
				{
					key = var_pairs[i].substr(0, equal_index);
					name = decodeURIComponent(var_pairs[i].substr(equal_index + 1));
				}

				this.insert([key, name]);
			}
		}

		/**
		 * Returns a string containing all enumerable variables, in the MIME content encoding application/x-www-form-urlencoded.
		 */
		public toString(): string
		{
			let str: string = "";

			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
			{
				if (!it.equal_to(this.begin()))
					str += "&";

				str += it.first + "=" + encodeURIComponent(it.second);
			}
			return str;
		}
	}
}