# Log4fns
![asd](https://img.shields.io/npm/v/log4fns)
![](https://img.shields.io/bundlephobia/min/log4fns)
![](https://img.shields.io/npm/l/log4fns)

Log4fns is a lightweight, high-performance JavaScript utility that simplifies bug tracking during software development by logging the function name and location from where it is called. supports both ESM and CommonJS.
With Log4fns, developers can easily identify the source of bugs, improve the debugging process, and increase software quality..

![screen shot](https://i.imgur.com/1M09M3d.png)


## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com).

```
npm install log4fns
```

## Usage

### Import
```javascript
// ESM
import Log from "log4fns"
// CommonJS
const Log = require("log4fns").default
```

### Optional
```javascript
// If you are using a remote enviornment and want to get the correct local time
// or you want to change the default timezone
Log.setTimeZone("Your time zone")

// If you need to ouput the function name and path in Production
Log.setShowDetailInProduction(true)
```

### Example
```javascript
/** index.js */
import Log from "log4fns"
function test(){
    Log("hello world")
}
test()
```
output
```
12/3/2022, 2:34:37 AM | index.js:3 | test | hello world
```
