type LogType = {
    (...message: any[]): void;
    timeZone?: string | undefined;
    verbose?: boolean;
    setTimeZone: (timeZone: string) => void;
    setVerbose: (b: boolean) => void;
};

const getFns = (e: any) => {
    const locationRegex = Log.verbose ? /[\w\/]+\.[\w]+:[0-9]+/ : /[\w]+\.[\w]+:[0-9]+/;
    const location = locationRegex.exec(e.stack.split('\n')[2]) || 'Unknown';
    const functionRegex = /\ {1}(?!at)[\w\.<>]+\ /;
    const fnName = functionRegex.exec(e.stack.split('\n')[2]) || ' Anonymous ';
    return { location, fnName };
};

const genContent = (e: any, ...message: any[]): string => {
    const isNode = typeof window === 'undefined';
    const timeZone = Log.timeZone || isNode ? process.env.TIME_ZONE : undefined;
    const time = new Date().toLocaleString('en-US', { timeZone });
    message = message.map((msg) => (typeof msg === 'object' ? JSON.stringify(msg) : msg));
    if (isNode && process.env.NODE_ENV === 'production') return `${time} | ${message.join(' ')}`;
    const { location, fnName } = getFns(e);
    return `${time} | ${location} |${fnName}| ${message.join(', ')}`;
};

const Log: LogType = (...message: any[]) => {
    const content = genContent(new Error(), ...message);
    console.log(content);
};

Log.setTimeZone = (tz: string) => {
    Log.timeZone = tz;
};

Log.setVerbose = (b: boolean) => {
    Log.verbose = b;
};

export default Log;
