/// <reference path="../API.ts" />

namespace samchon.protocol
{
	/**
	 * A container of entity, and it's a type of entity, too.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
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
		createChild(xml: library.XML): T;

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
	 * @hidden
	 */
	export namespace IEntityGroup
	{
		/* ------------------------------------------------------------------
			ENTITY <-> XML CONVERSION
		------------------------------------------------------------------ */
		/**
		 * @hidden
		 */
		export function construct<T extends IEntity>
			(entityGroup: IEntityGroup<T>, xml: library.XML, ...prohibited_names: string[]): void
		{
			entityGroup.clear();

			// MEMBER VARIABLES
			IEntity.construct(entityGroup, xml, ...prohibited_names);

			// CHILDREN
			if (xml.has(entityGroup.CHILD_TAG()) == false)
				return;

			let children: std.Vector<T> = new std.Vector<T>();
			let xml_list: library.XMLList = xml.get(entityGroup.CHILD_TAG());

			for (let i: number = 0; i < xml_list.size(); i++) 
			{
				let child: T = entityGroup.createChild(xml_list.at(i));
				if (child == null)
					continue;

				child.construct(xml_list.at(i));
				children.push(child);
			}
			entityGroup.assign(children.begin(), children.end());
		}

		/**
		 * @hidden
		 */
		export function toXML<T extends IEntity>
			(entityGroup: IEntityGroup<T>, ...prohibited_names: string[]): library.XML
		{
			// MEMBERS
			let xml: library.XML = IEntity.toXML(entityGroup, ...prohibited_names);

			// CHILDREN
			for (let it = entityGroup.begin(); !it.equal_to(entityGroup.end()); it = it.next())
				xml.push(it.value.toXML());

			return xml;
		}

		/* ------------------------------------------------------------------
			ACCESSORS
		------------------------------------------------------------------ */
		export function has<T extends IEntity>
			(entityGroup: IEntityGroup<T>, key: any): boolean
		{
			return std.any_of(entityGroup.begin(), entityGroup.end(),
				function (entity: T): boolean
				{
					return std.equal_to(entity.key(), key);
				}
			);
		}

		export function count<T extends IEntity>
			(entityGroup: IEntityGroup<T>, key: any): number
		{
			return std.count_if(entityGroup.begin(), entityGroup.end(),
				function (entity: T): boolean
				{
					return std.equal_to(entity.key(), key);
				}
			);
		}

		export function get<T extends IEntity>
			(entityGroup: IEntityGroup<T>, key: any): T
		{
			for (let it = entityGroup.begin(); !it.equal_to(entityGroup.end()); it = it.next())
				if (std.equal_to(it.value.key(), key) == true)
					return it.value;

			throw new std.OutOfRange("out of range");
		}
	}
}

namespace samchon.protocol
{
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
			IEntityGroup.construct(this, xml, "length");
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
		public has(key: any): boolean
		{
			return IEntityGroup.has(this, key);
		}

		/**
		 * @inheritdoc
		 */
		public count(key: any): number
		{
			return IEntityGroup.count(this, key);
		}

		/**
		 * @inheritdoc
		 */
		public get(key: any): T
		{
			return IEntityGroup.get(this, key);
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
			return IEntityGroup.toXML(this, "length");
		}
	}
}

namespace samchon.protocol
{
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
			IEntityGroup.construct(this, xml);
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
		public has(key: any): boolean
		{
			return IEntityGroup.has(this, key);
		}

		/**
		 * @inheritdoc
		 */
		public count(key: any): number
		{
			return IEntityGroup.count(this, key);
		}

		/**
		 * @inheritdoc
		 */
		public get(key: any): T
		{
			return IEntityGroup.get(this, key);
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
			return IEntityGroup.toXML(this);
		}
	}
}

namespace samchon.protocol
{
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
			IEntityGroup.construct(this, xml);
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
		public has(key: any): boolean
		{
			return IEntityGroup.has(this, key);
		}

		/**
		 * @inheritdoc
		 */
		public count(key: any): number
		{
			return IEntityGroup.count(this, key);
		}

		/**
		 * @inheritdoc
		 */
		public get(key: any): T
		{
			return IEntityGroup.get(this, key);
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
			return IEntityGroup.toXML(this);
		}
	}
}