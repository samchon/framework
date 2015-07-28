#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>

namespace samchon
{
	namespace namtree
	{
		class NTFactory;
		class NTSide;

		class NTIterator;

		class SAMCHON_FRAMEWORK_API NTCriteria
			: public virtual protocol::SharedEntityArray
		{
		private:
			typedef protocol::SharedEntityArray super;

		public:
			virtual auto TAG() const -> String;
			virtual auto CHILD_TAG() const -> String;

			enum
			{
				LESS = -2,
				LESS_EQUAL = -1,
				EUQLA = 0,
				LARGER_EQUAL = 1,
				LARGER = 2
			};

		protected:
			NTFactory *factory;
			NTCriteria *parent;
			
			NTSide *leftSide;
			NTSide *rightSide;
			
			int operator_;
			double weight;

		public:
			NTCriteria(NTFactory*, NTCriteria*);
			virtual ~NTCriteria();

			virtual void construct(std::shared_ptr<library::XML>);
			SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(NTCriteria)

		protected:
			virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::Entity*;

		public:
			virtual void initRetrieve();
			auto calcRetrieved(NTIterator&) const -> double;
			
			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};