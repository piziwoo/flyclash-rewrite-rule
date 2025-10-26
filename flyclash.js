// 全局常量
const CONSTANTS = {
  TEST_INTERVAL: 300,
  TEST_TOLERANCE: 50,
  ENABLE: true,
};

// 分流规则开关配置
const RULE_OPTIONS = {
  apple: true,
  microsoft: true,
  github: true,
  google: true,
  openai: true,
  spotify: true,
  youtube: true,
  bahamut: true,
  netflix: true,
  tiktok: true,
  disney: true,
  pixiv: true,
  hbo: true,
  biliintl: false,
  tvb: true,
  hulu: true,
  primevideo: true,
  telegram: true,
  line: true,
  whatsapp: true,
  games: true,
  japan: true,
  tracker: true,
  ads: false,
};

// 前置规则
const FRONT_RULES = [
  'PROCESS-NAME,SunloginClient,DIRECT',
  'PROCESS-NAME,AnyDesk,DIRECT',
  'PROCESS-NAME,NodeBabyLinkBackup,DIRECT',
  'PROCESS-NAME,NodeBabyLinkClient,DIRECT',
  'PROCESS-NAME,NodeBabyLinkRfile,DIRECT',
];

// DNS 配置
const DNS_CONFIG = {
  enable: true,
  listen: ':1053',
  ipv6: false,
  'prefer-h3': true,
  'use-hosts': true,
  'use-system-hosts': true,
  'respect-rules': true,
  'enhanced-mode': 'fake-ip',
  'fake-ip-range': '198.18.0.1/16',
  'fake-ip-filter': ['+.lan', '+.local', '+.market.xiaomi.com'],
  nameserver: ['https://120.53.53.53/dns-query', 'https://223.5.5.5/dns-query'],
  'proxy-server-nameserver': ['https://120.53.53.53/dns-query', 'https://223.5.5.5/dns-query'],
  'nameserver-policy': {
    'geosite:private': 'system',
    'geosite:cn,steam@cn,category-games@cn,microsoft@cn,apple@cn': ['udp://119.29.29.29:53', 'udp://223.5.5.5:53'],
  },
};

// 规则集通用配置
const RULE_PROVIDER_COMMON = {
  type: 'http',
  format: 'yaml',
  interval: 86400,
};

// 代理组通用配置
const GROUP_BASE_OPTION = {
  interval: 300,
  timeout: 3000,
  url: 'http://cp.cloudflare.com/generate_204',
  lazy: true,
  'max-failed-times': 3,
  hidden: false,
};

// 规则提供者配置
const RULE_PROVIDERS = new Map([
  ['reject', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt',
    path: './ruleset/loyalsoldier/reject.yaml',
  }],
  ['google', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt',
    path: './ruleset/loyalsoldier/google.yaml',
  }],
  ['proxy', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt',
    path: './ruleset/loyalsoldier/proxy.yaml',
  }],
  ['direct', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt',
    path: './ruleset/loyalsoldier/direct.yaml',
  }],
  ['private', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt',
    path: './ruleset/loyalsoldier/private.yaml',
  }],
  ['gfw', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt',
    path: './ruleset/loyalsoldier/gfw.yaml',
  }],
  ['tld-not-cn', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt',
    path: './ruleset/loyalsoldier/tld-not-cn.yaml',
  }],
  ['telegramcidr', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'ipcidr',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt',
    path: './ruleset/loyalsoldier/telegramcidr.yaml',
  }],
  ['cncidr', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'ipcidr',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt',
    path: './ruleset/loyalsoldier/cncidr.yaml',
  }],
  ['lancidr', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'ipcidr',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt',
    path: './ruleset/loyalsoldier/lancidr.yaml',
  }],
  ['YouTube', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'classical',
    url: 'https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/YouTube.txt',
    path: './ruleset/xiaolin-007/YouTube.yaml',
  }],
  ['Netflix', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'classical',
    url: 'https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/Netflix.txt',
    path: './ruleset/xiaolin-007/Netflix.yaml',
  }],
  ['Spotify', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'classical',
    url: 'https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/Spotify.txt',
    path: './ruleset/xiaolin-007/Spotify.yaml',
  }],
  ['BilibiliHMT', {
    ...RULE_PROVIDER_COMMON,
    behavior: 'classical',
    url: 'https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/BilibiliHMT.txt',
    path: './ruleset/xiaolin-007/BilibiliHMT.yaml',
  }],
]);

