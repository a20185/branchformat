#! /usr/bin/env node
var fs = require('fs')
var path = require('path')
var userDir = process.cwd()
var binDirectory = path.join(userDir, 'bin')
var checkoutFile = path.join(binDirectory, 'checkout')
var verifyFile = path.join(binDirectory, 'branchverify')
var targetPackageJson = path.join(userDir, 'package.json')

var checkoutTemplate = `const { performFormat } = require('@nibfe/branchformat')
performFormat(process.cwd())
`

var verifyTemplate = `const { isCurrentBranchValid } = require('@nibfe/branchformat')
isCurrentBranchValid(process.cwd()).then(result => {
    if (!result) {
        console.log('分支不合法，请使用 \`yarn checkout\` 切出分支!')
        process.exit(1)
    }
})
`

/** 有则不写 */
if (!fs.existsSync(checkoutFile)) {
    if (!fs.existsSync(binDirectory)) {
        fs.mkdirSync(binDirectory)
    }
    fs.writeFileSync(checkoutFile, checkoutTemplate, { encoding: 'utf8' })
    console.log('分支切出脚本已添加到 bin/checkout...')
}

if (!fs.existsSync(verifyFile)) {
    if (!fs.existsSync(binDirectory)) {
        fs.mkdirSync(binDirectory)
    }
    fs.writeFileSync(verifyFile, verifyTemplate, { encoding: 'utf8' })
    console.log('分支检测脚本已添加到 bin/branchverify...')
}


var pkgFile = require(targetPackageJson)
if (pkgFile.scripts && pkgFile.scripts.checkout) {
    console.log('当前已存在 checkout npm 命令，暂不做处理...')
} else {
    if (!pkgFile.scripts) pkgFile.scripts = {}
    if (!pkgFile.scripts.checkout) {
        pkgFile.scripts.checkout = 'node bin/checkout'
    }
    console.log('已添加 checkout npm 命令，使用 yarn checkout / npm checkout 即可体验...')
}
if (pkgFile.scripts && pkgFile.scripts.brverify) {
    console.log('当前已存在 brverify npm 命令，暂不做处理...')
} else {
    if (!pkgFile.scripts) pkgFile.scripts = {}
    if (!pkgFile.scripts.brverify) {
        pkgFile.scripts.brverify = 'node bin/branchverify'
    }
    console.log('已添加 brverify npm 命令，使用 yarn brverify / npm brverify 即可体验...')
}
fs.writeFileSync(targetPackageJson, JSON.stringify(pkgFile, null, 2), { encoding: "utf8" })
console.log('全部完成')
