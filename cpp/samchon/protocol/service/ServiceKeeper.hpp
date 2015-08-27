#pragma once
#include <samchon\API.hpp>

#include <samchon/SmartPointer.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace service
		{
			class User;
			class Client;

			/**
			 * @brief 
			 *
			 * @details
			 * <p>  </p>
			 * <p> You can prevent the object to be destructed until the method is in a process. 
			 * ServerUser, ServerClient and ServerService provides a macro instruction for it. </p>
			 *
			 * @note Defined macros
			 *	\li KEEP_USER_ALIVE
			 *	\li KEEP_CLIENT_ALIVE
			 *	\li KEEP_SERVICE_ALIVE
			 *
			 * @see SmartPointer
			 * @author Jeongho Nam
			 */
			class SAMCHON_FRAMEWORK_API ServiceKeeper
			{
			private:
				/**
				 * @brief A shared pionter of an User
				 */
				SmartPointer<User> user;

				/**
				 * @brief A shared pointer of a Client
				 */
				SmartPointer<Client> client;

			public:
				/**
				 * @brief Construct from User and Client
				 */
				ServiceKeeper(const User *user, const Client *client);
				
				/**
				 * @brief Copy Constructor
				 */
				ServiceKeeper(const ServiceKeeper&);

				/**
				 * @brief Movie Constructor
				 */
				ServiceKeeper(ServiceKeeper&&);
			};
		};
	};
};