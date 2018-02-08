const fs = require("fs");
const cmd = require('child_process');

function main()
{
	compile();
	attach_header();

	// REMOVE EVALS
	replace_body(content =>
	{
		let first = content.indexOf('eval("');
		let last = content.indexOf('");', first + 1);

		if (first == -1)
			return null;

		let repl = content.substring(first + 6, last);
		return content.substr(0, first) + repl + content.substr(last + 3);
	});

	// REMOVE DYNAMICS
	replace_body(content =>
	{
		let first = -1;

		while (true)
		{
			first = content.indexOf('["', first + 1);
			let last = content.indexOf('"]', first + 1);

			if (first == -1)
				return null;
			
			let repl = "." + content.substring(first + 2, last);

			if (repl.indexOf(",") != -1)
			{
				first = last;
				continue;
			}
			else
				return content.substr(0, first) + repl + content.substr(last + 2);
		}
	});
}

function compile()
{
	const FILE = __dirname + "/../src/samchon/tsconfig.json";

	cmd.execSync("tsc -p " + FILE);
	cmd.execSync("tsc -p " + FILE + " --removeComments --declaration false");
}

function attach_header()
{
	const TITLE_FILE = __dirname + "/../src/samchon/typings/samchon/samchon.d.ts";
	const HEADER_FILE = __dirname + "/../lib/samchon.d.ts";

	let content = fs.readFileSync(TITLE_FILE, "utf8");
	content += fs.readFileSync(HEADER_FILE, "utf8");

	fs.writeFileSync(HEADER_FILE, content, "utf8");
}

function replace_body(replacer)
{
	const JS_FILE = __dirname + "/../lib/samchon.js";
	let content = fs.readFileSync(JS_FILE, "utf8");
	
	while (true)
	{
		let repl = replacer(content);
		if (repl == null)
			break;
		else
			content = repl;
	}
	fs.writeFileSync(JS_FILE, content, "utf8");
}

main();