type LogType = {
    (...message: any[]): void;
    TIME_ZONE?: string | undefined;
    setTimeZone: (timeZone: string) => void;
};

const genContent = (e: any, timeZone: string | undefined, ...message: any[]): string => {
    const time = new Date().toLocaleString('en-US', { timeZone });
    message = message.map((msg) => (typeof msg === 'object' ? JSON.stringify(msg) : msg));
    if (process && process.env.NODE_ENV === 'production') return `${time} | ${message.join(' ')}`;
    const locationRegex = /[\w]+\.[\w]+:[0-9]+/;
    const location = locationRegex.exec(e.stack.split('\n')[2]);
    const functionRegex = /\ {1}(?!at)[\w\.]+\ /;
    const fnName = functionRegex.exec(e.stack.split('\n')[2]) || ' anonymous ';
    return `${time} | ${location} |${fnName}| ${message.join(', ')}`;
};

const Log: LogType = (...message: any[]) => {
    const e = new Error();
    let timeZone;
    if (process && process.env.TIME_ZONE) timeZone = process.env.TIME_ZONE;
    if (Log.TIME_ZONE) timeZone = Log.TIME_ZONE;
    const content = genContent(e, timeZone, ...message);
    console.log(content);
};

Log.setTimeZone = (tz: string) => {
    Log.TIME_ZONE = tz;
};

export default Log;
