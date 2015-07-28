package skins.halo
{
    import flash.display.*;
    import mx.skins.*;

    public class ProgressIndeterminateSkin extends Border
    {
        static const VERSION:String = "3.6.0.12937";

        public function ProgressIndeterminateSkin()
        {
            return;
        }// end function

        override public function get measuredWidth() : Number
        {
            return 195;
        }// end function

        override public function get measuredHeight() : Number
        {
            return 6;
        }// end function

        override protected function updateDisplayList(param1:Number, param2:Number) : void
        {
            super.updateDisplayList(param1, param2);
            var _loc_3:* = graphics;
            _loc_3.clear();
            var _loc_4:int = 0;
            while (_loc_4 < param1)
            {
                
                _loc_3.beginFill(16777215, 0.65);
                _loc_3.moveTo(_loc_4, 1);
                _loc_3.lineTo(Math.min(_loc_4 + 14, param1), 1);
                _loc_3.lineTo(Math.min(_loc_4 + 10, param1), (param2 - 1));
                _loc_3.lineTo(Math.max(_loc_4 - 4, 0), (param2 - 1));
                _loc_3.lineTo(_loc_4, 1);
                _loc_3.endFill();
                _loc_4 = _loc_4 + 28;
            }
            return;
        }// end function

    }
}
