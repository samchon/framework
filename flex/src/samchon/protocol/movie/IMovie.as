package samchon.protocol.movie
{
	import samchon.protocol.invoke.IProtocol;

	/**
	 * IMovie is a common interface for Movie and SubMovie<br/>
	 * Designed only for SubMovie's parent<br/>
	 * ----- SubMovie's parent can be one of Movie and SubMovie<br/>
	 * ----- Thus, SubMovie can contain SubMovie(s) hierarchically<br/>
	 * <br/>
	 * @see Movie
	 * @see SubMovie
	 */
	public interface IMovie
		extends IProtocol
	{
		
	}
}