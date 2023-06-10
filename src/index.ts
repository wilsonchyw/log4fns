/**
 * An interface for a logging function.
 * @function {(...message: any[]) => void} - A function that takes any number of arguments and logs them.
 * @property {string} [timeZone] - An optional string representing the time zone to use when logging timestamps.
 * @property {boolean} [verbose] - An optional boolean indicating whether to show the full path instead of just the file name when logging.
 * @property {boolean} [showDetailInProduction] - An optional boolean indicating whether to show detailed log messages in production.
 * @function {(timeZone: string) => void} setTimeZone - A function that takes a string representing a time zone and sets the `timeZone` property.
 * @function {(b: boolean) => void} setVerbose - A function that takes a boolean and sets the `verbose` property.
 * @function {(b: boolean) => void} setShowDetailInProduction - A function that takes a boolean and sets the `showDetailInProduction` property.
 */
interface LogType {
    (...message: any): void;
    timeZone?: string | undefined;
    verbose?: boolean;
    showDetailInProduction?: boolean;
    callback?: (content: string) => any;
    setTimeZone: (timeZone: string) => void;
    setVerbose: (b: boolean) => void;
    setShowDetailInProduction: (b: boolean) => void;
    use: (callback: (content: string) => any) => void;
    tag: (tag: string) => (...message: any) => void;
}

/**
 * Extracts the location and function name from a stack trace.
 * @param {any} e - An error object whose stack trace will be parsed.
 * @returns {Object} An object containing the location and function name.
 */
function getFnDetail(e: any): { location: string; fnName: string } {
    const stacks = e.stack.split('\n');
    const locationRegex = Log.verbose ? /[\w\/]+\.[\w]+:[0-9]+/ : /[\w]+\.[\w]+:[0-9]+/;
    const location = (locationRegex.exec(stacks[2]) || ['Unknown'])[0];
    const functionRegex = /(?!at)(?<=\ {1})[\w\.<>]+(?=\ {1})/;

    let fnName = (functionRegex.exec(stacks[2]) || ['Anonymous'])[0];

    // Typescript async function
    if (fnName === 'Anonymous' && /.ts:/.test(stacks[2])) {
        const re = new RegExp('__awaiter', 'g');
        const index = stacks.findIndex((stack: string) => re.test(stack));
        fnName = (functionRegex.exec(stacks[index + 1]) || ['Anonymous'])[0];
    }

    // Typescript async function in Class
    if (/<anonymous>/.test(fnName)) {
        const className = fnName.split('.')[0];
        const re = new RegExp(`${className}.\\w+`, 'g');
        const message = stacks.find((stack: string) => re.test(stack));
        fnName = (functionRegex.exec(message) || ['Anonymous'])[0];
    }
    return { location, fnName };
}

/**
 * Generates content for logging purposes.
 * @param {any} e - An error object or anything else.
 * @param {any[]} message - An array of messages to be logged.
 * @returns {string} The generated content.
 */
function genContent(e: any, message: any[]): string {
    const isNode = typeof window === 'undefined';
    const time = new Date().toLocaleString('en-US', { timeZone: Log.timeZone });
    const _message = message.map((msg) => (typeof msg === 'object' ? JSON.stringify(msg) : msg)).join(' ');
    if (isNode && process.env.NODE_ENV === 'production' && !Log.showDetailInProduction) return `${time} | ${_message}`;
    const { location, fnName } = getFnDetail(e);
    return `${time} | ${location} | \x1b[42m${fnName}\x1b[0m | ${_message}`;
}

/**
 * Logs the provided message(s).
 * @param {...any} message - The message(s) to be logged.
 * @returns {void}
 */
const Log: LogType = (...message: any): void => {
    const content = genContent(new Error(), message);
    console.log(content);
    if (Log.callback) Log.callback(content);
};

/**
 * Sets the time zone for the logs.
 * @param {string} tz - The time zone to be set.
 * @returns {void}
 */
Log.setTimeZone = (tz: string): void => {
    Object.defineProperty(Log, 'timeZone', {
        value: tz,
        writable: false,
    });
};

/**
 * Sets the verbosity of the logs.
 * @param {boolean} b - A boolean indicating whether the logs should be verbose or not.
 * @returns {void}
 */
Log.setVerbose = (b: boolean): void => {
    Object.defineProperty(Log, 'verbose', {
        value: b,
        writable: false,
    });
};

/**
 * Sets the visibility of details in production logs.
 * @param {boolean} b - A boolean indicating whether the details should be shown in production logs or not.
 * @returns {void}
 */
Log.setShowDetailInProduction = (b: boolean): void => {
    Object.defineProperty(Log, 'showDetailInProduction', {
        value: b,
        writable: false,
    });
};

Log.use = (callback: (content: string) => any): void => {
    Object.defineProperty(Log, 'callback', {
        value: callback,
        writable: false,
    });
};

Log.tag = (tag: string) => {
    return (...message: any) => {
        Log(`\x1b[43m${tag}\x1b[0m |`, ...message);
    };
};

export default Log;



