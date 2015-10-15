package org.samchon.ui
{
	import mx.containers.TabNavigator;
	import mx.core.IVisualElement;
	
	import spark.components.NavigatorContent;
	
	public class TabNavigator extends mx.containers.TabNavigator
	{
		public function TabNavigator()
		{
			super();
		}
		public function set padding(val:int):void
		{
			this.setStyle("paddingTop", val);
			this.setStyle("paddingLeft", val);
			this.setStyle("paddingRight", val);
			this.setStyle("paddingBottom", val);
		}
		protected function getNewNavigator(element:IVisualElement, label:String):NavigatorContent
		{
			var navigatorContent:NavigatorContent = new NavigatorContent();
			navigatorContent.label = label;
			
			element.percentWidth = 100;
			element.percentHeight = 100;
			navigatorContent.addElement(element);
			
			return navigatorContent;
		}
		public function addNavigator(element:IVisualElement, label:String):IVisualElement
		{
			return this.addElement(getNewNavigator(element, label));
		}
		public function addNavigatorAt(element:IVisualElement, label:String, index:int):IVisualElement
		{
			return this.addElementAt(getNewNavigator(element, label), index);
		}
	}
}