# BranchFormat
> ⚙ A simple util to help quick checkout or switch branches that correspond to team regulations

Branchformat is a simple util for rapid checkout and switch among branches.It aims to saving lives of checkouts and branch creations by using all-known presumptions of current environment as  defaultValues (By dynamically parse your current branch, your runtimeEnvs, and so on).


### Demo

Checking out from a skipped branch (e.g. `master`):
![img1](./assets/checkout.gif)


Checking out from a previous branch which originally checkouted by BranchFormat
![img2](./assets/checkexisted.gif)


### Usage

Install
```shell
# Using Yarn
yarn add branchformat --dev
# Using NPM
npm install branchformat -D
```

Initialization
```shell
yarn bfinit
npx bfinit
```


Usage

- Use `yarn run checkout` or `npm run checkout` for your git checkouts
- Use `yarn run brverify` or `npm run brverify` for your git branch verifications


### Advanced Configurations

You can create a `branchformat.config.js` file or define `branchformat` configuration block in the package.json file in project root. Branchformat will take them into account.
> Note: If you want to eject a default configuration, run **yarn bfeject / npm run bfeject** in your project folder. It will eject a default `branchformat.config.js` into your current project's root folder

A sample configuration file's structure may look as below:
```javascript
module.exports = {
  	/** Branch options (ordered) */
    config: [
        {
          	/** PropName, required */
            name: 'type',
          	/** Type of the inquirer, required */
            type: 'list',
          	/** The branch option is optional?（Which means can skip orderly），defaultly false */
            optional: false,
          	/** Static defaultValue，defaultly empty string [Lowest priority] */
            default: 'feature',
          	/** Dynamic defaultValue, defaultly empty string [highest priority] */
            envDefault: '',
          	/** Inquirer hint message，defaultly Input ${name} */
            message: 'Select branch type',
            /** The common prefix used for specify, defaultly empty string */
            prefix: '',
          	/** Optionlist, required for 'list' type */
            options: ['feature', 'bugfix', 'hotfix'],
            /** regular expressions used for parsing current option */
            regExp: '(feature|bugfix|hotfix)'
        }
    ],
    /**
     * The branch regexes used for skipping
     * Note that skip options will skip parameter parsing and fill in defaultValues and branch Verification pricess
     * Set it with care~
     **/
    skip: [
        'master',
        'staging',
        'test'
    ]
}
```