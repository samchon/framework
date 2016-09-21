const fs = require("fs");
const exec = require('child_process').exec;

compile();

function compile()
{
	exec
	(
		// DO COMPILE
		"tsc -p ts/tsconfig.json", 
		(err, stdout, stderr) => 
		{
			if (err || stderr)
			{
				// ERROR ON COMPILE
				console.log(err);
				return;
			}

			// POST-PROCESS
			attach_header();
			remove_dynamics();
		}
	);
}

function attach_header()
{
	const TITLE_FILE = "./ts/src/typings/samchon-framework/samchon-framework.d.ts";
	const HEADER_FILE = "./lib/ts/samchon-framework.d.ts";

	var text = fs.readFileSync(TITLE_FILE, "utf8");
	text += fs.readFileSync(HEADER_FILE, "utf8");

	fs.writeFileSync(HEADER_FILE, text, "utf8");
}

function remove_dynamics()
{
	const JS_FILE = "./lib/ts/samchon-framework.js";
	const REPLACES = 
		[
			//--------
			// FILE MODULE
			//--------
			'file_', // FileReference.file_

			//--------
			// PROTOCOL MODULE
			//--------
			'_replyData',		// IProtocol._replyData

			//--------
			// SERVICE MODULE
			//--------
			'erase_user',		// Server.erase_user
			'account_map_',		// Server.account_map_
			'session_id_',		// User.session_id_
			'sequence_',		// User.sequence_
			'createClient',		// User.createClient
			'no_',				// Client.no_
			
			//--------
			// PARALLEL SYSTEM MODULE
			//--------
			'history_sequence_',	// ParallelSystemArray.history_sequence_
			'_Complete_history',	// ParallelSystemArray._Complete_history

			'progress_list_',		// (ParallelSystem | DistributedSystemRole).progress_list_
			'history_list_',		// (ParallelSystem | DistributedSystemRole).history_list_
			'send_piece_data',		// ParallelSystem.send_piece_dat

			'complete_history',		// MediatorSystem.complete_history
			'start_time_',			// InvokeHistory.start_time_
			'end_time_',			// InvokeHistory.end_time_

			//--------
			// DISTRIBUTED SYSTEM MODULE
			//--------
			'compute_average_elapsed_time'	// (DistributedSystem | DistributedSystemRole).compute_average_elapsed_time
		];

	var text = fs.readFileSync(JS_FILE, "utf8");
	for (var i = 0; i < REPLACES.length; i++)
		text = text.split('["' + REPLACES[i] + '"]').join('.' + REPLACES[i]);

	fs.writeFileSync(JS_FILE, text, "utf8");
}
