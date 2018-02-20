/**
 * # Samchon Framework
 * 
 * <a href="https://nodei.co/npm/samchon">
 *	<img src="https://nodei.co/npm/samchon.png?downloads=true&downloadRank=true&stars=true"> </a>
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
namespace samchon {}

try
{
	// IF THE CONDITION BE IS_NODE(), THEN CANNOT BE USED IN BROWSERIFY
	eval("var std = require('tstl');");
	eval("var sxml = require('sxml');");
	eval("var _url_variables = require('url-variables');");

	eval("var http = require('http');");
	eval("var websocket = require('websocket');");
	eval("var net = require('net');");
}
catch (exception) {}