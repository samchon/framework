#pragma once

#define WIN32_LEAN_AND_MEAN
#define _SQLNCLI_ODBC_

#include <Windows.h>
#include <atlstr.h>

#include <codecvt>
#include <mutex>
#include <list>
#include <queue>
#include <map>
#include <array>
#include <chrono>
#include <iostream>
#include <random>
#include <thread>
#include <cmath>
#include <atomic>
#include <condition_variable>
#include <memory>
#include <vector>
#include <stdexcept>
#include <initializer_list>

#include <sqltypes.h>
#include <sql.h>
#include <sqlext.h>

#include <boost/asio.hpp>


#if defined(_WINDOWS) || defined(_WIN32) || defined(_WIN64)
#	ifdef SAMCHON_FRAMEWORK_EXPORT
#		define SAMCHON_FRAMEWORK_API __declspec(dllexport)
#		define SAMCHON_FRAMEWORK_EXTERN
#	else
#		define SAMCHON_FRAMEWORK_API __declspec(dllimport)
#		define SAMCHON_FRAMEWORK_EXTERN extern
#	endif
#else
#	define SAMCHON_FRAMEWORK_API
#	define SAMCHON_FRAMEWORK_EXTERN
#endif

/* -------------------------------------------------------------------------
	DISABLE WARNINGS
------------------------------------------------------------------------- */
//MACRO RE-DEFINITION
#pragma warning(disable:4005)

//PRE-DEFINED POINTER'S DELETION
#pragma warning(disable:4150)

//DIAMOND INHERITANCE
#pragma warning(disable:4250)

//TEMPLATE DLL
#pragma warning(disable:4251)

//TYPEDEF TEMPLATE'S DEFAULT PARAMETER
#pragma warning(disable:4348)

#include <ByteArray.hpp>
#include <Dictionary.hpp>
#include <HashMap.hpp>
#include <IndexPair.hpp>
#include <library.hpp>
#include <protocol.hpp>
#include <Set.hpp>
#include <SmartPointer.hpp>
#include <sqlncli.h>
#include <WeakString.hpp>

#include <library\Base64.hpp>
#include <library\CaseGenerator.hpp>
#include <library\Charset.hpp>
#include <library\CombinedPermutationGenerator.hpp>
#include <library\CriticalAllocator.hpp>
#include <library\CriticalDictionary.hpp>
#include <library\CriticalList.hpp>
#include <library\CriticalMap.hpp>
#include <library\CriticalSet.hpp>
#include <library\CriticalVector.hpp>
#include <library\Date.hpp>
#include <library\Datetime.hpp>
#include <library\ErrorEvent.hpp>
#include <library\Event.hpp>
#include <library\EventDispatcher.hpp>
#include <library\FactorialGenerator.hpp>
#include <library\FTByteFile.hpp>
#include <library\FTFactory.hpp>
#include <library\FTFile.hpp>
#include <library\FTFolder.hpp>
#include <library\FTInstance.hpp>
#include <library\FTTextFile.hpp>
#include <library\GAParameters.hpp>
#include <library\GAPopulation.hpp>
#include <library\GeneticAlgorithm.hpp>
#include <library\HTTPLoader.hpp>
#include <library\IOperator.hpp>
#include <library\Math.hpp>
#include <library\memory.hpp>
#include <library\MySQLi.hpp>
#include <library\PermutationGenerator.hpp>
#include <library\ProgressEvent.hpp>
#include <library\RWMutex.hpp>
#include <library\Semaphore.hpp>
#include <library\SharedAcquire.hpp>
#include <library\SharedReadLock.hpp>
#include <library\SharedWriteLock.hpp>
#include <library\SQLi.hpp>
#include <library\SQLLiteConnector.hpp>
#include <library\SQLStatement.hpp>
#include <library\StringUtil.hpp>
#include <library\TSQLi.hpp>
#include <library\TSQLStatement.hpp>
#include <library\UniqueAcquire.hpp>
#include <library\UniqueReadLock.hpp>
#include <library\UniqueWriteLock.hpp>
#include <library\URLVariables.hpp>
#include <library\XML.hpp>
#include <library\XMLList.hpp>

#include <namtree\INTExplore.hpp>
#include <namtree\NTCriteria.hpp>
#include <namtree\NTEntityGroup.hpp>
#include <namtree\NTFactory.hpp>
#include <namtree\NTFile.hpp>
#include <namtree\NTIterator.hpp>
#include <namtree\NTParameter.hpp>
#include <namtree\NTParameterArray.hpp>
#include <namtree\NTParameterDetermined.hpp>
#include <namtree\NTSide.hpp>