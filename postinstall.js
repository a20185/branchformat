#! /usr/bin/env node
var fs = require('fs')
var path = require('path')
var userDir = process.cwd()
var binDirectory = path.join(userDir, 'bin')
var checkoutFile = path.join(binDirectory, 'checkout')
var switchFile = path.join(binDirectory, 'switch')
var verifyFile = path.join(binDirectory, 'branchverify')
var targetPackageJson = path.join(userDir, 'package.json')

var checkoutTemplate = `const { performFormat } = require('@nibfe/branchformat')
performFormat(process.cwd())
`

var switchTemplate = `const { switchBranch } = require('@nibfe/branchformat')
switchBranch()
`

var verifyTemplate = `const { isCurrentBranchValid } = require('@nibfe/branchformat')
isCurrentBranchValid(process.cwd()).then(result => {
    if (!result) {
        console.log('Your current branch is invalid.Use \`yarn checkout\` instead!')
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
    console.log('Branch checkout script has been successfully added to bin/checkout...')
}

if (!fs.existsSync(switchFile)) {
    if (!fs.existsSync(binDirectory)) {
        fs.mkdirSync(binDirectory)
    }
    fs.writeFileSync(switchFile, switchTemplate, { encoding: 'utf8' })
    console.log('Branch switch script has been successfully added to bin/switch...')
}

if (!fs.existsSync(verifyFile)) {
    if (!fs.existsSync(binDirectory)) {
        fs.mkdirSync(binDirectory)
    }
    fs.writeFileSync(verifyFile, verifyTemplate, { encoding: 'utf8' })
    console.log('Branch validate script has been successfully added to bin/branchverify...')
}


var pkgFile = require(targetPackageJson)
if (pkgFile.scripts && pkgFile.scripts.checkout) {
    console.log('Checkout is existed in npm scripts, not adding npm checkout script...')
} else {
    if (!pkgFile.scripts) pkgFile.scripts = {}
    if (!pkgFile.scripts.checkout) {
        pkgFile.scripts.checkout = 'node bin/checkout'
    }
    console.log('Added npm checkout script，try using yarn checkout / npm run checkout...')
}
if (pkgFile.scripts && pkgFile.scripts.switch) {
    console.log('Switch is existed in npm scripts， not adding npm switch script...')
} else {
    if (!pkgFile.scripts) pkgFile.scripts = {}
    if (!pkgFile.scripts.switch) {
        pkgFile.scripts.switch = 'node bin/switch'
    }
    console.log('Added npm switch script，try using yarn switch / npm run switch...')
}
if (pkgFile.scripts && pkgFile.scripts.brverify) {
    console.log('Brverify is existed in npm scripts, not adding npm brverify script...')
} else {
    if (!pkgFile.scripts) pkgFile.scripts = {}
    if (!pkgFile.scripts.brverify) {
        pkgFile.scripts.brverify = 'node bin/branchverify'
    }
    console.log('Added npm checkout script，try using yarn brverify / npm run brverify...')
}
fs.writeFileSync(targetPackageJson, JSON.stringify(pkgFile, null, 2), { encoding: "utf8" })
console.log('All done!')
