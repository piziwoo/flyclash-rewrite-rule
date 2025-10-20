// 常量定义
const test_interval = 300;
const test_tolerance = 50;
const enable = true; // 总开关：true=启用分流，false=禁用

/**
 * 分流规则配置（仅用于规则，不生成分组）
 * true = 启用，false = 禁用
 */
const ruleOptions = {
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
  biliintl: false, // 修改：禁用国际版代理，确保bilibili.com全直连
  tvb: true,
  hulu: true,
  primevideo: true,
  telegram: true,
  line: true,
  whatsapp: true,
  games: true,
  japan: true,
  tracker: true,
  ads: true,
};

/**
 * 前置规则（已移除 .exe 相关规则）
 */
const frontRules = [
  'RULE-SET,applications,DIRECT',
  'PROCESS-NAME,SunloginClient,DIRECT',
  'PROCESS-NAME,AnyDesk,DIRECT',
  'PROCESS-NAME,NodeBabyLinkBackup,DIRECT',
  'PROCESS-NAME,NodeBabyLinkClient,DIRECT',
  'PROCESS-NAME,NodeBabyLinkRfile,DIRECT',
];

/**
 * DNS配置
 */
const dnsConfig = {
  enable: true,
  listen: ':1053',
  ipv6: false,
  'prefer-h3': true,
  'use-hosts': true,
  'use-system-hosts': true,
  'respect-rules': true,
  'enhanced-mode': 'fake-ip',
  'fake-ip-range': '198.18.0.1/16',
  'fake-ip-filter': ['*', '+.lan', '+.local', '+.market.xiaomi.com'],
  nameserver: ['https://120.53.53.53/dns-query', 'https://223.5.5.5/dns-query'],
  'proxy-server-nameserver': ['https://120.53.53.53/dns-query', 'https://223.5.5.5/dns-query'],
  'nameserver-policy': {
    'geosite:private': 'system',
    'geosite:cn,steam@cn,category-games@cn,microsoft@cn,apple@cn': ['119.29.29.29', '223.5.5.5'],
  },
};

// 规则集通用配置
const ruleProviderCommon = {
  type: 'http',
  format: 'yaml',
  interval: 86400,
};

// 代理组通用配置
const groupBaseOption = {
  interval: 300,
  timeout: 3000,
  url: 'http://cp.cloudflare.com/generate_204',
  lazy: true,
  'max-failed-times': 3,
  hidden: false,
};

const ruleProviders = new Map();
ruleProviders.set('applications', {
  ...ruleProviderCommon,
  behavior: 'classical',
  format: 'text',
  url: 'https://fastly.jsdelivr.net/gh/DustinWin/ruleset_geodata@clash-ruleset/applications.list',
  path: './ruleset/DustinWin/applications.list',
});

// Loyalsoldier 规则集
const loyalsoldierProviders = {
  "reject": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
    "path": "./ruleset/loyalsoldier/reject.yaml"
  },
  "icloud": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
    "path": "./ruleset/loyalsoldier/icloud.yaml"
  },
  "apple": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt",
    "path": "./ruleset/loyalsoldier/apple.yaml"
  },
  "google": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt",
    "path": "./ruleset/loyalsoldier/google.yaml"
  },
  "proxy": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
    "path": "./ruleset/loyalsoldier/proxy.yaml"
  },
  "direct": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
    "path": "./ruleset/loyalsoldier/direct.yaml"
  },
  "private": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
    "path": "./ruleset/loyalsoldier/private.yaml"
  },
  "gfw": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
    "path": "./ruleset/loyalsoldier/gfw.yaml"
  },
  "tld-not-cn": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt",
    "path": "./ruleset/loyalsoldier/tld-not-cn.yaml"
  },
  "telegramcidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
    "path": "./ruleset/loyalsoldier/telegramcidr.yaml"
  },
  "cncidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
    "path": "./ruleset/loyalsoldier/cncidr.yaml"
  },
  "lancidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
    "path": "./ruleset/loyalsoldier/lancidr.yaml"
  },
  "YouTube": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/YouTube.txt",
    "path": "./ruleset/xiaolin-007/YouTube.yaml"
  },
  "Netflix": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/Netflix.txt",
    "path": "./ruleset/xiaolin-007/Netflix.yaml"
  },
  "Spotify": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/Spotify.txt",
    "path": "./ruleset/xiaolin-007/Spotify.yaml"
  },
  "BilibiliHMT": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/BilibiliHMT.txt",
    "path": "./ruleset/xiaolin-007/BilibiliHMT.yaml"
  },
};

