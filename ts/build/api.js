const fs = require("fs");
const os = require("os");
const process = require('child_process');

const RELEASE_DIR = "D:/Homepage/samchon.github.io/framework/ts/api";

if (fs.existsSync(RELEASE_DIR))
	if (os.platform().substr(0, 3) == "win")
		process.execSync("rd " + RELEASE_DIR.split("/").join("\\") + " /S /Q");
	else
		process.execSync("rm -rf " + RELEASE_DIR);

var command = 
	'typedoc --tsconfig "../tsconfig.json" --target ES5 --mode file --out ' + RELEASE_DIR + 
	'--includeDeclarations --excludeExternals --externalPattern "**/+(node|websocket)*"';
process.execSync(command);
