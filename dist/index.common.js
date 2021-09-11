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
  ANSWER_FAIL: '❌ 分支选项 __OPTION__ 不符合要求格式 __REQ_REG__，验证失败。(当前填写为 __VALUE__)',
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
  SWITCH_FAIL: '❌ 分支切换失败，请选择分支！',
  BRANCH_FAIL: '❌ __BRANCH_OPTION__ 校验失败！您填写的值 __PARSED__ 无法满足您配置的分支格式 __REQUIRED__',
  BRRESU_SUCC: '分支校验结果：成功 ✅',
  BRRESU_FAIL: '分支校验结果：失败 ❌',
  BRRESU_REST: '详细错误情况：',
  BRVALI_RESU: '未切出',
  BRVALI_EXIT: '❌ 您填写的属性不满足项目指定的校验规则！请注意当前分支 __RESULT__！',
  BRVALI_HITX: '验证失败！',
  BRVALI_HINT: '❌ 自定义校验规则 __RESULT__!'
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
  ANSWER_FAIL: '❌ Inputed option `__OPTION__` fails to match required format __REQ_REG__ (Your current value `__VALUE__`)',
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
  SWITCH_FAIL: '❌ Branch switch error, please make sure any branch has selected！',
  BRANCH_FAIL: '❌ __BRANCH_OPTION__ validate failed since parsed value __PARSED__ does not matched your config format __REQUIRED__',
  BRRESU_SUCC: 'Branch verify result：PASSED ✅',
  BRRESU_FAIL: 'Branch verify result：FAILED ❌',
  BRRESU_REST: 'Errors in detail: ',
  BRVALI_RESU: 'has NOT created',
  BRVALI_EXIT: '❌ Customize verification failed! Please note that your branch __RESULT__!',
  BRVALI_HITX: 'validate FAILED',
  BRVALI_HINT: '❌ Customize verification function __RESULT__!'
};
const D = lang === 'zh' ? ZH_DICT : EN_DICT;
const STASHERROR_ZH = '没有要保存的本地修改';
const STASHERROR_EN = 'No local changes to save';

