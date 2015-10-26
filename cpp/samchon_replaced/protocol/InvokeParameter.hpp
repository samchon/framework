#pragma once
#include <samchon\API.hpp>

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
		public:
			auto key() const -> String;

		protected:
			String name;
			String type;
			void *value;

		public:
			InvokeParameter(std::shared_ptr<library::XML>);
			InvokeParameter(const String&, const String&, const String&);
			template <typename _Ty> InvokeParameter(const String &name, const _Ty &value)
			{
				this->name = name;
				setValue(value);
			};
			~InvokeParameter();

			auto getName() const -> String;
			auto getType() const -> String;
			template<typename _Ty> auto getValue() const -> _Ty;

		protected:
			void setValue(const String &, const String &);
			template<typename _Ty> void setValue(const _Ty &val);

		public:
			auto toXML() const -> std::shared_ptr<library::XML>;
			virtual auto toSQL() const -> String;

		protected:
			auto getString() const -> String;
		};
	};
};