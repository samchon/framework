package org.samchon.simulation.simulation.backtesting.boundary.namtree
{
	import mx.containers.Accordion;
	import mx.events.IndexChangedEvent;
	
	import spark.components.NavigatorContent;
	
	public class BTCriteriaGridPair extends NavigatorContent
	{
		public var accordion:Accordion;
		protected var change:Function;
		
		public function BTCriteriaGridPair(leftGrid:BTCriteriaGrid, rightGrid:BTCriteriaGrid, change:Function)
		{
			super();
			this.change = change;
			
			//add Accordion
			accordion = new Accordion();
			accordion.percentWidth = 100;
			accordion.percentHeight = 100;
			accordion.addEventListener(IndexChangedEvent.CHANGE, change);
			
			this.addElement( accordion );
			
			//add Nam-Tree-Grid to accordion
			addCriteriaGrid(leftGrid, "Buying Algorithm");
			addCriteriaGrid(rightGrid, "Selling Algorithm");
		}
		protected function addCriteriaGrid(grid:BTCriteriaGrid, label:String):void
		{
			//set Scale
			grid.percentWidth = 100;
			grid.percentHeight = 100;
			
			//set NavigatorContent
			var navigatorContent:NavigatorContent = new NavigatorContent();
			navigatorContent.percentWidth = 100;
			navigatorContent.percentHeight = 100;
			navigatorContent.label = label;
			navigatorContent.addElement(grid);
			
			accordion.addElement(navigatorContent);
		}
	}
}