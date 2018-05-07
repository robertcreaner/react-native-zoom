/* eslint react/prop-types: 0 */

import React, { Component } from 'react';
import { Animated, PanResponder, View } from 'react-native';

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent'
  }
};

class ZoomView extends Component {
  static defaultProps = {
    // width of working area
    cropWidth: 100,

    // height of working area
    cropHeight: 100,

    // width of Image
    imageWidth: 100,

    // Height of Image
    imageHeight: 100,

    // moving by one finger
    panToMove: true,

    // zooming by few fingers
    pinchToZoom: true,

    // max distance for offset
    clickDistance: 10,

    // максимлаьный порог скольжения
    maxOverflow: 100,

    // Long press threshold (milliseconds)
    longPressTime: 800,

    // Double-click timer maximum interval
    doubleClickInterval: 175,
    style: {},
    swipeDownThreshold: 230,
    enableSwipeDown: false,
    onClick: () => {
      //
    },
    onDoubleClick: () => {
      //
    },
    onLongPress: () => {
      //
    },
    horizontalOuterRangeOffset: () => {
      //
    },
    onDragLeft: () => {
      //
    },
    // Let go but didn’t cancel the callback
    responderRelease: () => {
      //
    },
    // If provided, this will be called everytime the map is moved
    onMove: () => {
      //
    },
    // If provided, this method will be called when the onLayout event fires
    layoutChange: () => {
      //
    },
    // function that fires when user swipes down
    onSwipeDown: () => {
      //
    }
  };

  state = {
    centerX: 0.5,
    centerY: 0.5
  };

