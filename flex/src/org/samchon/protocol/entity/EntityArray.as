package org.samchon.protocol.entity
{
	import mx.collections.ArrayCollection;
	
	import org.samchon.library.container.IDictionary;
	import org.samchon.protocol.invoke.Invoke;
	import org.samchon.protocol.invoke.InvokeParameter;

	/**
	 * EntityArray is an Entity and a ArrayCollection&lt;Entity&gt;<br>
	 * <br>
	 * The <code>EntityArray</code> is a container set of <code>Entity.</code><br>
	 * But it's not only a container for <code>Entity</code>, but also <code>EntityArray</code> is another type of <code>Entity</code>, too.<br>
	 * <br>
	 * It shares same interface with <code>Entity.</code><br>
	 * So it privdes similar methods for converting between <code>EntityArray</code> and {<code>XML</code>, <code>Invoke</code>}<br>
	 * Addictionally, there's a <u>composite relationship</u> between <code>EntityArray</code> and <code>Entity.</code><br>
	 * <br>
	 * 
	 * @author Jeongho Nam<br>
	 * <a href="http://samchon.org" target="_blank">http://samchon.org</a>
	 * 
	 * @see ArrayCollection
	 * @see Entity
	 */ 
	public class EntityArray 
		extends ArrayCollection
		implements IEntity, IDictionary
	{
		public function get TAG():String { return null; }
		
		/**
		 * A tag name of children in composite relationship<br>
		 * Needed for <i>virtual EntityArray::construct(XML)</i> &amp; <i>virtual EntityArray::toXML() -> XML</i><br>
		 * <br>
		 * &lt;TAG&gt;<br>
		 * &nbsp;&nbsp;&nbsp;&nbsp;&lt;CHILD_TAG /&gt;<br>
		 * &nbsp;&nbsp;&nbsp;&nbsp;&lt;CHILD_TAG /&gt;<br>
		 * &lt;/TAG&gt;
		 */ 
		public function get CHILD_TAG():String { return null; }
		
		/* ---------------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------------- */
		public function EntityArray()
		{
			super();
		}
		
		/**
		 * You don't need to consider the children Entities' members<br>
		 * Just concentrate on this EntityArray's own members<br>
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
		 * Abstract method creating a new chil <code>Entity</code> which is belonged to the <code>EntityArray</code><br>
		 * This method is called by construct method (<code>EntityArray::construct(XML)</code>)<br>
		 * 
		 * @return New Children Entity in a <u>composite relationship</u>
		 */
		protected function createChild(xml:XML):IEntity
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
				if(at(i).key == key)
					return true;
			return false;
		}
		public function erase(key:*):Boolean
		{
			for(var i:int = length - 1; i >= 0; i--)
				if(at(i).key == key)
				{
					removeItemAt(i);
					return true;
				}
			return false;
		}
		
		/**
		 * Access the element(<code>Entity</code>) by specified index
		 * 
		 * @param index The index in the list from which to retrieve the item.
		 * @return The item(Entity) at that index. or null if there is none.
		 */
		public function at(index:int):IEntity
		{
			return getItemAt(index) as IEntity;
		}
		
		/**
		 * Access the element(<code>Entity</code>) by specified identifier(key)
		 * 
		 * @param key the identifier of the <code>Entity</code> wants to access 
		 * @return The <code>Entity</code> having the key, or null if there is none.
		 */
		public function get(key:*):IEntity
		{
			for(var i:int = 0; i < this.length; i++)
				if(at(i).key == key)
					return at(i);
			return null;
		}
		
		/* ---------------------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------------------- */
		/**
		 * You don't need to consider the children Entities' members<br>
		 * Just concentrate on this EntityArray's own members<br>
		 * 
		 * @inheritDoc
		 */ 
		public function toXML():XML
		{
			var xml:XML = new XML("<" + TAG + " />");
			
			var xmlList:XMLList = new XMLList();
			for(var i:int = 0; i < length; i++)
				xmlList[i] = at(i).toXML();
			
			xml.setChildren(xmlList);
			return xml;
		}
	}
}