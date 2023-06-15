# Log4fns
![asd](https://img.shields.io/npm/v/log4fns)
![](https://img.shields.io/bundlephobia/min/log4fns)
![](https://img.shields.io/npm/l/log4fns)

Log4fns is a lightweight, high-performance, flexible JavaScript utility that doesn't require third party dependency. It simplifies bug tracking during software development by logging the function name and location from where it is called. supports both ESM and CommonJS.

With Log4fns, developers can easily identify the source of bugs, improve the debugging process, and increase software quality..

![screen shot](https://i.imgur.com/wo007V1.png)


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


// If you need to ouput the absolute file path
Log.setVerbose(true)


// If you need to reuse the output, such as log into a file
const writer = fs.createWriteStream(`${__dirname}/${new Date().toJSON()}.log`, {
    flags: 'w'
});
const logCallback = content => {
    writer.write(content + '\n');
};
Log.use(logCallback)
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


### Example2
```javascript
/** index.ts */
import Log from "log4fns"
(()=>Log.tag("Shoppers)("running"))()
```
output

![screen shot](https://i.imgur.com/tKooOf0.png)
