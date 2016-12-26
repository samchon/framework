/// <reference types="tstl" />

/**
 * # Samchon-Framework
 * 
 * <a href="https://nodei.co/npm/samchon-framework">
 *	<img src="https://nodei.co/npm/samchon-framework.png?downloads=true&downloadRank=true&stars=true"> </a>
 * 
 * Samchon, a OON (Object-Oriented Network) framework.
 * 
 * With Samchon Framework, you can implement distributed processing system within framework of OOD like handling S/W 
 * objects (classes). You can realize cloud and distributed system very easily with provided system templates and even 
 * integration with C++ is possible.
 * 
 * The goal, ultimate utilization model of Samchon Framework is, building cloud system with NodeJS and taking heavy works 
 * to C++ distributed systems with provided modules (those are system templates).
 * 
 * @git https://github.com/samchon/framework
 * @author Jeongho Nam <http://samchon.org>
 */
namespace samchon
{
	/**
	 * Running on Node.
	 * 
	 * Test whether the JavaScript is running on Node.
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

try
{
	// IF THE CONDITION BE IS_NODE(), THEN CANNOT BE USED IN BROWSERIFY
	eval("var std = require('tstl')");
	eval("var http = require('http')");
	eval("var websocket = require('websocket')");
	eval("var net = require('net')");
}
catch (exception) { }