# Samchon Simulation Cloud
*Samchon Simulation Cloud* is my private solution not publishing source codes, however, I introduce this *Samchon Simulation Cloud* as top of example projects using **Samchon Framework**. Any solution can't represent **Samchon Framework** much better than this *Samchon Simulation Cloud*.

The *Samchon Simulation Cloud* is a cloud solution for:
  - Inquirying corporate
    - Price and summarized information
    - Financial statement & index
    - Comparison
  - Retrieving corporations with specified condition via Nam-Tree.
  - Simulation
    - Deduct the optimal trading condition via Nam-Tree and Back-testing.
    - Future Price with Montecarlo Simulation.
  - Those're all for Automatic System Trading.

Reading the manual, and using the provided demo, how about estimating which modules are used in which parts.

## Demo
  - [Samchon Simulation Cloud](http://samchon.org/simulation)
  - [YouTube Video - Korean](https://youtu.be/oKk6qwwWUM8?t=7m7s)

## Manual
### 1. Top Menu
#### 1.1. Basic Menu
  1. Main: If you click a buttion in Main, new window will be opened.
    1.1. Price
	1.2. Finance
	1.3. Retrieve
	1.4. Comparision
	1.5. Back Test
	1.6. Montecarlo
	1.7. Board
  2. Export
    2-1. To Word
	2-2. To Excel
	2-3. To HTML
	2-4. To Picture
  3. Help
    3-1. Manual
	3-2. Full Screen
	3-3. About

#### 1.2. Simulation Menu
  1. New File
  2. Open File
  3. Save File
  4. Interaction
  5. Programming
  6. Nam-Tree

### 2. Inquiring corporates
#### 2.1. Price
  1. Date range of price data
  2. Minimap Chart
  3. List of technical indices
  4. You can select a financial standard for summarized financial information.

#### 2.2. Financial statements
  1. You can set the type of financial statement.
    - Financial indices
    - Profit & Losses
    - Balanced Sheet
    - Cash Flow 
  2. You can set the standard and period of financial statement.
    - Standard: GAAP & IFRS
    - Period: Year & Quarter
  3. You can select multiple accounts (rows) on report. If you select, then line charts are drawn.
    - Top graph: Original data
    - Bottom graph: Growth ratio compare with before (T / (T-1))

#### 2.3. Comparison
  1. Compare relative price
  2. Compare relative financial indices
  3. Drag corporations from left grid to right what you want to compare. If you double click a corporation in left grid, recommended comparison list will be loaded.
  4. Price data range and financial standard to be compared.

### 3. Nam-Tree
#### 3.1. Composition Principle
#### 3.2. Layout
#### Example; Retrieving Corporation

### 4. Simulation
#### 4.1. Back-testing
##### 4.1.1. Concept
##### 4.1.2. Result Screen
##### 4.1.3. Nam-Tree
#### 4.2. Montecarlo Simulation



## Used Modules
#### C++
  - [Library](CPP-Library)
    - [XML](CPP-Library-XML)
    - [Case Generator](CPP-Library-Case_Generator)
    - [Genetic Algorithm](CPP-Library-Genetic_Algorithm)
    - EventDispatcher
    - Virtual File Tree
    - HTTP Loader
  - [Protocol](CPP-Protocol)
    - [Basic Components](CPP-Protocol-Basic_Components)
    - [Standard Message](CPP-Protocol-Standard_Message)
    - [Cloud Service](CPP-Protocol-Service)
    - [External System](CPP-Protocol-External_System)
      - [Parallel System](CPP-Protocol-Parallel_System)
  - Nam-Tree

#### Flex
  - Library
    - Virtual File Tree
  - Protocol
    - Standard Message
    - Cloud Application
  - Nam-Tree