const os = Deno.build.os;
const eol = os === "windows" ? "\r\n" : "\n";
/**
 * OS specific end of line character
 */
export default eol;
