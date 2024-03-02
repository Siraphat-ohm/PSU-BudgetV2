export const isDevEnvironment = ():boolean => {
    return process.env["MODE"]  === "dev";
}