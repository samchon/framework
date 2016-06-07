#pragma once
#include <samchon/API.hpp>

#include <string>

namespace samchon
{
namespace protocol
{
	class WebSocketUtil
	{
	public:
		enum OpCode : unsigned char
		{
			TEXT = 129,
			BINARY = 130,
			DISCONNECT = 136
		};

		enum SizeCode : unsigned char
		{
			TWO_BYTES = 126,
			EIGHT_BYTES = 127
		};

		static const unsigned char MASK = 128;

		static const std::string GUID;
		
		static auto generate_base64_certification_key() -> std::string;

		static auto encode_certification_key(const std::string &base64) -> std::string;

		static auto issue_session_id() -> std::string;
	};
};
};