const fs = require("fs");
const process = require('child_process');

function main()
{
	compile();
	attach_header();

	replace_body('["', '"]', (value) => 
	{
		return "." + value;
	});
	replace_body('eval("', '");', (value) => {return value;});
}

function compile()
{
	const FILE = __dirname + "/../src/samchon/tsconfig.json";

	process.execSync("tsc -p " + FILE);
	process.execSync("tsc -p " + FILE + " --removeComments --declaration false");
}

function attach_header()
{
	const TITLE_FILE = __dirname + "/../src/samchon/typings/samchon/samchon.d.ts";
	const HEADER_FILE = __dirname + "/../lib/samchon.d.ts";

	let text = fs.readFileSync(TITLE_FILE, "utf8");
	text += fs.readFileSync(HEADER_FILE, "utf8");

	fs.writeFileSync(HEADER_FILE, text, "utf8");
}

function replace_body(S1, S2, changer)
{
	const JS_FILE = __dirname + "/../lib/samchon.js";
	let text = fs.readFileSync(JS_FILE, "utf8");
	if (text.indexOf(S1) == -1)
		return;

	let segments = text.split(S1);
	for (let part of segments)
	{
		if (part.indexOf(S2) == -1)
			continue;

		let value = part.substr(0, part.indexOf(S2));
		let org = S1 + value + S2;
		let repl = changer(value);

		text = text.split(org).join(repl);
	}
	fs.writeFileSync(JS_FILE, text, "utf8");
}

main();