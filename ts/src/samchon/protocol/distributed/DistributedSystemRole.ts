/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystemRole.ts" />

namespace samchon.protocol.distributed
{
	export abstract class DistributedSystemRole extends external.ExternalSystemRole
	{
		private systems: std.HashSet<DistributedSystem>;
	}
}