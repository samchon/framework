#pragma once

#include <random>
#include <vector>
#include <samchon/IndexPair.hpp>

namespace samchon
{
	namespace library
	{
		class Math
		{
		public:
			//최소 최대값을 계산
			template <typename T> static auto calcMin(const std::vector<T> &vec) -> IndexPair<T>
			{
				size_t size = vec.size();

				const T *val = &vec.at(0);
				size_t position = 0;

				for (size_t i = 0; i < size; i++)
					if (vec.at(i) < *val)
					{
						val = &vec.at(i);
						position = i;
					}
				return{ position, *val };
			};
			template <typename T> static auto calcMax(const std::vector<T> &vec) -> IndexPair<T>
			{
				size_t size = vec.size();

				const T *val = &vec.at(0);
				size_t position = 0;

				for (size_t i = 0; i < size; i++)
					if (vec.at(i) > *val)
					{
						val = &vec.at(i);
						position = i;
					}
				return{ position, *val };
			};
		};
	};
};