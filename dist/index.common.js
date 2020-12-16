'use strict';

require("core-js/modules/es.array.sort");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.replace");

require("core-js/modules/es.string.trim");

var _process$env$LANG;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, '__esModule', {
  value: true
});

const Shell = require('shelljs');

const defaultSkipbranch = ['master', 'staging'];

const getParsingPhases = config => {
  /** Final not use */
  return config.slice(0, -1);
};

const isBranchShouldParse = (branch, skipBranch = defaultSkipbranch) => {
  if (skipBranch.find(current => new RegExp(current).test(branch))) {
    return false;
  }

  return true;
};

const getCurrentBranch = () => {
  const branch = Shell.exec('git symbolic-ref --short -q HEAD', {
    silent: true
  });
  return branch.stdout.trim();
};
/** 获取当前分支名称 */


const parseExistedBranch = (currentBranch, config, skipBranchs = defaultSkipbranch) => {
  /** 使用正则匹配当前分支是否合法，以及具备什么信息 */
  const parsingPhases = getParsingPhases(config);
  /** 根据斜杠做切割 */

  const branchSlices = currentBranch.split('/');
  const restFeatures = [];
  let parsingIndex = 0;
  const parseResult = {};
  /** Setup initial value */

  config.forEach(option => {
    parseResult[option.name] = '';
  });

  if (!isBranchShouldParse(currentBranch, skipBranchs)) {
    return parseResult;
  }
  /** 从头到尾 parse */


  while (branchSlices.length && parsingIndex < parsingPhases.length) {
    const brResult = branchSlices.shift();
    let matchResult = null;
    let targetIndex = parsingIndex;
    /** 从前往后看看那个匹配上了 */

    for (let idx = parsingIndex; idx < parsingPhases.length; idx++) {
      targetIndex = idx;
      const parsingRegex = parsingPhases[targetIndex];
      const matcher = brResult.match(new RegExp(parsingRegex.regExp));
      /** 匹配上了，或者不允许跳过 */

      if (matcher || !parsingRegex.optional) {
        matchResult = matcher;
        break;
      }
    }

    if (matchResult && targetIndex < parsingPhases.length) {
      /** 匹配上了，记录，然后更新 */
      parseResult[parsingPhases[targetIndex].name] = matchResult[1];
      targetIndex += 1;
    } else {
      /** 说明到最后一个都匹配不上 */
      restFeatures.push(brResult);
    }

    parsingIndex = targetIndex;
  }

  parseResult.desc = restFeatures.concat(branchSlices).join('/');
  return parseResult;
};

