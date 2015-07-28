package org.samchon.simulation.simulation.retrieve.namtree
{
	import org.samchon.namtree.NamTreeMovie;
	import org.samchon.namtree.criteria.NTCriteria;
	import org.samchon.simulation.simulation.retrieve.namtree.criteria.RTCriteria;
	import org.samchon.simulation.simulation.retrieve.namtree.filetree.RTFileTreeManager;
	import org.samchon.simulation.simulation.retrieve.namtree.filetree.file.RTFileList;
	
	public class RetrieveTreeMovie extends NamTreeMovie
	{
		public function RetrieveTreeMovie()
		{
			super();
		}
		
		//CONSTRUCTOR
		override protected function constructFileList():void
		{
			fileList = new RTFileList(Root.application, Root.category + 1000);
			fileList.load();
		}
		override protected function constructUI():void
		{
			//REPLACE NAM_FILE_TREE_MANAGER TO RETRIEVE'S
			fileTreeManager = new RTFileTreeManager();
			fileTreeManager.dataProvider = this.fileList;
			fileTreeManager.percentWidth = 100;
			fileTreeManager.percentHeight = 100;
			
			rightVGroup.removeElementAt(0);
			rightVGroup.addElementAt(fileTreeManager, 0);
		}
		override protected function constructCriteria():void
		{
			//REPLACE NTGRID TO RTGRID -> FOR OVERRIDING OF CRITERIA CREATION
			_criteriaGrid = new RTCriteriaGrid();
			_criteriaGrid.fileList = this.fileList;
			_criteriaGrid.change = itemGridChanged;
			
			criteriaGrid.percentWidth = 100;
			criteriaGrid.percentHeight = 100;
			leftContainer.criteriaGrid = _criteriaGrid;
			rightContainer.criteriaGrid = _criteriaGrid;
			
			vDividedBox.removeElementAt(0);
			vDividedBox.addElementAt(_criteriaGrid, 0);
			
			super.constructCriteria();	//criteriaGridVector.push( this._criteriaGrid );
		}
		
		//LENGTH
		public function getMaxPriceLength():int
		{
			return RTCriteria(criteriaGrid.getTopCriteria()).getMaxPriceLength();
		}
		public function getMaxIndexLength():int
		{
			return RTCriteria(criteriaGrid.getTopCriteria()).getMaxIndexLength();
		}
	}
}