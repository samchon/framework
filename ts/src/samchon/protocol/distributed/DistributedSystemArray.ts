/// <reference path="../../API.ts" />

/// <reference path="../parallel/ParallelSystemArray.ts" />

namespace samchon.protocol.distributed
{
	export abstract class DistributedSystemArray extends parallel.ParallelSystemArray
	{
		/**
		 * @hidden
		 */
		private role_map_: std.HashMap<string, DistributedSystemRole>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			// CREATE ROLE MAP AND ENROLL COLLECTION EVENT LISTENRES
			this.role_map_ = new std.HashMap<string, DistributedSystemRole>();
		}

		public construct(xml: library.XML): void
		{
			//--------
			// CONSTRUCT ROLES
			//--------
			// CLEAR ORDINARY ROLES
			this.role_map_.clear();

			// CREATE ROLES
			if (xml.has("roles") == true && xml.get("roles").front().has("role") == true)
			{
				let role_xml_list: library.XMLList = xml.get("roles").front().get("role");
				for (let i: number = 0; i < role_xml_list.size(); i++)
				{
					let role_xml: library.XML = role_xml_list.at(i);

					// CONSTRUCT ROLE FROM XML
					let role: DistributedSystemRole = this.createRole(role_xml);
					role.construct(role_xml);

					// AND INSERT TO ROLE_MAP
					this.role_map_.insert([role.getName(), role]);
				}
			}

			//--------
			// CONSTRUCT SYSTEMS
			//--------
			super.construct(xml);
		}

		public abstract createRole(xml: library.XML): DistributedSystemRole;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public at(index: number): DistributedSystem
		{
			return super.at(index) as DistributedSystem;
		}

		public getRoleMap(): std.HashMap<string, DistributedSystemRole>
		{
			return this.role_map_;
		}

		/**
		 * @inheritdoc
		 */
		public hasRole(name: string): boolean
		{
			return this.role_map_.has(name);
		}

		/**
		 * @inheritdoc
		 */
		public getRole(name: string): DistributedSystemRole
		{
			return this.role_map_.get(name);
		}

		public insertRole(role: DistributedSystemRole): void
		{
			this.role_map_.insert([role.getName(), role]);
		}

		public eraseRole(name: string): void
		{
			this.role_map_.erase(name);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		public toXML(): library.XML
		{
			let xml: library.XML = super.toXML();
			if (this.role_map_.empty() == true)
				return xml;

			let roles_xml: library.XML = new library.XML();
			{
				roles_xml.setTag("roles");
				for (let it = this.role_map_.begin(); !it.equal_to(this.role_map_.end()); it = it.next())
					roles_xml.push(it.second.toXML());
			}
			xml.push(roles_xml);
			return xml;
		}
	}
}