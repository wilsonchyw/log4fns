import Log from "../src";
class TestClass{
    main(){
        Log("")
    }
}
describe("Testing Log function", () => {
    const log = console.log;
    beforeEach(() => {
        console.log = jest.fn();
    });

    afterEach(() => {
        console.log = log;
    });

    describe("In test enviornment ", () => {
        test('Should print out file name(test.ts), function name(anonymous) and message(arg1)', () => {
            Log("arg1");
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining("arg1"));
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining("test.ts"));
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Anonymous"));
        });

        test('SetTimeZone should change the Log\'s timezone setting',()=>{
            expect(Log.timeZone).toBe(undefined)
            Log.setTimeZone("America/Vancouver")
            expect(Log.timeZone).toBe("America/Vancouver")
        })
    });

    describe("In development enviornment ", () => {
        const oldEnv = process.env.NODE_ENV;
        beforeEach(() => {
            process.env.NODE_ENV = "development";
        });

        test('Should print out file name "test.js" and  function name "anonymous"', () => {
            Log("arg1","arg2");
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining("arg1"));
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining("test.ts"));
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Anonymous"));
        });

        test('Should print out function name Test.main',()=>{
            const testClass = new TestClass()
            testClass.main()
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining("TestClass.main"));
        })
    });

    describe("In production enviornment ", () => {
        beforeEach(() => {
            process.env.NODE_ENV = "production";
        });

        test('Should not print out the function name or file name', () => {
            Log("");
            expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining("test"));
            expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining("Anonymous"));
        });
    });

});
