#pragma once
#include <samchon/API.hpp>

#include <samchon/library/FTFile.hpp>
#include <samchon/namtree/INTExplore.hpp>

#include <functional>

namespace std
{
	template <typename _Ty, typename _Alloc = std::allocator<_Ty>>
	class vector;
};
namespace samchon
{
	namespace namtree
	{
		class NTFactory;
		class NTParameterArray;
		class NTIterator;

		/**
		 * @brief File for medata of function used in NTSide
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API NTFile
			: public library::FTFile,
			public INTExplore
		{
		private:
			typedef library::FTFile super;
			typedef std::function<double(NTIterator&, const std::vector<double> &)> SideFunction;

		protected:
			NTFactory *factory; //TO FIND OTHERSIDE AND FUNCTION POINTER
			NTParameterArray *parameterArray;
			NTFile *otherside;

			//double (*function)(NTIterator&, const std::vector<double> &);
			SideFunction function;

		public:
			NTFile(NTFactory*, library::FTFolder*);
			virtual ~NTFile() = default;

			virtual void construct(std::shared_ptr<library::XML>) override;

			auto getParameterArray() const -> NTParameterArray*;
			auto getOtherside() const -> NTFile*;
			auto getFunction() const -> SideFunction;

			virtual auto toXML() const -> std::shared_ptr<library::XML> override;
		};
	};
};