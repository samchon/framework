package org.samchon.simulation.simulation.backtesting.boundary.namtree
{
	import org.samchon.namtree.NamTreeMovie;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree.BTFileTreeManager;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree.file.BTFileList;
	
	public class BTNamTreeMovie extends NamTreeMovie
	{
		import mx.containers.TabNavigator;
		import mx.events.IndexChangedEvent;
		import mx.events.ListEvent;
		
		import org.samchon.namtree.NTCriteriaGrid;
		import org.samchon.simulation.simulation.abstract.history.History;
		import org.samchon.simulation.simulation.abstract.history.HistoryArray;
		
		import spark.components.NavigatorContent;
		
		//포인터 변수
		protected var algorithmTabNavigator:TabNavigator;//짝수 -> BUY, 홀수 -> SELL
		override public function get criteriaGrid():NTCriteriaGrid
		{
			var pair:BTCriteriaGridPair = algorithmTabNavigator.selectedChild as BTCriteriaGridPair;
			var navigatorContent:NavigatorContent = pair.accordion.selectedChild as NavigatorContent;
			var grid:NTCriteriaGrid = navigatorContent.getElementAt(0) as NTCriteriaGrid;
			
			this._criteriaGrid = grid; //TO BIND TO ITEM_CONTAINER
			return grid;
		}
		
		public function BTNamTreeMovie()
		{
			super();
		}
		
		/* ------------------------------------------------------------
			구성 관리자
		------------------------------------------------------------ */
		override protected function constructFileList():void
		{
			fileList = new BTFileList(Root.application, Root.category + 1000);
			fileList.load();
		}
		override protected function constructUI():void
		{
			//REPLACE NAM_FILE_TREE_MANAGER TO RETRIEVE'S
			fileTreeManager = new BTFileTreeManager();
			fileTreeManager.dataProvider = this.fileList;
			fileTreeManager.percentWidth = 100;
			fileTreeManager.percentHeight = 100;
			
			rightVGroup.removeElementAt(0);
			rightVGroup.addElementAt(fileTreeManager, 0);
		}
		override protected function constructCriteria():void
		{
			//중앙 남트리-그리드 제거
			criteriaVGroup.removeAllElements();
			criteriaVGroup.padding = 0;
			
			//중앙 탭네비게이터 삽입
			algorithmTabNavigator = new TabNavigator();
			algorithmTabNavigator.percentWidth = 100;
			algorithmTabNavigator.percentHeight = 100;
			algorithmTabNavigator.setStyle("paddingTop", 0);
			algorithmTabNavigator.addEventListener(IndexChangedEvent.CHANGE, itemGridNavigatorChanged);
			
			criteriaVGroup.addElement(algorithmTabNavigator);
			
			updateTypeList();
		}
		protected function itemGridNavigatorChanged(event:*):void
		{
			for(var i:int = 0; i < criteriaGridArray.length; i++)
				criteriaGridArray[i].advDg.selectedIndex = -1;
		}
		
		private function updateTypeList():void
		{
			leftContainer.typeList.addItem( {label:"explore", data:"explore"} );
			rightContainer.typeList.addItem( {label:"explore", data:"explore"} );
		}
		
		/* ------------------------------------------------------------
			알고리즘 리스트 관리
		------------------------------------------------------------ */
		public function addCriteriaGridPair():void
		{
			var pair:BTCriteriaGridPair = new BTCriteriaGridPair(addCriteriaGrid(), addCriteriaGrid(), itemGridNavigatorChanged);
			//pair.label = "Algorithm" + (algorithmTabNavigator.length + 1);
			algorithmTabNavigator.addElement(pair);
		}
		public function removeCriteriaGridPairAt(x:int):void
		{
			algorithmTabNavigator.removeElementAt(x);
			criteriaGridArray.splice(x * 2, 2);
		}
		public function removeAllCriteriaPair():void
		{
			algorithmTabNavigator.removeAllElements();
			criteriaGridArray.splice(0, criteriaGridArray.length);
		}
		public function setCriteriaGridPairNameAt(val:String, x:int):void
		{
			var pair:BTCriteriaGridPair = algorithmTabNavigator.getElementAt(x) as BTCriteriaGridPair;
			pair.label = val;
		}
		protected function addCriteriaGrid():BTCriteriaGrid
		{
			var grid:BTCriteriaGrid = new BTCriteriaGrid();
			grid.fileList = this.fileList;
			grid.percentWidth = 100;
			grid.percentHeight = 100;
			grid.change = itemGridChanged;
			
			criteriaGridArray.push( grid );
			return grid;
		}
		
		/* ------------------------------------------------------------
		COMPILE
		------------------------------------------------------------ */
		override protected function goImportClasses():void
		{
			trace("goImportClasses");
			
			DateUtil.parse("2014-03-01");
		}
	}
}