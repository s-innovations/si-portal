export function isDefined(obj: any) {
    return !(typeof obj === "undefined" || obj === null);
}
export default isDefined;