package org.samchon.simulation.menu
{
	import flash.events.MouseEvent;
	
	import mx.controls.Spacer;
	
	import spark.components.HGroup;

	public class ComparisonMenu extends SimulationMenu
	{
		
		public function ComparisonMenu()
		{
			super();
			
			var priceButton:StateMenuButton = new StateMenuButton();
					priceButton.label = "Price";
					priceButton.source = "price";
					priceButton.state = "PRICE_STATE";
					priceButton.addEventListener(MouseEvent.CLICK, goState);
					priceButton.toolTip = "Inquiry relative comparison prices";
			var financeButton:StateMenuButton = new StateMenuButton();
					financeButton.label = "Finance";
					financeButton.source = "finance";
					financeButton.state = "FINANCE_STATE";
					financeButton.addEventListener(MouseEvent.CLICK, goState);
					financeButton.toolTip = "Financial indices which are comparisonable";
			
			popButton(interactionButton);
			popButton(programmingButton);
			popButton(simulationButton);
			
			addButtonAt(priceButton, 3);
			addButtonAt(financeButton, 4);
		}
	}
}