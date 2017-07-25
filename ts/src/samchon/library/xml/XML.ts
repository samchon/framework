/// <reference path="../../API.ts" />

namespace samchon.library
{
	/**
	 * @hidden
	 */
	interface _IXMLQuote
	{
		type: number;
		start: number;
		end: number;
	}

	/**
	 * A tree-structured XML object.
	 * 
	 * The {@link XML| class contains methods and properties for working with XML objects. The {@link XML} class (along 
	 * with the {@link XMLList}) implements the powerful XML-handling standards defined in ECMAScript for XML (E4X) 
	 * specification (ECMA-357 edition 2).
	 * 
	 * An XML object, it is composed with three members; {@link getTag tag}, {@link getProperty properties} and 
	 * {@link getValue value}. As you know, XML is a tree structured data expression method. The tree-stucture; 
	 * {@link XML} class realizes it by extending ```std.HashMap<string, XMLList>```. Child {@link XML} objects are 
	 * contained in the matched {@link XMLList} object being grouped by their {@link getTag tag name}. The 
	 * {@link XMLList} objects, they're stored in the {@link std.HashMap} ({@link XML} itself) with its **key**; common 
	 * {@link getTag tag name} of children {@link XML} objects. 
	 * 
	 * ```typescript
	 * class XML extends std.HashMap<string, XMLList>
	 * {
	 *	private tag_: string;
	 *	private properties_: std.HashMap<string, string>;
	 *	private value_: string;
	 * }
	 * ```
	 * 
	 * ```xml
	 * <?xml version="1.0" ?>
	 * <TAG property_name={property_value}>
	 *	<!-- 
	 *		The child XML objects with "CHILD_TAG", They're contained in an XMLList object. 
	 *		The XMLList object, it is stored in std.HashMap (XML class itself) with its key "CHILD_TAG" 
	 *	--> 
	 *	<CHILD_TAG property_name={property_value}>{value}</CHILD_TAG>
	 *  <CHILD_TAG property_name={property_value}>{value}</CHILD_TAG>
	 *	<CHILD_TAG property_name={property_value}>{value}</CHILD_TAG>
	 * 
	 *	<!-- 
	 *		The child XML object named "ANOTHER_TAG", it also belonged to an XMLList ojbect.
	 *		And the XMLList is also being contained in the std.HashMap with its key "ANOTHER_TAG"
	 *	-->
	 *	<ANOTHER_TAG />
	 * </TAG>
	 * ```
	 * 
	 * Use the {@link toString toString()} method to return a string representation of the {@link XML} object regardless 
	 * of whether the {@link XML} object has simple content or complex content.
	 * 
	 * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/XML.html
	 * @handbook https://github.com/samchon/framework/wiki/TypeScript-Library-XML
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class XML
		extends std.HashMap<string, XMLList>
	{
		/**
		 * @hidden
		 */
		private tag_: string;

		/**
		 * @hidden
		 */
		private value_: string;

		/**
		 * @hidden
		 */
		private property_map_: std.HashMap<string, string>;

		/* =============================================================
			CONSTRUCTORS
				- BASIC CONSTRUCTORS
				- PARSERS
		================================================================
			BASIC CONSTRUCTORS
		------------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor();

		/**
		 * Construct from string.
		 * 
		 * Creates {@link XML} object by parsing a string who represents xml structure.
		 * 
		 * @param str A string represents XML structure.
		 */
		public constructor(str: string);

		public constructor(str: string = "")
		{
			super();

			this.property_map_ = new std.HashMap<string, string>();
			this.value_ = "";

			if (str.indexOf("<") == -1)
				return;

			let start: number;
			let end: number;

			//ERASE HEADER OF XML
			if ((start = str.indexOf("<?xml")) != -1) 
			{
				end = str.indexOf("?>", start);

				if (end != -1)
					str = str.substr(end + 2);
			}

			//ERASE COMMENTS
			while ((start = str.indexOf("<!--")) != -1) 
			{
				end = str.indexOf("-->", start);
				if (end != -1)
					break;

				str = str.substr(0, start) + str.substr(end + 3);
			}

			//BEGIN PARSING
			this._Parse(str);
		}

