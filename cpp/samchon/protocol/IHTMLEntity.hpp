#pragma once


#include <string>

namespace samchon
{
	namespace protocol
	{
		class  IHTMLEntity
		{
		public:
			IHTMLEntity();
			virtual ~IHTMLEntity() = default;

			virtual auto toHTML() const -> std::string = NULL;
		};
	};
};