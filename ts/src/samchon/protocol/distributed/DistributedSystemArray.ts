/// <reference path="../../API.ts" />

/// <reference path="../parallel/ParallelSystemArray.ts" />

namespace samchon.protocol.distributed
{
	export abstract class DistributedSystemArray extends parallel.ParallelSystemArray
	{
		protected roles: std.HashMap<string, DistributedSystemRole>;
	}
}