package org.samchon.hansung.apply
{
	import mx.collections.ArrayList;
	
	import org.samchon.hansung.base.Major;
	
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class TargetMajorURLList extends ArrayList
	{
		protected var loadedList:ArrayList = new ArrayList();
		
		public function TargetMajorURLList(source:Array=null)
		{
			super(source);
		}	
		public function at(x:int):Major
		{
			return this.getItemAt(x) as Major;
		}
		
		public override function addItem(item:Object):void
		{
			//중복 방지
			var value:Major = item as Major;
			var i:int;
			
			//loadedList에 있을 경우
			for( i = 0; i < loadedList.length; i++ )
				if(loadedList.getItemAt(i) == value)
					return;
			
			//내부에 중복된 것이 있을 경우
			for( i = 0; i < this.length; i++ )
				if(this.at(i) == value)
					return;
			
			super.addItem(item);
		}		
		public override function removeAll():void
		{
			//모두 지울時, loadedList에 추가됨
			loadedList.addAll(this);
			super.removeAll();
		}
	}
}