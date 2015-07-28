package org.samchon.namTree.criteria.grid
{
	import flash.events.Event;
	
	import org.samchon.ui.NumberInputMX;
	
	public class NTItemWeightDGEditor extends NumberInputMX
	{
		public function NTItemWeightDGEditor()
		{
			super();
		}
		override protected function handleChanged(event:Event):void
		{
			super.handleChanged(event);
			
			var data:Object = super.data;
			data.setWeight( Number(this.text) );
		}
	}
}