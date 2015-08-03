package samchon.protocol.entity
{
	import samchon.protocol.invoke.Invoke;

	/**
	 * IInvokeEntity is an interface for Invoke converting<br/>
	 * If you want to convert an Entity to Invoke message, implement IInvokeEntity to Entity<br/>
	 * <br/>
	 * @see Entity
	 * @see Invoke
	 * @author Jeongho Nam
	 */
	public interface IInvokeEntity
	{
		/**
		 * The listener when converted to Invoke<br/>
		 * <u>&lt;invoke listener="LISTENER" /&gt;</u>
		 */
		function get LISTENER():String;
		
		/**
		 * <u>Entity -> Invoke</u><br/>
		 * converts Entity to Invoke message
		 */
		function toInvoke():Invoke;
	}
}