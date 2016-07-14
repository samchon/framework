/// <reference path="../API.ts" />

namespace samchon.protocol
{
	export interface IEntityGroup<T extends IEntity>
		extends IEntity, std.base.IContainer<T>
	{
		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		/**
		 * <p> Construct data of the Entity from an XML object. </p>
		 *
		 * <p> Constructs the EntityArray's own member variables only from the input XML object. </p>
		 *
		 * <p> Do not consider about constructing children Entity objects' data in EntityArray::construct(). 
		 * Those children Entity objects' data will constructed by their own construct() method. Even insertion 
		 * of XML objects representing children are done by abstract method of EntityArray::toXML(). </p>
		 *
		 * <p> Constructs only data of EntityArray's own. </p>
		 */
		construct(xml: library.XML): void;

		/**
		 * <p> Factory method of a child Entity. </p>
		 *
		 * <p> EntityArray::createChild() is a factory method creating a new child Entity which is belonged 
		 * to the EntityArray. This method is called by EntityArray::construct(). The children construction
		 * methods Entity::construct() will be called by abstract method of the EntityArray::construct(). </p>
		 *
		 * @return A new child Entity belongs to EntityArray.
		 */
		// createChild(xml: library.XML): T;

		/* ------------------------------------------------------------------
			GETTERS
		------------------------------------------------------------------ */
		/**
		 * <p> Get iterator to element. </p>
		 * 
		 * <p> Searches the container for an element with a identifier equivalent to <i>key</i> and returns an 
		 * iterator to it if found, otherwise it returns an iterator to {@link end end()}. </p>
		 *
		 * <p> Two keys are considered equivalent if the container's comparison object returns false reflexively 
		 * (i.e., no matter the order in which the elements are passed as arguments). </p>
		 *
		 * <p> Another member functions, {@link has has()} and {@link count count()}, can be used to just check 
		 * whether a particular <i>key</i> exists. </p>
		 *
		 * @param key Key to be searched for
		 * @return An iterator to the element, if an element with specified <i>key</i> is found, or 
		 *		   {@link end end()} otherwise.
		 */
		// find(key: any): std.Iterator<T>;

		/**
		 * <p> Whether have the item or not. </p>
		 * 
		 * <p> Indicates whether a map has an item having the specified identifier. </p>
		 *
		 * @param key Key value of the element whose mapped value is accessed.
		 *
		 * @return Whether the map has an item having the specified identifier.
		 */
		has(key: any): boolean;

		/**
		 * <p> Count elements with a specific key. </p>
		 * 
		 * <p> Searches the container for elements whose key is <i>key</i> and returns the number of elements found. </p>
		 *
		 * @param key Key value to be searched for.
		 *
		 * @return The number of elements in the container with a <i>key</i>.
		 */
		count(key: any): number;

		/**
		 * <p> Get an element </p>
		 *
		 * <p> Returns a reference to the mapped value of the element identified with <i>key</i>. </p>
		 *
		 * @param key Key value of the element whose mapped value is accessed.
		 * 
		 * @throw exception out of range
		 * 
		 * @return A reference object of the mapped value (_Ty)
		 */
		get(key: any): T;

		/* ------------------------------------------------------------------
			EXPORTERS
		------------------------------------------------------------------ */
		/**
		 * <p> A tag name of children objects. </p>
		 */
		CHILD_TAG(): string;

		/**
		 * <p> Get an XML object represents the EntityArray. </p>
		 *
		 * <p> Archives the EntityArray's own member variables only to the returned XML object. </p>
		 *
		 * <p> Do not consider about archiving children Entity objects' data in EntityArray::toXML(). 
		 * Those children Entity objects will converted to XML object by their own toXML() method. The 
		 * insertion of XML objects representing children are done by abstract method of 
		 * EntityArray::toXML(). </p>
		 *
		 * <p> Archives only data of EntityArray's own. </p>
		 */
		toXML(): library.XML;
	}

	/**
	 * @inheritdoc
	 */
	export abstract class EntityArray<T extends IEntity>
		extends std.Vector<T>
		implements IEntityGroup<T>
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
			{
				if (v_it.first == "length")
					continue;

				if (typeof this[v_it.first] == "number")
					this[v_it.first] = parseFloat(v_it.second);
				else if (typeof this[v_it.first] == "string")
					this[v_it.first] = v_it.second;
				else if (typeof this[v_it.first] == "boolean")
					this[v_it.first] = (v_it.second == "true");
			}

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
		 * <p> Factory method of a child Entity. </p>
		 *
		 * <p> EntityArray::createChild() is a factory method creating a new child Entity which is belonged 
		 * to the EntityArray. This method is called by EntityArray::construct(). The children construction
		 * methods Entity::construct() will be called by abstract method of the EntityArray::construct(). </p>
		 *
		 * @return A new child Entity belongs to EntityArray.
		 */
		protected abstract createChild(xml: library.XML): T;

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
				if (typeof key == "string"
					&& (typeof this[key] == "string" || typeof this[key] == "number" || typeof this[key] == "boolean") 
					&& this.hasOwnProperty(key))
				{
					if (key == "length")
						continue;

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
	export abstract class EntityList<T extends IEntity>
		extends std.List<T>
		implements IEntityGroup<T>
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
			{
				if (v_it.first == "size_")
					continue;

				if (typeof this[v_it.first] == "number")
					this[v_it.first] = parseFloat(v_it.second);
				else if (typeof this[v_it.first] == "string")
					this[v_it.first] = v_it.second;
				else if (typeof this[v_it.first] == "boolean")
					this[v_it.first] = (v_it.second == "true");
			}

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
		 * <p> Factory method of a child Entity. </p>
		 *
		 * <p> EntityArray::createChild() is a factory method creating a new child Entity which is belonged 
		 * to the EntityArray. This method is called by EntityArray::construct(). The children construction
		 * methods Entity::construct() will be called by abstract method of the EntityArray::construct(). </p>
		 *
		 * @return A new child Entity belongs to EntityArray.
		 */
		protected abstract createChild(xml: library.XML): T;
		
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
	export abstract class EntityDeque<T extends IEntity>
		extends std.Deque<T>
		implements IEntityGroup<T>
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
			{
				if (v_it.first == "size_" || v_it.first == "capacity_")
					continue;

				if (typeof this[v_it.first] == "number")
					this[v_it.first] = parseFloat(v_it.second);
				else if (typeof this[v_it.first] == "string")
					this[v_it.first] = v_it.second;
				else if (typeof this[v_it.first] == "boolean")
					this[v_it.first] = (v_it.second == "true");
			}

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
		 * <p> Factory method of a child Entity. </p>
		 *
		 * <p> EntityArray::createChild() is a factory method creating a new child Entity which is belonged 
		 * to the EntityArray. This method is called by EntityArray::construct(). The children construction
		 * methods Entity::construct() will be called by abstract method of the EntityArray::construct(). </p>
		 *
		 * @return A new child Entity belongs to EntityArray.
		 */
		protected abstract createChild(xml: library.XML): T;
		
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
					if (key == "size_" || key == "capacity_")
						continue;

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