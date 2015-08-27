#pragma once
#include <samchon/API.hpp>

#include <samchon/ByteArray.hpp>

namespace samchon
{
	namespace library
	{
		class URLVariables;

		/**
		 * @brief A
		 */
		class SAMCHON_FRAMEWORK_API HTTPLoader
		{
		private:
			std::string url;
			int method;

		public:
			HTTPLoader(int method);
			virtual ~HTTPLoader();

			void close();

			auto load(const URLVariables &) const -> ByteArray;
		};
	};
};