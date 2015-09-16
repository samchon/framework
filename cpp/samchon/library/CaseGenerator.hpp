#pragma once
#include <samchon/API.hpp>

#include <vector>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief Case generator
		 */
		class SAMCHON_FRAMEWORK_API CaseGenerator
		{
		protected:
			/**
			 * @brief N, size of the candidates
			 */
			size_t n_;

			/**
			 * @brief R, size of elements of each case
			 */
			size_t r_;

			/**
			 * @brief Size, the number of all cases
			 */
			size_t size_;

			std::vector<size_t> dividerArray;

		public:
			/**
			 * @brief Construct from size of N and R
			 *
			 * @param n Size of candidates
			 * @param r Size of elements of each case
			 */
			CaseGenerator(size_t n, size_t r);
			virtual ~CaseGenerator() = default;

			//ACCESSORS
			/**
			 * @brief Get size of all cases
			 *
			 * @return The size of all cases
			 */
			auto size() const -> size_t;

			/**
			 * @brief Get x'th row
			 *
			 * @return The row of the x'th in combined permuation case
			 */
			virtual auto at(size_t x) const -> std::vector<size_t> = NULL;

			/**
			 * @copy CaseGenerator::at()
			 */
			auto operator[](size_t) const -> std::vector<size_t>;

			/** 
			 * @brief Get size of the N
			 */
			auto n() const -> size_t;

			/**
			 * @brief Get size of the R
			 */
			auto r() const -> size_t;

		public:
			/* ----------------------------------------------------
				TO_MATRIX
			---------------------------------------------------- */
			/**
			 * @return A matrix containing all cases
			 */
			auto toMatrix() const -> std::vector<std::vector<size_t>>;
		};
	};
};