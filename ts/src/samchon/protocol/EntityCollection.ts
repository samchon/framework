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