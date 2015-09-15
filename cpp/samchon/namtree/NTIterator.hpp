#pragma once


#include <samchon/library/IOperator.hpp>

#include <memory>

namespace samchon
{
	namespace namtree
	{
		class NTEntityGroup;

		/**
		 * @brief Abstract iterator of historical, studying data
		 */
		class  NTIterator
			: public library::IOperator
		{
		private:
			typedef library::IOperator super;

		protected:
			//NEED NOT TO USE THIS MEMBER-VARIABLE ESSENTIALLY
			//RECOMMEND TO OVERRIDE AND HIDE THIS POINTER-VARIABLE
			const NTEntityGroup *data;

		public:
			NTIterator(const NTEntityGroup* = nullptr);
			virtual ~NTIterator() = default;

			virtual auto operator++() const -> std::shared_ptr<NTIterator> = NULL;
			virtual auto operator--() const -> std::shared_ptr<NTIterator> = NULL;
			virtual auto operator==(std::shared_ptr<NTIterator>&) const -> bool = NULL;
			virtual auto operator<(std::shared_ptr<NTIterator>&) const -> bool = NULL;
		};
	};
};