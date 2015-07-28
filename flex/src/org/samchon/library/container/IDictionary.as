package org.samchon.library.container
{
	/**
	 * Interface for Dictionary container having key-based items<br>
	 * <br> 
	 * @author Jeongho Nam<br>
	 * <a href="http://samchon.org" target="_blank">http://samchon.org</a>
	 */ 
	//template <typename _Ty>
	public interface IDictionary
	{
		//function get(key:*):_Ty;
		
		/**
		 * Access the element by specified identifier(key)
		 * 
		 * @param key the identifier of the element wants to access 
		 * @return The element having the key, or null if there is none.
		 */
		function has(key:*):Boolean;
		
		/**
		 * Removes child element by specified key and returns whether deletion was succeded or not.
		 * 
		 * @param key the identifier of the Entity wants to erase 
		 * @return Whethere succeded to erase or not
		 */
		function erase(key:*):Boolean;
	}
}