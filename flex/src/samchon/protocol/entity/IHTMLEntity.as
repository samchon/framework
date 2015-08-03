package samchon.protocol.entity
{
	/**
	 * IHTMLEntity is an interface for HTML converting<br/>
	 * If you want to convert an Entity to HTML, implement IHTMLEntity to Entity<br/>
	 * <br/>
	 * @see Entity
	 * @author Jeongho Nam
	*/
	public interface IHTMLEntity
	{
		/**
		 * Converts current Entity to HTML<br/>
		 * <br/>
		 * @return HTML String expressing Entity's data
		 */
		function toHTML():String;
	}
}