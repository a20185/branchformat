#! /usr/bin/env node
var fs = require('fs')
var path = require('path')
var userDir = process.cwd()
var defaultConfig = fs.readFileSync(path.join(__dirname, '..','branchformat.config.js'), { encoding: 'utf8' })
var formatConfigPath = path.join(userDir, 'branchformat.config.js')

if (fs.existsSync(formatConfigPath)) {
    console.log('`branchformat.config.js` existed, skip eject procedure')
    console.log('🍻All done!')
    process.exit(0)
}

fs.writeFileSync(formatConfigPath, defaultConfig, { encoding: 'utf8' })
console.log('Default config has been successfully ejected to `branchformat.config.js` ')
console.log('🍻All done!')
process.exit(0)