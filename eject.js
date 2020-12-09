#! /usr/bin/env node
var fs = require('fs')
var path = require('path')
var userDir = process.cwd()
var defaultConfig = fs.readFileSync('./branchformat.config.js', { encoding: 'utf8' })
var formatConfigPath = path.join(userDir, 'branchformat.config.js')

if (fs.existsSync(formatConfigPath)) {
    console.log('当前项目已存在 `branchformat.config.js`, 跳过 eject 流程')
    console.log('🍻全部完成！')
    process.exit(0)
}

fs.writeFileSync(formatConfigPath, defaultConfig, { encoding: 'utf8' })
console.log('已输出默认配置至 `branchformat.config.js` ')
console.log('🍻全部完成！')
process.exit(0)