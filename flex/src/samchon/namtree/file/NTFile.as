package samchon.namtree.file
{
	import samchon.library.filetree.file.FTFile;
	import samchon.library.filetree.file.FTFolder;
	import samchon.namtree.NTFactory;
	
	public class NTFile extends FTFile
	{
		/* ------------------------------------------------------------
			TAGS
		------------------------------------------------------------ */
		override public function get LISTENER():String
		{
			return "mergeNTFile";
		}
		
		/* ------------------------------------------------------------
			VARIABLES
		------------------------------------------------------------ */
		protected var factory:NTFactory;
		
		protected var parameterArray:NTParameterArray;
		protected var otherside:NTFile;
			private var othersideUID:int;
		
		protected var functionName:String;
		protected var exploreParameter:NTExploreParameter;
		
		/* ------------------------------------------------------------
			CONSTRUCTOR
		------------------------------------------------------------ */
		public function NTFile(factory:NTFactory, parent:FTFolder)
		{
			super(parent);
			
			this.factory = factory;
			
			parameterArray = new NTParameterArray();
			otherside = null;
			othersideUID = int.MIN_VALUE;
			
			functionName = "";
			exploreParameter = null;
		}
		override public function construct(xml:XML):void
		{
			super.construct(xml);
			
			parameterArray.construct( xml.TAG );
			othersideUID = xml.hasOwnProperty("@otherside") ? xml.@otherside : int.MIN_VALUE;
			
			functionName = xml["@function"];
			if(xml.hasOwnProperty("exploreParameter"))
			{
				exploreParameter = new NTExploreParameter();
				exploreParameter.construct(xml.exploreParameter);
			}
		}
		public function link():void
		{
			if(factory.hasFile(othersideUID) == true)
				otherside = factory.getFile(othersideUID) as NTFile;
			else
				otherside = null;
		}
		
		/* ------------------------------------------------------------
			ACCESSORS
		------------------------------------------------------------ */
		//GETTERS
		public function getParameterArray():NTParameterArray
		{
			return parameterArray;
		}
		public function getOtherside():NTFile
		{
			return otherside;
		}
		public function getFunction():String
		{
			return functionName;
		}
		public function getExploreParameter():NTExploreParameter
		{
			return exploreParameter;
		}
		
		//EXPLORE
		public function hasExploreParameter():Boolean
		{
			return (exploreParameter != null);
		}
		public function setHasExploreParameter(flag:Boolean):void
		{
			if(flag == true)
			{
				if(exploreParameter == null)
					exploreParameter = new NTExploreParameter();
			}
			else
				exploreParameter = null;
		}
		
		/* ------------------------------------------------------------
			EXPORTS
		------------------------------------------------------------ */
		override public function toXML():XML
		{
			var xml:XML = super.toXML();
			
			xml.parameterArray = parameterArray.toXML();
			if(otherside != null)	
				xml.@otherside = otherside.uid;
			
			xml["@function"] = functionName;
			
			if(exploreParameter != null)
				xml.exploreParemeter = exploreParameter.toXML();
			
			return xml;
		}
	}
}