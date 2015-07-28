package org.samchon.simulation.simulation.backtesting.boundary.namtree.criteria
{
	import org.samchon.namtree.criteria.NTItem;
	import org.samchon.namtree.filetree.file.NTFile;
	
	public class BTItem extends NTItem
	{
		public function BTItem(aggregation:int=0, file:NTFile=null, type:String="Number", value:String="0.0", parameterMap:Object=null)
		{
			super(aggregation, file, type, value, parameterMap);
		}
		/*override public function setValue(value:String):void
		{
			if( this.type == "explore")
				this.type = "Number";
			super.setValue( value );
		}*/
		public function setExploratoryValue(value:Number):void
		{
			setType("Number");
			setValue( String(value) );
		}
	}
}