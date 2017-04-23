/// <reference path="../../API.ts" />

namespace samchon.library
{	
	/**
	 * List of {@link XML} objects with same tag.
	 * 
	 * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/XMLList.html
	 * @handbook https://github.com/samchon/framework/wiki/TypeScript-Library-XML
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class XMLList
		extends std.Deque<XML>
	{
		// using super::constructor

		/**
		 * Get tag.
		 */
		public getTag(): string
		{
			return this.front().getTag();
		}

		/**
		 * {@link XMLList XML objects} to string.
		 * 
		 * Returns a string representation of the {@link XMLList XML objects}.
		 * 
		 * @param tab Number of tabs to spacing.
		 * @return The string representation of the {@link XMLList XML objects}.
		 */
		public toString(level: number = 0): string 
		{
			let str: string = "";
			
			for (let i: number = 0; i < this.size(); i++)
				str += this.at(i).toString(level) + "\n";

			return str;
		}
	}
}