const lang = (_process$env$LANG = process.env.LANG) !== null && _process$env$LANG !== void 0 && _process$env$LANG.startsWith('zh') ? 'zh' : 'en';
const ZH_DICT = {
  UPDATE_CLOG: '更新内容如下：',
  UPDATE_HINT: '__PKG_NAME__ 新版本 __L_T_VER__ 已经发布, 运行以下命令，立即更新到最新版吧 \n\nnpm i __PKG_NAME__ -D \nyarn add __PKG_NAME__ --dev',
  CONFIG_TTLE: '分支切出助手（任意输入项填入「no」将等同于不填写）',
  CONFIG_DEFH: '请输入 __ITM_NAME__ :',
  CONFIG_DESC: '请输入需求/修复的相关描述（建议小于 30 字）：',
  CONFIG_TYPE: '请选择分支类型（默认：feature）：',
  CONFIG_SWIM: '请输入使用的泳道名称（例如 1787-qkgku、ouyifeng-hhhhh 等）：',
  CONFIG_SUBP: '请输入子目录名称（例如 product-gx 等）：',
  CONFIG_BIZK: '请输入业务变量名称（例如 AgentOrder 等）：',
  CONFIG_REID: '请输入关联ID（例如 ones-xxx, km-xxx, tt-xxx）：',
  ANSWER_CONF: '确认吗（Y/n）?',
  ANSWER_LIST: '您当前填写的信息如下：',
  ANSWER_RMBR: '是否要删除原分支（Y/n）？',
  HINT_NODESC: '缺少分支类型和分支描述，请重新检查！',
  HINT_MUSTOP: '必填选项 __MUST_OP__ 未填写，请重新检查！',
  HINT_MUSTDS: '创建的分支不合法，已退出',
  HINT_PRECKO: '切出的目标分支为 __TGT_BR__',
  HINT_STSING: '正在保存当前分支状态...',
  HINT_CHKING: '正在切出新分支...',
  HINT_CHKEND: '分支切出完成, 开始设置 upstream 并做初始化推送...',
  HINT_UPSEND: '设置 upstream 完成...',
  HINT_RMBEND: '本地及远程的原始分支已移除...',
  HINT_ALLEND: '🍻全部完成！',
  HINT_SAMEBR: '切出前后分支相同，您本次操作将不会产生效果...',
  SWITCH_INTR: '分支切换助手',
  SWITCH_SETR: '请输入关键字搜索分支, 方向键选择分支，回车执行分支切出...',
  SWITCH_TTLE: '输入关键字：',
  SWITCH_SUCC: '🍻 分支切换成功！',
  SWITCH_FAIL: '❌ 分支切换失败，请选择分支！'
};
const EN_DICT = {
  UPDATE_CLOG: 'Version update brought changes as below: ',
  UPDATE_HINT: 'Version __L_T_VER__ of __PKG_NAME__ is out, run the following command for upgrade \n\nnpm i __PKG_NAME__ -D \nyarn add __PKG_NAME__ --dev',
  CONFIG_TTLE: 'Branch format switcher (Input \'no\' at any input term will erase the result)',
  CONFIG_DEFH: 'Input __ITM_NAME__ :',
  CONFIG_DESC: 'Brief descriptions (less than 30 letters) :',
  CONFIG_TYPE: 'Select branch type (default：feature) :',
  CONFIG_SWIM: 'Input swimlane (E.g. 1787-qkgku、ouyifeng-hhhhh) :',
  CONFIG_SUBP: 'Input subpackage (E.g. product-gx ) :',
  CONFIG_BIZK: 'Input businesskey (E.g. AgentOrder) :',
  CONFIG_REID: 'Input reference ID (E.g. ones-xxx, km-xxx, tt-xxx) :',
  ANSWER_CONF: 'Proceed (Y/n) ?',
  ANSWER_LIST: 'Collected branch informations: ',
  ANSWER_RMBR: 'Delete origin checkouted branch (Y/n) ?',
  HINT_NODESC: 'Missing BranchType and BranchDescription, program exited.',
  HINT_MUSTOP: 'Required item __MUST_OP__ is missing.',
  HINT_MUSTDS: 'Program exited because of the created branch is invalid',
  HINT_PRECKO: 'Branch to be checkout is __TGT_BR__',
  HINT_STSING: 'Saving current branch state...',
  HINT_CHKING: 'Checking out new branch...',
  HINT_CHKEND: 'Branch checkout completed, setting up upstream with initial push...',
  HINT_UPSEND: 'Upstream setting completed...',
  HINT_RMBEND: 'Removed source branch locally and remotedly...',
  HINT_ALLEND: '🍻All done！',
  HINT_SAMEBR: 'Same branch before and after checkout, it won\'t take any effects...',
  SWITCH_INTR: 'Branch switch helper',
  SWITCH_SETR: 'Input keyword for branch searching, arrow key for selection, enter to perform checkout...',
  SWITCH_TTLE: 'Branch keyword: ',
  SWITCH_SUCC: '🍻 Branch switched successfully！',
  SWITCH_FAIL: '❌ Branch switch error, please make sure any branch has selected！'
};
const D = lang === 'zh' ? ZH_DICT : EN_DICT;

