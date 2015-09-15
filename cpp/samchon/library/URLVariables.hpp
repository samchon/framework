#pragma once


#include <samchon/Map.hpp>
#include <string>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief URLVariables class is for representing variables of HTTP
		 * @details
		 * URLVariables class allows you to transfer variables between an application and server.
		 * When transfering, URLVariables will be converted to a URI string
		 *	\li URI: Uniform Resource Identifier
		 *
		 * Use URLVariabels objects with methods of HTTPLoader class
		 *
		 * @author Jeongho Nam
		 */
		class  URLVariables
			: public Map<std::string, std::string>
		{
		private:
			typedef Map<std::string, std::string> super;

		public:
			/* ------------------------------------------------------------
				CONSTRUCTORS
			 ------------------------------------------------------------ */
			/**
			 * @brief Inherits all constructors of map<string, string>
			 */
			using super::super;

			/**
			 * @brief Default Constructor
			 */
			URLVariables();
			
			/**
			 * @brief Constructor by a string representing encoded properties
			 * @details 
			 * Converts the variable string to properties of the specified URLVariables object.\n
			 * &nbps;&nbps;&nbps;&nbps; ex) URLVariables(\"id=jhnam88&name=Jeongho+Nam") => {{\"id\", \"jhnam88\"}, {\"name\", \"Jeongho Nam\"}}
			 * 
			 * @param A uri-encoded string containing pair of properties
			 */
			URLVariables(const std::string &flashVars);

		private:
			/* ------------------------------------------------------------
				URI ENCODING & DECONDING
			------------------------------------------------------------ */
			/**
			 * @brief Encodes a string into a valid URI
			 * @details Encodes a string to follow URI standard format.
			 *
			 * @param A string to encode to URI
			 * @return A string converted to URI
			 */
			auto encode(const std::string &) const -> std::string;

			/**
			 * @brief Decodes a URI string
			 * @details Decodes a URI string to its original
			 *
			 * @param A string encoded
			 * @return A string decoded from URI
			 */
			auto decode(const std::string &) const -> std::string;

		public:
			/* ------------------------------------------------------------
				TO_STRING
			------------------------------------------------------------ */
			/**
			 * @brief Get the string representing URLVariables
			 * @details Returns a string object representing URLVariables following the URI\n
			 * &nbsp;&nbsp;&nbsp;&nbsp; ex) URLVariables({{"id", "jhnam88"}, {"name", "Jeongho Nam"}}).toString() => "id=jhnam88&name=Jeongho+Nam"
			 *
			 * @return A string representing URLVariables following the URI
			 */
			auto toString() const -> std::string;
		};
	};
};