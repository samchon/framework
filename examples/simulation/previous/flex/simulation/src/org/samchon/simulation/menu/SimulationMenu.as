package org.samchon.simulation.menu
{
	import flash.events.MouseEvent;
	
	import mx.controls.Alert;
	import mx.controls.Spacer;
	
	import org.samchon.simulation.movie.SimulationMovie;
	
	import spark.components.HGroup;

	public class SimulationMenu extends InquiryMenu
	{
		protected var navigatorContent:MenuNavigatorContent = new MenuNavigatorContent();
		protected var hGroup:HGroup = new HGroup();
		
		protected var newFileButton:MenuButton;
		protected var openFileButton:MenuButton;
		protected var saveFileButton:MenuButton;
		
		protected var interactionButton:StateMenuButton;
		protected var programmingButton:StateMenuButton;
		//public var namTreeButton:StateMenuButton;
		protected var simulationButton:StateMenuButton;
		
		public function SimulationMenu()
		{
			super();
			
			//MAKE TAB
			navigatorContent.percentWidth = 100
			navigatorContent.label = " - Simulation - ";
			
			hGroup.percentWidth = 100;
			
			navigatorContent.addElement(hGroup);
			
			//CONSTRUCT
			newFileButton = new MenuButton();
			openFileButton = new MenuButton();
			saveFileButton = new MenuButton();
			
			interactionButton = new StateMenuButton();
			programmingButton = new StateMenuButton();
			//namTreeButton = new StateMenuButton();
			
			simulationButton = new StateMenuButton();
			var retrieveButton:MenuButton = new MenuButton();
			var spacer:Spacer = new Spacer();
			var newWindowButton:MenuButton = new MenuButton();
			
			//CONFIGURATION
			newFileButton.label = "New File";			newFileButton.source = "newFile";			newFileButton.addEventListener(MouseEvent.CLICK, goNewFile);
			openFileButton.label = "Open File";			openFileButton.source = "openFile";			openFileButton.addEventListener(MouseEvent.CLICK, goOpenFile);
			saveFileButton.label = "Save File";			saveFileButton.source = "saveFile";			saveFileButton.addEventListener(MouseEvent.CLICK, goSaveFile);
			
			interactionButton.label = "Interaction";	interactionButton.source = "interaction";	interactionButton.addEventListener(MouseEvent.CLICK, goState);	interactionButton.state = "INTERACTION_STATE";
			programmingButton.label = "Programming";	programmingButton.source = "programming";	programmingButton.addEventListener(MouseEvent.CLICK, goState);	programmingButton.state = "PROGRAMMING_STATE";
			//namTreeButton.label = "Nam-Tree";			namTreeButton.source = "namTree";			namTreeButton.addEventListener(MouseEvent.CLICK, goState);		namTreeButton.state = "NAMTREE_STATE";
			
			simulationButton.label = "Simulation";		simulationButton.source = "simulation";		simulationButton.addEventListener(MouseEvent.CLICK, goState);	simulationButton.state = "SIMULATION_STATE";
			retrieveButton.label = "Retrieve";			retrieveButton.source = "retrieve";			retrieveButton.addEventListener(MouseEvent.CLICK, goWindow);
			spacer.percentWidth = 100;
			newWindowButton.label = "New Window";		newWindowButton.source = "newWindow";
			
			//SET TOOLTIP
			newWindowButton.toolTip = "Pop-up new window";
			
			//ADD BUTTON
			addButton(newFileButton);
			addButton(openFileButton);
			addButton(saveFileButton);
			
			// ---------------------------------------
			//	CAN BE UNABLED
			// ---------------------------------------
			addButton(interactionButton); //not work in demo
			addButton(programmingButton);
			//addButton(namTreeButton); //can be popped
			//--
			
			addButton(simulationButton);
			addButton(retrieveButton);
			hGroup.addElement(spacer);
			addButton(newWindowButton);
			
			//ADD TO #0
			this.addElementAt(navigatorContent, 0);
			this.selectedIndex = 0;
		}
		
		protected function addButton(button:MenuButton):void
		{
			hGroup.addElement(button);
		}
		protected function addButtonAt(button:MenuButton, x:int):void
		{
			hGroup.addElementAt(button, x);
		}
		public function popButton(button:MenuButton):void
		{
			hGroup.removeElement(button);
		}
		
		/* ---------------------------------------------------
			CLICK HANDLER
		--------------------------------------------------- */
		protected function goNewFile(event:MouseEvent):void
		{
			window.goNewFile(event);
		}
		protected function goOpenFile(event:MouseEvent):void
		{
			window.goOpenFile(event);
		}
		protected function goSaveFile(event:MouseEvent):void
		{
			window.goSaveFile(event);
		}
		
		override protected function goState(event:MouseEvent):void
		{
			if(event.currentTarget == interactionButton)
				Alert.show("Interaction is not permitted in demo.", "License Error");
			else
				super.goState(event);
		}
	}
}