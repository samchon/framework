package
{
	public class MCParameter
	{
		protected var mean:Number;
		protected var variance:Number;
		
		public function MCParameter(mean:Number, variance:Number)
		{
			this.mean = mean;
			this.variance = variance;
		}
		public function getMean():Number		{	return mean;				}
		public function getVariance():Number	{	return variance;			}
		public function getStdev():Number		{	return Math.sqrt(variance);	}
	}
}