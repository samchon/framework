#pragma once
#include <samchon/API.hpp>

#include <samchon/ByteArray.hpp>
#include <samchon/Map.hpp>

namespace samchon
{
	namespace library
	{
		class URLVariables;

		/**
		 * @brief A http, web-page loader
		 * @details
		 *
		 * @image html cpp/subset/library_http.png
		 * @image latex cpp/subset/library_http.png
		 *
		 * @note Depreciated
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API HTTPLoader
		{
		private:
			std::string url;
			int method;

			Map<std::string, std::string> sendHeaderMap;
			Map<std::string, std::string> receivedHeaderMap;

		public:
			enum METHOD : int
			{
				GET = 1,
				POST = 2
			};

		public:
			/* ------------------------------------------------------------
				CONSTRUCTORS
			------------------------------------------------------------ */
			HTTPLoader();
			HTTPLoader(int method);
			HTTPLoader(const std::string &, int method);
			virtual ~HTTPLoader();

			/* ------------------------------------------------------------
				SETTERS & GETTERS
			------------------------------------------------------------ */
			void setURL(const std::string &);
			void setMethod(int);

			auto getURL() const -> std::string;
			auto getMethod() const -> int;

			/* ------------------------------------------------------------
				LOADERS
			------------------------------------------------------------ */
			auto load(const URLVariables &) const -> ByteArray;

		private:
			static auto decodeGZip(const ByteArray&) -> ByteArray;
		};
	};
};