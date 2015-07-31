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
		/**
		 * ISQLEntity is an interface for interacting with Database
		 */
		class SAMCHON_FRAMEWORK_API ISQLEntity
		{
		public:
			ISQLEntity();
			virtual ~ISQLEntity() = default;

			/**
			 * Load data of the Entity from Database by SQLStatement
			 *
			 * @param stmt SQLStatement storing data of the Entity
			 */
			virtual void load(std::shared_ptr<library::SQLStatement> stmt);
			
			/**
			 * Archive data of the Entity to Database by SQLStatement
			 *
			 * @param stmt SQLStatement would store data of the Entity
			 */
			virtual void archive(std::shared_ptr<library::SQLStatement> stmt);

			/**
			 * Make a SQL representing data of the Enitty
			 *
			 * @return SQL storing record(s) to temporary table of a Procedure
			 */
			virtual auto toSQL() const -> String;
		};
	};
};