const unifyConfigs = item => {
  return item.map(config => {
    var _config$options, _config$message, _config$default, _config$envDefault, _config$optional, _config$prefix, _config$regExp;

    const listDefaults = config.type === 'list' ? {
      type: 'list',
      options: (_config$options = config.options) !== null && _config$options !== void 0 && _config$options.length ? config.options : []
    } : {};
    const inputDefaults = config.type === 'input' ? {
      type: 'input'
    } : {};
    return _objectSpread(_objectSpread({
      name: config.name,
      message: (_config$message = config === null || config === void 0 ? void 0 : config.message) !== null && _config$message !== void 0 ? _config$message : D.CONFIG_DEFH.replace('__ITM_NAME__', config.name),
      default: (_config$default = config === null || config === void 0 ? void 0 : config.default) !== null && _config$default !== void 0 ? _config$default : '',
      envDefault: (_config$envDefault = config === null || config === void 0 ? void 0 : config.envDefault) !== null && _config$envDefault !== void 0 ? _config$envDefault : '',
      optional: (_config$optional = config === null || config === void 0 ? void 0 : config.optional) !== null && _config$optional !== void 0 ? _config$optional : true,
      prefix: (_config$prefix = config === null || config === void 0 ? void 0 : config.prefix) !== null && _config$prefix !== void 0 ? _config$prefix : '',
      regExp: (_config$regExp = config === null || config === void 0 ? void 0 : config.regExp) !== null && _config$regExp !== void 0 ? _config$regExp : '(.*)'
    }, inputDefaults), listDefaults);
  });
};

const BRANCH_CONFIG = [{
  name: 'type',
  type: 'list',
  optional: false,
  default: 'feature',
  envDefault: '',
  message: D.CONFIG_TYPE,
  prefix: '',
  options: ['feature', 'bugfix', 'hotfix'],
  regExp: '(feature|bugfix|hotfix)'
}, {
  name: 'swimlane',
  type: 'input',
  optional: true,
  default: '',
  envDefault: '',
  message: D.CONFIG_SWIM,
  prefix: 'sl-',
  regExp: 'sl-([0-9a-z]{4,}-[a-z]{5})'
}, {
  name: 'packageName',
  type: 'input',
  optional: true,
  envDefault: '',
  default: '',
  message: D.CONFIG_SUBP,
  prefix: '@',
  regExp: '@([0-9a-z-]+)'
}, {
  name: 'businessKey',
  type: 'input',
  optional: true,
  envDefault: '',
  default: '',
  message: D.CONFIG_BIZK,
  prefix: '#',
  regExp: '#([0-9a-zA-Z_]+)'
}, {
  name: 'id',
  type: 'input',
  optional: true,
  envDefault: '',
  default: '',
  message: D.CONFIG_REID,
  prefix: '',
  regExp: '(km-[0-9]+|ones-[0-9]+|tt-[0-9]+)'
}];

const getCurrentConfig = userConfig => {
  /** user definedConfig */
  const customConfig = unifyConfigs(userConfig);

  if (customConfig.length) {
    return customConfig.filter(config => config.name !== 'desc').concat([{
      name: 'desc',
      type: 'input',
      optional: false,
      message: D.CONFIG_DESC,
      envDefault: '',
      default: '',
      prefix: '',
      regExp: '.*$'
    }]);
  }
  /** TODO: Merge user configs, use .branchformatrc */


  return BRANCH_CONFIG.slice().concat([{
    name: 'desc',
    type: 'input',
    optional: false,
    message: D.CONFIG_DESC,
    envDefault: '',
    default: '',
    prefix: '',
    regExp: '.*$'
  }]);
};

const inquirer = require('inquirer');

const Chalk = require('chalk');

const Shell$1 = require('shelljs');

const BRANCH_REMOVE_QUESTIONS = [{
  type: 'input',
  name: 'confirm',
  message: D.ANSWER_RMBR,
  default: 'n'
}];

