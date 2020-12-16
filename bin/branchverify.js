#! /usr/bin/env node
const { isCurrentBranchValid } = require('../dist/index.common')
isCurrentBranchValid(process.cwd()).then(result => {
    if (!result) {
        console.log('Your current branch is invalid.Use \`yarn checkout\` instead!')
        process.exit(1)
    }
})
