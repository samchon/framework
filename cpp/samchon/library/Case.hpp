#pragma once
#include <samchon/API.hpp>

#include <vector>

namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API Case
		{
			/*
				levelSize 만큼의 자리수를 가진 indexSize 진수의 숫자를 모두 만들면 된다
				따라서 index ^ levelSize
			*/
		private:
			std::vector<size_t> dividerArray;
			size_t indexSize;
			size_t levelSize;

			size_t size_;

		public:
			Case(size_t indexSize, size_t levelSize);
			virtual ~Case() = default;

			//ACCESSORS
			auto size() const -> size_t;
			auto at(size_t x) const -> std::vector<size_t>;
			auto operator[](size_t) const -> std::vector<size_t>;

			auto getIndexSize() const -> size_t;
			auto getLevelSize() const -> size_t;

		protected:
			virtual auto MATRIX_SIZE() const -> size_t = 0;

			void fetchRow(std::vector<size_t> &, size_t) const;

		public:
			auto isValid(size_t) const -> bool;
			virtual auto isValid(const std::vector<size_t> &) const -> bool = 0;

			auto toMatrix() const -> std::vector<std::vector<size_t>>;
		};
	};
};