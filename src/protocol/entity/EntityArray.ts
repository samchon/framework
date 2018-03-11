import * as std from "tstl";
import { XML } from "sxml";

import { IEntity } from "./IEntity";
import { IEntityGroup } from "./IEntityGroup";

/**
 * @inheritdoc
 */
export abstract class EntityArray<T extends IEntity>
	extends std.Vector<T>
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
		IEntityGroup.construct(this, xml);
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
	public toXML(): XML
	{
		return IEntityGroup.toXML(this, "length");
	}
}

/**
 * @inheritdoc
 */
export abstract class EntityList<T extends IEntity>
	extends std.List<T>
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
		IEntityGroup.construct(this, xml);
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
	public toXML(): XML
	{
		return IEntityGroup.toXML(this);
	}
}

/**
 * @inheritdoc
 */
export abstract class EntityDeque<T extends IEntity>
	extends std.Deque<T>
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
		IEntityGroup.construct(this, xml);
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
	public toXML(): XML
	{
		return IEntityGroup.toXML(this);
	}
}