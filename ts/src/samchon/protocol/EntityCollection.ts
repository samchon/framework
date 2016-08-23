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
	}
}

namespace samchon.protocol
{
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
			return IEntityGroup.toXML(this);
		}
	}
}

namespace samchon.protocol
{
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
			return IEntityGroup.toXML(this);
		}
	}
}

namespace samchon.protocol
{
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
			return IEntityGroup.toXML(this);
		}
	}
}