// 合并规则提供者
Object.entries(loyalsoldierProviders).forEach(([key, value]) => {
  ruleProviders.set(key, value);
});

// 程序入口
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount = typeof config?.["proxy-providers"] === "object" ? Object.keys(config["proxy-providers"]).length : 0;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
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
    'force-domain': ['+.google.com', '+.googleapis.com', '+.googleusercontent.com', '+.youtube.com', '+.facebook.com', '+.messenger.com', '+.fbcdn.net', 'fbcdn-a.akamaihd.net'],
    'skip-domain': ['Mijia Cloud', '+.oray.com'],
  };
  config['ntp'] = { enable: true, 'write-to-system': false, server: 'cn.ntp.org.cn' };
  config['geox-url'] = {
    geoip: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat',
    geosite: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat',
    mmdb: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country-lite.mmdb',
    asn: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/GeoLite2-ASN.mmdb',
  };

  // 覆盖 DNS
  config["dns"] = dnsConfig;

  if (!enable) {
    return config;
  }

  // 仅4个核心分组
  config["proxies"].push({
    name: '直连',
    type: 'direct',
    udp: true,
  });

  config["proxy-groups"] = [
    {
      ...groupBaseOption,
      "name": "节点选择",
      "type": "select",
      "proxies": ["故障转移", "手动选择", "延迟选优"],
      "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg"
    },
    {
      ...groupBaseOption,
      name: "手动选择",
      type: "select",
      "include-all": true,
      "filter": "^(?!.*(官网|套餐|流量|异常|剩余|直连)).*$",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg",
    },
    {
      ...groupBaseOption,
      "name": "延迟选优",
      "type": "url-test",
      interval: test_interval,
      tolerance: test_tolerance,
      "include-all": true,
      "filter": "^(?!.*(官网|套餐|流量|异常|剩余|直连)).*$",
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg"
    },
    {
      ...groupBaseOption,
      "name": "故障转移",
      "type": "fallback",
      timeout: 1500,
      'max-failed-times': 2,
      "include-all": true,
      "filter": "^(?!.*(官网|套餐|流量|异常|剩余|直连)).*$",
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/ambulance.svg"
    },
  ];

  // 定义所有分组名称
  const proxyGroups = ['节点选择', '手动选择', '延迟选优', '故障转移'];

  // 动态添加分流规则
  let rules = [...frontRules];

  // 国外AI
  if (ruleOptions.openai) {
    proxyGroups.forEach(group => {
      rules.push(`DOMAIN-SUFFIX,grazie.ai,${group}`, `DOMAIN-SUFFIX,grazie.aws.intellij.net,${group}`, `RULE-SET,ai,${group}`);
    });
    ruleProviders.set('ai', {
      ...ruleProviderCommon,
      behavior: 'classical',
      format: 'text',
      url: 'https://github.com/dahaha-365/YaNet/raw/refs/heads/dist/rulesets/mihomo/ai.list',
      path: './ruleset/YaNet/ai.list',
    });
  }

  // YouTube
  if (ruleOptions.youtube) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,youtube,${group}`);
    });
  }

  // 巴哈姆特
  if (ruleOptions.bahamut) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,bahamut,${group}`);
    });
  }

  // Disney+
  if (ruleOptions.disney) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,disney,${group}`);
    });
  }

  // Netflix
  if (ruleOptions.netflix) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,netflix,${group}`);
    });
  }

  // Tiktok
  if (ruleOptions.tiktok) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,tiktok,${group}`);
    });
  }

  // Spotify
  if (ruleOptions.spotify) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,spotify,${group}`);
    });
  }

  // Pixiv
  if (ruleOptions.pixiv) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,pixiv,${group}`);
    });
  }

  // HBO
  if (ruleOptions.hbo) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,hbo,${group}`);
    });
  }

  // TVB
  if (ruleOptions.tvb) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,tvb,${group}`);
    });
  }

  // Prime Video
  if (ruleOptions.primevideo) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,primevideo,${group}`);
    });
  }

  // Hulu
  if (ruleOptions.hulu) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,hulu,${group}`);
    });
  }

  // Telegram
  if (ruleOptions.telegram) {
    proxyGroups.forEach(group => {
      rules.push(`GEOIP,telegram,${group}`);
    });
  }

  // WhatsApp
  if (ruleOptions.whatsapp) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,whatsapp,${group}`);
    });
  }

  // Line
  if (ruleOptions.line) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,line,${group}`);
    });
  }

  // 游戏专用
  if (ruleOptions.games) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,category-games@cn,DIRECT`, `GEOSITE,category-games,${group}`);
    });
  }

  // 跟踪分析
  if (ruleOptions.tracker) {
    rules.push('GEOSITE,tracker,REJECT');
  }

  // 广告过滤
  if (ruleOptions.ads) {
    rules.push('GEOSITE,category-ads-all,REJECT', 'RULE-SET,adblockmihomo,REJECT');
    ruleProviders.set('adblockmihomo', {
      ...ruleProviderCommon,
      behavior: 'domain',
      format: 'mrs',
      url: 'https://github.com/217heidai/adblockfilters/raw/refs/heads/main/rules/adblockmihomo.mrs',
      path: './ruleset/adblockfilters/adblockmihomo.mrs',
    });
  }

  // 苹果服务
  if (ruleOptions.apple) {
    rules.push('GEOSITE,apple-cn,DIRECT');
  }

  // 谷歌服务
  if (ruleOptions.google) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,google,${group}`);
    });
  }

  // Github
  if (ruleOptions.github) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,github,${group}`);
    });
  }

  // 微软服务
  if (ruleOptions.microsoft) {
    proxyGroups.forEach(group => {
      rules.push(`GEOSITE,microsoft@cn,DIRECT`, `GEOSITE,microsoft,${group}`);
    });
  }

  // 日本网站
  if (ruleOptions.japan) {
    proxyGroups.forEach(group => {
      rules.push(`RULE-SET,category-bank-jp,${group}`, `GEOIP,jp,${group},no-resolve`);
    });
    ruleProviders.set('category-bank-jp', {
      ...ruleProviderCommon,
      behavior: 'domain',
      format: 'mrs',
      url: 'https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/category-bank-jp.mrs',
      path: './ruleset/MetaCubeX/category-bank-jp.mrs',
    });
  }

  // 后置规则（为所有分组添加通用规则）
  rules.push(
    // Loyalsoldier 规则集
    "RULE-SET,private,DIRECT",
    "RULE-SET,reject,REJECT",
    "RULE-SET,icloud,DIRECT",
    "RULE-SET,apple,DIRECT",
    ...proxyGroups.map(group => `RULE-SET,YouTube,${group}`),
    ...proxyGroups.map(group => `RULE-SET,Netflix,${group}`),
    ...proxyGroups.map(group => `RULE-SET,Spotify,${group}`),
    // ...proxyGroups.map(group => `RULE-SET,BilibiliHMT,${group}`), // 修改：注释掉，禁用Bilibili海外内容代理
    ...proxyGroups.map(group => `RULE-SET,google,${group}`),
    ...proxyGroups.map(group => `RULE-SET,proxy,${group}`),
    ...proxyGroups.map(group => `RULE-SET,gfw,${group}`),
    ...proxyGroups.map(group => `RULE-SET,tld-not-cn,${group}`),
    "RULE-SET,direct,DIRECT",
    "RULE-SET,lancidr,DIRECT,no-resolve",
    "RULE-SET,cncidr,DIRECT,no-resolve",
    ...proxyGroups.map(group => `RULE-SET,telegramcidr,${group},no-resolve`),
    // 其他
    'GEOSITE,private,DIRECT',
    'GEOIP,private,DIRECT,no-resolve',
    'GEOSITE,cn,DIRECT', // 捕获所有bilibili域名，包括intl
    'GEOIP,cn,DIRECT,no-resolve',
    // 自定义规则
    ...proxyGroups.map(group => `DOMAIN-SUFFIX,cloudflare.com,${group}`),
    ...proxyGroups.map(group => `DOMAIN-SUFFIX,googleapis.cn,${group}`),
    ...proxyGroups.map(group => `DOMAIN-SUFFIX,gstatic.com,${group}`),
    ...proxyGroups.map(group => `DOMAIN-SUFFIX,xn--ngstr-lra8j.com,${group}`),
    ...proxyGroups.map(group => `DOMAIN-SUFFIX,github.io,${group}`),
    ...proxyGroups.map(group => `DOMAIN,v2rayse.com,${group}`),
    ...proxyGroups.map(group => `MATCH,${group}`)
  );

  // 覆盖规则和规则提供者
  config["rule-providers"] = Object.fromEntries(ruleProviders);
  config["rules"] = rules;

  // UDP 启用
  config["proxies"].forEach(proxy => {
    proxy.udp = true;
  });

  // 返回修改后的配置
  return config;
}
