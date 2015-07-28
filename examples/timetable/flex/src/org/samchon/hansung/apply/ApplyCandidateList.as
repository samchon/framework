package org.samchon.hansung.apply
{
	import mx.collections.ArrayList;
	
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class ApplyCandidateList extends ArrayList
	{
		public function ApplyCandidateList()
		{
			super(null);
		}
		public function at(x:int):ApplyCandidate
		{
			return this.getItemAt(x) as ApplyCandidate;
		}
	}
}