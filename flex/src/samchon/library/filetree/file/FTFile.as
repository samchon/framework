package samchon.library.filetree.file
{
	import samchon.protocol.entity.Entity;
	import samchon.protocol.invoke.Invoke;
	import samchon.protocol.invoke.InvokeParameter;
	
	public class FTFile extends Entity 
		implements IFTFile
	{
		/* ------------------------------------------------------------
			TAGS
		------------------------------------------------------------ */
		override public function get TAG():String { return "file" }
		public function get LISTENER():String { return "mergeFTFile"; }
		
		/* ------------------------------------------------------------
			VARIABLES
		------------------------------------------------------------ */
		protected var parent:FTFolder;
		
		protected var uid:int;
		protected var name:String;
		protected var comment:String;
		
		//ADDICTED
		protected var extension:String;
		
		/* ------------------------------------------------------------
			CONSTRUCTOR
		------------------------------------------------------------ */
		public function FTFile(parent:FTFolder)
		{
			super();
			
			this.parent = parent;
		}
		override public function construct(xml:XML):void
		{
			uid = xml.hasOwnProperty("@uid") ? xml.@uid : int.MIN_VALUE;
			
			name = xml.@name;
			comment = xml.@comment;
			extension = xml.@extension;
		}
		
		/* ------------------------------------------------------------
			ACCESSORS
		------------------------------------------------------------ */
		public function load():void {}; //SOMETHING TO BE OVERRIDEN
		
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
		public function getExtension():String
		{
			return extension;
		}
		
		public function getPath():String
		{
			var path:String = name + "." + extension;
			if(parent != null)
				path = parent.getPath() + "/" + path;
			
			return path;
		}
		public function get $label():String
		{
			return name + "." + extension;
		}
		
		
		/* ------------------------------------------------------------
			EXPORTS
		------------------------------------------------------------ */
		override public function toXML():XML
		{
			var xml:XML = super.toXML();
			if(uid != int.MIN_VALUE)
				xml.@uid = uid;
			
			xml.@name = name;
			xml.@comment = comment;
			xml.@extension = extension;
			
			return xml;
		}
		public function toInvoke():Invoke
		{
			var invoke:Invoke = new Invoke(LISTENER);
			invoke.addItem( new InvokeParameter("xml", toXML()) );
			
			return invoke;
		}
		/*public function toInvoke():Invoke
		{
			var invoke:Invoke = new Invoke("mergeFile");
			
			//IDENTIFIERS
			if(uid != int.MIN_VALUE) 
				invoke.addItem( new InvokeParameter("uid", uid) );
			if(parent != null) 
				invoke.addItem( new InvokeParameter("fid", parent.getUID()) );
			
			//VARIABLES
			invoke.addItem( new InvokeParameter("name", name) );
			invoke.addItem( new InvokeParameter("comment", comment) );
			invoke.addItem( new InvokeParameter("extension", extension) );
			
			return invoke;
		}*/
	}
}