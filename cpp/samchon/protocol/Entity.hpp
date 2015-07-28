#pragma once
#include <samchon\API.hpp>

#include <samchon/String.hpp>
#include <memory>

namespace samchon
{
	namespace library
	{
		class XML;
	};
	namespace protocol
	{
		class Invoke;
		
		class SAMCHON_FRAMEWORK_API Entity
		{
		public:
			virtual auto TAG() const -> String = NULL;
			virtual auto LISTENER() const -> String;

			virtual auto key() const -> String;

		public:
			Entity();
			virtual ~Entity() = default;
			
			virtual void construct(std::shared_ptr<library::XML> xml) = NULL;

			virtual auto toXML() const -> std::shared_ptr<library::XML> = NULL;
			virtual auto toInvoke() const -> std::shared_ptr<Invoke>;
		};
	};
};