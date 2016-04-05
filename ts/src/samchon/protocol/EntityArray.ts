namespace samchon.protocol
{
	/**
	 * 
	 */
	export abstract class EntityArray<Ety extends IEntity>
		extends std.Vector<Ety>
	{
		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
		}

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
		 * 
		 * @inheritdoc
		 */
		public construct(xml: library.XML): void
		{
			this.clear();

			// MEMBER VARIABLES; ATOMIC
			var propertyMap = xml.getPropertyMap();

			for (var v_it = propertyMap.begin(); v_it.equals(propertyMap.end()) != true; v_it = v_it.next())
				if (typeof this[v_it.first] == "number" && v_it.first != "length")
					this[v_it.first] = parseFloat(v_it.second);
				else if (typeof this[v_it.first] == "string")
					this[v_it.first] = v_it.second;

			//CHILDREN
			if (xml.has(this.CHILD_TAG()) == false)
				return;

			var xmlList: library.XMLList = xml.get(this.CHILD_TAG());

			for (var i: number = 0; i < xmlList.size(); i++) 
			{
				var child: Ety = this.createChild(xmlList.at(i));
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
		protected abstract createChild(xml: library.XML): Ety;
		
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
			var i: number;

			if (key instanceof Entity || key instanceof EntityArray)
			{
				for (i = 0; i < this.size(); i++)
					if (this.at(i) == key)
						return true;
			}
			else
			{
				for (var i: number = 0; i < this.size(); i++)
					if (this.at(i).key() == key)
						return true;
			}

			return false;
		}

		/**
		 * @inheritdoc
		 */
		public get(key: string): Ety
		{
			for (var i: number = 0; i < this.size(); i++)
				if (this.at(i).key() == key)
					return this.at(i);

			throw Error("out of range");
		}

		/* ------------------------------------------------------------------
			EXPORTERS
		------------------------------------------------------------------ */
		/**
		 * @inheritdoc
		 */
		public abstract TAG(): string;

		/**
		 * <p> A tag name of children objects. </p>
		 */
		public abstract CHILD_TAG(): string;

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
		 *
		 * @inheritdoc
		 */
		public toXML(): library.XML
		{
			var xml: library.XML = new library.XML();
			xml.setTag(this.TAG());

			// MEMBERS
			for (var key in this)
				if (typeof key == "string" && key != "length" // LENGTH: MEMBER OF AN ARRAY
					&& (typeof this[key] == "string" || typeof this[key] == "number"))
				{
					// ATOMIC
					xml.setProperty(key, this[key]);
				}
		
			// CHILDREN
			for (var i: number = 0; i < this.size(); i++)
				xml.push(this.at(i).toXML());

			return xml;
		}
	}
}