const unifyConfigs = item => {
  return item.map(config => {
    var _config$options, _config$message, _config$default, _config$envDefault, _config$optional, _config$prefix, _config$regExp, _config$when;

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
      regExp: (_config$regExp = config === null || config === void 0 ? void 0 : config.regExp) !== null && _config$regExp !== void 0 ? _config$regExp : '(.*)',
      when: (_config$when = config === null || config === void 0 ? void 0 : config.when) !== null && _config$when !== void 0 ? _config$when : true
    }, inputDefaults), listDefaults);
  }).map(originalConfig => {
    const regExp = `${originalConfig.regExp.startsWith('^') ? '' : '^'}${originalConfig.regExp}${originalConfig.regExp.endsWith('$') ? '' : '$'}`;
    return _objectSpread(_objectSpread({}, originalConfig), {}, {
      regExp
    });
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
      regExp: '^[0-9a-zA-Z-_\/\.]*$'
    }]);
  }
  /** TODO: Merge user configs, use .branchformatrc */


  return unifyConfigs(BRANCH_CONFIG.slice()).concat([{
    name: 'desc',
    type: 'input',
    optional: false,
    message: D.CONFIG_DESC,
    envDefault: '',
    default: '',
    prefix: '',
    regExp: '^[0-9a-zA-Z-_\/\.]*$'
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
/** 判断是否成功加入 stash */

const hasStashedSuccessfully = stashOutput => {
  if (stashOutput.indexOf(STASHERROR_EN) !== -1 || stashOutput.indexOf(STASHERROR_ZH) !== -1) {
    return false;
  }

  return true;
};

const modifyBranch = async (branchConfig, config, sourceBranch, skipBranch) => {
  var _stashOutput$stdout;

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
  /** Stash changes - including untracked files */

  const stashOutput = Shell$1.exec('git stash --include-untracked');
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
  /** Perform Stash pop if stashed successfully */


  if (hasStashedSuccessfully(stashOutput === null || stashOutput === void 0 ? void 0 : (_stashOutput$stdout = stashOutput.stdout) === null || _stashOutput$stdout === void 0 ? void 0 : _stashOutput$stdout.trim())) {
    Shell$1.exec('git stash pop');
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
        default: df,
        when
      } = question;

      const validate = input => {
        const inputEmpty = !input || input === 'no';
        const validateResult = Boolean(question.optional && inputEmpty || !inputEmpty && new RegExp(question.regExp).test(question.prefix + input));
        return Promise.resolve(validateResult ? validateResult : Chalk$1.red(D.ANSWER_FAIL.replace('__OPTION__', question.name).replace('__REQ_REG__', question.regExp).replace('__VALUE__', question.prefix + input)));
      };

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
          default: defaults,
          validate,
          when
        };
      }

      return {
        name,
        type,
        message,
        default: defaults,
        validate,
        when
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
let npmMirror = defaultNpmMirror;
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
    npmMirror = defaultNpmMirror;
  }
};

const getProperNpmListPath = packageName => {
  const hasNpmMirror = npmMirror !== defaultNpmMirror && npmMirror !== defaultYarnMirror;

  if (hasNpmMirror) {
    return `${npmMirror}${packageName}`;
  }

  return `${defaultNpmMirror}${packageName}`;
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
    console.log('CurrentMirror: ', npmMirror);
    /** FetchData */

    const npmData = await fetchData(getProperNpmListPath(pkg.name));
    console.log(npmData);
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

const Shell$3 = require('shelljs');

const getCurrentBranchLists = () => {
  const branchs = Shell$3.exec('git branch', {
    silent: true
  });
  return branchs.stdout.trim();
};

const prepareBranchLists = () => {
  const branchs = getCurrentBranchLists().split('\n').map(branch => branch.trim()).filter(branchItem => !branchItem.startsWith('*'));
  return branchs;
};
/** 判断是否成功加入 stash */


const hasStashedSuccessfully$1 = stashOutput => {
  if (stashOutput.indexOf(STASHERROR_EN) !== -1 || stashOutput.indexOf(STASHERROR_ZH) !== -1) {
    return false;
  }

  return true;
};

const performCheckout = branchName => {
  var _stashResult$stdout;

  const stashResult = Shell$3.exec('git stash --include-untracked', {
    silent: true
  });
  Shell$3.exec(`git checkout ${branchName}`, {
    silent: true
  });

  if (hasStashedSuccessfully$1(stashResult === null || stashResult === void 0 ? void 0 : (_stashResult$stdout = stashResult.stdout) === null || _stashResult$stdout === void 0 ? void 0 : _stashResult$stdout.trim())) {
    Shell$3.exec('git stash pop', {
      silent: true
    });
  }
};

const Inquirer = require('inquirer');

Inquirer.registerPrompt('search-list', require('inquirer-search-list'));

const prepareQuestions = () => {
  const availableBranchs = prepareBranchLists();
  return [{
    type: "search-list",
    message: D.SWITCH_TTLE,
    name: "branch",
    choices: availableBranchs,
    default: availableBranchs[0]
  }];
};

const getCheckoutBranch = async () => {
  const question = prepareQuestions();
  const result = await Inquirer.prompt(question);
  return result.branch;
};

const Chalk$3 = require('chalk');

const switchBranch = async () => {
  console.log(Chalk$3.green(D.SWITCH_INTR));
  console.log(Chalk$3.green(D.SWITCH_SETR));
  console.log();
  const checkoutBranch = await getCheckoutBranch();

  if (checkoutBranch) {
    performCheckout(checkoutBranch);
    console.log(Chalk$3.green(D.SWITCH_SUCC));
    return true;
  }

  console.log(Chalk$3.red(D.SWITCH_FAIL));
  return false;
};

const chalk = require("chalk");

const inspectBranchEquivalance = (configTerm, branchModel) => {
  const termInspectResult = Boolean(configTerm.optional || branchModel[configTerm.name] && new RegExp(configTerm.regExp).test(configTerm.prefix + branchModel[configTerm.name]));

  if (!termInspectResult) {
    return D.BRANCH_FAIL.replace('__BRANCH_OPTION__', chalk.green(chalk.bold(configTerm.name))).replace('__PARSED__', chalk.underline(chalk.bold(configTerm.prefix + branchModel[configTerm.name]))).replace('__REQUIRED__', chalk.red(chalk.bold(configTerm.regExp)));
  }

  return null;
};
/**
 * 校验验证错误
 * @export
 * @param {BranchAnswers} branchAnswers
 * @param {BranchformatConfigModel} branchConfig
 * @returns
 */


function checkVerificationErrors(branchAnswers, branchConfig) {
  if (typeof (branchConfig === null || branchConfig === void 0 ? void 0 : branchConfig.verify) === 'function') {
    try {
      const verifyResult = branchConfig === null || branchConfig === void 0 ? void 0 : branchConfig.verify(branchAnswers);
      if (verifyResult === true) return false;
      if (verifyResult === false) return D.BRRESU_FAIL;
      return D.BRRESU_FAIL + ': ' + verifyResult;
    } catch (err) {
      return `${D.BRRESU_FAIL}: 校验函数调用失败！
                ${err.message}
            `;
    }
  }

  return false;
}

const chalk$1 = require('chalk');

const rcfile = require('rcfile');

const path = require('path');

const os = require('os');

const fs$1 = require('fs');

const pkgJsonPath = path.join('..', 'package.json');
const updateRcPath = path.join(os.homedir(), '.bfrc');
/**
 * 分支切换 API
 * @export
 * @param {string} directoryPath 当前项目目录
 * @returns {Promise<boolean>} 分支切换结果
 */

async function performFormat(directoryPath) {
  var _rcConfig$config;

  await updateNotice(pkgJsonPath, updateRcPath);
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

  const result = await askQuestions(configs, branchModel);
  /** Perform user validation */

  const validationError = checkVerificationErrors(result, rcConfig);

  if (validationError) {
    console.log(validationError);
    console.log(D.BRVALI_EXIT.replace('__RESULT__', chalk$1.bold(chalk$1.cyan(chalk$1.underline(D.BRVALI_RESU)))));
    return false;
  }

  console.log(D.BRRESU_SUCC); // /** write target branch */

  await modifyBranch(result, configs, currentBranch, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip);
  return true;
}
/**
 * 分支合法性校验 API
 * @export
 * @param {string} directoryPath 当前项目目录
 * @returns {Promise<boolean>} 分支校验结果
 */


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
  /** avoid detached HEAD state verifications */

  if (!currentBranch) {
    return true;
  }
  /** Skip with skippable branches */


  if (!isBranchShouldParse(currentBranch, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip)) {
    return true;
  }

  const branchModel = parseExistedBranch(currentBranch, configs, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip);
  /** Loop through branchModel and check if currentValid */

  const errors = [];
  const parsedResult = configs.every(config => {
    /** if is optional, or is filled with value and match regex */
    const termInspectResult = inspectBranchEquivalance(config, branchModel);

    if (termInspectResult) {
      errors.push(termInspectResult);
    }

    return !termInspectResult;
  });
  console.log(parsedResult ? D.BRRESU_SUCC : D.BRRESU_FAIL);

  if (!parsedResult) {
    console.log('----------------------------------------------------------------');
    console.log(D.BRRESU_REST);
    errors.forEach(result => console.log(result));
    return parsedResult;
  }
  /** Perform user validation */


  const validationError = checkVerificationErrors(branchModel, rcConfig);

  if (validationError) {
    console.log(validationError);
    console.log(D.BRVALI_HINT.replace('__RESULT__', chalk$1.bold(chalk$1.cyan(chalk$1.underline(D.BRVALI_HITX)))));
    return false;
  }

  console.log(D.BRRESU_SUCC);
  return parsedResult;
}
/**
 * 分支快速切换 API
 * @export
 * @returns {Promise<void>}
 */


async function switchBranch$1() {
  await updateNotice(pkgJsonPath, updateRcPath);
  const result = await switchBranch();
  return result;
}
/**
 * 根据当前的 branchFormat 配置
 * 从给定分支中提取参数
 * @export
 * @param {string} directoryPath 当前项目目录
 * @param {string} [targetBranch] 目标分支，默认为当前分支
 * @returns {Promise<BranchAnswers | null>} 当前分支解析结果，如果分支不存在或需跳过则为空
 */


async function extractBranchParams(directoryPath, targetBranch) {
  var _rcConfig$config3;

  await updateNotice(pkgJsonPath, updateRcPath);
  /** rcPath */

  const rcConfig = rcfile('branchformat', {
    cwd: directoryPath,
    configFileName: 'branchformat.config.js',
    defaultExtension: '.js'
  });
  /** get configs */

  const configs = getCurrentConfig((_rcConfig$config3 = rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.config) !== null && _rcConfig$config3 !== void 0 ? _rcConfig$config3 : []);
  const testBranch = targetBranch !== null && targetBranch !== void 0 ? targetBranch : getCurrentBranch();
  if (!testBranch || !isBranchShouldParse(testBranch, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip)) return null;
  return parseExistedBranch(testBranch, configs, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip);
}
/**
 * [同步 API]
 * 根据当前的 branchFormat 配置
 * 从给定分支中提取参数
 * @export
 * @param {string} directoryPath 当前项目目录
 * @param {string} [targetBranch] 目标分支，默认为当前分支
 * @returns {Promise<BranchAnswers | null>} 当前分支解析结果，如果分支不存在或需跳过则为空
 */


function extractBranchParamsSync(directoryPath, targetBranch) {
  var _rcConfig$config4;

  /** rcPath */
  const rcConfig = rcfile('branchformat', {
    cwd: directoryPath,
    configFileName: 'branchformat.config.js',
    defaultExtension: '.js'
  });
  /** get configs */

  const configs = getCurrentConfig((_rcConfig$config4 = rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.config) !== null && _rcConfig$config4 !== void 0 ? _rcConfig$config4 : []);
  const testBranch = targetBranch !== null && targetBranch !== void 0 ? targetBranch : getCurrentBranch();
  if (!testBranch || !isBranchShouldParse(testBranch, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip)) return null;
  return parseExistedBranch(testBranch, configs, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip);
}
/**
 * [同步 API]
 * 分支合法性校验 API
 * @export
 * @param {string} directoryPath 当前项目目录
 * @returns {Promise<boolean>} 分支校验结果
 */


function isCurrentBranchValidSync(directoryPath) {
  var _rcConfig$config5;

  /** rcPath */
  const rcConfig = rcfile('branchformat', {
    cwd: directoryPath,
    configFileName: 'branchformat.config.js',
    defaultExtension: '.js'
  });
  /** get configs */

  const configs = getCurrentConfig((_rcConfig$config5 = rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.config) !== null && _rcConfig$config5 !== void 0 ? _rcConfig$config5 : []);
  /** get current branch */

  const currentBranch = getCurrentBranch();
  /** avoid detached HEAD state verifications */

  if (!currentBranch) {
    return true;
  }
  /** Skip with skippable branches */


  if (!isBranchShouldParse(currentBranch, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip)) {
    return true;
  }

  const branchModel = parseExistedBranch(currentBranch, configs, rcConfig === null || rcConfig === void 0 ? void 0 : rcConfig.skip);
  /** Loop through branchModel and check if currentValid */

  const errors = [];
  const parsedResult = configs.every(config => {
    /** if is optional, or is filled with value and match regex */
    const termInspectResult = inspectBranchEquivalance(config, branchModel);

    if (termInspectResult) {
      errors.push(termInspectResult);
    }

    return !termInspectResult;
  });
  console.log(parsedResult ? D.BRRESU_SUCC : D.BRRESU_FAIL);

  if (!parsedResult) {
    console.log('----------------------------------------------------------------');
    console.log(D.BRRESU_REST);
    errors.forEach(result => console.log(result));
    return parsedResult;
  }
  /** Perform user validation */


  const validationError = checkVerificationErrors(branchModel, rcConfig);

  if (validationError) {
    console.log(validationError);
    console.log(D.BRVALI_HINT.replace('__RESULT__', chalk$1.bold(chalk$1.cyan(chalk$1.underline(D.BRVALI_HITX)))));
    return false;
  }

  console.log(D.BRRESU_SUCC);
  return parsedResult;
}

exports.extractBranchParams = extractBranchParams;
exports.extractBranchParamsSync = extractBranchParamsSync;
exports.isCurrentBranchValid = isCurrentBranchValid;
exports.isCurrentBranchValidSync = isCurrentBranchValidSync;
exports.performFormat = performFormat;
exports.switchBranch = switchBranch$1;