  constructor(props) {
    super(props);
    this.lastPositionX = null;
    this.positionX = 0;
    this.animatedPositionX = new Animated.Value(0);

    this.lastPositionY = null;
    this.positionY = 0;
    this.animatedPositionY = new Animated.Value(0);

    // scale/zooming
    this.scale = 1;
    this.animatedScale = new Animated.Value(1);
    this.zoomLastDistance = null;
    this.zoomCurrentDistance = 0;

    this.lastTouchStartTime = 0;
    this.horizontalWholeOuterCounter = 0;

    this.swipeDownOffset = 0;

    this.horizontalWholeCounter = 0;
    this.verticalWholeCounter = 0;

    this.centerDiffX = 0;
    this.centerDiffY = 0;

    this.singleClickTimeout;

    this.longPressTimeout;

    this.lastClickTime = 0;

    this.doubleClickX = 0;
    this.doubleClickY = 0;

    this.isDoubleClick = false;

    this.isLongPress = false;

    this.isHorizontalWrap = false;

    this.imagePanResponder = PanResponder.create({
      // Request to be a responder：
      // don't respond to single touch to avoid shielding click on child components
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,

      // The View is now responding for touch events.
      // This is the time to highlight and show the user what is happening
      onPanResponderGrant: evt => {
        // Start gesture operation
        this.lastPositionX = null;
        this.lastPositionY = null;
        this.zoomLastDistance = null;
        this.horizontalWholeCounter = 0;
        this.verticalWholeCounter = 0;
        this.lastTouchStartTime = new Date().getTime();
        this.isDoubleClick = false;
        this.isLongPress = false;
        this.isHorizontalWrap = false;

        // When any gesture starts, clear the click timer
        this.singleClickTimeout && clearTimeout(this.singleClickTimeout);

        // changedTouches - Array of all touch events that have changed since the last event
        if (evt.nativeEvent.changedTouches.length > 1) {
          const centerX =
            (evt.nativeEvent.changedTouches[0].pageX +
              evt.nativeEvent.changedTouches[1].pageX) /
            2;
          this.centerDiffX = centerX - this.props.cropWidth / 2;

          const centerY =
            (evt.nativeEvent.changedTouches[0].pageY +
              evt.nativeEvent.changedTouches[1].pageY) /
            2;
          this.centerDiffY = centerY - this.props.cropHeight / 2;
        }

        // Calculate long press
        this.longPressTimeout && clearTimeout(this.longPressTimeout);

        this.longPressTimeout = setTimeout(() => {
          this.isLongPress = true;
          this.props.onLongPress && this.props.onLongPress();
        }, this.props.longPressTime);

        if (evt.nativeEvent.changedTouches.length <= 1) {
          // A finger condition
          if (
            new Date().getTime() - this.lastClickTime <
            (this.props.doubleClickInterval || 0)
          ) {
            // thinking that triggered a double click
            this.lastClickTime = 0;
            if (this.props.onDoubleClick) {
              this.props.onDoubleClick();
            }

            // Cancel long press
            clearTimeout(this.longPressTimeout);

            // Because the zoom may be triggered, record the coordinate position when double-clicking
            this.doubleClickX = evt.nativeEvent.changedTouches[0].pageX;
            this.doubleClickY = evt.nativeEvent.changedTouches[0].pageY;

            // Scale
            this.isDoubleClick = true;
            if (this.scale > 1 || this.scale < 1) {
              // Return to the original position
              this.scale = 1;

              this.positionX = 0;
              this.positionY = 0;
            } else {
              // Start scaling at the displacement location
              // Scale before recording
              // At this time this.scale must be 1
              const beforeScale = this.scale;

              // start zoom
              this.scale = 2;

              // zoom diff
              const diffScale = this.scale - beforeScale;
              // Find the displacement of the center point of both hands from the center of the page
              // move Place
              this.positionX =
                (this.props.cropWidth / 2 - this.doubleClickX) *
                diffScale /
                this.scale;

              this.positionY =
                (this.props.cropHeight / 2 - this.doubleClickY) *
                diffScale /
                this.scale;
            }

            this.imageDidMove('centerOn');

            Animated.parallel([
              Animated.timing(this.animatedScale, {
                toValue: this.scale,
                duration: 100
              }),
              Animated.timing(this.animatedPositionX, {
                toValue: this.positionX,
                duration: 100
              }),
              Animated.timing(this.animatedPositionY, {
                toValue: this.positionY,
                duration: 100
              })
            ]).start();
          } else {
            this.lastClickTime = new Date().getTime();
          }
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (this.isDoubleClick) {
          // Sometimes the double click will be treated as a displacement.
          return;
        }

        if (evt.nativeEvent.changedTouches.length <= 1) {
          // x displacement
          let diffX = gestureState.dx - (this.lastPositionX || 0);
          if (this.lastPositionX === null) {
            diffX = 0;
          }
          // y displacement
          let diffY = gestureState.dy - (this.lastPositionY || 0);
          if (this.lastPositionY === null) {
            diffY = 0;
          }

          // Keep this displacement as the next displacement
          this.lastPositionX = gestureState.dx;
          this.lastPositionY = gestureState.dy;

          this.horizontalWholeCounter += diffX;
          this.verticalWholeCounter += diffY;

          if (
            Math.abs(this.horizontalWholeCounter) > 5 ||
            Math.abs(this.verticalWholeCounter) > 5
          ) {
            // If the displacement exceeds the finger range, cancel the long press monitor
            clearTimeout(this.longPressTimeout);
          }

          // allow to move picture with one finger
          if (this.props.panToMove) {
            // handle left and right slides, if swipeDown, slide left and right
            if (this.swipeDownOffset === 0) {
              if (diffX !== 0) {
                this.isHorizontalWrap = true;
              }

              // diffX > 0 means the hand slides to the right and the chart moves to the left, and on the contrary
              // horizontalWholeOuterCounter > 0 means overflow on the left, otherwise on the right,
              // the greater the absolute value, the more overflow
              if (this.props.imageWidth * this.scale > this.props.cropWidth) {
                // If the picture width is larger than the box width, it can be dragged horizontally
                // There is no overflow offset or the offset is completely retracted by this offset
                if (this.horizontalWholeOuterCounter > 0) {
                  // overflow to the right
                  if (diffX < 0) {
                    // tighten from the right
                    if (this.horizontalWholeOuterCounter > Math.abs(diffX)) {
                      // The offset has not been used yet
                      this.horizontalWholeOuterCounter += diffX;
                      diffX = 0;
                    } else {
                      // The overflow is set to 0, the offset minus the remaining overflow, and can be dragged
                      diffX += this.horizontalWholeOuterCounter;
                      this.horizontalWholeOuterCounter = 0;
                      if (this.props.horizontalOuterRangeOffset) {
                        this.props.horizontalOuterRangeOffset(0);
                      }
                    }
                  } else {
                    // Amplify to the right
                    this.horizontalWholeOuterCounter += diffX;
                  }
                } else if (this.horizontalWholeOuterCounter < 0) {
                  // overflow to the left
                  if (diffX > 0) {
                    // tighten from the left
                    if (Math.abs(this.horizontalWholeOuterCounter) > diffX) {
                      // The offset has not been used yet
                      this.horizontalWholeOuterCounter += diffX;
                      diffX = 0;
                    } else {
                      // The overflow is set to 0, the offset minus the remaining overflow, and can be dragged
                      diffX += this.horizontalWholeOuterCounter;
                      this.horizontalWholeOuterCounter = 0;
                      if (this.props.horizontalOuterRangeOffset) {
                        this.props.horizontalOuterRangeOffset(0);
                      }
                    }
                  } else {
                    // Amplify to the left
                    this.horizontalWholeOuterCounter += diffX;
                  }
                } else {
                  // overflow offset is 0, normal movement
                }

                // generate displacement
                this.positionX += diffX / this.scale;
                // The absolute value of horizontal tolerance
                // But there can't be black edges in the landscape
                const horizontalMax =
                  (this.props.imageWidth * this.scale - this.props.cropWidth) /
                  2 /
                  this.scale;
                if (this.positionX < -horizontalMax) {
                  // Exceeds the left critical point and continues to move left
                  this.positionX = -horizontalMax;

                  // let it have a slight displacement, off track
                  this.horizontalWholeOuterCounter += -1 / 1e10;
                } else if (this.positionX > horizontalMax) {
                  // beyond the critical point on the right, still moving right
                  this.positionX = horizontalMax;

                  // let it have a slight displacement, off track
                  this.horizontalWholeOuterCounter += 1 / 1e10;
                }
                this.animatedPositionX.setValue(this.positionX);
              } else {
                // Can't drag horizontally, all count as overflow offset
                this.horizontalWholeOuterCounter += diffX;
              }

              // The overflow will not exceed the set limit
              if (
                this.horizontalWholeOuterCounter > (this.props.maxOverflow || 0)
              ) {
                this.horizontalWholeOuterCounter = this.props.maxOverflow || 0;
              } else if (
                this.horizontalWholeOuterCounter <
                -(this.props.maxOverflow || 0)
              ) {
                this.horizontalWholeOuterCounter = -(
                  this.props.maxOverflow || 0
                );
              }

              if (this.horizontalWholeOuterCounter !== 0) {
                // If the overflow offset is not 0, execute an overflow callback
                if (this.props.horizontalOuterRangeOffset) {
                  this.props.horizontalOuterRangeOffset(
                    this.horizontalWholeOuterCounter
                  );
                }
              }
            }

            // If the picture height is greater than the height of the box, it can be vertically stretched
            if (this.props.imageHeight * this.scale > this.props.cropHeight) {
              this.positionY += diffY / this.scale;
              this.animatedPositionY.setValue(this.positionY);
            } else {
              // swipeDown does not allow triggering when there is already a horizontal offset
              if (this.props.enableSwipeDown && !this.isHorizontalWrap) {
                // The picture height is less than the height of the box and can only be dragged down, and it must be a swipeDown action
                this.swipeDownOffset += diffY;

                // As long as the sliding overflow is not less than 0, you can drag
                if (this.swipeDownOffset > 0) {
                  this.positionY += diffY / this.scale;
                  this.animatedPositionY.setValue(this.positionY);

                  // The lower the zoom, the smaller the zoom
                  this.scale = this.scale - diffY / 1000;
                  this.animatedScale.setValue(this.scale);
                }
              }
            }
          }
        } else {
          // The condition of multiple fingers
          // Cancel long press
          if (this.longPressTimeout) {
            clearTimeout(this.longPressTimeout);
          }

          if (this.props.pinchToZoom) {
            // find the smallest x and the largest x
            let minX;
            let maxX;
            if (
              evt.nativeEvent.changedTouches[0].locationX >
              evt.nativeEvent.changedTouches[1].locationX
            ) {
              minX = evt.nativeEvent.changedTouches[1].pageX;
              maxX = evt.nativeEvent.changedTouches[0].pageX;
            } else {
              minX = evt.nativeEvent.changedTouches[0].pageX;
              maxX = evt.nativeEvent.changedTouches[1].pageX;
            }

            let minY;
            let maxY;
            if (
              evt.nativeEvent.changedTouches[0].locationY >
              evt.nativeEvent.changedTouches[1].locationY
            ) {
              minY = evt.nativeEvent.changedTouches[1].pageY;
              maxY = evt.nativeEvent.changedTouches[0].pageY;
            } else {
              minY = evt.nativeEvent.changedTouches[0].pageY;
              maxY = evt.nativeEvent.changedTouches[1].pageY;
            }

            const widthDistance = maxX - minX;
            const heightDistance = maxY - minY;
            const diagonalDistance = Math.sqrt(
              widthDistance * widthDistance + heightDistance * heightDistance
            );
            this.zoomCurrentDistance = Number(diagonalDistance.toFixed(1));

            if (this.zoomLastDistance !== null) {
              const distanceDiff =
                (this.zoomCurrentDistance - this.zoomLastDistance) / 200;
              let zoom = this.scale + distanceDiff;

              if (zoom < 0.6) {
                zoom = 0.6;
              }
              if (zoom > 10) {
                zoom = 10;
              }

              // Scale before recording
              // const beforeScale = this.scale;

              // Start zooming
              this.scale = zoom;
              this.animatedScale.setValue(this.scale);

              // The picture moves slowly to the center of the two fingers
              // zoom diff
              // const diffScale = this.scale - beforeScale;
              // find the displacement of the center point of both hands from the center of the page
              // move Place
              // this.positionX -= this.centerDiffX * diffScale / this.scale;
              // this.positionY -= this.centerDiffY * diffScale / this.scale;

              this.positionX -= this.centerDiffX / this.scale;
              this.positionY -= this.centerDiffY / this.scale;
              this.animatedPositionX.setValue(this.positionX);
              this.animatedPositionY.setValue(this.positionY);
            }
            this.zoomLastDistance = this.zoomCurrentDistance;
          }
        }

        this.imageDidMove('onPanResponderMove');
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Cancel long press
        if (this.longPressTimeout) {
          clearTimeout(this.longPressTimeout);
        }

        // double-click to end the judgment
        if (this.isDoubleClick) {
          return;
        }

        // Press and hold to end and end the judgment
        if (this.isLongPress) {
          return;
        }

        // If it is a single finger, the distance is greater than
        // the preset second, the sliding distance is less than the preset value,
        // it may be a click (if there is no start gesture in the subsequent double click interval)
        // const stayTime = new Date().getTime() - this.lastTouchStartTime!
        const moveDistance = Math.sqrt(
          gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy
        );
        if (
          evt.nativeEvent.changedTouches.length === 1 &&
          moveDistance < (this.props.clickDistance || 0)
        ) {
          this.singleClickTimeout = setTimeout(() => {
            if (this.props.onClick) {
              this.props.onClick();
            }
          }, this.props.doubleClickInterval);
        } else {
          // Multi-gesture ends, or slide ends
          if (this.props.responderRelease) {
            this.props.responderRelease(gestureState.vx, this.scale);
          }

          this.panResponderReleaseResolve();
        }
      },
      onPanResponderTerminate: () => {
        //
      }
    });
  }

  resetScale = () => {
    this.positionX = 0;
    this.positionY = 0;
    this.scale = 1;
    this.animatedScale.setValue(1);
  };

  panResponderReleaseResolve = () => {
    // To determine if it is swipeDown
    if (this.props.enableSwipeDown && this.props.swipeDownThreshold) {
      if (this.swipeDownOffset > this.props.swipeDownThreshold) {
        if (this.props.onSwipeDown) {
          this.props.onSwipeDown();
        }
        // Stop reset.
        return;
      }
    }

    if (this.scale < 1) {
      // If the zoom is less than 1, forced reset to 1
      this.scale = 1;
      Animated.timing(this.animatedScale, {
        toValue: this.scale,
        duration: 100
      }).start();
    }

    if (this.props.imageWidth * this.scale <= this.props.cropWidth) {
      // If the picture width is less than the box width,
      // the landscape position is reset
      this.positionX = 0;
      Animated.timing(this.animatedPositionX, {
        toValue: this.positionX,
        duration: 100
      }).start();
    }

    if (this.props.imageHeight * this.scale <= this.props.cropHeight) {
      // If the picture height is less than the height of the box, the vertical position is reset
      this.positionY = 0;
      Animated.timing(this.animatedPositionY, {
        toValue: this.positionY,
        duration: 100
      }).start();
    }

    // The horizontal will certainly not exceed the range, controlled by drag and drop
    // If the picture height is greater than the height of the box, black bars cannot appear vertically
    if (this.props.imageHeight * this.scale > this.props.cropHeight) {
      // The absolute value of longitudinal tolerance
      const verticalMax =
        (this.props.imageHeight * this.scale - this.props.cropHeight) /
        2 /
        this.scale;
      if (this.positionY < -verticalMax) {
        this.positionY = -verticalMax;
      } else if (this.positionY > verticalMax) {
        this.positionY = verticalMax;
      }
      Animated.timing(this.animatedPositionY, {
        toValue: this.positionY,
        duration: 100
      }).start();
    }

    // After drag and drop, if there is no zoom, go back to 0,0
    if (this.scale === 1) {
      this.positionX = 0;
      this.positionY = 0;
      Animated.timing(this.animatedPositionX, {
        toValue: this.positionX,
        duration: 100
      }).start();
      Animated.timing(this.animatedPositionY, {
        toValue: this.positionY,
        duration: 100
      }).start();
    }

    // The horizontal overflow is empty
    this.horizontalWholeOuterCounter = 0;

    // swipeDown overflow is blank
    this.swipeDownOffset = 0;

    this.imageDidMove('onPanResponderRelease');
  };

  componentDidMount() {
    this.props.centerOn && this.centerOn(this.props.centerOn);
  }

  componentDidUpdate(nextProps) {
    // Either centerOn has never been called, or it is a repeat and we should ignore it
    if (
      (nextProps.centerOn && !this.props.centerOn) ||
      (nextProps.centerOn &&
        this.props.centerOn &&
        this.didCenterOnChange(this.props.centerOn, nextProps.centerOn))
    ) {
      this.centerOn(nextProps.centerOn);
    }
  }

  didCenterOnChange(params, paramsNext) {
    return (
      params.x !== paramsNext.x ||
      params.y !== paramsNext.y ||
      params.scale !== paramsNext.scale
    );
  }

  centerOn(params) {
    this.positionX = params.x;
    this.positionY = params.y;
    this.scale = params.scale;
    const duration = params.duration || 300;
    Animated.parallel([
      Animated.timing(this.animatedScale, {
        toValue: this.scale,
        duration
      }),
      Animated.timing(this.animatedPositionX, {
        toValue: this.positionX,
        duration
      }),
      Animated.timing(this.animatedPositionY, {
        toValue: this.positionY,
        duration
      })
    ]).start(() => {
      this.imageDidMove('centerOn');
    });
  }

  imageDidMove(type) {
    this.props.onMove &&
      this.props.onMove({
        type,
        positionX: this.positionX,
        positionY: this.positionY,
        scale: this.scale,
        zoomCurrentDistance: this.zoomCurrentDistance
      });
  }

  // Picture area view is rendered
  handleLayout(event) {
    this.props.layoutChange && this.props.layoutChange(event);
  }

  // Reset size and position
  reset() {
    this.scale = 1;
    this.animatedScale.setValue(this.scale);
    this.positionX = 0;
    this.animatedPositionX.setValue(this.positionX);
    this.positionY = 0;
    this.animatedPositionY.setValue(this.positionY);
  }

  render() {
    const animateConf = {
      transform: [
        {
          scale: this.animatedScale
        },
        {
          translateX: this.animatedPositionX
        },
        {
          translateY: this.animatedPositionY
        }
      ]
    };

    return (
      <View
        style={{
          ...styles.container,
          ...this.props.style,
          width: this.props.cropWidth,
          height: this.props.cropHeight
        }}
        {...this.imagePanResponder.panHandlers}
      >
        <Animated.View style={animateConf}>
          <View
            onLayout={this.handleLayout.bind(this)}
            style={{
              width: this.props.imageWidth,
              height: this.props.imageHeight
            }}
          >
            {this.props.children}
          </View>
        </Animated.View>
      </View>
    );
  }
}

export { ZoomView };