const modifyBranch = async (branchConfig, config, sourceBranch, skipBranch) => {
  if (!branchConfig.type || !branchConfig.desc) {
    console.log(Chalk.red(D.HINT_NODESC));
    throw new Error(D.HINT_NODESC);
  }
  /** check if optional config has all satisfied */


  let satisfied = true;
  config.forEach(option => {
    if (!branchConfig[option.name] && !option.optional) {
      satisfied = false;
      console.log(Chalk.red(`${D.HINT_MUSTOP.replace('__MUST_OP__', option.name)}`));
    }
  });

  if (!satisfied) {
    console.log(Chalk.red(D.HINT_MUSTDS));
    throw new Error(D.HINT_MUSTDS);
  }
  /** Start build Branch and perform checkout */


  const targetBranch = config.map(option => {
    var _ref;

    return (_ref = `${branchConfig[option.name] ? option.prefix + branchConfig[option.name] : ''}`) !== null && _ref !== void 0 ? _ref : '';
  }).filter(Boolean).join('/');

  if (sourceBranch === targetBranch) {
    console.log(Chalk.red(D.HINT_SAMEBR));
    throw new Error(D.HINT_SAMEBR);
  }
  /** performCheckout */


  console.log();
  console.log();
  console.log(Chalk.green(D.HINT_PRECKO.replace('__TGT_BR__', targetBranch)));
  console.log(Chalk.white(D.HINT_STSING));
  /** Stash changes */

  Shell$1.exec('git stash');
  console.log(Chalk.white(D.HINT_CHKING));
  Shell$1.exec(`git checkout -b ${targetBranch} -f`);
  console.log(Chalk.green(D.HINT_CHKEND));
  Shell$1.exec(`git push --set-upstream origin ${targetBranch} --no-verify`);
  console.log(Chalk.green(D.HINT_UPSEND));

  if (isBranchShouldParse(sourceBranch)) {
    /** Not skipped branch */
    const checkResult = await inquirer.prompt(BRANCH_REMOVE_QUESTIONS);

    if (checkResult.confirm.toUpperCase() === 'Y') {
      Shell$1.exec(`git branch -D ${sourceBranch}`);
      Shell$1.exec(`git push origin :${sourceBranch}`);
    }
  }

  console.log(Chalk.green(D.HINT_ALLEND));
};

const inquirer$1 = require('inquirer');

const Chalk$1 = require('chalk');

const CONFIRM_QUESTIONS = [{
  type: 'input',
  name: 'confirm',
  message: D.ANSWER_CONF,
  default: 'Y'
}];

const getQuestions = (currentBranch, config) => {
  const currentQuestions = config.slice();
  return {
    questions: currentQuestions.map(question => {
      const {
        name,
        type,
        message,
        options,
        envDefault,
        default: df
      } = question;
      const defaults =
      /** Top1: 从 env 处理得出的默认值来 */
      envDefault ? envDefault
      /** Top2: 从老 Branch 来 */
      : currentBranch[name] ? currentBranch[name]
      /** Top3: 从用户定义的默认值中来 */
      : df;

      if (options) {
        return {
          choices: options,
          name,
          type,
          message,
          envDefault,
          default: defaults
        };
      }

      return {
        name,
        type,
        message,
        default: defaults
      };
    }),
    defaults: currentQuestions.reduce((prev, curr) => {
      prev[curr.name] =
      /** Top1: 从 env 处理得出的默认值来 */
      curr.envDefault ? curr.envDefault
      /** Top2: 从老 Branch 来 */
      : currentBranch[curr.name] ? currentBranch[curr.name]
      /** Top3: 从用户定义的默认值中来 */
      : curr.default;
      return prev;
    }, {})
  };
};

const logAnswers = answers => {
  console.log(D.ANSWER_LIST);
  Object.keys(answers).forEach(answerKey => {
    if (answers[answerKey]) {
      console.log(Chalk$1.green(`${answerKey}: `) + Chalk$1.white(answers[answerKey]));
    }
  });
};

const askQuestions = async (config, currentBranch) => {
  let confirmed = false;
  const {
    questions,
    defaults
  } = getQuestions(currentBranch, config);
  let answers = Object.assign({}, defaults);

  while (!confirmed) {
    console.log(Chalk$1.cyan(D.CONFIG_TTLE));
    answers = Object.assign({}, defaults, await inquirer$1.prompt(questions));
    /** hold defaults */

    Object.keys(answers).forEach(answerKey => {
      if (answers[answerKey] === 'no') {
        answers[answerKey] = '';
      }
    });
    console.log();
    logAnswers(answers);
    const userConfirm = await inquirer$1.prompt(CONFIRM_QUESTIONS);

    if (userConfirm.confirm.toLowerCase() === 'y') {
      confirmed = true;
    } else {
      console.log();
      console.log();
    }
  }

  if (!confirmed) throw new Error();
  return answers;
};

