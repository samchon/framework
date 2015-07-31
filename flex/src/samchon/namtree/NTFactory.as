package samchon.namtree
{
	import samchon.library.filetree.FTFactory;
	import samchon.library.filetree.file.FTFolder;
	import samchon.library.filetree.file.IFTFile;
	import samchon.namtree.criteria.NTCriteria;
	import samchon.namtree.criteria.NTFilter;
	import samchon.namtree.criteria.NTSide;
	import samchon.namtree.file.NTFile;

	public class NTFactory
		extends FTFactory
	{
		public function NTFactory()
		{
		}
		
		//ABOUT FILE
		override public function createFile(parent:FTFolder, xml:XML):IFTFile
		{
			if(xml.hasOwnProperty("@extension") == true && xml.@extension == "ntfx")
				return createNTFile(parent);
			else
				return super.createFile(parent, xml);
		}
		public function createNTFile(parent:FTFolder):IFTFile
		{
			return new NTFile(this, parent);
		}
		
		//ABOUT CRITERIA & SIDE
		public function createCriteria(parent:NTCriteria, xml:XML):NTCriteria
		{
			return new NTCriteria(this, parent);
		}
		public function createFilter(parent:NTCriteria, xml:XML):NTFilter
		{
			return new NTFilter(this, parent);
		}
		public function createSide():NTSide
		{
			return new NTSide(this);
		}
	}
}