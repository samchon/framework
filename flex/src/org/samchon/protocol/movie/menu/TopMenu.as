package org.samchon.protocol.movie.menu
{
	import mx.containers.TabNavigator;
	
	import org.samchon.protocol.movie.Window;
	
	/**
	 * <p> TopMenu is a TabNavigator item putting on top side in Window. </p>
	 * 
	 * <p> This is an optional UI-object, so that this is not essential component for Samchon Framework on Flex. </p>
	 * 
	 * <img src="movie.png" />
	 * 
	 * @see Window
	 * @author Jeongho Nam
	 */
	public class TopMenu 
		extends TabNavigator
	{
		/**
		 * <p> Parent window's pointer. </p>
		 */
		public var window:Window;
		
		/**
		 * <p> Constructor from parent Window. </p>
		 * 
		 * @param window Window containning this TopMenu
		 */ 
		public function TopMenu(window:Window = null)
		{
			super();
			
			this.window = window;
		}
		
		/**
		 * <p> Handles TopMenu from authority level. </p>
		 * <p> Some menu items can be disabled by authority policy. Override this setAuthority method to do it. </p>
		 * 
		 * @param level User's authority level
		 */
		public function setAuthority(level:int):void
		{
			//FOR IMPLEMENTATION
		}
	}
}