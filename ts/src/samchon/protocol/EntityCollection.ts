/// <reference path="../API.ts" />

/// <reference path="../collection/ArrayCollection.ts" />
/// <reference path="../collection/ListCollection.ts" />
/// <reference path="../collection/DequeCollection.ts" />

namespace samchon.protocol
{
	/**
	 * @inheritdoc
	 */
	export interface IEntityCollection<T extends IEntity>
		extends IEntityGroup<T>, collection.ICollection<T>
	{
	};

	/**
	 * @inheritdoc
	 */
	export abstract class EntityArrayCollection<T extends IEntity>
		extends collection.ArrayCollection<T>
		implements IEntityCollection<T>
	{
		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		// using super::super;

		/**
		 * @inheritdoc
		 */
		public construct(xml: library.XML): void
		{
			this.clear();

			// MEMBER VARIABLES; ATOMIC
			let propertyMap = xml.getPropertyMap();

			for (let v_it = propertyMap.begin(); v_it.equal_to(propertyMap.end()) != true; v_it = v_it.next())
				if (typeof this[v_it.first] == "number" && v_it.first != "length")
					this[v_it.first] = parseFloat(v_it.second);
				else if (typeof this[v_it.first] == "string")
					this[v_it.first] = v_it.second;
				else if (typeof this[v_it.first] == "boolean")
					this[v_it.first] = (v_it.second == "true");

			//CHILDREN
			if (xml.has(this.CHILD_TAG()) == false)
				return;

			let xmlList: library.XMLList = xml.get(this.CHILD_TAG());

			for (let i: number = 0; i < xmlList.size(); i++) 
			{
				let child: T = this.createChild(xmlList.at(i));
				if (child == null)
					continue;

				child.construct(xmlList.at(i));
				this.push(child);
			}
		}

		/**
		 * @inheritdoc
		 */
		public abstract createChild(xml: library.XML): T;
		
		/* ------------------------------------------------------------------
			GETTERS
		------------------------------------------------------------------ */
		/**
		 * @inheritdoc
		 */
		public key(): any
		{
			return "";
		}

		/**
		 * @inheritdoc
		 */
		//public find(key: any): std.VectorIterator<T>
		//{
		//	return std.find_if(this.begin(), this.end(),
		//		function (entity: T): boolean
		//		{
		//			return std.equal_to(entity.key(), key);
		//		}
		//	);
		//}

		/**
		 * @inheritdoc
		 */
		public has(key: any): boolean
		{
			return std.any_of(this.begin(), this.end(),
				function (entity: T): boolean
				{
					return std.equal_to(entity.key(), key);
				}
			);
		}

		/**
		 * @inheritdoc
		 */
		public count(key: any): number
		{
			return std.count_if(this.begin(), this.end(),
				function (entity: T): boolean
				{
					return std.equal_to(entity.key(), key);
				}
			);
		}

		/**
		 * @inheritdoc
		 */
		public get(key: any): T
		{
			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
				if (it.value.key() == key)
					return it.value;

			throw new std.OutOfRange("out of range");
		}

		/* ------------------------------------------------------------------
			EXPORTERS
		------------------------------------------------------------------ */
		/**
		 * @inheritdoc
		 */
		public abstract TAG(): string;

		/**
		 * @inheritdoc
		 */
		public abstract CHILD_TAG(): string;

		/**
		 * @inheritdoc
		 */
		public toXML(): library.XML
		{
			let xml: library.XML = new library.XML();
			xml.setTag(this.TAG());

			// MEMBERS
			for (let key in this)
				if (typeof key == "string" && key != "length" // LENGTH: MEMBER OF AN ARRAY
					&& (typeof this[key] == "string" || typeof this[key] == "number")
					&& this.hasOwnProperty(key))
				{
					// ATOMIC
					xml.setProperty(key, this[key] + "");
				}
		
			// CHILDREN
			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
				xml.push(it.value.toXML());
			
			return xml;
		}
	}