		/* -------------------------------------------------------------
			PARSERS
		------------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private _Parse(str: string): void
		{
			this._Parse_tag(str);
			this._Parse_properties(str);

			let res = this._Parse_value(str);
			if (res.second == true)
				this._Parse_children(res.first);
		}

		/**
		 * @hidden
		 */
		private _Parse_tag(str: string): void
		{
			let start: number = str.indexOf("<") + 1;
			let end: number =
				this._Compute_min_index
					(
					str.indexOf(" ", start),
					str.indexOf("\r\n", start),
					str.indexOf("\n", start),
					str.indexOf("\t", start),
					str.indexOf(">", start),
					str.indexOf("/", start)
					);
			if (start == 0 || end == -1)
				return;

			this.tag_ = str.substring(start, end);
		}

		/**
		 * @hidden
		 */
		private _Parse_properties(str: string): void
		{
			let start: number = str.indexOf("<" + this.tag_) + this.tag_.length + 1;
			let end: number = this._Compute_min_index(str.lastIndexOf("/"), str.indexOf(">", start));

			if (start == -1 || end == -1 || start >= end)
				return;

			//<comp label='ABCD' /> : " label='ABCD' "
			let line: string = str.substring(start, end);
			if (line.indexOf("=") == -1)
				return;

			let label: string;
			let value: string;
			let helpers: _IXMLQuote[] = [];

			let inQuote: boolean = false;
			let quoteType: number;
			let equal: number;

			//INDEXING
			for (let i: number = 0; i < line.length; i++) 
			{
				//Start of quote
				if (inQuote == false && (line.charAt(i) == "'" || line.charAt(i) == "\"")) 
				{
					inQuote = true;
					start = i;

					if (line.charAt(i) == "'")
						quoteType = 1;
					else if (line.charAt(i) == "\"")
						quoteType = 2;
				}
				else if
					(
					inQuote == true &&
					(
						(quoteType == 1 && line.charAt(i) == "'") ||
						(quoteType == 2 && line.charAt(i) == "\"")
					)
				) 
				{
					helpers.push({ type: quoteType, start: start, end: i });
					inQuote = false;
				}
			}

			//CONSTRUCTING
			for (let i: number = 0; i < helpers.length; i++) 
			{
				let quote = helpers[i];

				if (i == 0) 
				{
					equal = line.indexOf("=");
					label = line.substring(0, equal).trim();
				}
				else 
				{
					equal = line.indexOf("=", helpers[i - 1].end + 1);
					label = line.substring(helpers[i - 1].end + 1, equal).trim();
				}
				value = line.substring(helpers[i].start + 1, helpers[i].end);

				this.setProperty(label, this._Decode_property(value));
			}
		}

		/**
		 * @hidden
		 */
		private _Parse_value(str: string): std.Pair<string, boolean>
		{
			let end_slash: number = str.lastIndexOf("/");
			let end_block: number = str.indexOf(">");

			if (end_slash < end_block || end_slash + 1 == str.lastIndexOf("<")) 
			{
				//STATEMENT1: <TAG />
				//STATEMENT2: <TAG></TAG> -> SAME WITH STATEMENT1: <TAG />
				this.value_ = "";

				return new std.Pair<string, boolean>(str, false);
			}

			let start: number = end_block + 1;
			let end: number = str.lastIndexOf("<");
			str = str.substring(start, end); //REDEFINE WEAK_STRING -> IN TO THE TAG

			if (str.indexOf("<") == -1)
				this.value_ = this._Decode_value(str.trim());
			else
				this.value_ = "";

			return new std.Pair<string, boolean>(str, true);
		}

		/**
		 * @hidden
		 */
		private _Parse_children(str: string): void
		{
			if (str.indexOf("<") == -1)
				return;

			let start: number = str.indexOf("<");
			let end: number = str.lastIndexOf(">") + 1;
			str = str.substring(start, end);

			let blockStart: number = 0;
			let blockEnd: number = 0;
			start = 0;

			for (let i: number = 0; i < str.length; i++) 
			{
				if (str.charAt(i) == "<" && str.substr(i, 2) != "</")
					blockStart++;
				else if (str.substr(i, 2) == "/>" || str.substr(i, 2) == "</")
					blockEnd++;

				if (blockStart >= 1 && blockStart == blockEnd) 
				{
					end = str.indexOf(">", i);

					let xmlList: XMLList;
					let xml: XML = new XML();
					xml._Parse(str.substring(start, end + 1));

					if (this.has(xml.tag_) == true)
						xmlList = this.get(xml.tag_);
					else 
					{
						xmlList = new XMLList();
						this.set(xml.tag_, xmlList);
					}
					xmlList.push(xml);

					i = end;
					start = end + 1;
					blockStart = 0;
					blockEnd = 0;
				}
			}
		}

