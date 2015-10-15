#pragma once

namespace samchon
{
	namespace protocol
	{
		/**
		 * @brief Package of cloud service as a server
		 *
		 * @details
		 * <p> In Samchon Framework, realizing cloud service, there're two classes representing physical
		 * server and client as Server and Client. Between the two classes representing 
		 * boundaries, there is a class representing logical conception user as User.
		 * In the terminal node under the Client, Service class represents a control. </p>
		 *
		 * <p> The default protocol of the service package is not 'web socket'. The default only has
		 * message protocol of Invoke, does not have handshake or another pre-defined protocol. By
		 * the default protocol, you can connect to the cloud server (built from c++, by service package)
		 * as a client by a program or plug-in like Flex or C#. However you can't connect by web-browser
		 * only allowing socket protocol as web-socket. </p>
		 *
		 * <p> To build a cloud service to follow web-socket protocol, inherits derviced classes 
		 * not from Server, Client, but from WebServer, WebClient or 
		 * implements IWebServer, IWebClient which are derived from Server and Client. </p>
		 *
		 * <h5> Class Diagram </h5>
		 * <p> @image html cpp/protocol_service.png
		 * @image latex cpp/protocol_service.png </p>
		 *
		 * <h5> Sequence Diagram - A client's connection </h5>
		 * <p> @image html sequence/service_connection.png
		 * @image latex sequence/service_connection.png </p>
		 *
		 * <h5> Sequence Diagram - Network communication </h5>
		 * <p> @image html sequence/service_communication.png
		 * @image latex sequence/service_communication.png </p>
		 *
		 * <h4> Simple example - Chat service </h4>
		 * \par examples/chat_service/ChatServer.hpp
		 *		@includelineno examples/chat_service/ChatServer.hpp
		 * \par examples/chat_service/ChatUser.hpp
		 *		@includelineno examples/chat_service/ChatUser.hpp
		 * \par examples/chat_service/ChatClient.hpp
		 *		@includelineno examples/chat_service/ChatClient.hpp
		 * \par examples/chat_service/ChatService.hpp
		 *		@includelineno examples/chat_service/ChatService.hpp
		 * \par examples/chat_service/ListService.hpp
		 *		@includelineno examples/chat_service/ListService.hpp
		 *
		 * \par examples/chat_service/ChatRoomArray.hpp
		 *		@includelineno examples/chat_service/ChatRoomArray.hpp
		 * \par examples/chat_service/ChatRoom.hpp
		 *		@includelineno examples/chat_service/ChatRoom.hpp
		 * \par examples/chat_service/ChatMessage.hpp
		 *		@includelineno examples/chat_service/ChatMessage.hpp
		 *
		 * \par examples/chat_service/ChatServer.cpp
		 *		@includelineno examples/chat_service/ChatServer.cpp
		 * \par examples/chat_service/ChatUser.cpp
		 *		@includelineno examples/chat_service/ChatUser.cpp
		 * \par examples/chat_service/ChatClient.cpp
		 *		@includelineno examples/chat_service/ChatClient.cpp
		 * \par examples/chat_service/ChatService.cpp
		 *		@includelineno examples/chat_service/ChatService.cpp
		 * \par examples/chat_service/ListService.cpp
		 *		@includelineno examples/chat_service/ListService.cpp
		 *
		 * \par examples/chat_service/ChatRoomArray.cpp
		 *		@includelineno examples/chat_service/ChatRoomArray.cpp
		 * \par examples/chat_service/ChatRoom.cpp
		 *		@includelineno examples/chat_service/ChatRoom.cpp
		 * \par examples/chat_service/ChatMessage.cpp
		 *		@includelineno examples/chat_service/ChatMessage.cpp
		 *
		 * @author Jeongho Nam
		 */
		namespace service
		{
			//THIS HEADER FILE IS ONLY FOR DOCUMENTATION
		};
	};
};