package org.samchon.library.container
{
	/**
	 * <p> Interface for Dictionary container having key-based items. </p>
	 * 
	 * @author Jeongho Nam <http://samchon.org><br/>
	 */ 
	//template <typename _Ty>
	public interface IDictionary
	{
		//function get(key:*):_Ty;
		
		/**
		 * <p> Indicates whether a container has an object having the specified identifier. </p>
		 * 
		 * @param key The identifier wants to check
		 * @return If there's the object then true, otherwise false
		 */
		function has(key:*):Boolean;
		
		/**
		 * <p> Removes child element by specified key and returns whether deletion was succeded or not. </p>
		 * 
		 * @param key the identifier of the Entity wants to erase 
		 * @return Whethere succeded to erase or not
		 */
		function erase(key:*):Boolean;
	}
}