		/* =============================================================
			ACCESSORS
				- GETTERS
				- SETTERS
				- ELEMENTS I/O
		================================================================
			GETTERS
		------------------------------------------------------------- */
		/**
		 * Get tag.
		 * 
		 * ```xml
		 * <TAG property_key={property_value}>{value}</TAG>
		 * ```
		 * 
		 * @return tag.
		 */
		public getTag(): string
		{
			return this.tag_;
		}

		/** 
		 * Get value.
		 * 
		 * ```xml
		 * <tag property_key={property_value}>{VALUE}</tag>
		 * ```
		 * 
		 * @return value.
		 */
		public getValue(): string
		{
			return this.value_;
		}

		/**
		 * Get iterator to property element.
		 * 
		 * Searches the {@link getPropertyMap properties} for an element with a identifier equivalent to <i>key</i> 
		 * and returns an iterator to it if found, otherwise it returns an iterator to {@link HashMap.end end()}.
		 *
		 * <p> Two keys are considered equivalent if the properties' comparison object returns false reflexively
		 * (i.e., no matter the order in which the elements are passed as arguments). </p>
		 *
		 * Another member function, {@link hasProperty hasProperty()} can be used to just check whether a particular 
		 * <i>key</i> exists.
		 * 
		 * ```xml
		 * <tag PROPERTY_KEY={property_value}>{value}</tag>
		 * ```
		 * 
		 * @param key Key to be searched for
		 * @return An iterator to the element, if an element with specified <i>key</i> is found, or
		 *		   {@link end HashMap.end()} otherwise.
		 */
		public findProperty(key: string): std.MapIterator<string, string>
		{
			return this.property_map_.find(key);
		}

		/**
		 * Test whether a property exists.
		 * 
		 * ```xml
		 * <tag PROPERTY_KEY={property_value}>{value}</tag>
		 * ```
		 * 
		 * @return Whether a property has the *key* exists or not.
		 */
		public hasProperty(key: string): boolean
		{
			return this.property_map_.has(key);
		}

		/**
		 * Get property.
		 * 
		 * Get property by its *key*, property name. If the matched *key* does not exist, then exception
		 * {@link std.OutOfRange} is thrown. Thus, it would better to test whether the *key* exits or not by calling the
		 * {@link hasProperty hasProperty()} method before calling this {@link getProperty getProperty()}.
		 * 
		 * This method can be substituted by {@link getPropertyMap getPropertyMap()} such below:
		 * - ```getPropertyMap().get(key, value);```
		 * - ```getPropertyMap().find(key).second;```
		 * 
		 * ```xml
		 * <tag PROPERTY_KEY={PROPERTY_VALUE}>{value}</tag>
		 * ```
		 * 
		 * @return Value of the matched property.
		 */
		public getProperty(key: string): string
		{
			return this.property_map_.get(key);
		}

		/**
		 * Get property map.
		 * 
		 * ```xml
		 * <tag PROPERTY_KEY1={PROPERTY_VALUE1}
		 *		PROPERTY_KEY2={PROPERTY_VALUE2}
		 *		PROPERTY_KEY3={PROPERTY_VALUE3}>{value}</tag>
		 * ```
		 * 
		 * @return {@link HashMap} containing properties' keys and values.
		 */
		public getPropertyMap(): std.HashMap<string, string>
		{
			return this.property_map_;
		}

		/* -------------------------------------------------------------
			SETTERS
		------------------------------------------------------------- */
		/**
		 * Set tag.
		 * 
		 * Set tag name, identifier of this {@link XML} object.
		 * 
		 * If this {@link XML} object is belonged to, a child of, an {@link XMLList} and its related {@link XML} objects, 
		 * then calling this {@link setTag setTag()} method direclty is not recommended. Erase this {@link XML} object
		 * from parent objects and insert this object again.
		 * 
		 * ```xml
		 * <TAG property_key={property_value}>{value}</TAG>
		 * ```
		 * 
		 * @param val To be new {@link getTag tag}.
		 */
		public setTag(val: string): void
		{
			this.tag_ = val;
		}

		/**
		 * Set value.
		 *
		 * ```xml
		 * <tag property_key={property_value}>{VALUE}</tag>
		 * ```
		 * 
		 * @param val To be new {@link getValue value}.
		 */
		public setValue(val: string): void
		{
			this.value_ = val;
		}

