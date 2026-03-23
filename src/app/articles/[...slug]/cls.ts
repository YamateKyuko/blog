import { Articles } from "./class"

const dest = `${process.cwd()}/tmp`;
const articles = await Articles.get(dest);

export default articles;