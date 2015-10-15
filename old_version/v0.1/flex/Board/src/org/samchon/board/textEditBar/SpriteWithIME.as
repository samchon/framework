package org.samchon.board.textEditBar
{
	import flash.display.Sprite;
	
	import mx.core.IIMESupport;
	import mx.managers.IFocusManagerComponent;

	public class SpriteWithIME extends Sprite implements IIMESupport, IFocusManagerComponent
	{
		private var _imeMode:String;
		
		public function SpriteWithIME()
		{
			super();
		}
		
		public function get enableIME():Boolean
		{
			return true;
		}
		
		public function get imeMode():String
		{
			return _imeMode;
		}
		
		public function set imeMode(value:String):void
		{
			_imeMode = value;
		}
		
		public function get focusEnabled():Boolean
		{
			return true;
		}
		
		public function set focusEnabled(value:Boolean):void
		{
		}
		
		// For now! Should be dependent on Configuration.manageTabKey
		public function get tabFocusEnabled():Boolean
		{
			return true;
		}
		
		public function set tabFocusEnabled(value:Boolean):void
		{
		}
		
		public function get hasFocusableChildren():Boolean
		{
			return false;
		}
		
		public function set hasFocusableChildren(value:Boolean):void
		{
		}
		
		public function get mouseFocusEnabled():Boolean
		{
			return false;
		}
		
		/*public function get tabEnabled():Boolean
		{
			return false;
		}
		
		public function get tabIndex():int
		{
			return 0;
		}*/
		
		public function setFocus():void
		{
		}
		
		public function drawFocus(isFocused:Boolean):void
		{
		}
		
	}
}