		/**
		 * Insert a XML object with value.
		 * 
		 * @param tag Tag name, an identifier of new XML object.
		 * @param value Value to be the new XML object.
		 * @return A newly inserted XML object with the value.
		 */
		public insertValue(tag: string, value: string): XML
		{
			let xml = new XML();
			xml.setTag(tag);
			xml.setValue(value);

			return xml;
		}

		/**
		 * Set property.
		 * 
		 * Set a property *value* with its *key*. If the *key* already exists, then the *value* will be overwritten to 
		 * the property. Otherwise the *key* is not exist yet, then insert the *key* and *value* {@link Pair pair} to 
		 * {@link getPropertyMao property map}.
		 * 
		 * This method can be substituted by {@link getPropertyMap getPropertyMap()} such below:
		 * - ```getPropertyMap().set(key, value);```
		 * - ```getPropertyMap().emplace(key, value);```
		 * - ```getPropertyMap().insert([key, value]);```
		 * - ```getPropertyMap().insert(std.make_pair(key, value));```
		 * 
		 * ```xml
		 * <tag PROPERTY_KEY={PROPERTY_VALUE}>{value}</tag>
		 * ```
		 * 
		 * @param key Key, identifier of property to be newly inserted.
		 * @param value Value of new property to be newly inserted.
		 */
		public setProperty(key: string, value: string): void
		{
			this.property_map_.set(key, value);
		}
		
		/**
		 * Erase property.
		 * 
		 * Erases a property by its *key*, property name. If the matched *key* does not exist, then exception 
		 * {@link std.OutOfRange} is thrown. Thus, it would better to test whether the *key* exits or not by calling the
		 * {@link hasProperty hasProperty()} method before calling this {@link eraseProperty eraseProperty()}.
		 * 
		 * This method can be substituted by ``getPropertyMap().erase(key)````.
		 * 
		 * ```xml
		 * <tag PROPERTY_KEY={property_value}>{value}</tag>
		 * ```
		 * 
		 * @param key Key of the property to erase
		 * @throw {@link std.OutOfRange}
		 */
		public eraseProperty(key: string): void
		{
			let it = this.property_map_.find(key);
			if (it.equals(this.property_map_.end()) == true)
				throw Error("out of range");

			this.property_map_.erase(it);
		}

		/* -------------------------------------------------------------
			ELEMENTS I/O
		------------------------------------------------------------- */
		/**
		 * @hidden
		 */
		public push(...args: std.Pair<string, XMLList>[]): number;

		/**
		 * @hidden
		 */
		public push(...args: [string, XMLList][]): number;


		public push(...xmls: XML[]): number;


		public push(...xmlLists: XMLList[]): number;

		public push(...items: any[]): number
		{
			for (let i: number = 0; i < items.length; i++)
			{
				if (items[i] instanceof XML)
				{
					let xml: XML = items[i];

					if (this.has(xml.tag_) == true)
						this.get(xml.tag_).push(xml);
					else 
					{
						let xmlList: XMLList = new XMLList();
						xmlList.push(xml);

						this.set(xml.tag_, xmlList);
					}
				}
				else if (items[i] instanceof XMLList)
				{
					let xmlList: XMLList = items[i];

					if (xmlList.empty() == true)
						continue;

					if (this.has(xmlList.getTag()) == true)
					{
						let myXMLList: XMLList = this.get(xmlList.getTag());

						myXMLList.insert(myXMLList.end(), xmlList.begin(), xmlList.end());
					}
					else
						this.set(xmlList.getTag(), xmlList);
				}
				else
					super.push(items[i]);
			}

			return this.size();
		}

		/**
		 * Add all properties from other {@link XML} object.
		 * 
		 * All the properties in the *obj* are copied to this {@link XML} object. If this {@link XML} object has same
		 * property key in the *obj*, then value of the property will be replaced to *obj*'s own. If you don't want to 
		 * overwrite properties with same key, then use {@link getPropertyMap getPropertyMap()} method.
		 * 
		 * ```typescript
		 * let x: library.XML;
		 * let y: library.XML;
		 * 
		 * x.addAllProperties(y); // duplicated key exists, then overwrites
		 * x.getPropertyMap().insert(y.getPropertyMap().begin(), y.getPropertyMap().end()); 
		 *	// ducpliated key, then ignores. only non-duplicateds are copied.
		 * ```
		 * 
		 * ```xml
		 * <tag PROPERTY_KEY1={property_value1}
		 *		PROPERTY_KEY2={property_value2}
		 *		PROPERTY_KEY3={property_value3}>{value}</tag>
		 * ```
		 * 
		 * @param obj Target {@link XML} object to copy properties.
		 */
		public insertAllProperties(obj: XML): void
		{
			for (let it = obj.property_map_.begin(); it.equals(obj.property_map_.end()) == false; it = it.next())
				this.setProperty(it.first, it.second);
		}

