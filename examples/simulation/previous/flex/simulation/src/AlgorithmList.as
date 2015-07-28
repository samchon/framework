package 
{
	import mx.collections.ArrayCollection;
	
	import org.samchon.utils.StringUtil;
	
	public class AlgorithmList extends ArrayCollection
	{
		public function AlgorithmList(source:Array=null)
		{
			super(source);
		}
		public function at(x:int):Algorithm
		{
			return this.getItemAt(x) as Algorithm;
		}
		
		public function toXML():String
		{
			var xml:String = "<algorithmList>\n";
			for(var i:int = 0; i < this.length; i++)
				xml += StringUtil.getTabbed( this.at(i).toXML() ) + "\n";
			xml += "</algorithmList>";
			
			return xml;
		}
	}
}