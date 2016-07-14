/**
 * <h1> Samchon-Framework </h1>
 * 
 * <p> <a href="https://nodei.co/npm/samchon-framework">
 *	<img src="https://nodei.co/npm/samchon-framework.png?downloads=true&downloadRank=true&stars=true"> </a> </p>
 * 
 * <p> Samchon, a SDN (Software Defined Network) framework. </p>
 * 
 * <p> With Samchon Framework, you can implement distributed processing system within framework of OOD like
 * handling S/W objects (classes). You can realize cloud and distributed system very easily with provided
 * system templates and even integration with C++ is possible. </p>
 * 
 * <p> The goal, ultimate utilization model of Samchon Framework is, building cloud system with NodeJS and 
 * take heavy works to C++ distributed systems with provided modules (system templates). </p>
 * 
 * @git https://github.com/samchon/framework
 * @author Jeongho Nam <http://samchon.org>
 */
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
	eval("var std = require('typescript-stl')");
	eval("var http = require('http')");
	eval("var websocket = require('websocket')");
	eval("var net = require('net')");
}