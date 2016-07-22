/// <reference path="../../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../../typings/samchon-framework/samchon-framework.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

namespace slave
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export abstract class Slave
		extends protocol.slave.SlaveClient
	{
		protected createServerConnector(): protocol.IServerConnector
		{
			return new protocol.WebServerConnector(this);
		}
		protected createChild(xml: library.XML): protocol.external.ExternalSystemRole
		{
			return null;
		}

		protected abstract optimize(xml: library.XML, index: number, size: number): void;
	}
}

export = slave;