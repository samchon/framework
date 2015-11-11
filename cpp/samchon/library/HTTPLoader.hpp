#pragma once
#include <samchon/API.hpp>

#include <samchon/ByteArray.hpp>
#include <samchon/library/URLVariables.hpp>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief A http, web-page loader
		 * @details
		 *
		 * @image html cpp/subset/library_http.png
		 * @image latex cpp/subset/library_http.png
		 *
		 * @note Depreciated
		 *
		 * @see samchon::library
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API HTTPLoader
		{
		private:
			std::string url;
			int method;

			static Map<std::string, std::string> cookieMap;

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
			HTTPLoader(int method = POST);
			HTTPLoader(const std::string &, int method);
			virtual ~HTTPLoader() = default;

			/* ------------------------------------------------------------
				SETTERS & GETTERS
			------------------------------------------------------------ */
			void setURL(const std::string &);
			void setMethod(int);

			auto getURL() const -> std::string;
			auto getMethod() const -> int;
			auto getCookie(const std::string &) const -> std::string;

			/* ------------------------------------------------------------
				LOADERS
			------------------------------------------------------------ */
			auto load(const URLVariables & = {}) const->ByteArray;
		};
	};
};