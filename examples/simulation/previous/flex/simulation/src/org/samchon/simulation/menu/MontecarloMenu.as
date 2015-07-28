package org.samchon.simulation.menu
{
	public class MontecarloMenu extends SimulationMenu
	{
		public function MontecarloMenu()
		{
			super();
			
			navigatorContent.label = " - Montecarlo - ";
			
			//SIMULATION_BUTTON
			simulationButton.label = "Montecarlo";
			simulationButton.source = "montecarlo";
		}
	}
}