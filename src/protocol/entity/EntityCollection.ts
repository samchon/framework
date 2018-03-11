import * as collections from "econ";
import { XML } from "sxml";

import { IEntity } from "./IEntity";
import { IEntityGroup } from "./IEntityGroup";

/**
 * @inheritdoc
 */
export abstract class EntityArrayCollection<T extends IEntity>
	extends collections.Vector<T>
{
	/* ------------------------------------------------------------------
		CONSTRUCTORS
	------------------------------------------------------------------ */
	// using super::super;

	/**
	 * @inheritdoc
	 */
	public construct(xml: XML): void
	{
		IEntityGroup.construct(<any>this, xml);
	}

	/**
	 * @inheritdoc
	 */
	public abstract createChild(xml: XML): T;

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
		return IEntityGroup.has(<any>this, key);
	}

	/**
	 * @inheritdoc
	 */
	public count(key: any): number
	{
		return IEntityGroup.count(<any>this, key);
	}

	/**
	 * @inheritdoc
	 */
	public get(key: any): T
	{
		return IEntityGroup.get(<any>this, key);
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
	public toXML(): XML
	{
		return IEntityGroup.toXML(<any>this);
	}
}

/**
 * @inheritdoc
 */
export abstract class EntityListCollection<T extends IEntity>
	extends collections.List<T>
{
	/* ------------------------------------------------------------------
		CONSTRUCTORS
	------------------------------------------------------------------ */
	// using super::super;

	/**
	 * @inheritdoc
	 */
	public construct(xml: XML): void
	{
		IEntityGroup.construct(<any>this, xml);
	}

	/**
	 * @inheritdoc
	 */
	public abstract createChild(xml: XML): T;

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
		return IEntityGroup.has(<any>this, key);
	}

	/**
	 * @inheritdoc
	 */
	public count(key: any): number
	{
		return IEntityGroup.count(<any>this, key);
	}

	/**
	 * @inheritdoc
	 */
	public get(key: any): T
	{
		return IEntityGroup.get(<any>this, key);
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
	public toXML(): XML
	{
		return IEntityGroup.toXML(<any>this);
	}
}

/**
 * @inheritdoc
 */
export abstract class EntityDequeCollection<T extends IEntity>
	extends collections.Deque<T>
{
	/* ------------------------------------------------------------------
		CONSTRUCTORS
	------------------------------------------------------------------ */
	// using super::super;

	/**
	 * @inheritdoc
	 */
	public construct(xml: XML): void
	{
		IEntityGroup.construct(<any>this, xml);
	}

	/**
	 * @inheritdoc
	 */
	public abstract createChild(xml: XML): T;

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
		return IEntityGroup.has(<any>this, key);
	}

	/**
	 * @inheritdoc
	 */
	public count(key: any): number
	{
		return IEntityGroup.count(<any>this, key);
	}

	/**
	 * @inheritdoc
	 */
	public get(key: any): T
	{
		return IEntityGroup.get(<any>this, key);
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
	public toXML(): XML
	{
		return IEntityGroup.toXML(<any>this);
	}
}