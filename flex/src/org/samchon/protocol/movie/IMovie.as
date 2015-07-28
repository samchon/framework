package org.samchon.protocol.movie
{
	import org.samchon.protocol.invoke.IProtocol;

	/**
	 * IMovie is a common interface for Movie and SubMovie<br>
	 * Designed only for SubMovie's parent<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp;- SubMovie's parent can be one of Movie and SubMovie<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp;- Thus, SubMovie can contain SubMovie(s) hierarchically<br>
	 * <br>
	 * @see Movie
	 * @see SubMovie
	 */
	public interface IMovie
		extends IProtocol
	{
		
	}
}