#pragma once


#include <samchon/ByteArray.hpp>

namespace samchon
{
	namespace library
	{
		class URLVariables;

		/**
		 * @brief A
		 */
		class  HTTPLoader
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