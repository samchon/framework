package org.samchon.protocol.entity
{
	import mx.collections.ArrayCollection;
	
	import org.samchon.library.container.IDictionary;
	import org.samchon.protocol.invoke.Invoke;
	import org.samchon.protocol.invoke.InvokeParameter;

	/**
	 * <p> An Entity and an Array of children Entity objects. </p>
	 * 
	 * <p> EntityArray is a template class for containinig children Entity objects, and also another type 
	 * of an Entity, too. You can realize hierarchical relationship. Although some entities have complicated
	 * hierarchical relationship, you can deduct a optimal solution easily with EntityArray and Entity. </p>
	 *
	 * <p> If an entity has some subordinate entities of same type, they are in "Composite relationship". 
	 * Make the entity to be EmntityGroup and subordinate entities to be children of the entity. When
	 * those relationships are continued, continue to create classes dervied from EntityArray. When those
	 * relationshiop meets a terminal node, then make the terminal node to be an Entity. </p>
	 *
	 * <p> <img src="inspect.png" /> </p>
	 * 
	 * <p> EntityArray is an Entity, and a container of children Entity objects at the same time. If
	 * children type, of a class derived from an EntityArray, is itself, you can realize hierarchical
	 * and recursive relationship. The relationship is called as "Composite pattern". </p>
	 *
	 * <ul>
	 *	<li> FTFolder extends FTInstance and EntityArray&lt;FTInstance&gt;. </li>
	 *	<li> NTCriteria extends EntityArray&lt;NTCriteria&gt;. </li>
	 * </ul>
	 *
	 * <h3> Inherited </h3>
	 * @copy IEntity
	 * 
	 * @see Entity
	 * @author Jeongho Nam <http://samchon.org>
	 */ 
	public class EntityArray 
		extends ArrayCollection
		implements IEntity, IDictionary
	{
		public function get TAG():String { return null; }
		
		/**
		 * A tag name of children in composite relationship<br/>
		 * <br/>
		 * Needed for<br/>
		 * &#xA0;&#xA0;&#xA0;&#xA0; <i>virtual EntityArray::construct(XML)</i><br/>
		 * &#xA0;&#xA0;&#xA0;&#xA0; <i>virtual EntityArray::toXML() -> XML</i><br/>
		 * &lt;TAG&gt;
		 * &#xA0;&#xA0;&#xA0;&#xA0; &lt;CHILD_TAG /&gt;<br/>
		 * &#xA0;&#xA0;&#xA0;&#xA0; &lt;CHILD_TAG /&gt;<br/>
		 * &lt;/TAG&gt;
		 */ 
		public function get CHILD_TAG():String { return null; }
		
		/* ---------------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------------- */
		/**
		 * <p> Default Constructor. </p>
		 * 
		 */
		public function EntityArray()
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
		 * @inheritDoc
		 */
		public function construct(xml:XML):void
		{
			removeAll();
			if(xml.hasOwnProperty(CHILD_TAG) == false)
				return;
			
			var xmlList:XMLList = xml[CHILD_TAG];
			for(var i:int = 0; i < xmlList.length(); i++)
			{
				var entity:IEntity = createChild(xmlList[i] as XML);
				if(entity == null)
					continue;
				
				entity.construct(xmlList[i] as XML);
				addItem(entity);
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
		public function createChild(xml:XML):IEntity
		{
			return null;
		}
		
		/* ---------------------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------------------- */
		public function get key():* { return null; } //IDENTIFIER
		
		public function has(key:*):Boolean
		{
			for(var i:int = 0; i < this.length; i++)
				if(_at(i).key == key)
					return true;
			return false;
		}
		public function erase(key:*):Boolean
		{
			for(var i:int = length - 1; i >= 0; i--)
				if(_at(i).key == key)
				{
					removeItemAt(i);
					return true;
				}
			return false;
		}
		
		/**
		 * <p> Access the element(<code>Entity</code>) by specified index. </p>
		 * 
		 * @param index The index in the list from which to retrieve the item.
		 * @return The item(Entity) at that index. or null if there is none.
		 */
		protected function _at(index:int):IEntity
		{
			return getItemAt(index) as IEntity;
		}
		
		/**
		 * <p> Access the element(<code>Entity</code>) by specified identifier(key). </p>
		 * 
		 * @param key the identifier of the <code>Entity</code> wants to access 
		 * @return The <code>Entity</code> having the key, or null if there is none.
		 */
		protected function _get(key:*):IEntity
		{
			for(var i:int = 0; i < this.length; i++)
				if(_at(i).key == key)
					return _at(i);
			return null;
		}
		
		/* ---------------------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------------------- */
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
		 * @inheritDoc
		 */ 
		public function toXML():XML
		{
			var xml:XML = new XML("<" + TAG + " />");
			
			var xmlList:XMLList = new XMLList();
			for(var i:int = 0; i < length; i++)
				xmlList[i] = _at(i).toXML();
			
			xml.setChildren(xmlList);
			return xml;
		}
	}
}