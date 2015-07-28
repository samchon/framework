package skins.halo
{
    import flash.display.*;
    import mx.skins.*;

    public class ProgressBarSkin extends Border
    {
        static const VERSION:String = "3.6.0.12937";

        public function ProgressBarSkin()
        {
            return;
        }// end function

        override public function get measuredWidth() : Number
        {
            return 200;
        }// end function

        override public function get measuredHeight() : Number
        {
            return 6;
        }// end function

        override protected function updateDisplayList(param1:Number, param2:Number) : void
        {
            super.updateDisplayList(param1, param2);
            var _loc_3:* = getStyle("barColor");
            if (!_loc_3)
            {
                _loc_3 = getStyle("themeColor");
            }
            var _loc_4:Array = [_loc_3, _loc_3];
            var _loc_5:* = graphics;
            _loc_5.clear();
            drawRoundRect(0, 0, param1, param2, 0, _loc_4, 0.5, verticalGradientMatrix(0, 0, param1 - 2, param2 - 2));
            drawRoundRect(1, 1, param1 - 2, param2 - 2, 0, _loc_4, 1, verticalGradientMatrix(0, 0, param1 - 2, param2 - 2));
            return;
        }// end function

    }
}