		/**
		 * Clear properties.
		 * 
		 * Remove all properties. It's same with calling ```getPropertyMap().clear()```.
		 * 
		 * ```xml
		 * <tag PROPERTY_KEY1={property_value1}
		 *		PROPERTY_KEY2={property_value2}
		 *		PROPERTY_KEY3={property_value3}>{value}</tag>
		 * ```
		 */
		public clearProperties(): void
		{
			this.property_map_.clear();
		}

		/* -------------------------------------------------------------
			FILTERS
		------------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private _Compute_min_index(...args: number[]): number 
		{
			let min: number = args[0];

			for (let i: number = 1; i < args.length; i++)
			{
				if (args[i] == -1)
					continue;

				if (min == -1 || args[i] < min)
					min = args[i];
			}
			return min;
		}

		/**
		 * @hidden
		 */
		private _Decode_value(str: string): string 
		{
			let pairs: Array<std.Pair<string, string>> =
				[
					new std.Pair("&amp;", "&"),
					new std.Pair("&lt;", "<"),
					new std.Pair("&gt;", ">")
				];

			return StringUtil.replaceAll(str, ...pairs);
		}

		/**
		 * @hidden
		 */
		private _Encode_value(str: string): string 
		{
			let pairs: Array<std.Pair<string, string>> =
				[
					new std.Pair("&", "&amp;"),
					new std.Pair("<", "&lt;"),
					new std.Pair(">", "&gt;")
				];
			return StringUtil.replaceAll(str, ...pairs);
		}

		/**
		 * @hidden
		 */
		private _Decode_property(str: string): string 
		{
			let pairs: Array<std.Pair<string, string>> =
				[
					new std.Pair("&amp;", "&"),
					new std.Pair("&lt;", "<"),
					new std.Pair("&gt;", ">"),
					new std.Pair("&quot;", "\""),
					new std.Pair("&apos;", "'"),
					new std.Pair("&#x9;", "\t"),
					new std.Pair("&#xA;", "\n"),
					new std.Pair("&#xD;", "\r"),
				];
			return StringUtil.replaceAll(str, ...pairs);
		}

		/**
		 * @hidden
		 */
		private _Encode_property(str: string): string 
		{
			let pairs: Array<std.Pair<string, string>> =
				[
					new std.Pair("&", "&amp;"),
					new std.Pair("<", "&lt;"),
					new std.Pair(">", "&gt;"),
					new std.Pair("\"", "&quot;"),
					new std.Pair("'", "&apos;"),
					new std.Pair("\t", "&#x9;"),
					new std.Pair("\n", "&#xA;"),
					new std.Pair("\r", "&#xD;"),
				];
			return StringUtil.replaceAll(str, ...pairs);
		}

		/* -------------------------------------------------------------
			EXPORTS
		------------------------------------------------------------- */
		/**
		 * {@link XML} object to xml string.
		 * 
		 * Returns a string representation of the {@link XML} object.
		 * 
		 * @param tab Number of tabs to spacing.
		 * @return The string representation of the {@link XML} object.
		 */
		public toString(tab: number = 0): string
		{
			let str: string = StringUtil.repeat("\t", tab) + "<" + this.tag_;
			let children_str: string = "";

			//PROPERTIES
			for (let p_it = this.property_map_.begin(); p_it.equals(this.property_map_.end()) == false; p_it = p_it.next())
				str += " " + p_it.first + "=\"" + this._Encode_property(p_it.second) + "\"";

			if (this.size() == 0) 
			{
				// VALUE
				if (this.value_ != "")
					str += ">" + this._Encode_value(this.value_) + "</" + this.tag_ + ">";
				else
					str += " />";
			}
			else 
			{
				// CHILDREN
				str += ">\n";

				for (let x_it = this.begin(); x_it.equals(this.end()) == false; x_it = x_it.next())
					str += x_it.second.toString(tab + 1);

				str += StringUtil.repeat("\t", tab) + "</" + this.tag_ + ">";
			}
			return str;
		}
	}
}
