# BranchFormat
> 提供便捷默认值的快速分支切出工具


### 使用

先安装
```shell
# 使用 Yarn
yarn add @nibfe/branchformat --dev
# 使用 NPM
npm install @nibfe/branchformat -D
```

进行初始化设置
```shell
yarn bfinit
npx bfinit
```

添加完成后使用 `yarn checkout` 或者 `npm checkout` 即可


### 高级配置
> 默认会读取 `package.json` 或者 `branchformat.config.js` 中的配置信息