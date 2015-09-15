#pragma once


#include <samchon/protocol/IServer.hpp>
#include <samchon/Map.hpp>
#include <samchon/SmartPointer.hpp>
#include <samchon/library/CriticalAllocator.hpp>

#include <string>

namespace samchon
{
	namespace library
	{
		class SQLi;
		class SQLStatement;
	}
	namespace protocol
	{
		namespace service
		{
			class IPUserPair;
			class User;
			class Client;

			/**
			 * @brief Server for (cloud) service
			 *
			 * @details
			 * 
			 * 
			 * @note Override those methods.
			 *  \li NAME()
			 * 	\li PORT()
			 * 	\li createUser()
			 *
			 * @tparam key_Kty std::string := Session id of User
			 * @tparam _Ty SmartPointer<User>
			 * @author Jeongho Nam
			 */
			class  Server
				: private Map<std::string, SmartPointer<User>>,
				public IServer
			{
				friend class IPUserPair;
				friend class User;
				
			private:
				typedef Map<std::string, SmartPointer<User>> super;
			
			protected:
				virtual auto NAME() const -> std::string = NULL;

				/**
				 * @brief SQLi for archiving log
				 */
				library::SQLi *sqli;

			private:
				std::mutex mtx;
				
				/**
				 * @brief Map of issuer of session ID of each ip
				 */
				Map<std::string, std::shared_ptr<IPUserPair>> ipMap;

				/**
				 * @brief Sequence for issuing session ID
				 */
				size_t sequence;

			public:
				/**
				 * @brief Default Constructor
				 */
				Server();
				virtual ~Server();

				/* =========================================================
					GETTERS
				========================================================= */
				auto getSQLi() const -> library::SQLi*;

				/* =========================================================
					ACCESSORS OF MAP
				========================================================= */
				auto size() const -> size_t;
				auto begin() const -> const_iterator;
				auto end() const -> const_iterator;

			protected:
				/* =========================================================
					ABSTRACT METHODS
				========================================================= */
				/**
				* @brief Factory method of User
				*/
				virtual auto createUser(const std::string&) const -> User* = NULL;

				/**
				* @brief Handling connection of a client
				*/
				void addClient(Socket*);

			private:
				void eraseUser(const std::string &);
			};
		};
	};
};