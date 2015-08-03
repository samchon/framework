package samchon.protocol.movie
{
	import samchon.protocol.invoke.IProtocol;

	/**
	 * IMovie is a common interface for Movie and SubMovie<br/>
	 * <br/>
	 * Designed only for SubMovie's parent<br/>
	 * &#xA0;&#xA0;&#xA0;&#xA0; SubMovie's parent can be one of Movie or SubMovie<br/>
	 * &#xA0;&#xA0;&#xA0;&#xA0; Thus, SubMovie can contain SubMovie(s) hierarchically<br/>
	 * <br/>
	 * @see Movie
	 * @see SubMovie
	 */
	public interface IMovie
		extends IProtocol
	{
		
	}
}