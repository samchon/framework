#pragma once
#include <samchon/API.hpp>

#include <string>

namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API IHTMLEntity
		{
		public:
			IHTMLEntity();
			virtual ~IHTMLEntity() = default;

			virtual auto toHTML() const -> std::string = NULL;
		};
	};
};