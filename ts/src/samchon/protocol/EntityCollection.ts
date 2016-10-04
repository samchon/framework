/// <reference path="../API.ts" />

/// <reference path="../collections/ArrayCollection.ts" />
/// <reference path="../collections/ListCollection.ts" />
/// <reference path="../collections/DequeCollection.ts" />

namespace samchon.protocol
{
	/**
	 * @inheritdoc
	 */
	export interface IEntityCollection<T extends IEntity>
		extends IEntityGroup<T>, collections.ICollection<T>
	{
	}
}

namespace samchon.protocol
{
	/**
	 * @inheritdoc
	 */
	export abstract class EntityArrayCollection<T extends IEntity>
		extends collections.ArrayCollection<T>
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
		extends collections.ListCollection<T>
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
		extends collections.DequeCollection<T>
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