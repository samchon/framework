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

Reading the manual and using the provided demo, how about estimating which modules are used in which parts.

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

## Demo
  - [Samchon Simulation Cloud](http://samchon.org/simulation)
  - [YouTube Video - Korean](https://youtu.be/oKk6qwwWUM8?t=7m7s)

## Manual
### 1. Top Menu
#### 1.1. Basic Menu
![Basic Menu](http://samchon.github.io/simulation/images/manual/basic_menu.png)

  1. Main: If you click a buttion in Main, new window will be opened.
    - A. Price
      - Inquiry stock price
      - Inquiry summarized financial information   
	- B. Finance
	  - Inquiry financial indices
	  - Inquiry financial statements   
	- C. Retrieve
	  - Find matched corporation via *Nam-Tree*
	  - Condition in *Retrive* can be used in *Back-Testing*
	- D. Comparision
	  - Compare relative price
	  - Compare financial indices
	- E. Back Test
	  - Deduct best trading condition via *Back Testing*
	  - The trading condition is composed with *Nam-Tree*
	  - The trading condition can be automatically compowsed via *exploration*
	- F. Montecarlo
	  - Montecarlo Simulation
	  - Predict future price
	  - Reference distribution (risk) for determination
	- G. Board
	
  2. Export: Export current's screen or data to document.
    - A. To Word -> *.doc
	- B. To Excel -> *.xls
	- C. To HTML -> *.html
	- D. To Picture -> Screenshot and save as *.png
	
  3. Help
    - A. Manual -> Samchon Simulation Cloud Manual
	- B. Full Screen -> Convert screen to full-size
	- C. About -> Information about Samchon Simulation Cloud and developer Jeongho Nam

#### 1.2. Simulation Menu
![Simulation Menu](http://samchon.github.io/simulation/images/manual/simulation_menu.png)

  1. New File: Initialize the simulation configurations
    - Iinitialize configurations of simulation.
    
  2. Open File
    - Load simulation configurations.
    
  3. Save File
    - Save current's simulation configurations.
    - It doesn't mean result of simulation but parameters for execution.
    
  4. Interaction
    - Get simulation settings from external program that user specified.
    - This program (Samchon Simulation Cloud) sends historical data, to external program, which will be used to deduct simulation configurations. The external program sends simulation configurations again and the simulation begins.
    
  5. Programming
    - Sinluation configurations are derived from user-defined programming code (script).
    - User writes the programming code, and Samchon Simulation Cloud compiles it and the compiled program will follow steps in *4. Interaction.*
    
  6. Nam-Tree
    - Deduct configurations via *Nam-Tree*.


### 2. Inquiring corporates
#### 2.1. Price
![Inquiry - Price](http://samchon.github.io/simulation/images/manual/price.png)

  1. Date range of price data
    - Starting date ~ final date
    
  2. Minimap Chart
    - You can resize or move the main candle chart by moving or resizing the minimap chart.
    
  3. List of technical indices
    - You can add or pop technical charts by clicking those buttons.
    - Of course, you also can swap the position between those technical charts.
    
  4. You can select a financial standard for summarized financial information.

#### 2.2. Financial statements
![Inquiry - Finance](http://samchon.github.io/simulation/images/manual/finance.png)

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
![Inquiry - Comparison](http://samchon.github.io/simulation/images/manual/comparison.png)

  1. Compare relative price
  2. Compare relative financial indices
  3. Drag corporations from left grid to right what you want to compare. If you double click a corporation in left grid, recommended comparison list will be loaded.
  4. Price data range and financial standard to be compared.


### 3. Nam-Tree
#### 3.1. Composition Principle
###### Nam-Tree is a kind of filtering function that tree-structured.
![NamTree Diagram - Filtering](http://samchon.github.io/simulation/images/manual/namtree_symbol_filter.png)

Like the picture on top, data is inserted into Nam-Tree, and through the filtering out, and return the result. This Nam-Tree's shape and structure is seemed like a decision-tree.

Before utilization, let's ssee the composition principle.

###### Vertical is AND (x), Horizontal is OR(+)
![NamTree Diagram - Axis](http://samchon.github.io/simulation/images/manual/namtree_symbol_tree.png)

AND condition between different level, same level under a same hierarchy is OR. But in fact, not AND or OR condition, but X (multiply) condition between different level which is expressed as parent and child relationship, + (plus) conditions between same level under the same parent.

###### Each elements are criteria (conditional equation)
![NamTree Diagram - Axis](http://samchon.github.io/simulation/images/manual/namtree_symbol_formula.png)

Each element is a criteria:
  - [Left Side] [__compare expression__] [Right side]) ? 1 : 0

If the condition is true, then returns 1. Else then returns 0.

###### Each side in criteria can has weight
As I've mentioned, each criteria’s condition is right, then return 1, else false 0. If you add a weight in here then return (1 X Wi) when true, false is 0, too.
  - [Left Side] [__compare expression__] [Right side]) ? Wi : 0

You can reflect importance by this weight, and you can even adjust minus weight so that you can reflect minus weight (reverse importance), too.

###### You can insert programming code in each side
You can insert not only value to each side, but also user defined function (programming code) so that makes express dynamically.

###### You can deduct the best value to side by optimization: named explore
If you set a **side** to explore, then *Samchon Simulation Clloud* finds the optimization value
It can be used usefully in Back-testing.     


#### 3.2. Layout
##### 3.2.1. Main Layout
![Nam-Tree Layout](http://samchon.github.io/simulation/images/manual/namtree_layout.png)

  1. Nam-Tree Grid
    - A hierarchical grid expressing Nam-Tree’s tree structure.
    
  2. Nam-Tree criteria (A record)
    - Each criteria in Nam-Tree is matched with a record in grid. 
    - Like the top picture, if you select a criteria (record) then, *3. Left side* and *3. Right side* are displayed in *3. Parameter container*.
    
  3. Parameter container
    - Display the left side and right side of 2. Nam-Tree criteria which is selected. You can edit each side in here.
    
  4. User defined function list
    - I told you that you can insert not only value to each side, but also user defined function (programming code) so that makes express dynamically at a page before.
    - This is the user-defined function list and you can adjust the functions to *3. Each side* in *2. Criteria*.

##### 3.2.1. Nam-Tree Grid
![Nam-Tree Grid](http://samchon.github.io/simulation/images/manual/namtree_layout_grid.png)

  1. New Filter
    - Add a filter under the selected criteria.
    - This filter acts like this expression:
	  - (Criteria result from the children [\__compare expression\__] [Right side]) ? Wi : 0
	  
  2. New Criteria
    - Add a new criteria under a selected criteria.
    
  3. Left Term and Right Term
    - Display selected criteria’s left and right side.
    
  4. Operator
    - Display compare expression (>, <, ==, >=, etc.)
    - You can directly change the compare expression by clicking it.
    
  5. Weight
    - Display the weight on each criteria.
    - Like the *4. Operator*, you can edit it directly in grid’s record.
    
  6. Initialization, opening, saving files, etc.

##### 3.2.2. User Defined Function Manager
###### First, Definition
![Nam-Tree Function Manager - Definition](http://samchon.github.io/simulation/images/manual/namtree_layout_function1.png)

  1. Opposite item
    - You can define opposite item as a pair.
    - If this opposite item is set up and when you input this function to a side, then this opposite function will be inserted into the other side automatically.
  
  2. Explore configurations
    - Configurations for optimization.
      - Minimum and Maximum value
      - Accuracy
  
  3. Parameters
    - Set parameters.
    - Components of parameter
      - Name
      - Data type
      - Initial value.
  
  4. Determined parameter candidate list
    - You can set candidate set for parameter.
    - Those candidates will be shown items in a ComboBox.


###### Second, Script
![Nam-Tree Function Manager - Script](http://samchon.github.io/simulation/images/manual/namtree_layout_function2.png)

Insert user-defined function code.

  1. Header
    - A code that will be run after compiled rightly.
    
  2. Get Function
    - A function that will be called by criteria’s a Side.
    
  3. Composer Function
    - A function that will be called when 2. Get Function was called first.


#### 3.3. Example; Retrieving Corporation
![Nam-Tree Example Model](http://samchon.github.io/simulation/images/manual/retrieve.png)
``` ruby
Sum of weighted value is over 3 IN
(
	Disparity 5 is less than 1.05, +
	Disparity 20 is less than 1.08 AND
	(
		VR 20 is less than 1.5 OR
		Psychological Line (PL) is over 0.6
	) +
	CCI 20 is less than -50
)
OR
Debt ratio is under 2.0 (200%) AND
	Matches over 2 IN
	(
		Liquidity ratio is over 1.0 (100%),
		Quick ratio is over 0.8 (80%),
		Operating profit growth ratio is over .08 (8%)
	)

```

### 4. Simulation
#### 4.1. Back-testing
##### 4.1.1. What Back-testing is?
Back-testing means act a virtual trading not to now but to previous time point. It is used to proof one’s own algorithm may be effective or deduct optimized algorithm to use real-trading.

##### 4.1.2. How to process
<img src="http://samchon.github.io/simulation/images/manual/backtesting_process1.png" width="100%" />|<img src="http://samchon.github.io/simulation/images/manual/backtesting_process2.png" width="100%" />
----|----
Select an interaction used to trading. | Select target corporations and click “Do Test”.
<img src="http://samchon.github.io/simulation/images/manual/backtesting_process3.png" width="100%" />|<img src="http://samchon.github.io/simulation/images/manual/backtesting_process4.png" width="100%" />
Set configurations and click “Execute”. | After simulation is finished, the result screen comes.

Back-testing supplies three types of interaction
  1. Interaction
    - Trade by user-determined external program
    
  2. Programming
    - Trade by user-defined programming code.
    - If you create a programming file, then example code is already wrote in.
    - Comprehend by the example code.
    
  3. Nam-Tree
    - Trade by Nam-Tree
    - Filtered out value by Nam-Tree means the trading volume.
	  - Preliminary Buying & Determined Buying, Selling

##### 4.1.3. Result Screen
###### Return Grid
![Back-testing Result Grid](http://samchon.github.io/simulation/images/manual/backtesting_result.png)

Displays trading result on each algorithm.
  - Value & Volume (Bought, Sold)
  - Normal return and hypothesis return for real and nominal return.

If you double-click a record, then you can see the Detailed-transaction Candle chart.

###### Detailed Transaction Candle Chart.
![Back-testing Detailed Transaction Chart](http://samchon.github.io/simulation/images/manual/backtesting_result_detail.png)

This is opened when you double-click a record from ~~Return grid~~.

It’s almost seemed like the Candle chart what we have seen in ~~Inquiry – Price~~. The only difference with it is Detailed-transaction Candle chart has a new index, “Trade History”

Of course, you can export this chart to document or save screenshot.

##### 4.1.4 Return Comparison
![Back-testing Return Comparison](http://samchon.github.io/simulation/images/manual/backtesting_return.png)

If you click the button “Result Comparison” of last tab menu, you can see all algorithm’s return visually and efficiently. This is the reason why this back-testing system can test multiple algorithms at once, for the visualization.

  1. If you open a folder of a record, then a column chart will be opened. 
    - In this case, you can compare a corporate return with multiple algorithms.
    
  2. You can see plot chart of return’s distribution for each algorithm.
    - You can the series of plot chart by setting up in orange circled grid-combo box.
    - Set algorithm name and return type to each-axis.

##### 4.1.5. Trading Method via Nsm-Tree
###### Layout
![Back-testing Nam-Tree Layout](http://samchon.github.io/simulation/images/manual/backtesting_namtree.png)

  1. Algorithm List Grid
    - Back-testing supports multiple algorithm simulation at once as we’ve seen.
    - This grid is for the multiple algorithm simulation. Each record means a trading algorithm. 
    
  2. Back-testing Nam-Tree for each algorithm
    - Each algorithm pairs with a tab-navigator’s tab. Of course, there’s a Nam-Tree set for each algorithm and tab-navigator’s tab.
    
  3. Nam-Tree for Preliminary Buying
    - Nam-Tree for preliminary buying.
    - In Back-testing, deduct a candidates first and determine whether to buy or not by the next step, determining.
    
  4. Determined Buying
  
  5. Nam-Tree for Selling

###### Optimization; Explore
![Back-testing Nam-Tree Explore](http://samchon.github.io/simulation/images/manual/backtesting_namtree_explore.png)

In back testing, you can optimize trading condition by the function, “explore”.

Set a Side to explore, then Samchon Simulation will retrieve the optimization value. 

Additionally, you can see the exploration path like bottom picture.

![Back-testing Nam-Tree Explore](http://samchon.github.io/simulation/images/manual/backtesting_result_explore.png)

#### 4.2. Montecarlo Simulation
##### 4.2.1. What Montecarlo Simulation is?
Assumes that price moves as random walk and the random walk follows normal distribution, generate future price by simulation several times (at least 1,000), deduct the distribution of simulated price.

![Montecarlo Function Formula](http://samchon.github.io/simulation/images/manual/montecarlo_formula.png)

W<sub>t</sub> means norm.s.inv(rand()) in excel, which means random variable follow normal distribution Z(0, 1), inverse function of cumulated normal distribution.

The value user have to input is the *mean* and *standard deviation*.

##### 4.2.2. Result Screen
###### Result Grid
![Montecarlo Simulation Result Grid](http://samchon.github.io/simulation/images/manual/montecarlo_result.png)

After simulation, you can see the mean, standard deviation of not user inputted, but result of simulated set. Also, of course, if you double-click the record, then you can see the detailed-.

##### 4.2.3. Simulation Detailed Histogram
###### Return Distribution
![Montecarlo Simulation Detailed Result 1](http://samchon.github.io/simulation/images/manual/montecarlo_result_detail1.png)

Displays a distribution of return by normal and cumulative graph.

###### Multiple simulated price graph
![Montecarlo Simulation Detailed Result 2](http://samchon.github.io/simulation/images/manual/montecarlo_result_detail2.png)

Display all graphs for each simulated price.

But as the reason of performance and validation, only 100 maximum simulations are be displayed.  

### 5. Documentation
![Export Menu](http://samchon.github.io/simulation/images/manual/export.png)

Top menu in all page has a component **"Export"**.

From inquiring corporate data to simulation result, you can save and export them to word, excel or html document. You also can capture a screenshot to png file.

###### All configurations used in Simulation also can be saved.
![Export Menu](http://samchon.github.io/simulation/images/manual/backtesting_namtree_explore.png)

Of course, as you could save your configurations, you can open and save the simulation configurations whenever you want.
