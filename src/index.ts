import { updateNotice } from "./update";
const path = require('path')

updateNotice(path.join(__dirname, 'package.json'))