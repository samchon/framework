/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
/// <reference path="../typings/scanf/scanf.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

import master = require("./base/master");
import tsp = require("./base/tsp");
import pack = require("./base/packer");

namespace monitor
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;
}

namespace monitor
{
	export class Monitor extends protocol.Server
	{
		// REPORTER; REPORTS TO VIEWERS
		private reporter: Reporter;

		// SYSTEMS, NODES OF DISTRIBUTED SYSTEM
		private system_map: std.HashMap<number, System>;
		private system_sequence: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();

			// INIT MEMBERS
			this.reporter = new Reporter(this);

			this.system_map = new std.HashMap<number, System>();
			this.system_sequence = 0;
		}

		public addClient(driver: protocol.IClientDriver): void
		{
			// ISSUE A NEW UID AND SYSTEM DRIVER
			let uid: number = ++this.system_sequence;
			let system: System = new System(this, driver, uid);

			// ENROLL THEM TO SYSTEM_MAP
			this.system_map.insert([uid, system]);
		}

		public constructSystemTree(): void
		{
			for (let it = this.system_map.begin(); !it.equal_to(this.system_map.end()); it = it.next())
				it.second.clear();

			for (let it = this.system_map.begin(); !it.equal_to(this.system_map.end()); it = it.next())
				if (it.second.getParent() != null)
					it.second.getParent().push_back(it.second);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getReporter(): Reporter
		{
			return this.reporter;
		}
		public getRootSystem(): System
		{
			if (this.system_map.empty() == true)
				return;

			// FIND ROOT (CHIEF) SYSTEM
			// CHIEF MAY THE FIRST
			let system: System = this.system_map.begin().second;
			while (system["parent"] != null)
				system = system["parent"];

			return system;
		}

		/* ---------------------------------------------------------
			MAIN
		--------------------------------------------------------- */
		public static main(): void
		{
			let monitor = new Monitor();
			monitor.open(37900);
			monitor.getReporter().open(37950);
		}
	}

	export class System extends protocol.EntityArray<System> implements protocol.IProtocol
	{
		// MONITOR AND PARENT (HIERARCHY) OBJECTS
		private monitor: Monitor;
		private parent: System;

		// COMMUNICATOR
		private driver: protocol.IClientDriver;

		// ATOMIC MEMBERS
		private uid: number;
		private name: string;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(monitor: Monitor, driver: protocol.IClientDriver, uid: number)
		{
			super();

			this.monitor = monitor;
			this.parent = null;

			this.driver = driver;
			{
				this.driver.onClose = this.destructor.bind(this);
				this.driver.listen(this);
			}

			this.uid = uid;
			this.name = "";

			this.sendData(new protocol.Invoke("set_uid", this.uid));
		}
		public destructor(): void
		{
			let system_map: std.HashMap<number, System> = this.monitor["system_map"];

			// ERASE THIS OBJECT FROM MAP AND PARENT
			system_map.erase(this.uid);
			if (this.parent != null)
				std.remove(this.begin(), this.end(), this as System);

			// LET VIEWERS TO SEND SYSTEM STRUCTURE AGAIN
			let viewers: Reporter = this.monitor.getReporter();
			viewers.sendSystems();
		}

		public createChild(xml: library.XML): System
		{
			// DO NOT CREATE CHILD SYSTEM OBJECT
			// BUT FETCH FROM THE SYSTEM_MAP IN MONITOR
			let system_map: std.HashMap<number, System> = this.monitor["system_map"];
			let uid: number = parseInt(xml.getProperty("uid")); // UID TO FETCH

			if (system_map.has(uid) == false)
				return null; // NOT EXISTS
			else
			{
				let system: System = system_map.get(uid);
				system.parent = this;

				return system;
			}
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getParent(): System
		{
			return this.parent;
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			this.driver.sendData(invoke);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);

			if (invoke.getListener() == "construct")
			{
				this.monitor.constructSystemTree();

				// LET VIEWERS TO SEND SYSTEM STRUCTURE
				let viewers: Reporter = this.monitor.getReporter();
				viewers.sendSystems();

				console.log(this.monitor.getRootSystem().toXML().toString());
				for (let it = this.monitor["system_map"].begin(); !it.equal_to(this.monitor["system_map"].end()); it = it.next())
					console.log(it.first, it.second.getParent() == null ? "null" : it.second.getParent()["uid"]);
			}
			else
				console.log(invoke.toXML().toString());
		}

		private notifySendData(to: number, listener: string): void
		{
			let viewers: Reporter = this.monitor.getReporter();
			viewers.sendData(new protocol.Invoke("notifySendData", this.uid, to, listener));
		}

		public TAG(): string
		{
			return "system";
		}
		public CHILD_TAG(): string
		{
			return "system";
		}
	}
}

namespace monitor
{
	export class Reporter extends protocol.external.ExternalClientArray
	{
		private monitor: Monitor;

		public constructor(monitor: Monitor)
		{
			super();

			this.monitor = monitor;
		}

		protected createServerBase(): protocol.IServerBase
		{
			return new protocol.WebServerBase(this);
		}
		protected createExternalClient(driver: protocol.IClientDriver): protocol.external.ExternalSystem
		{
			return null;
		}

		public getMonitor(): Monitor
		{
			return this.monitor;
		}

		public sendSystems(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				(this.at(i) as Viewer).sendSystems();
		}
	}

	export class Viewer extends protocol.external.ExternalSystem
	{
		private get reporter(): Reporter
		{
			return this.getSystemArray() as Reporter;
		};

		public constructor(reporter: Reporter, driver: protocol.IClientDriver)
		{
			super(reporter, driver);
		}

		public createChild(xml: library.XML): protocol.external.ExternalSystemRole
		{
			return null;
		}

		public sendSystems(): void
		{
			let root_system: System = this.reporter.getMonitor().getRootSystem();

			this.sendData(new protocol.Invoke("setSystems", root_system.toXML()));
		}
	}
}

monitor.Monitor.main();