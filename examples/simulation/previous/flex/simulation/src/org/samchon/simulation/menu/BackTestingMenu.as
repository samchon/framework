package org.samchon.simulation.menu
{
	import flash.events.MouseEvent;

	public class BackTestingMenu extends SimulationMenu
	{
		protected var namTreeButton:StateMenuButton;
		
		public function BackTestingMenu()
		{
			super();
			
			/* -----------------------------------------------------------
				NAVIGATOR
			----------------------------------------------------------- */
			navigatorContent.label = " - Back Testing - ";
			
			/* -----------------------------------------------------------
				BUTTON
			----------------------------------------------------------- */
			//NAMTREE_BUTTON
			namTreeButton = new StateMenuButton();
			namTreeButton.label = "Nam-Tree";
			namTreeButton.source = "namTree";
			namTreeButton.addEventListener(MouseEvent.CLICK, goState);
			namTreeButton.state = "NAMTREE_STATE";
			
			addButtonAt(namTreeButton, 5);
			
			//SIMULATION_BUTTON
			simulationButton.label = "Back Test";
			simulationButton.source = "backTesting";
		}
	}
}