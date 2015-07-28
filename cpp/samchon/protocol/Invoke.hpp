#pragma once
#include <samchon\API.hpp>

#include <samchon/VectorMap.hpp>
#include <samchon/protocol/ISQLEntity.hpp>

#include <samchon/protocol/InvokeParameter.hpp>

namespace samchon
{
	namespace library
	{
		class XML;
	};
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API Invoke;
		class InvokeParameter;
		
		SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API std::shared_ptr<Invoke>;
		SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API std::shared_ptr<InvokeParameter>;

		class SAMCHON_FRAMEWORK_API Invoke
			: public VectorDictionary<InvokeParameter>
		{
		private:
			typedef VectorDictionary<InvokeParameter> super;

		protected:
			String listener;

		public:
			using super::super;
			Invoke(const String &listener);
			Invoke(std::shared_ptr<library::XML> xml);

			auto getListener() const -> String;

			virtual void archive(std::shared_ptr<library::SQLStatement>);

			auto toXML() const -> std::shared_ptr<library::XML>;
			virtual auto toSQL() const -> String;
		};
	};
};