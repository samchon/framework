const fs = require("fs");
const process = require('child_process');

compile();
attach_header();
remove_dynamics();
distribute();

function compile()
{
	process.execSync("tsc -p ts/tsconfig.json");
}

function attach_header()
{
	const TITLE_FILE = "./ts/src/typings/samchon/samchon.d.ts";
	const HEADER_FILE = "./lib/samchon.d.ts";

	var text = fs.readFileSync(TITLE_FILE, "utf8");
	text += fs.readFileSync(HEADER_FILE, "utf8").replace("/// <reference types=\"tstl\" />", "");

	fs.writeFileSync(HEADER_FILE, text, "utf8");
}

function remove_dynamics()
{
	const JS_FILE = "./lib/samchon.js";

	var text = fs.readFileSync(JS_FILE, "utf8");
	if (text.indexOf('["') == -1)
		return;

	var dynamics = text.split('["');
	var used_keys = {};

	for (var i = 1; i < dynamics.length; i++)
	{
		if (dynamics[i].indexOf('"]') == -1)
			continue;
		
		var value = dynamics[i].substr(0, dynamics[i].indexOf('"]'));
		var org = '["' + value + '"]';
		var repl = '.' + value;

		if (value.indexOf(",") != -1)
			continue;
		else if (used_keys[value])
			continue;
		else
			used_keys[value] = true;
		
		text = text.split(org).join(repl);
	}
	fs.writeFileSync(JS_FILE, text, "utf8");
}

function distribute()
{
	// //--------
	// // DIST TYPESCRIPT 
	// //--------
	// const SOURCE_DIR = "cpp\\samchon";
	// const DIST_DIR = "dist\\cpp\\samchon\\";

	// try
	// {
	// 	process.execSync("rd " + DIST_DIR + " /S /Q");
	// } 
	// catch (exception) {}
	
	// process.execSync("xcopy " + SOURCE_DIR + " " + DIST_DIR + " /S /Y");

	// //--------
	// // DIST TYPESCRIPT 
	// //--------
	// const TSTL_FILE = "node_modules/tstl/lib/tstl.js";
	// const SAMCHON_FILE = "lib/samchon.js";

	// // MERGE TSTL.JS AND SAMCHON.JS
	// var source = fs.readFileSync(TSTL_FILE, "utf8") + "\n\n" + fs.readFileSync(SAMCHON_FILE, "utf8");
	// fs.writeFileSync("dist/ts/samchon.js", source, "utf8");

	// // MINIFY
	// process.execSync("minify dist/ts/samchon.js");

	// MINIFY IN LIB LEVEL
	process.execSync("minify lib/samchon.js");
}
