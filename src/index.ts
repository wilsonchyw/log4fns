interface LogType {
    (...message: any[]): void;
    timeZone?: string | undefined;
    /**
     * Show the full path instead of file name only
     */
    verbose?: boolean;
    showDetailInProduction?: boolean;
    setTimeZone: (timeZone: string) => void;
    setVerbose: (b: boolean) => void;
    setShowDetailInProduction: (b: boolean) => void;
}

const getFnDetail = (e: any) => {
    const stacks = e.stack.split('\n');
    const locationRegex = Log.verbose ? /[\w\/]+\.[\w]+:[0-9]+/ : /[\w]+\.[\w]+:[0-9]+/;
    const location = locationRegex.exec(stacks[2]) || 'Unknown';
    const functionRegex = /(?!at)(?<=\ {1})[\w\.<>]+(?=\ {1})/;

    let fnName = (functionRegex.exec(stacks[2]) || ['Anonymous'])[0];

    /**
     * Below part is for Typescript enviornment
     */

    // async function
    if (fnName === 'Anonymous' && /.ts:/.test(stacks[2])) {
        const re = new RegExp('__awaiter', 'g');
        const index = stacks.findIndex((stack: string) => re.test(stack));
        fnName = (functionRegex.exec(stacks[index + 1]) || ['Anonymous'])[0];
    }

    // async function in Class
    if (/<anonymous>/.test(fnName)) {
        const className = fnName.split('.')[0];
        const re = new RegExp(`${className}.\\w+`, 'g');
        const message = stacks.find((stack: string) => re.test(stack));
        fnName = (functionRegex.exec(message) || ['Anonymous'])[0];
    }
    return { location, fnName };
};

const genContent = (e: any, message: any[]): string => {
    const isNode = typeof window === 'undefined';
    const time = new Date().toLocaleString('en-US', { timeZone: Log.timeZone });
    const _message = message.map((msg) => (typeof msg === 'object' ? JSON.stringify(msg) : msg)).join(' ');
    if (isNode && process.env.NODE_ENV === 'production' && !Log.showDetailInProduction) return `${time} | ${_message}`;
    const { location, fnName } = getFnDetail(e);
    return `${time} | ${location} | \x1b[42m${fnName}\x1b[0m | ${_message}`;
};

const Log: LogType = (...message: any[]) => {
    const content = genContent(new Error(), message);
    console.log(content);
};

Log.setTimeZone = (tz: string) => {
    Object.defineProperty(Log, 'timeZone', {
        value: tz,
        writable: false,
    });
};

Log.setVerbose = (b: boolean) => {
    Object.defineProperty(Log, 'verbose', {
        value: b,
        writable: false,
    });
};

Log.setShowDetailInProduction = (b: boolean) => {
    Object.defineProperty(Log, 'showDetailInProduction', {
        value: b,
        writable: false,
    });
};

export default Log;
