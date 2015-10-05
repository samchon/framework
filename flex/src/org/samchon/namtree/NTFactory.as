package org.samchon.namtree
{
	import org.samchon.library.filetree.FTFactory;
	import org.samchon.library.filetree.file.FTFile;
	import org.samchon.library.filetree.file.FTFolder;
	import org.samchon.library.filetree.file.IFTFile;
	import org.samchon.namtree.criteria.NTCriteria;
	import org.samchon.namtree.criteria.NTFilter;
	import org.samchon.namtree.criteria.NTSide;
	import org.samchon.namtree.file.NTFile;

	public class NTFactory
		extends FTFactory
	{
		public function NTFactory()
		{
		}
		
		//ABOUT FILE
		override public function createFile(parent:FTFolder, xml:XML):FTFile
		{
			if(xml.hasOwnProperty("@extension") == true && xml.@extension == "ntfx")
				return createNTFile(parent);
			else
				return super.createFile(parent, xml);
		}
		public function createNTFile(parent:FTFolder):NTFile
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