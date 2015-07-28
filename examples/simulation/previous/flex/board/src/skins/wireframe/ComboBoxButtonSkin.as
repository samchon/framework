package skins.wireframe
{
    import mx.binding.*;
    import mx.core.*;
    import mx.events.*;
    import mx.graphics.*;
    import mx.states.*;
    import spark.components.*;
    import spark.components.supportClasses.*;
    import spark.primitives.*;

    public class ComboBoxButtonSkin extends Skin implements IStateClient2
    {
        public var _ComboBoxButtonSkin_Rect1:Rect;
        public var _ComboBoxButtonSkin_Rect2:Rect;
        public var _ComboBoxButtonSkin_Rect3:Rect;
        public var _ComboBoxButtonSkin_Rect4:Rect;
        public var _ComboBoxButtonSkin_Rect5:Rect;
        private var _452855515_ComboBoxButtonSkin_SolidColor1:SolidColor;
        private var _93090825arrow:Path;
        private var __moduleFactoryInitialized:Boolean = false;
        private var _213507019hostComponent:Button;

        public function ComboBoxButtonSkin()
        {
            mx_internal::_document = this;
            this.minWidth = 19;
            this.minHeight = 21;
            this.mxmlContent = [this._ComboBoxButtonSkin_Rect1_i(), this._ComboBoxButtonSkin_Path1_i()];
            this.currentState = "up";
            var _loc_1:* = new DeferredInstanceFromFunction(this._ComboBoxButtonSkin_Rect2_i);
            var _loc_2:* = new DeferredInstanceFromFunction(this._ComboBoxButtonSkin_Rect3_i);
            var _loc_3:* = new DeferredInstanceFromFunction(this._ComboBoxButtonSkin_Rect4_i);
            var _loc_4:* = new DeferredInstanceFromFunction(this._ComboBoxButtonSkin_Rect5_i);
            states = [new State({name:"up", overrides:[new SetProperty().initializeFromObject({target:"_ComboBoxButtonSkin_SolidColor1", name:"color", value:15658734})]}), new State({name:"over", overrides:[new SetProperty().initializeFromObject({target:"_ComboBoxButtonSkin_SolidColor1", name:"color", value:14540253})]}), new State({name:"down", overrides:[new AddItems().initializeFromObject({itemsFactory:_loc_4, destination:null, propertyName:"mxmlContent", position:"after", relativeTo:["_ComboBoxButtonSkin_Rect1"]}), new AddItems().initializeFromObject({itemsFactory:_loc_3, destination:null, propertyName:"mxmlContent", position:"after", relativeTo:["_ComboBoxButtonSkin_Rect1"]}), new AddItems().initializeFromObject({itemsFactory:_loc_2, destination:null, propertyName:"mxmlContent", position:"after", relativeTo:["_ComboBoxButtonSkin_Rect1"]}), new AddItems().initializeFromObject({itemsFactory:_loc_1, destination:null, propertyName:"mxmlContent", position:"after", relativeTo:["_ComboBoxButtonSkin_Rect1"]}), new SetProperty().initializeFromObject({target:"_ComboBoxButtonSkin_SolidColor1", name:"color", value:14540253})]}), new State({name:"disabled", overrides:[new SetProperty().initializeFromObject({name:"alpha", value:0.5})]})];
            return;
        }// end function

        override public function set moduleFactory(param1:IFlexModuleFactory) : void
        {
            super.moduleFactory = param1;
            if (this.__moduleFactoryInitialized)
            {
                return;
            }
            this.__moduleFactoryInitialized = true;
            return;
        }// end function

        override public function initialize() : void
        {
            super.initialize();
            return;
        }// end function

        private function _ComboBoxButtonSkin_Rect1_i() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 0;
            _loc_1.right = 0;
            _loc_1.top = 0;
            _loc_1.bottom = 0;
            _loc_1.width = 69;
            _loc_1.height = 20;
            _loc_1.topRightRadiusX = 2;
            _loc_1.bottomRightRadiusX = 2;
            _loc_1.stroke = this._ComboBoxButtonSkin_SolidColorStroke1_c();
            _loc_1.fill = this._ComboBoxButtonSkin_SolidColor1_i();
            _loc_1.initialized(this, "_ComboBoxButtonSkin_Rect1");
            this._ComboBoxButtonSkin_Rect1 = _loc_1;
            BindingManager.executeBindings(this, "_ComboBoxButtonSkin_Rect1", this._ComboBoxButtonSkin_Rect1);
            return _loc_1;
        }// end function

        private function _ComboBoxButtonSkin_SolidColorStroke1_c() : SolidColorStroke
        {
            var _loc_1:* = new SolidColorStroke();
            _loc_1.color = 7368816;
            return _loc_1;
        }// end function

        private function _ComboBoxButtonSkin_SolidColor1_i() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 12237498;
            this._ComboBoxButtonSkin_SolidColor1 = _loc_1;
            BindingManager.executeBindings(this, "_ComboBoxButtonSkin_SolidColor1", this._ComboBoxButtonSkin_SolidColor1);
            return _loc_1;
        }// end function

        private function _ComboBoxButtonSkin_Rect2_i() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 2;
            _loc_1.top = 1;
            _loc_1.right = 2;
            _loc_1.height = 1;
            _loc_1.fill = this._ComboBoxButtonSkin_SolidColor2_c();
            _loc_1.initialized(this, "_ComboBoxButtonSkin_Rect2");
            this._ComboBoxButtonSkin_Rect2 = _loc_1;
            BindingManager.executeBindings(this, "_ComboBoxButtonSkin_Rect2", this._ComboBoxButtonSkin_Rect2);
            return _loc_1;
        }// end function

        private function _ComboBoxButtonSkin_SolidColor2_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 6052956;
            _loc_1.alpha = 0.25;
            return _loc_1;
        }// end function

        private function _ComboBoxButtonSkin_Rect3_i() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 1;
            _loc_1.top = 2;
            _loc_1.right = 1;
            _loc_1.height = 1;
            _loc_1.fill = this._ComboBoxButtonSkin_SolidColor3_c();
            _loc_1.initialized(this, "_ComboBoxButtonSkin_Rect3");
            this._ComboBoxButtonSkin_Rect3 = _loc_1;
            BindingManager.executeBindings(this, "_ComboBoxButtonSkin_Rect3", this._ComboBoxButtonSkin_Rect3);
            return _loc_1;
        }// end function

        private function _ComboBoxButtonSkin_SolidColor3_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 6052956;
            _loc_1.alpha = 0.07;
            return _loc_1;
        }// end function

        private function _ComboBoxButtonSkin_Rect4_i() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 1;
            _loc_1.top = 2;
            _loc_1.bottom = 1;
            _loc_1.width = 1;
            _loc_1.fill = this._ComboBoxButtonSkin_SolidColor4_c();
            _loc_1.initialized(this, "_ComboBoxButtonSkin_Rect4");
            this._ComboBoxButtonSkin_Rect4 = _loc_1;
            BindingManager.executeBindings(this, "_ComboBoxButtonSkin_Rect4", this._ComboBoxButtonSkin_Rect4);
            return _loc_1;
        }// end function

        private function _ComboBoxButtonSkin_SolidColor4_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 6052956;
            _loc_1.alpha = 0.07;
            return _loc_1;
        }// end function

        private function _ComboBoxButtonSkin_Rect5_i() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.right = 1;
            _loc_1.top = 2;
            _loc_1.bottom = 1;
            _loc_1.width = 1;
            _loc_1.fill = this._ComboBoxButtonSkin_SolidColor5_c();
            _loc_1.initialized(this, "_ComboBoxButtonSkin_Rect5");
            this._ComboBoxButtonSkin_Rect5 = _loc_1;
            BindingManager.executeBindings(this, "_ComboBoxButtonSkin_Rect5", this._ComboBoxButtonSkin_Rect5);
            return _loc_1;
        }// end function

        private function _ComboBoxButtonSkin_SolidColor5_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 6052956;
            _loc_1.alpha = 0.07;
            return _loc_1;
        }// end function

        private function _ComboBoxButtonSkin_Path1_i() : Path
        {
            var _loc_1:* = new Path();
            _loc_1.right = 6;
            _loc_1.verticalCenter = 0;
            _loc_1.data = "M 4.0 4.0 L 4.0 3.0 L 5.0 3.0 L 5.0 2.0 L 6.0 2.0 L 6.0 1.0 L 7.0 1.0 L 7.0 0.0 L 0.0 0.0 L 0.0 1.0 L 1.0 1.0 L 1.0 2.0 L 2.0 2.0 L 2.0 3.0 L 3.0 3.0 L 3.0 4.0 L 4.0 4.0";
            _loc_1.fill = this._ComboBoxButtonSkin_SolidColor6_c();
            _loc_1.initialized(this, "arrow");
            this.arrow = _loc_1;
            BindingManager.executeBindings(this, "arrow", this.arrow);
            return _loc_1;
        }// end function

        private function _ComboBoxButtonSkin_SolidColor6_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 6710886;
            return _loc_1;
        }// end function

        public function get _ComboBoxButtonSkin_SolidColor1() : SolidColor
        {
            return this._452855515_ComboBoxButtonSkin_SolidColor1;
        }// end function

        public function set _ComboBoxButtonSkin_SolidColor1(param1:SolidColor) : void
        {
            var _loc_2:* = this._452855515_ComboBoxButtonSkin_SolidColor1;
            if (_loc_2 !== param1)
            {
                this._452855515_ComboBoxButtonSkin_SolidColor1 = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "_ComboBoxButtonSkin_SolidColor1", _loc_2, param1));
                }
            }
            return;
        }// end function

        public function get arrow() : Path
        {
            return this._93090825arrow;
        }// end function

        public function set arrow(param1:Path) : void
        {
            var _loc_2:* = this._93090825arrow;
            if (_loc_2 !== param1)
            {
                this._93090825arrow = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "arrow", _loc_2, param1));
                }
            }
            return;
        }// end function

        public function get hostComponent() : Button
        {
            return this._213507019hostComponent;
        }// end function

        public function set hostComponent(param1:Button) : void
        {
            var _loc_2:* = this._213507019hostComponent;
            if (_loc_2 !== param1)
            {
                this._213507019hostComponent = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "hostComponent", _loc_2, param1));
                }
            }
            return;
        }// end function

    }
}
