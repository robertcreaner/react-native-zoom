<h3 align="center">
  React-zoom-view
</h3>

<p align="center">
  Cross Platform View with zooming for react-native
</p>

<p align="center">
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
</p>

<br />

## Get Started

### Installation

```bash
npm i react-native-zoom --save

or

yarn add react-native-zoom
```

### Usage

```js
import { ZoomView } from "react-native-zoom";

<ImageZoom
  cropWidth={Dimensions.get("window").width}
  cropHeight={Dimensions.get("window").height}
  imageWidth={200}
  imageHeight={200}
>
  <Image
    style={{ width: 200, height: 200 }}
    source={{
      uri:
        "http://v1.qzone.cc/avatar/201407/07/00/24/53b9782c444ca987.jpg!200x200.jpg"
    }}
  />
</ImageZoom>;
```
