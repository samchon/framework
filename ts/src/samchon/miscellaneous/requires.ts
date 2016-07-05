namespace samchon
{
	/**
	 * <p> Running on Node. </p>
	 * 
	 * <p> Test whether the JavaScript is running on Node. </p>
	 * 
	 * @references http://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
	 */
	export function is_node(): boolean
	{
		if (typeof process === "object")
			if (typeof process.versions === "object")
				if (typeof process.versions.node !== "undefined")
					return true;

		return false;
	}
}

namespace samchon
{
	export declare var http: typeof NodeJS.http;
	export declare var websocket: typeof __websocket;
	export declare var net: typeof NodeJS.net;
}

if (samchon.is_node() == true)
{
	global["std"] = require("typescript-stl");
	samchon.http = require("http");
	samchon.websocket = require("websocket");
	samchon.net = require("net");
}