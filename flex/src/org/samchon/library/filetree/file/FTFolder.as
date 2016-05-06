package org.samchon.library.filetree.file
{
	import org.samchon.library.filetree.FTFactory;
	import org.samchon.protocol.entity.EntityArray;
	import org.samchon.protocol.entity.IEntity;
	import org.samchon.protocol.invoke.Invoke;
	import org.samchon.protocol.invoke.InvokeParameter;
	
	/**
	 * <p> A folder. </p>
	 * <p> A folder object has recursive and hierarchical relationship. </p>
	 * 
	 * <img src="file_tree.png" />
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	public class FTFolder extends EntityArray 
		implements IFTFile
	{
		//XML TAG
		override public function get TAG():String { return "file" }
		override public function get CHILD_TAG():String { return "file"; }
		public function get LISTENER():String { return "mergeFTFolder"; }
		
		//POINTERS
		/**
		 * <p> A factory object for creating sub-files. </p>
		 */
		protected var factory:FTFactory;
		
		//VARS
		/**
		 * <p> Parent folder containing the file. </p>
		 */
		protected var parent:FTFolder;
		
		/**
		 * <p> Key, an unique if of the file. </p>
		 */
		protected var uid:int;
		
		/**
		 * <p> Name of the file. </p>
		 */
		protected var name:String;
		
		/**
		 * <p> A comment of attached to the file for description. </p> 
		 */
		protected var comment:String;
		
		/* ------------------------------------------------------------
			CONSTRUCTOR
		------------------------------------------------------------ */
		/**
		 * <p> Construct from factory and parent folder. </p>
		 * 
		 * @param factory Factory instance.
		 * @param parent A parent folder that this folder is belonged to.
		 */
		public function FTFolder(factory:FTFactory, parent:FTFolder)
		{
			super();
			
			this.factory = factory;
			this.parent = parent;
		}
		override public function construct(xml:XML):void
		{
			uid = xml.hasOwnProperty("@uid") ? xml.@uid : int.MIN_VALUE;
			
			name = xml.@name;
			comment = xml.@comment;
		}
		
		override public function createChild(xml:XML):IEntity
		{
			if(xml.hasOwnProperty("@extension") == false)
				return new FTFolder(factory, this);
			else
				return factory.createFile(this, xml);
		}
		
		/* ------------------------------------------------------------
			GETTERS
		------------------------------------------------------------ */
		override public function get key():*
		{
			return uid;
		}
		public function getUID():int
		{
			return uid;
		}
		public function getParent():FTFolder
		{
			return parent;
		}
		
		public function getName():String
		{
			return name;
		}
		public function getComment():String
		{
			return comment;
		}
		
		public function getPath():String
		{
			var path:String = name;
			if(parent != null)
				path = parent.getPath() + "/" + path;
			
			return path;
		}
		public function get $label():String
		{
			return name;
		}
		
		/* ------------------------------------------------------------
			EXPORTERS
		------------------------------------------------------------ */
		override public function toXML():XML
		{
			var xml:XML = super.toXML();
			if(uid != int.MIN_VALUE)
				xml.@uid = uid;
			
			xml.@name = name;
			xml.@comment = comment;
			
			return xml;
		}
		/**
		 * For merging<br/>
		 * 
		 * @inheritDoc
		 */
		public function toInvoke():Invoke
		{
			var xml:XML = toXML();
			xml.setChildren(new XMLList()); //SAME WITH CLEAR() IN CPP
			
			var invoke:Invoke = new Invoke(LISTENER);
			invoke.addItem( new InvokeParameter("xml", xml) );
			
			return invoke;
		}
		/*public function toInvoke():Invoke
		{
			var invoke:Invoke = new Invoke("mergeFolder");
			
			//IDENTIFIERS
			if(uid != int.MIN_VALUE) 
				invoke.addItem( new InvokeParameter("uid", uid) );
			if(parent != null) 
				invoke.addItem( new InvokeParameter("fid", parent.uid) );
			
			//VARIABLES
			invoke.addItem( new InvokeParameter("name", name) );
			invoke.addItem( new InvokeParameter("comment", comment) );
			
			return invoke;
		}*/
	}
}