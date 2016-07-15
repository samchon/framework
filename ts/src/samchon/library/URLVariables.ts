/// <reference path="../API.ts" />

namespace samchon.library
{
	export class URLVariables
		extends std.HashMap<string, string>
	{
		public constructor();
		public constructor(str: string);

		public constructor(str: string = "")
		{
			super();

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