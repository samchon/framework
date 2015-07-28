#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ISQLEntity.hpp>

namespace samchon
{
	namespace library
	{
		class XML;
	};
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API InvokeParameter
		{
		protected:
			String name;
			String type;
			String value;
			std::shared_ptr<library::XML> xml;

		public:
			InvokeParameter(std::shared_ptr<library::XML>);
			InvokeParameter(const String&, const String&, const String&);
			template<typename _Ty> InvokeParameter(const String&, const _Ty&);

			auto key() const -> String;
			auto getName() const -> String;
			auto getType() const -> String;
			template<typename _Ty = String> auto getValue() const -> _Ty;
			auto getValueAsXML() const -> std::shared_ptr<library::XML>;

			auto toXML() const -> std::shared_ptr<library::XML>;
			virtual auto toSQL() const -> String;
		};
	};
};