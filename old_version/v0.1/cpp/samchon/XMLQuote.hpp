#pragma once
#include <samchon/SamchonLibrary.hpp>

namespace samchon
{
	class SAMCHON_LIBRARY_API XMLQuote 
	{
	private:
		size_t type;
		size_t startPoint;
		size_t endPoint;

	public:
		enum
		{
			QUOTE_SINGLE = 1, 
			QUOTE_DOUBLE = 2
		};

		XMLQuote(size_t type, size_t startPoint, size_t endPoint);

		auto getType() const -> size_t;
		auto getStartPoint() const -> size_t;
		auto getEndPoint() const -> size_t;
	};
};