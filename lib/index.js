Object.defineProperty(exports,"__esModule",{value:true});exports.ZoomView=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _jsxFileName="src/index.js";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();

var _react=require("react");var _react2=_interopRequireDefault(_react);
var _reactNative=require("react-native");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var styles={
container:{
justifyContent:"center",
alignItems:"center",
overflow:"hidden",
backgroundColor:"transparent"}};var



ZoomView=function(_Component){_inherits(ZoomView,_Component);







































































function ZoomView(props){_classCallCheck(this,ZoomView);var _this=_possibleConstructorReturn(this,(ZoomView.__proto__||Object.getPrototypeOf(ZoomView)).call(this,
props));_this.state={centerX:0.5,centerY:0.5};_this.








































































































































































































































































































































































































































































resetScale=function(){
_this.positionX=0;
_this.positionY=0;
_this.scale=1;
_this.animatedScale.setValue(1);
};_this.

panResponderReleaseResolve=function(){

if(_this.props.enableSwipeDown&&_this.props.swipeDownThreshold){
if(_this.swipeDownOffset>_this.props.swipeDownThreshold){
if(_this.props.onSwipeDown){
_this.props.onSwipeDown();
}

return;
}
}

if(_this.scale<1){

_this.scale=1;
_reactNative.Animated.timing(_this.animatedScale,{
toValue:_this.scale,
duration:100}).
start();
}

if(_this.props.imageWidth*_this.scale<=_this.props.cropWidth){


_this.positionX=0;
_reactNative.Animated.timing(_this.animatedPositionX,{
toValue:_this.positionX,
duration:100}).
start();
}

if(_this.props.imageHeight*_this.scale<=_this.props.cropHeight){

_this.positionY=0;
_reactNative.Animated.timing(_this.animatedPositionY,{
toValue:_this.positionY,
duration:100}).
start();
}



if(_this.props.imageHeight*_this.scale>_this.props.cropHeight){

var verticalMax=
(_this.props.imageHeight*_this.scale-_this.props.cropHeight)/
2/
_this.scale;
if(_this.positionY<-verticalMax){
_this.positionY=-verticalMax;
}else if(_this.positionY>verticalMax){
_this.positionY=verticalMax;
}
_reactNative.Animated.timing(_this.animatedPositionY,{
toValue:_this.positionY,
duration:100}).
start();
}


if(_this.scale===1){
_this.positionX=0;
_this.positionY=0;
_reactNative.Animated.timing(_this.animatedPositionX,{
toValue:_this.positionX,
duration:100}).
start();
_reactNative.Animated.timing(_this.animatedPositionY,{
toValue:_this.positionY,
duration:100}).
start();
}


_this.horizontalWholeOuterCounter=0;


_this.swipeDownOffset=0;

_this.imageDidMove("onPanResponderRelease");
};_this.lastPositionX=null;_this.positionX=0;_this.animatedPositionX=new _reactNative.Animated.Value(0);_this.lastPositionY=null;_this.positionY=0;_this.animatedPositionY=new _reactNative.Animated.Value(0);_this.scale=1;_this.animatedScale=new _reactNative.Animated.Value(1);_this.zoomLastDistance=null;_this.zoomCurrentDistance=0;_this.lastTouchStartTime=0;_this.horizontalWholeOuterCounter=0;_this.swipeDownOffset=0;_this.horizontalWholeCounter=0;_this.verticalWholeCounter=0;_this.centerDiffX=0;_this.centerDiffY=0;_this.singleClickTimeout;_this.longPressTimeout;_this.lastClickTime=0;_this.doubleClickX=0;_this.doubleClickY=0;_this.isDoubleClick=false;_this.isLongPress=false;_this.isHorizontalWrap=false;_this.imagePanResponder=_reactNative.PanResponder.create({onStartShouldSetPanResponder:function onStartShouldSetPanResponder(){return true;},onMoveShouldSetPanResponder:function onMoveShouldSetPanResponder(_evt){if(_evt.nativeEvent.changedTouches.length===1){return false;}else{return true;}},onPanResponderTerminationRequest:function onPanResponderTerminationRequest(){return false;},onPanResponderGrant:function onPanResponderGrant(evt){_this.lastPositionX=null;_this.lastPositionY=null;_this.zoomLastDistance=null;_this.horizontalWholeCounter=0;_this.verticalWholeCounter=0;_this.lastTouchStartTime=new Date().getTime();_this.isDoubleClick=false;_this.isLongPress=false;_this.isHorizontalWrap=false;_this.singleClickTimeout&&clearTimeout(_this.singleClickTimeout);if(evt.nativeEvent.changedTouches.length>1){var centerX=(evt.nativeEvent.changedTouches[0].pageX+evt.nativeEvent.changedTouches[1].pageX)/2;_this.centerDiffX=centerX-_this.props.cropWidth/2;var centerY=(evt.nativeEvent.changedTouches[0].pageY+evt.nativeEvent.changedTouches[1].pageY)/2;_this.centerDiffY=centerY-_this.props.cropHeight/2;}_this.longPressTimeout&&clearTimeout(_this.longPressTimeout);_this.longPressTimeout=setTimeout(function(){_this.isLongPress=true;_this.props.onLongPress&&_this.props.onLongPress();},_this.props.longPressTime);if(evt.nativeEvent.changedTouches.length<=1){if(new Date().getTime()-_this.lastClickTime<(_this.props.doubleClickInterval||0)){_this.lastClickTime=0;if(_this.props.onDoubleClick){_this.props.onDoubleClick();}clearTimeout(_this.longPressTimeout);_this.doubleClickX=evt.nativeEvent.changedTouches[0].pageX;_this.doubleClickY=evt.nativeEvent.changedTouches[0].pageY;_this.isDoubleClick=true;if(_this.scale>1||_this.scale<1){_this.scale=1;_this.positionX=0;_this.positionY=0;}else{var beforeScale=_this.scale;_this.scale=2;var diffScale=_this.scale-beforeScale;_this.positionX=(_this.props.cropWidth/2-_this.doubleClickX)*diffScale/_this.scale;_this.positionY=(_this.props.cropHeight/2-_this.doubleClickY)*diffScale/_this.scale;}_this.imageDidMove("centerOn");_reactNative.Animated.parallel([_reactNative.Animated.timing(_this.animatedScale,{toValue:_this.scale,duration:100}),_reactNative.Animated.timing(_this.animatedPositionX,{toValue:_this.positionX,duration:100}),_reactNative.Animated.timing(_this.animatedPositionY,{toValue:_this.positionY,duration:100})]).start();}else{_this.lastClickTime=new Date().getTime();}}},onPanResponderMove:function onPanResponderMove(evt,gestureState){if(_this.isDoubleClick){return;}if(evt.nativeEvent.changedTouches.length<=1){var diffX=gestureState.dx-(_this.lastPositionX||0);if(_this.lastPositionX===null){diffX=0;}var diffY=gestureState.dy-(_this.lastPositionY||0);if(_this.lastPositionY===null){diffY=0;}_this.lastPositionX=gestureState.dx;_this.lastPositionY=gestureState.dy;_this.horizontalWholeCounter+=diffX;_this.verticalWholeCounter+=diffY;if(Math.abs(_this.horizontalWholeCounter)>5||Math.abs(_this.verticalWholeCounter)>5){clearTimeout(_this.longPressTimeout);}if(_this.props.panToMove){if(_this.swipeDownOffset===0){if(diffX!==0){_this.isHorizontalWrap=true;}if(_this.props.imageWidth*_this.scale>_this.props.cropWidth){if(_this.horizontalWholeOuterCounter>0){if(diffX<0){if(_this.horizontalWholeOuterCounter>Math.abs(diffX)){_this.horizontalWholeOuterCounter+=diffX;diffX=0;}else{diffX+=_this.horizontalWholeOuterCounter;_this.horizontalWholeOuterCounter=0;if(_this.props.horizontalOuterRangeOffset){_this.props.horizontalOuterRangeOffset(0);}}}else{_this.horizontalWholeOuterCounter+=diffX;}}else if(_this.horizontalWholeOuterCounter<0){if(diffX>0){if(Math.abs(_this.horizontalWholeOuterCounter)>diffX){_this.horizontalWholeOuterCounter+=diffX;diffX=0;}else{diffX+=_this.horizontalWholeOuterCounter;_this.horizontalWholeOuterCounter=0;if(_this.props.horizontalOuterRangeOffset){_this.props.horizontalOuterRangeOffset(0);}}}else{_this.horizontalWholeOuterCounter+=diffX;}}else{}_this.positionX+=diffX/_this.scale;var horizontalMax=(_this.props.imageWidth*_this.scale-_this.props.cropWidth)/2/_this.scale;if(_this.positionX<-horizontalMax){_this.positionX=-horizontalMax;_this.horizontalWholeOuterCounter+=-1/1e10;}else if(_this.positionX>horizontalMax){_this.positionX=horizontalMax;_this.horizontalWholeOuterCounter+=1/1e10;}_this.animatedPositionX.setValue(_this.positionX);}else{_this.horizontalWholeOuterCounter+=diffX;}if(_this.horizontalWholeOuterCounter>(_this.props.maxOverflow||0)){_this.horizontalWholeOuterCounter=_this.props.maxOverflow||0;}else if(_this.horizontalWholeOuterCounter<-(_this.props.maxOverflow||0)){_this.horizontalWholeOuterCounter=-(_this.props.maxOverflow||0);}if(_this.horizontalWholeOuterCounter!==0){if(_this.props.horizontalOuterRangeOffset){_this.props.horizontalOuterRangeOffset(_this.horizontalWholeOuterCounter);}}}if(_this.props.imageHeight*_this.scale>_this.props.cropHeight){_this.positionY+=diffY/_this.scale;_this.animatedPositionY.setValue(_this.positionY);}else{if(_this.props.enableSwipeDown&&!_this.isHorizontalWrap){_this.swipeDownOffset+=diffY;if(_this.swipeDownOffset>0){_this.positionY+=diffY/_this.scale;_this.animatedPositionY.setValue(_this.positionY);_this.scale=_this.scale-diffY/1000;_this.animatedScale.setValue(_this.scale);}}}}}else{if(_this.longPressTimeout){clearTimeout(_this.longPressTimeout);}if(_this.props.pinchToZoom){var minX=void 0;var maxX=void 0;if(evt.nativeEvent.changedTouches[0].locationX>evt.nativeEvent.changedTouches[1].locationX){minX=evt.nativeEvent.changedTouches[1].pageX;maxX=evt.nativeEvent.changedTouches[0].pageX;}else{minX=evt.nativeEvent.changedTouches[0].pageX;maxX=evt.nativeEvent.changedTouches[1].pageX;}var minY=void 0;var maxY=void 0;if(evt.nativeEvent.changedTouches[0].locationY>evt.nativeEvent.changedTouches[1].locationY){minY=evt.nativeEvent.changedTouches[1].pageY;maxY=evt.nativeEvent.changedTouches[0].pageY;}else{minY=evt.nativeEvent.changedTouches[0].pageY;maxY=evt.nativeEvent.changedTouches[1].pageY;}var widthDistance=maxX-minX;var heightDistance=maxY-minY;var diagonalDistance=Math.sqrt(widthDistance*widthDistance+heightDistance*heightDistance);_this.zoomCurrentDistance=Number(diagonalDistance.toFixed(1));if(_this.zoomLastDistance!==null){var distanceDiff=(_this.zoomCurrentDistance-_this.zoomLastDistance)/200;var zoom=_this.scale+distanceDiff;if(zoom<0.6){zoom=0.6;}if(zoom>10){zoom=10;}_this.scale=zoom;_this.animatedScale.setValue(_this.scale);_this.positionX-=_this.centerDiffX/_this.scale;_this.positionY-=_this.centerDiffY/_this.scale;_this.animatedPositionX.setValue(_this.positionX);_this.animatedPositionY.setValue(_this.positionY);}_this.zoomLastDistance=_this.zoomCurrentDistance;}}_this.imageDidMove("onPanResponderMove");},onPanResponderRelease:function onPanResponderRelease(evt,gestureState){if(_this.longPressTimeout){clearTimeout(_this.longPressTimeout);}if(_this.isDoubleClick){return;}if(_this.isLongPress){return;}var moveDistance=Math.sqrt(gestureState.dx*gestureState.dx+gestureState.dy*gestureState.dy);if(evt.nativeEvent.changedTouches.length===1&&moveDistance<(_this.props.clickDistance||0)){_this.singleClickTimeout=setTimeout(function(){if(_this.props.onClick){_this.props.onClick();}},_this.props.doubleClickInterval);}else{if(_this.props.responderRelease){_this.props.responderRelease(gestureState.vx,_this.scale);}_this.panResponderReleaseResolve();}},onPanResponderTerminate:function onPanResponderTerminate(){}});return _this;}_createClass(ZoomView,[{key:"componentDidMount",value:function componentDidMount()

{
this.props.centerOn&&this.centerOn(this.props.centerOn);
}},{key:"componentDidUpdate",value:function componentDidUpdate(

nextProps){

if(
nextProps.centerOn&&!this.props.centerOn||
nextProps.centerOn&&
this.props.centerOn&&
this.didCenterOnChange(this.props.centerOn,nextProps.centerOn))
{
this.centerOn(nextProps.centerOn);
}
}},{key:"didCenterOnChange",value:function didCenterOnChange(

params,paramsNext){
return(
params.x!==paramsNext.x||
params.y!==paramsNext.y||
params.scale!==paramsNext.scale);

}},{key:"centerOn",value:function centerOn(

params){var _this2=this;
this.positionX=params.x;
this.positionY=params.y;
this.scale=params.scale;
var duration=params.duration||300;
_reactNative.Animated.parallel([
_reactNative.Animated.timing(this.animatedScale,{
toValue:this.scale,
duration:duration}),

_reactNative.Animated.timing(this.animatedPositionX,{
toValue:this.positionX,
duration:duration}),

_reactNative.Animated.timing(this.animatedPositionY,{
toValue:this.positionY,
duration:duration})]).

start(function(){
_this2.imageDidMove("centerOn");
});
}},{key:"imageDidMove",value:function imageDidMove(

type){
this.props.onMove&&
this.props.onMove({
type:type,
positionX:this.positionX,
positionY:this.positionY,
scale:this.scale,
zoomCurrentDistance:this.zoomCurrentDistance});

}},{key:"handleLayout",value:function handleLayout(


event){
this.props.layoutChange&&this.props.layoutChange(event);
}},{key:"reset",value:function reset()


{
this.scale=1;
this.animatedScale.setValue(this.scale);
this.positionX=0;
this.animatedPositionX.setValue(this.positionX);
this.positionY=0;
this.animatedPositionY.setValue(this.positionY);
}},{key:"render",value:function render()

{
var animateConf={
transform:[
{
scale:this.animatedScale},

{
translateX:this.animatedPositionX},

{
translateY:this.animatedPositionY}]};




return(
_react2.default.createElement(_reactNative.View,_extends({
style:_extends({},
styles.container,
this.props.style,{
width:this.props.cropWidth,
height:this.props.cropHeight})},

this.imagePanResponder.panHandlers,{__source:{fileName:_jsxFileName,lineNumber:723}}),

_react2.default.createElement(_reactNative.Animated.View,{style:animateConf,__source:{fileName:_jsxFileName,lineNumber:732}},
_react2.default.createElement(_reactNative.View,{
onLayout:this.handleLayout.bind(this),
style:{
width:this.props.imageWidth,
height:this.props.imageHeight},__source:{fileName:_jsxFileName,lineNumber:733}},


this.props.children))));




}}]);return ZoomView;}(_react.Component);ZoomView.defaultProps={cropWidth:100,cropHeight:100,imageWidth:100,imageHeight:100,panToMove:true,pinchToZoom:true,clickDistance:10,maxOverflow:100,longPressTime:800,doubleClickInterval:175,style:{},swipeDownThreshold:230,enableSwipeDown:false,onClick:function onClick(){},onDoubleClick:function onDoubleClick(){},onLongPress:function onLongPress(){},horizontalOuterRangeOffset:function horizontalOuterRangeOffset(){},onDragLeft:function onDragLeft(){},responderRelease:function responderRelease(){},onMove:function onMove(){},layoutChange:function layoutChange(){},onSwipeDown:function onSwipeDown(){}};exports.


ZoomView=ZoomView;