const http = require('http');

const https = require('https');

const fetchData = (url, type = 'http') => {
  const fetcher = url.startsWith('https://') ? https : http;
  return new Promise((resolve, reject) => {
    fetcher.get(url, res => {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', chunk => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData);
        } catch (e) {
          console.error(e.message);
          reject(e);
        }
      });
    }).on('error', e => {
      // console.error(`Got error: ${e.message}`);
      reject(e);
    });
  });
};

const Semver = require('semver');

const Chalk$2 = require('chalk');

const Shell$2 = require('shelljs');

const fs = require('fs');

const defaultNpmMirror = 'http://registry.npmjs.org/';
const defaultYarnMirror = 'https://registry.yarnpkg.com/';
const sankuaiMirror = 'http://r.npm.sankuai.com/';
let npmMirror = sankuaiMirror;
const DEFAULT_VALIDATE_REMAINS = 20;

const isRcValid = rcFile => {
  if (!rcFile) return false;
  if (!Number.isInteger(rcFile.validateRemain)) return false;
  return true;
};

const getRcContent = rcPath => {
  const rcExists = fs.existsSync(rcPath);
  const defaultRcResult = {
    validateRemain: DEFAULT_VALIDATE_REMAINS
  };

  if (rcExists) {
    try {
      const rcContent = JSON.parse(fs.readFileSync(rcPath, {
        encoding: 'utf8'
      }));
      if (isRcValid(rcContent)) return rcContent;
      return defaultRcResult;
    } catch (err) {
      return defaultRcResult;
    }
  }

  return defaultRcResult;
};

const checkShouldUpdate = rcPath => {
  const rcContent = getRcContent(rcPath);

  if (rcContent.validateRemain === 0) {
    rcContent.validateRemain = DEFAULT_VALIDATE_REMAINS;
    fs.writeFileSync(rcPath, JSON.stringify(rcContent, null, 2), {
      encoding: 'utf8'
    });
    return true;
  }

  rcContent.validateRemain -= 1;
  fs.writeFileSync(rcPath, JSON.stringify(rcContent, null, 2), {
    encoding: 'utf8'
  });
  return false;
};

const getNpmMirror = () => {
  try {
    const mirrorResult = Shell$2.exec('npm config get registry', {
      silent: true
    });
    npmMirror = mirrorResult.stdout.trim();
  } catch (err) {
    npmMirror = sankuaiMirror;
  }
};

const getProperNpmListPath = packageName => {
  const hasNpmMirror = npmMirror !== defaultNpmMirror && npmMirror !== defaultYarnMirror;

  if (hasNpmMirror) {
    return `${npmMirror}${packageName}`;
  }

  return `${sankuaiMirror}${packageName}`;
};

const getLocalMessage = (packageName, latestVersion, originMessage) => {
  return (originMessage || D.UPDATE_HINT).replace('__L_T_VER__', latestVersion).replace(/__PKG_NAME__/g, packageName);
};

const getUpdateLogs = (npmData, currentVersion, latestVersion) => {
  if (Semver.prerelease(currentVersion) || !Semver.gt(latestVersion, currentVersion)) {
    return '';
  }
  /** parse version lists */


  const upcomingVersions = Object.keys(npmData.versions || {}).filter(incomingVersion => Boolean(
  /** not prerelease */
  !Semver.prerelease(incomingVersion) &&
  /** larger than currentVersion */
  Semver.gt(incomingVersion, currentVersion) &&
  /** less or equal to latestVersion */
  Semver.lte(incomingVersion, latestVersion))).sort((versionA, versionB) => Semver.lte(versionA, versionB) ? -1 : 1);
  /** output version changelogs */

  return upcomingVersions.map(version => {
    var _npmData$versions, _npmData$versions$ver, _npmData$versions2, _npmData$versions2$ve;

    const changelog = lang === 'zh' ? (_npmData$versions = npmData.versions) === null || _npmData$versions === void 0 ? void 0 : (_npmData$versions$ver = _npmData$versions[version]) === null || _npmData$versions$ver === void 0 ? void 0 : _npmData$versions$ver.config.changelog : (_npmData$versions2 = npmData.versions) === null || _npmData$versions2 === void 0 ? void 0 : (_npmData$versions2$ve = _npmData$versions2[version]) === null || _npmData$versions2$ve === void 0 ? void 0 : _npmData$versions2$ve.config.enchangelog;

    if (changelog) {
      return `[${version}]: ${changelog}`;
    }

    return '';
  }).filter(Boolean).join('\n');
};

