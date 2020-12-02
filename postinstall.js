var fs = require('fs')
var path = require('path')
var userDir = process.cwd()
var checkoutFile = path.join(userDir, 'bin', 'checkout')
var targetPackageJson = path.join(userDir, 'package.json')
/** 有则不写 */
if (!fs.existsSync(checkoutFile)) {
    var template = fs.readFileSync('./src/templates/branch')
    fs.writeFileSync(checkoutFile, template, { encoding: 'utf8' })
    console.log('分支切出脚本已添加到 bin/checkout...')
}

var pkgFile = require(targetPackageJson)
if (pkgFile.scripts && pkgFile.scripts.checkout) {
    console.log('当前已存在 checkout npm 命令，暂不做处理...')
} else {
    if (!pkgFile.scripts) pkgFile.scripts = {}
    if (!pkgFile.scripts.checkout) {
        pkgFile.scripts.checkout = 'node bin/checkout'
    }
    fs.writeFileSync(targetPackageJson, JSON.stringify(pkgFile, null, 2), { encoding: "utf8" })
    console.log('已添加 checkout npm 命令，使用 yarn checkout / npm checkout 即可体验...')
}

console.log('全部完成')