// 主配置函数
function main(config) {
  // 验证代理配置
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount = typeof config?.['proxy-providers'] === 'object' ? Object.keys(config['proxy-providers']).length : 0;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error('配置文件中未找到任何代理');
  }

  // 全局设置
  config['allow-lan'] = true;
  config['bind-address'] = '*';
  config['mode'] = 'rule';
  config['profile'] = { 'store-selected': true, 'store-fake-ip': true };
  config['unified-delay'] = true;
  config['tcp-concurrent'] = true;
  config['keep-alive-interval'] = 1800;
  config['find-process-mode'] = 'strict';
  config['geodata-mode'] = true;
  config['geodata-loader'] = 'memconservative';
  config['geo-auto-update'] = true;
  config['geo-update-interval'] = 24;
  config['sniffer'] = {
    enable: true,
    'force-dns-mapping': true,
    'parse-pure-ip': false,
    'override-destination': true,
    sniff: {
      TLS: { ports: [443, 8443] },
      HTTP: { ports: [80, '8080-8880'] },
      QUIC: { ports: [443, 8443] },
    },
    'skip-src-address': ['127.0.0.0/8', '192.168.0.0/16', '10.0.0.0/8', '172.16.0.0/12'],
    'force-domain': [
      '+.google.com',
      '+.googleapis.com',
      '+.googleusercontent.com',
      '+.youtube.com',
      '+.facebook.com',
      '+.messenger.com',
      '+.fbcdn.net',
      'fbcdn-a.akamaihd.net',
      '+.openai.com',
    ],
    'skip-domain': ['Mijia Cloud', '+.oray.com'],
  };
  config['ntp'] = { enable: true, 'write-to-system': false, server: 'cn.ntp.org.cn' };
  config['geox-url'] = {
    geoip: 'https://codeberg.org/Joyen/flyclash/raw/branch/main/geoip-lite.dat',
    geosite: 'https://codeberg.org/Joyen/flyclash/raw/branch/main/geosite.dat',
    mmdb: 'https://codeberg.org/Joyen/flyclash/raw/branch/main/country-lite.mmdb',
    asn: 'https://codeberg.org/Joyen/flyclash/raw/branch/main/GeoLite2-ASN.mmdb',
  };

  // 覆盖 DNS 配置
  config['dns'] = DNS_CONFIG;

  // 如果分流未启用，直接返回
  if (!CONSTANTS.ENABLE) {
    return config;
  }

  // 添加直连代理
  config['proxies'].push({
    name: '直连',
    type: 'direct',
    udp: true,
  });

  // 定义代理组
  config['proxy-groups'] = [
    {
      ...GROUP_BASE_OPTION,
      name: '节点选择',
      type: 'select',
      proxies: ['故障转移', '手动选择', '延迟选优'],
      filter: '^(?!.*(官网|套餐|流量|异常|剩余)).*$',
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg',
    },
    {
      ...GROUP_BASE_OPTION,
      name: '手动选择',
      type: 'select',
      'include-all': true,
      filter: '^(?!.*(官网|套餐|流量|异常|剩余|直连)).*$',
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg',
    },
    {
      ...GROUP_BASE_OPTION,
      name: '延迟选优',
      type: 'url-test',
      interval: CONSTANTS.TEST_INTERVAL,
      tolerance: CONSTANTS.TEST_TOLERANCE,
      lazy: false,
      'include-all': true,
      filter: '^(?!.*(官网|套餐|流量|异常|剩余|直连)).*$',
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg',
    },
    {
      ...GROUP_BASE_OPTION,
      name: '故障转移',
      type: 'fallback',
      timeout: 1000,
      interval: 1800,
      'max-failed-times': 2,
      'include-all': true,
      filter: '^(?!.*(官网|套餐|流量|异常|剩余|直连)).*$',
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/ambulance.svg',
    },
  ];

  // 动态添加分流规则
  let rules = [...FRONT_RULES];

  // 服务分流规则
  const addServiceRules = (service, geosite, providerKey = null) => {
    if (RULE_OPTIONS[service]) {
      rules.push(`GEOSITE,${geosite},节点选择`);
      if (providerKey) {
        RULE_PROVIDERS.set(providerKey, {
          ...RULE_PROVIDER_COMMON,
          behavior: 'classical',
          format: 'text',
          url: `https://github.com/dahaha-365/YaNet/raw/refs/heads/dist/rulesets/mihomo/${providerKey}.list`,
          path: `./ruleset/YaNet/${providerKey}.list`,
        });
      }
    }
  };

  // AI 服务
  if (RULE_OPTIONS.openai) {
    rules.push(
      `DOMAIN-SUFFIX,grazie.ai,节点选择`,
      `DOMAIN-SUFFIX,grazie.aws.intellij.net,节点选择`,
      `RULE-SET,ai,节点选择`
    );
    RULE_PROVIDERS.set('ai', {
      ...RULE_PROVIDER_COMMON,
      behavior: 'classical',
      format: 'text',
      url: 'https://github.com/dahaha-365/YaNet/raw/refs/heads/dist/rulesets/mihomo/ai.list',
      path: './ruleset/YaNet/ai.list',
    });
  }

  // 流媒体、通讯、游戏等服务
  addServiceRules('youtube', 'youtube', 'YouTube');
  addServiceRules('bahamut', 'bahamut');
  addServiceRules('disney', 'disney');
  addServiceRules('netflix', 'netflix', 'Netflix');
  addServiceRules('tiktok', 'tiktok');
  addServiceRules('spotify', 'spotify', 'Spotify');
  addServiceRules('pixiv', 'pixiv');
  addServiceRules('hbo', 'hbo');
  addServiceRules('tvb', 'tvb');
  addServiceRules('primevideo', 'primevideo');
  addServiceRules('hulu', 'hulu');
  addServiceRules('whatsapp', 'whatsapp');
  addServiceRules('line', 'line');

  if (RULE_OPTIONS.telegram) {
    rules.push(`GEOIP,telegram,节点选择`);
  }

  if (RULE_OPTIONS.games) {
    rules.push(`GEOSITE,category-games@cn,DIRECT`, `GEOSITE,category-games,节点选择`);
  }

  if (RULE_OPTIONS.tracker) {
    rules.push('GEOSITE,tracker,REJECT');
  }

  if (RULE_OPTIONS.apple) {
    rules.push('GEOSITE,apple-cn,DIRECT');
  }

  addServiceRules('google', 'google', 'google');
  addServiceRules('github', 'github');

  if (RULE_OPTIONS.microsoft) {
    rules.push(`GEOSITE,microsoft@cn,DIRECT`, `GEOSITE,microsoft,节点选择`);
  }

  if (RULE_OPTIONS.japan) {
    rules.push(`RULE-SET,category-bank-jp,节点选择`, `GEOIP,jp,节点选择,no-resolve`);
    RULE_PROVIDERS.set('category-bank-jp', {
      ...RULE_PROVIDER_COMMON,
      behavior: 'domain',
      format: 'mrs',
      url: 'https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/category-bank-jp.mrs',
      path: './ruleset/MetaCubeX/category-bank-jp.mrs',
    });
  }

  // 添加 reject 规则，仅在 ads: true 时启用
  if (RULE_OPTIONS.ads) {
    rules.push('RULE-SET,reject,REJECT');
  }

  // 后置规则
  rules.push(
    'RULE-SET,private,DIRECT',
    'RULE-SET,YouTube,节点选择',
    'RULE-SET,Netflix,节点选择',
    'RULE-SET,Spotify,节点选择',
    'RULE-SET,google,节点选择',
    'RULE-SET,proxy,节点选择',
    'RULE-SET,gfw,节点选择',
    'RULE-SET,tld-not-cn,节点选择',
    'RULE-SET,direct,DIRECT',
    'RULE-SET,lancidr,DIRECT,no-resolve',
    'RULE-SET,cncidr,DIRECT,no-resolve',
    'RULE-SET,telegramcidr,节点选择,no-resolve',
    'GEOSITE,private,DIRECT',
    'GEOIP,private,DIRECT,no-resolve',
    'GEOSITE,cn,DIRECT',
    'GEOIP,cn,DIRECT,no-resolve',
    'DOMAIN-SUFFIX,cloudflare.com,节点选择',
    'DOMAIN-SUFFIX,googleapis.cn,DIRECT',
    'DOMAIN-SUFFIX,gstatic.com,节点选择',
    'DOMAIN-SUFFIX,xn--ngstr-lra8j.com,节点选择',
    'DOMAIN-SUFFIX,github.io,节点选择',
    'DOMAIN,v2rayse.com,节点选择',
    'MATCH,节点选择'
  );

  // 覆盖规则和规则提供者
  config['rule-providers'] = Object.fromEntries(RULE_PROVIDERS);
  config['rules'] = rules;

  // 启用 UDP
  config['proxies'].forEach(proxy => {
    proxy.udp = true;
  });

  return config;
}