	/**
	 * @inheritdoc
	 */
	export abstract class EntityListCollection<T extends IEntity>
		extends collection.ListCollection<T>
		implements IEntityCollection<T>
	{
		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		// using super::super;

		/**
		 * @inheritdoc
		 */
		public construct(xml: library.XML): void
		{
			this.clear();

			// MEMBER VARIABLES; ATOMIC
			let propertyMap = xml.getPropertyMap();

			for (let v_it = propertyMap.begin(); v_it.equal_to(propertyMap.end()) != true; v_it = v_it.next())
				if (typeof this[v_it.first] == "number")
					this[v_it.first] = parseFloat(v_it.second);
				else if (typeof this[v_it.first] == "string")
					this[v_it.first] = v_it.second;
				else if (typeof this[v_it.first] == "boolean")
					this[v_it.first] = (v_it.second == "true");

			//CHILDREN
			if (xml.has(this.CHILD_TAG()) == false)
				return;

			let xmlList: library.XMLList = xml.get(this.CHILD_TAG());

			for (let i: number = 0; i < xmlList.size(); i++) 
			{
				let child: T = this.createChild(xmlList.at(i));
				if (child == null)
					continue;

				child.construct(xmlList.at(i));
				this.push(child);
			}
		}

		/**
		 * @inheritdoc
		 */
		public abstract createChild(xml: library.XML): T;
		
		/* ------------------------------------------------------------------
			GETTERS
		------------------------------------------------------------------ */
		/**
		 * @inheritdoc
		 */
		public key(): any
		{
			return "";
		}

		/**
		 * @inheritdoc
		 */
		//public find(key: any): std.ListIterator<T>
		//{
		//	return std.find_if(this.begin(), this.end(),
		//		function (entity: T): boolean
		//		{
		//			return std.equal_to(entity.key(), key);
		//		}
		//	);
		//}

		/**
		 * @inheritdoc
		 */
		public has(key: any): boolean
		{
			return std.any_of(this.begin(), this.end(),
				function (entity: T): boolean
				{
					return std.equal_to(entity.key(), key);
				}
			);
		}

		/**
		 * @inheritdoc
		 */
		public count(key: any): number
		{
			return std.count_if(this.begin(), this.end(),
				function (entity: T): boolean
				{
					return std.equal_to(entity.key(), key);
				}
			);
		}

		/**
		 * @inheritdoc
		 */
		public get(key: any): T
		{
			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
				if (it.value.key() == key)
					return it.value;

			throw new std.OutOfRange("out of range");
		}

		/* ------------------------------------------------------------------
			EXPORTERS
		------------------------------------------------------------------ */
		/**
		 * @inheritdoc
		 */
		public abstract TAG(): string;

		/**
		 * @inheritdoc
		 */
		public abstract CHILD_TAG(): string;

		/**
		 * @inheritdoc
		 */
		public toXML(): library.XML
		{
			let xml: library.XML = new library.XML();
			xml.setTag(this.TAG());

			// MEMBERS
			for (let key in this)
				if (typeof key == "string"
					&& (typeof this[key] == "string" || typeof this[key] == "number" || typeof this[key] == "boolean")
					&& this.hasOwnProperty(key))
				{
					// ATOMIC
					xml.setProperty(key, this[key] + "");
				}

			// CHILDREN
			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
				xml.push(it.value.toXML());

			return xml;
		}
	}

	/**
	 * @inheritdoc
	 */
	export abstract class EntityDequeCollection<T extends IEntity>
		extends collection.DequeCollection<T>
		implements IEntityCollection<T>
	{
		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		// using super::super;

		/**
		 * @inheritdoc
		 */
		public construct(xml: library.XML): void
		{
			this.clear();

			// MEMBER VARIABLES; ATOMIC
			let propertyMap = xml.getPropertyMap();

			for (let v_it = propertyMap.begin(); v_it.equal_to(propertyMap.end()) != true; v_it = v_it.next())
				if (typeof this[v_it.first] == "number")
					this[v_it.first] = parseFloat(v_it.second);
				else if (typeof this[v_it.first] == "string")
					this[v_it.first] = v_it.second;
				else if (typeof this[v_it.first] == "boolean")
					this[v_it.first] = (v_it.second == "true");

			//CHILDREN
			if (xml.has(this.CHILD_TAG()) == false)
				return;

			let xmlList: library.XMLList = xml.get(this.CHILD_TAG());

			for (let i: number = 0; i < xmlList.size(); i++) 
			{
				let child: T = this.createChild(xmlList.at(i));
				if (child == null)
					continue;

				child.construct(xmlList.at(i));
				this.push(child);
			}
		}

		/**
		 * @inheritdoc
		 */
		public abstract createChild(xml: library.XML): T;
		
		/* ------------------------------------------------------------------
			GETTERS
		------------------------------------------------------------------ */
		/**
		 * @inheritdoc
		 */
		public key(): any
		{
			return "";
		}

		/**
		 * @inheritdoc
		 */
		//public find(key: any): std.DequeIterator<T>
		//{
		//	return std.find_if(this.begin(), this.end(),
		//		function (entity: T): boolean
		//		{
		//			return std.equal_to(entity.key(), key);
		//		}
		//	);
		//}

		/**
		 * @inheritdoc
		 */
		public has(key: any): boolean
		{
			return std.any_of(this.begin(), this.end(),
				function (entity: T): boolean
				{
					return std.equal_to(entity.key(), key);
				}
			);
		}

		/**
		 * @inheritdoc
		 */
		public count(key: any): number
		{
			return std.count_if(this.begin(), this.end(),
				function (entity: T): boolean
				{
					return std.equal_to(entity.key(), key);
				}
			);
		}

		/**
		 * @inheritdoc
		 */
		public get(key: any): T
		{
			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
				if (it.value.key() == key)
					return it.value;

			throw new std.OutOfRange("out of range");
		}

		/* ------------------------------------------------------------------
			EXPORTERS
		------------------------------------------------------------------ */
		/**
		 * @inheritdoc
		 */
		public abstract TAG(): string;

		/**
		 * @inheritdoc
		 */
		public abstract CHILD_TAG(): string;

		/**
		 * @inheritdoc
		 */
		public toXML(): library.XML
		{
			let xml: library.XML = new library.XML();
			xml.setTag(this.TAG());

			// MEMBERS
			for (let key in this)
				if (typeof key == "string"
					&& (typeof this[key] == "string" || typeof this[key] == "number" || typeof this[key] == "boolean")
					&& this.hasOwnProperty(key))
				{
					// ATOMIC
					xml.setProperty(key, this[key] + "");
				}

			// CHILDREN
			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
				xml.push(it.value.toXML());

			return xml;
		}
	}
}