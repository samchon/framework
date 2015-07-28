#pragma once
#include <samchon\API.hpp>

#include <memory>
#include <mutex>
#include <samchon/String.hpp>

namespace samchon
{
	namespace library
	{
		class SQLStatement;

		class SAMCHON_FRAMEWORK_API SQLi
		{
		friend class SQLStatement;
		
		protected:
			virtual auto DRIVER() const -> String = NULL;
			virtual auto PORT() const -> long = NULL;

			virtual auto getErrorMessage(short type) const -> std::string;

		private:
			void *hdbc;

			SQLStatement *stmt;
			std::mutex stmtMutex;

		public:
			SQLi();
			virtual ~SQLi();

			virtual void connect
			(
				const String &ip, const String &db,
				const String &id, const String &pwd
			);
			virtual void disconnect();

			virtual auto createStatement() -> std::shared_ptr<SQLStatement>;
		};
	};
};