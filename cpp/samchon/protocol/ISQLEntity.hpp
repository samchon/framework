#pragma once
#include <samchon\API.hpp>

#include <samchon/String.hpp>
#include <memory>

namespace samchon
{
	namespace library
	{
		class SQLStatement;
	};

	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API ISQLEntity
		{
		public:
			ISQLEntity();
			virtual ~ISQLEntity() = default;

			virtual void load(std::shared_ptr<library::SQLStatement>);
			virtual void archive(std::shared_ptr<library::SQLStatement>);

			virtual auto toSQL() const -> String = NULL;
		};
	};
};