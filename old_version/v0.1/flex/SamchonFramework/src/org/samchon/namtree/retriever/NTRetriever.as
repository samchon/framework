package org.samchon.namtree.retriever
{
	import org.samchon.namtree.criteria.data.NTAggregation;
	import org.samchon.namtree.criteria.data.NTOperator;
	
	public class NTRetriever
	{
		protected static const NULL:int = Global.NULL;
		
		//Aggregation's MAP
		protected var averageMap:Object = new Object();
		protected var minimumMap:Object = new Object();
		protected var maximumMap:Object = new Object();
		protected var rankMap:Object = new Object();
		
		//INDEX
		protected var iterator:NTIterator;
		
		public function NTRetriever(baseLength:int)
		{
			iterator = new NTIterator(baseLength - 1);
		}
		
		public function getGroupped
			(
				leftValue:Number,
				rightPieceID:int, rightAggregation:int, right:*, rightFunction:Function, rightParam:Array, 
				operator:int, weight:Number
			):Number
		{
			var value:Number = 
				getRetrieved
				(
					NULL, NTAggregation.ATOMIC, leftValue, null, null,
					rightPieceID, rightAggregation, right, rightFunction, rightParam,
					operator, weight
				);
			return value;
		}
		public function getRetrieved
			( 
				leftPieceID:int, leftAggregation:int, left:*, leftFunction:Function, leftParam:Array, 
				rightPieceID:int, rightAggregation:int, right:*, rightFunction:Function, rightParam:Array, 
				operator:int, weight:Number
			):Number
		{
			var result:Number = 0.0;
			
			/* ------------------------------------------------------------------------
				Function일 경우, 값을 받아온다.
			------------------------------------------------------------------------ */
			if(leftFunction != null)
				if(leftAggregation == NTAggregation.ATOMIC)
					left = leftFunction.apply(null, leftParam);
				else
					left = getAggregated(leftPieceID, leftAggregation, leftFunction, leftParam);
			if(rightFunction != null)
				if(rightAggregation == NTAggregation.ATOMIC)
					right = rightFunction.apply(null, rightParam);
				else
					right = getAggregated(rightPieceID, rightPieceID, rightFunction, rightParam);
			
			/* ------------------------------------------------------------------------
				NULL에 대한 처리 -> NULL끼리는 비교가 불가능하게 하는 것으로 한다
			------------------------------------------------------------------------ */
			if( (left is String && left == null) || ( !(left is String) && left == NULL ) )
				return 0.0;
			else if( (right is String && right == null) || ( !(right is String) && right == NULL ) )
				return 0.0;
			
			/* ------------------------------------------------------------------------
				연산자 - sign에 대한 처리
			------------------------------------------------------------------------ */
			//String인데 숫자 연산을 할 경우
			if((NTOperator.EQUAL <= operator && operator <= NTOperator.BIGGER_EQUAL) && (left is String || right is String))
				return 0.0;
				//int 내지 Number인데 글자 연산을 할 경우)
			else if( operator == NTOperator.LIKE && (!(left is String) || !(right is String)) )
				return 0.0;
			
			//비교 연산 결과 x 가중치
			if(operator == NTOperator.EQUAL) // SAME
				result = Number( left == right );
			else if(operator == NTOperator.SMALLER)
				result = Number( left < right );
			else if(operator == NTOperator.SMALLER_EQUAL)
				result = Number( left <= right );
			else if(operator == NTOperator.BIGGER)
				result = Number( left > right );
			else if(operator == NTOperator.BIGGER_EQUAL)
				result = Number( left >= right )
			else if(operator == NTOperator.LIKE)
				result = Number( left.indexOf(right) != -1 );
			
			return result * weight;
		}
		protected function getAggregated
			(
				pieceID:int, 
				aggregation:int, 
				func:Function, 
				orgParam:Array
			):Number
		{
			var key:String = String(pieceID);
			var map:Object;
			var param:Array = new Array();
			var value:Number;
			var atomicValue:Number;
			var i:int;
			var iterable:Boolean;
			var N:int;
			
			//Map 포인터
			if(aggregation == NTAggregation.AVERAGE)
				map = averageMap;
			else if(aggregation == NTAggregation.MINIMUM)
				map = minimumMap;
			else if(aggregation == NTAggregation.MAXIMUM)
				map = maximumMap;
			else if(aggregation == NTAggregation.RANK)
				map = rankMap;
			else
				return 0.0;
			
			//PARAM 초기화
			for(i = 0; i < orgParam.length; i++)
				param.push( orgParam[i] );
			
			/* ------------------------------------------------------------------------
				RANK가 아닐 경우
			------------------------------------------------------------------------ */
			if(aggregation != NTAggregation.RANK)
			{
				//안 구해놨을 경우,
				if(map.hasOwnProperty(key) == false)
				{
					//평균일 경우,
					if(aggregation == NTAggregation.AVERAGE)
					{
						value = 0.0;
						N = 0;
						
						for(iterable = iterator.begin(param); iterable == true; iterable = iterator.toNext(param))
						{
							atomicValue = func.apply( null, param );
							if( atomicValue == NULL )
								continue;
							value += atomicValue;
							N++;
						}
						value = value / Number(N);
					}
					else //최대 또는 최소일 경우
					{
						value = (aggregation == NTAggregation.MINIMUM) ? Number.MAX_VALUE : Number.MIN_VALUE;
						
						for(iterable = iterator.begin(param); iterable == true; iterable = iterator.toNext(param))
						{
							atomicValue = func.apply( null, param );
							
							if( atomicValue == NULL )
								continue;
							
							if(aggregation == NTAggregation.MINIMUM && value > atomicValue) //최소
								value = atomicValue;
							else if(aggregation == NTAggregation.MAXIMUM && value < atomicValue) //최대
								value = atomicValue;
						}
					}
					map[key] = value;
				}
				else //이미 구해져있을 경우, 바로 불러옴
					value = map[key];	
			}
				
			/* ------------------------------------------------------------------------
				구하는 것이 RANK일 경우
			------------------------------------------------------------------------ */
			else
			{
				var array:Array;
				
				//안 구해놨을 경우,
				if(map.hasOwnProperty(key) == false)
				{
					array = new Array();
					for(iterable = iterator.begin(param); iterable == true; iterable = iterator.toNext(param))
					{
						atomicValue = func.apply( null, param );
						
						if( atomicValue == NULL )
							continue;
						array.push( atomicValue );
					}
					array = array.sort(Array.NUMERIC|Array.DESCENDING);
					map[key] = array;
				}
				else
					array = map[key];
				
				for(i = 0; i < array.length; i++)
					if( func.apply( null, param ) == array[i] )
						break;
				value = i;
			}
			return value;
		}
	}
}