#! /usr/bin/env node
const { performFormat } = require('../dist/index.common.js')
performFormat(process.cwd())
