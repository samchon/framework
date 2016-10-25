#pragma once
#include <samchon/API.hpp>

#include <thread>
#include <boost/asio.hpp>
#include <samchon/ByteArray.hpp>
#include <samchon/library/URLVariables.hpp>

#include <array>
#include <random>
#include <chrono>
#include <samchon/library/Date.hpp>
#include <samchon/library/StringUtil.hpp>

namespace samchon
{
namespace library
{
	/**
	 * @brief A http, web-page loader
	 * 
	 * ![Class Diagram](http://samchon.github.io/framework/images/design/cpp_class_diagram/library_data.png)
	 *
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class SAMCHON_FRAMEWORK_API HTTPLoader
	{
	private:
		std::string url;

		/**
		 * @brief Method, Get or Post.
		 */
		int method;

		/**
		 * @brief Cookies got from remote web server.
		 */
		static HashMap<std::string, std::string> cookie_map;

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
		/**
		 * @brief Construct from request url and method.
		 *
		 * @param url Target url of remote web server.
		 * @param method Get or Post
		 */
		HTTPLoader(const std::string &url, int method = POST)
		{
			this->url = url;
			this->method = method;
		};
		virtual ~HTTPLoader() = default;

		/* ------------------------------------------------------------
			SETTERS & GETTERS
		------------------------------------------------------------ */
		/**
		 * @brief Set url.
		 */
		void setURL(const std::string &val)
		{
			this->url = val;
		};

		/**
		 * @brief Set method.
		 */
		void setMethod(int val)
		{
			this->method = method;
		};

		/**
		 * @brief Get url.
		 */
		auto getURL() const -> std::string
		{
			return url;
		};

		/**
		 * @brief Get method.
		 */
		auto getMethod() const -> int
		{
			return method;
		};

		/**
		 * @brief Get cookie.
		 */
		auto getCookie(const std::string &key) const -> std::string
		{
			auto it = cookie_map.find(key);

			if (it == cookie_map.end())
				return "";
			else
				return it->second;
		};

		/* ------------------------------------------------------------
			LOADERS
		------------------------------------------------------------ */
		/**
		 * @brief Load data from target url.
		 *
		 * @details Loads binary data from target web server and address.
		 *
		 * @param data URLVariables containing parameters to request.
		 * @return Binary data fetched from remote web server.
		 */
		auto load(const URLVariables & = {}) const->ByteArray;
	};
};
};