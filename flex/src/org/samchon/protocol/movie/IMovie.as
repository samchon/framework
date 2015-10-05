package org.samchon.protocol.movie
{
	import org.samchon.protocol.invoke.IProtocol;

	/**
	 * <p> A common interface for Movie and SubMovie. </p>
	 * <p> IMovie is an interface which is designed only for SubMovie's parent. </p>
	 * 
	 * <ul>
	 * 	<li> SubMovie's parent can be one of Movie or SubMovie. </li>
	 * 	<li> Thus, SubMovie can contain SubMovie(s) hierarchically. </li>
	 * </ul>
	 * 
	 * <img src="movie.png" />
	 * 
	 * @see Movie
	 * @see SubMovie
	 */
	public interface IMovie
		extends IProtocol
	{
		
	}
}