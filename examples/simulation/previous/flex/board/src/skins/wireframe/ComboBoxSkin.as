package skins.wireframe
{
    import mx.binding.*;
    import mx.core.*;
    import mx.events.*;
    import mx.graphics.*;
    import mx.states.*;
    
    import spark.components.*;
    import spark.components.supportClasses.*;
    import spark.filters.*;
    import spark.layouts.*;
    import spark.primitives.*;
    import spark.skins.spark.*;

    public class ComboBoxSkin extends Skin implements IStateClient2
    {
        private var _385593099dataGroup:DataGroup;
        private var _433014735dropDown:Group;
        private var _137111012openButton:Button;
        private var _106851532popUp:PopUpAnchor;
        private var _1058056547textInput:TextInput;
        private var __moduleFactoryInitialized:Boolean = false;
        private var _213507019hostComponent:ComboBox;

        public function ComboBoxSkin()
        {
            mx_internal::_document = this;
            this.mxmlContent = [this._ComboBoxSkin_Button1_i(), this._ComboBoxSkin_TextInput1_i()];
            this.currentState = "normal";
            var _loc_1:* = new DeferredInstanceFromFunction(this._ComboBoxSkin_PopUpAnchor1_i, this._ComboBoxSkin_PopUpAnchor1_r);
            states = [new State({name:"normal", overrides:[new SetProperty().initializeFromObject({target:"popUp", name:"displayPopUp", value:false})]}), new State({name:"open", overrides:[new AddItems().initializeFromObject({destructionPolicy:"auto", itemsFactory:_loc_1, destination:null, propertyName:"mxmlContent", position:"first"}), new SetProperty().initializeFromObject({target:"popUp", name:"displayPopUp", value:true})]}), new State({name:"disabled", overrides:[new SetProperty().initializeFromObject({name:"alpha", value:0.5})]})];
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

        private function _ComboBoxSkin_PopUpAnchor1_i() : PopUpAnchor
        {
            var _loc_1:* = new PopUpAnchor();
            _loc_1.left = 0;
            _loc_1.right = 0;
            _loc_1.top = 0;
            _loc_1.bottom = 0;
            _loc_1.popUpPosition = "below";
            _loc_1.popUpWidthMatchesAnchorWidth = true;
            _loc_1.popUp = this._ComboBoxSkin_Group1_i();
            _loc_1.id = "popUp";
            if (!_loc_1.document)
            {
                _loc_1.document = this;
            }
            this.popUp = _loc_1;
            BindingManager.executeBindings(this, "popUp", this.popUp);
            return _loc_1;
        }// end function

        private function _ComboBoxSkin_PopUpAnchor1_r() : void
        {
            var _loc_1:String = null;
            this.popUp = null;
            var _loc_1:String = null;
            this.dropDown = null;
            var _loc_1:String = null;
            this.dataGroup = null;
            return;
        }// end function

        private function _ComboBoxSkin_Group1_i() : Group
        {
            var _loc_1:* = new Group();
            _loc_1.filters = [this._ComboBoxSkin_DropShadowFilter1_c()];
            _loc_1.mxmlContent = [this._ComboBoxSkin_Rect1_c(), this._ComboBoxSkin_Scroller1_c()];
            _loc_1.id = "dropDown";
            if (!_loc_1.document)
            {
                _loc_1.document = this;
            }
            this.dropDown = _loc_1;
            BindingManager.executeBindings(this, "dropDown", this.dropDown);
            return _loc_1;
        }// end function

        private function _ComboBoxSkin_DropShadowFilter1_c() : DropShadowFilter
        {
            var _loc_1:* = new DropShadowFilter();
            _loc_1.blurX = 20;
            _loc_1.blurY = 20;
            _loc_1.distance = 7;
            _loc_1.angle = 90;
            _loc_1.alpha = 0.45;
            _loc_1.color = 7368816;
            return _loc_1;
        }// end function

        private function _ComboBoxSkin_Rect1_c() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 0;
            _loc_1.right = 0;
            _loc_1.top = 0;
            _loc_1.bottom = 0;
            _loc_1.stroke = this._ComboBoxSkin_SolidColorStroke1_c();
            _loc_1.fill = this._ComboBoxSkin_SolidColor1_c();
            _loc_1.initialized(this, null);
            return _loc_1;
        }// end function

        private function _ComboBoxSkin_SolidColorStroke1_c() : SolidColorStroke
        {
            var _loc_1:* = new SolidColorStroke();
            _loc_1.color = 7368816;
            return _loc_1;
        }// end function

        private function _ComboBoxSkin_SolidColor1_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 16777215;
            return _loc_1;
        }// end function

        private function _ComboBoxSkin_Scroller1_c() : Scroller
        {
            var _loc_1:* = new Scroller();
            _loc_1.left = 0;
            _loc_1.top = 0;
            _loc_1.right = 0;
            _loc_1.bottom = 0;
            _loc_1.focusEnabled = false;
            _loc_1.minViewportInset = 1;
            _loc_1.viewport = this._ComboBoxSkin_DataGroup1_i();
            if (!_loc_1.document)
            {
                _loc_1.document = this;
            }
            return _loc_1;
        }// end function

        private function _ComboBoxSkin_DataGroup1_i() : DataGroup
        {
            var _loc_1:* = new DataGroup();
            _loc_1.itemRenderer = this._ComboBoxSkin_ClassFactory1_c();
            _loc_1.layout = this._ComboBoxSkin_VerticalLayout1_c();
            _loc_1.id = "dataGroup";
            if (!_loc_1.document)
            {
                _loc_1.document = this;
            }
            this.dataGroup = _loc_1;
            BindingManager.executeBindings(this, "dataGroup", this.dataGroup);
            return _loc_1;
        }// end function

        private function _ComboBoxSkin_ClassFactory1_c() : ClassFactory
        {
            var _loc_1:* = new ClassFactory();
            _loc_1.generator = spark.skins.spark.DefaultItemRenderer;
            return _loc_1;
        }// end function

        private function _ComboBoxSkin_VerticalLayout1_c() : VerticalLayout
        {
            var _loc_1:* = new VerticalLayout();
            _loc_1.gap = 0;
            _loc_1.horizontalAlign = "contentJustify";
            _loc_1.requestedMinRowCount = 1;
            _loc_1.requestedMaxRowCount = 6;
            return _loc_1;
        }// end function

        private function _ComboBoxSkin_Button1_i() : Button
        {
            var _loc_1:* = new Button();
            _loc_1.width = 19;
            _loc_1.right = 0;
            _loc_1.top = 0;
            _loc_1.bottom = 0;
            _loc_1.focusEnabled = false;
            _loc_1.tabEnabled = false;
            _loc_1.setStyle("skinClass", skins.wireframe.ComboBoxButtonSkin);
            _loc_1.id = "openButton";
            if (!_loc_1.document)
            {
                _loc_1.document = this;
            }
            this.openButton = _loc_1;
            BindingManager.executeBindings(this, "openButton", this.openButton);
            return _loc_1;
        }// end function

        private function _ComboBoxSkin_TextInput1_i() : TextInput
        {
            var _loc_1:* = new TextInput();
            _loc_1.left = 0;
            _loc_1.right = 18;
            _loc_1.top = 0;
            _loc_1.bottom = 0;
            _loc_1.id = "textInput";
            if (!_loc_1.document)
            {
                _loc_1.document = this;
            }
            this.textInput = _loc_1;
            BindingManager.executeBindings(this, "textInput", this.textInput);
            return _loc_1;
        }// end function

        public function get dataGroup() : DataGroup
        {
            return this._385593099dataGroup;
        }// end function

        public function set dataGroup(param1:DataGroup) : void
        {
            var _loc_2:* = this._385593099dataGroup;
            if (_loc_2 !== param1)
            {
                this._385593099dataGroup = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "dataGroup", _loc_2, param1));
                }
            }
            return;
        }// end function

        public function get dropDown() : Group
        {
            return this._433014735dropDown;
        }// end function

        public function set dropDown(param1:Group) : void
        {
            var _loc_2:* = this._433014735dropDown;
            if (_loc_2 !== param1)
            {
                this._433014735dropDown = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "dropDown", _loc_2, param1));
                }
            }
            return;
        }// end function

        public function get openButton() : Button
        {
            return this._137111012openButton;
        }// end function

        public function set openButton(param1:Button) : void
        {
            var _loc_2:* = this._137111012openButton;
            if (_loc_2 !== param1)
            {
                this._137111012openButton = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "openButton", _loc_2, param1));
                }
            }
            return;
        }// end function

        public function get popUp() : PopUpAnchor
        {
            return this._106851532popUp;
        }// end function

        public function set popUp(param1:PopUpAnchor) : void
        {
            var _loc_2:* = this._106851532popUp;
            if (_loc_2 !== param1)
            {
                this._106851532popUp = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "popUp", _loc_2, param1));
                }
            }
            return;
        }// end function

        public function get textInput() : TextInput
        {
            return this._1058056547textInput;
        }// end function

        public function set textInput(param1:TextInput) : void
        {
            var _loc_2:* = this._1058056547textInput;
            if (_loc_2 !== param1)
            {
                this._1058056547textInput = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "textInput", _loc_2, param1));
                }
            }
            return;
        }// end function

        public function get hostComponent() : ComboBox
        {
            return this._213507019hostComponent;
        }// end function

        public function set hostComponent(param1:ComboBox) : void
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