const updateNotice = async (packagePath, rcPath, message) => {
  if (!checkShouldUpdate(rcPath)) return false;

  try {
    var _npmData$distTags;

    const pkg = require(packagePath);

    const localVersion = pkg.version;
    getNpmMirror();
    /** FetchData */

    const npmData = await fetchData(getProperNpmListPath(pkg.name));
    const latestVersion = (_npmData$distTags = npmData['dist-tags']) === null || _npmData$distTags === void 0 ? void 0 : _npmData$distTags.latest;
    if (!latestVersion || latestVersion === localVersion) return false;
    /** Do nothing if user uses prerelease versions */

    if (Semver.prerelease(localVersion)) return false;
    /** Only build notice when latestVersion is greater than localVersion */

    if (Semver.gt(latestVersion, localVersion)) {
      const displayMessage = getLocalMessage(pkg.name, latestVersion, message);
      const changelogs = getUpdateLogs(npmData, localVersion, latestVersion);
      console.log(Chalk$2.green(displayMessage));

      if (changelogs) {
        console.log();
        console.log(Chalk$2.cyan(D.UPDATE_CLOG));
        console.log(Chalk$2.white(changelogs));
      }

      console.log();
      return {
        message: displayMessage,
        name: pkg.name,
        local: localVersion,
        latest: latestVersion
      };
    }
  } catch (err) {
    console.log(Chalk$2.red(err.message));
    return false;
  }
};

const rcfile = require('rcfile');

const path = require('path');

const os = require('os');

const fs$1 = require('fs');

const pkgJsonPath = path.join('..', 'package.json');
const updateRcPath = path.join(os.homedir(), '.bfrc');

async function performFormat(directoryPath) {
  var _rcConfig$config;

  await updateNotice(pkgJsonPath, updateRcPath);
  /** subFolderName */

  const defaultSubPackage = directoryPath.split('/').pop();
  /** rcPath */

  const rcConfig = rcfile('branchformat', {
    cwd: directoryPath,
    configFileName: 'branchformat.config.js',
    defaultExtension: '.js'
  });
  /** get configs */

  const configs = getCurrentConfig((_rcConfig$config = rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.config) !== null && _rcConfig$config !== void 0 ? _rcConfig$config : []);
  /** get current branch */

  const currentBranch = getCurrentBranch();
  const branchModel = parseExistedBranch(currentBranch, configs, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip);
  /** prepare questions */

  const result = await askQuestions(configs, branchModel); // /** write target branch */

  await modifyBranch(result, configs, currentBranch, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip);
  return true;
}

async function isCurrentBranchValid(directoryPath) {
  var _rcConfig$config2;

  await updateNotice(pkgJsonPath, updateRcPath);
  /** rcPath */

  const rcConfig = rcfile('branchformat', {
    cwd: directoryPath,
    configFileName: 'branchformat.config.js',
    defaultExtension: '.js'
  });
  /** get configs */

  const configs = getCurrentConfig((_rcConfig$config2 = rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.config) !== null && _rcConfig$config2 !== void 0 ? _rcConfig$config2 : []);
  /** get current branch */

  const currentBranch = getCurrentBranch();
  /** Skip with skippable branches */

  if (!isBranchShouldParse(currentBranch, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip)) {
    return true;
  }

  const branchModel = parseExistedBranch(currentBranch, configs, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip);
  /** Loop through branchModel and check if currentValid */

  return configs.every(config => {
    /** if is optional, or is filled with value */
    return Boolean(config.optional || branchModel[config.name]);
  });
}

exports.isCurrentBranchValid = isCurrentBranchValid;
exports.performFormat = performFormat;
