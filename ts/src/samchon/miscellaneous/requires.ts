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

if (samchon.is_node() == true)
{
	global["std"] = require("typescript-stl");
	global["http"] = require("http");
	global["websocket"] = require("websocket");
	global["net"] = require("net");
}