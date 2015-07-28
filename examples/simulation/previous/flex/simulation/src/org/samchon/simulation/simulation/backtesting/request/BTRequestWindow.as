package org.samchon.simulation.simulation.backtesting.request
{
	import mx.controls.TextInput;
	import mx.events.FlexEvent;
	
	import org.samchon.simulation.simulation.abstract.request.SMRequestParameter;
	import org.samchon.simulation.simulation.abstract.request.SMRequestWindow;
	
	public class BTRequestWindow extends SMRequestWindow
	{
		protected var requestMovie:BTRequestMovie = new BTRequestMovie();
		protected function get buyingCommissionText():TextInput		{	return requestMovie.buyingCommissionText;	}
		protected function get sellingCommissionText():TextInput	{	return requestMovie.sellingCommissionText;	}
		
		protected function get btRequestParameter():BTRequestParameter	{	return requestParameter as BTRequestParameter;	}
		
		public function BTRequestWindow()
		{
			super();
		}
		override protected function creationCompleted(event:FlexEvent):void
		{
			super.creationCompleted(event);
			formGroup.addElementAt(requestMovie, 0);
			
			if(requestParameter == null)
				return;
			
			buyingCommissionText.text = String(btRequestParameter.getBuyingCommission() * 100);
			sellingCommissionText.text = String(btRequestParameter.getSellingCommission()*100);
		}
		
		override protected function getNewRequestParameter():SMRequestParameter
		{
			var buyingCommission:Number = Number(buyingCommissionText.text) / 100;
			var sellingCommission:Number = Number(sellingCommissionText.text) / 100;
			
			requestParameter = super.getNewRequestParameter();
			requestParameter = new BTRequestParameter(requestParameter, buyingCommission, sellingCommission);
			
			return requestParameter;
		}
	}
}











