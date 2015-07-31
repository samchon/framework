package samchon.protocol.movie.menu
{
	import mx.containers.TabNavigator;
	
	import samchon.protocol.movie.Window;
	
	/**
	 * TopMenu is a TabNavigator item putting on top side in Window<br/>
	 * This is an optional UI-object, so that this is not essential component for Samchon Framework on Flex
	 */
	public class TopMenu 
		extends TabNavigator
	{
		/**
		 * Parent window's pointer
		 */
		public var window:Window;
		
		/**
		 * Constructor.
		 * 
		 * @param window Window containning this TopMenu
		 */ 
		public function TopMenu(window:Window = null)
		{
			super();
			
			this.window = window;
		}
		
		/**
		 * Handles TopMenu from authority level<br/>
		 * Some menu items can be disabled by authority policy. Override this setAuthority method to do it.<br/>
		 * <br/>
		 * @param level User's authority level
		 */
		public function setAuthority(level:int):void
		{
			//FOR IMPLEMENTATION
		}
	}
}