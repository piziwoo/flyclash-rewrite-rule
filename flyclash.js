// 规则集通用配置
const ruleProviderCommon = {
  "interval": 86400,
  "proxy": "DIRECT",
  "type": "http",
  "format": "mrs",
};

// 1. 排除所有杂项/管理/通知信息（官网、流量剩余、客服等）
const EX_INFO = [
  "(?i)群|邀请|返利|循环|建议|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入",
  "可用|剩余|(\\b(USE|USED|TOTAL|Traffic|Expire|EMAIL|Panel|Channel|Author)\\b|\\d{4}-\\d{2}-\\d{2}|\\d+G)"
].join('|');

// 2. 排除所有高倍率标识
const EX_RATE = [
  "高倍|高倍率|倍率[2-9]",
  "x[2-9]\\.?\\d*",
  "\\([xX][2-9]\\.?\\d*\\)",
  "\\[[xX][2-9]\\.?\\d*\\]",
  "\\{[xX][2-9]\\.?\\d*\\}",
  "（[xX][2-9]\\.?\\d*）",
  "【[xX][2-9]\\.?\\d*】",
  "【[2-9]x】",
  "【\\d+[xX]】"
].join('|');

// 3. 组合最终排除字符串
const EX_ALL = `${EX_INFO}|${EX_RATE}`;

// 策略组通用配置
const groupBaseOption = {
  "interval": 300,
  "url": "https://www.gstatic.com/generate_204",
  "lazy": true,
  "tolerance": 60,
  "timeout": 5000,
  "max-failed-times": 5,
  "include-all": true,
  "filter": ""
};

// 国内DNS服务器 (DoH)
const domesticNameservers = [
  "quic://dns.alidns.com",
  "https://doh.pub/dns-query",
  "quic://dns.18bit.cn"
];

// 国外 DNS 服务器
const foreignNameservers = [
  "quic://dns.adguard-dns.com",
  "https://cloudflare-dns.com/dns-query#h3=true",
  "https://8.8.8.8/dns-query"
];

// 默认明文 DNS
const defaultNameservers = ["223.5.5.5", "119.29.29.29"];

// ========== 主函数 ==========
const main = (config) => {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount = Object.keys(config?.["proxy-providers"] ?? {}).length;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  // 基础设置
  config["mixed-port"] = 7890;
  config["tcp-concurrent"] = true;
  config["allow-lan"] = true;
  config["ipv6"] = true;
  config["log-level"] = "info";
  config["unified-delay"] = true;
  config["find-process-mode"] = "always";
  config["global-client-fingerprint"] = "chrome";

  // ========== DNS 配置（已彻底解决淘宝问题）==========
  config["dns"] = {
    "enable": true,
    "listen": "0.0.0.0:1053",
    "respect-rules": true,
    "prefer-h3": false,
    "ipv6": true,
    "cache-algorithm": "arc",
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-range6": "fdfe:dcba:9876::/64",
    "fake-ip-filter": [
      // ========== 阿里系全家桶（彻底解决淘宝/支付宝/高德/钉钉/优酷）==========
      "+.taobao.com",
      "+.taobao.net",
      "+.tmall.com",
      "+.tmall.hk",
      "+.alibaba.com",
      "+.alibaba-inc.com",
      "+.alipay.com",
      "+.alipayobjects.com",
      "+.alipayobjects.net",
      "+.alipaydns.com",
      "+.alicdn.com",
      "+.alimama.com",
      "+.1688.com",
      "+.amap.com",
      "+.gaode.com",
      "+.dingtalk.com",
      "+.dingtalkapps.com",
      "+.youku.com",
      "+.tudou.com",
      "+.ykimg.com",
      "+.lazada.com",

      // ========== 其他国内常用服务白名单 ==========
      "+.bilibili.com",
      "+.bilivideo.com",
      "+.hdslb.com",
      "+.biliapi.net",
      "+.mi.com",
      "+.xiaomi.com",
      "+.xiaomi.net",
      "+.miui.com",
      "+.apple.com",
      "+.apple.com.cn",
      "+.icloud.com",
      "+.mzstatic.com",
      "+.crashlytics.com",
      "+.lanzou.com",
      "+.lanzoui.com",
      "+.lanzoux.com",

      // 原有内容
      "dns.alidns.com",
      "dns.google",
      "cloudflare-dns.com",
      "dns.18bit.cn",
      "dns.ipv4dns.com",
      "RULE-SET:Fakeip_Filter",
      "RULE-SET:CN",
      "RULE-SET:Private"
    ],
    "default-nameserver": [...defaultNameservers],
    "nameserver": [...foreignNameservers],
    "proxy-server-nameserver": [...defaultNameservers],
    "direct-nameserver": [...defaultNameservers],
    "direct-nameserver-follow-policy": true,
    "nameserver-policy": {
      "geosite:cn": [...domesticNameservers]
    }
  };

  // geodata & sniffer
  config["geodata-mode"] = true;
  config["geox-url"] = {
    "geoip": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat",
    "geosite": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat",
    "mmdb": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/country.mmdb",
    "asn": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb"
  };

  config["sniffer"] = {
    "enable": true,
    "parse-pure-ip": true,
    "sniff": {
      "TLS": { "ports": ["443", "8443"] },
      "HTTP": { "ports": ["80", "8080-8880"], "override-destination": true },
      "QUIC": { "ports": ["443", "8443"] }
    },
    "force-domain": ["+.v2ex.com", "+.bilibili.com", "+.mi.com"],
    "skip-domain": ["Mijia.Cloud.com", "router.asus.com", "time.apple.com"]
  ]
  };

  // TUN 配置
  config["tun"] = {
    "enable": true,
    "stack": "mixed",
    "auto-route": true,
    "auto-detect-interface": true,
    "dns-hijack": ["any:53", "tcp://any:53"],
    "device": "meta",              // 改成 meta 更稳（避免小米手机冲突）
    "mtu": 1500,
    "strict-route": true,
    "udp-timeout": 300,
    "endpoint-independent-nat": false
  };

  // 公共节点列表
  const baseProxies = ["节点选择", "香港节点", "台湾节点", "日本节点", "新加坡节点", "美国节点", "全部节点", "负载均衡", "自动选择", "自动回退", "DIRECT"];
  const baseProxiesCN = ["DIRECT", "节点选择", "香港节点", "台湾节点", "澳门节点", "全部节点", "负载均衡", "自动选择", "自动回退"];

  // 工厂函数：生成策略组
  function createGroups(groups) {
    return groups.map(g => {
      let [name, icon, type = "select", proxiesOrExtra = baseProxies, extra = {}] = g;
      if (typeof type !== "string") { extra = proxiesOrExtra; proxiesOrExtra = type; type = "select"; }
      let proxies = Array.isArray(proxiesOrExtra) ? proxiesOrExtra : (proxiesOrExtra === true ? baseProxiesCN : baseProxies);
      if (proxiesOrExtra && typeof proxiesOrExtra === "object" && !Array.isArray(proxiesOrExtra)) {
        proxies = proxiesOrExtra.proxies || proxies;
        extra = { ...proxiesOrExtra, ...extra };
        delete extra.proxies;
      }
      const cfg = { ...groupBaseOption, name, type, icon, proxies, ...extra };
      if (!cfg["exclude-filter"]) cfg["exclude-filter"] = EX_INFO;
      return cfg;
    });
  }

  // 地区分组工厂
  function createRegionGroups({ name, icon, filter }) {
    const sub = ["自动", "回退", "均衡"];
    const proxies = sub.map(s => `${name}${s}`);
    return [
      { ...groupBaseOption, name: `${name}节点`, type: "select", proxies, filter, icon },
      { ...groupBaseOption, name: `${name}自动`, type: "url-test", hidden: true, filter, "exclude-filter": EX_ALL, icon },
      { ...groupBaseOption, name: `${name}回退`, type: "fallback", hidden: true, filter, "exclude-filter": EX_INFO, icon },
      { ...groupBaseOption, name: `${name}均衡`, type: "load-balance", hidden: true, filter, "exclude-filter": EX_ALL, icon }
    ];
  }

  // 手动顶级组
  const manualGroups = [
    { ...groupBaseOption, name: "Final", type: "select", proxies: ["节点选择", "DIRECT"], icon: "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png" },
    { ...groupBaseOption, name: "节点选择", type: "select", proxies: ["自动选择", "自动回退", "全部节点", "负载均衡", "香港节点", "台湾节点", "日本节点", "新加坡节点", "美国节点", "DIRECT"], icon: "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Rocket.png" },
    { ...groupBaseOption, name: "全部节点", type: "select", include-all: true, "exclude-filter": EX_INFO, icon: "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Airport.png" },
    { ...groupBaseOption, name: "自动选择", type: "url-test", include-all: true, hidden: true, "exclude-filter": EX_ALL, tolerance: 50, icon: "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Airport.png" },
    { ...groupBaseOption, name: "自动回退", type: "fallback", include-all: true, hidden: true, "exclude-filter": EX_INFO, icon: "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Airport.png" },
    { ...groupBaseOption, name: "负载均衡", type: "load-balance", include-all: true, hidden: true, "exclude-filter": EX_ALL, icon: "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Airport.png" }
  ];

  // 地区分组
  const regionGroups = [
    ...createRegionGroups({ name: "香港", icon: "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png", filter: "(?i)🇭🇰|香港|(\\b(HK|Hong|HongKong)\\b)" }),
    ...createRegionGroups({ name: "台湾", icon: "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/China.png", filter: "(?i)🇨🇳|🇹🇼|台湾|(\\b(TW|Tai|Taiwan)\\b)" }),
    ...createRegionGroups({ name: "日本", icon: "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png", filter: "(?i)🇯🇵|日本|东京|(\\b(JP|Japan)\\b)" }),
    ...createRegionGroups({ name: "新加坡", icon: "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png", filter: "(?i)🇸🇬|新加坡|狮|(\\b(SG|Singapore)\\b)" }),
    ...createRegionGroups({ name: "美国", icon: "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png", filter: "(?i)🇺🇸|美国|洛杉矶|圣何塞|(\\b(US|United States|America)\\b)" })
  ];

  // 社交&国内分组（可继续按需添加）
  const socialGroups = createGroups([]);
  const cnAppGroups = createGroups([]);

  // 合并所有策略组
  config["proxy-groups"] = [...manualGroups, ...socialGroups, ...cnAppGroups, ...regionGroups];

  // 规则集
  config["rule-providers"] = {
    "CN": { ...ruleProviderCommon, behavior: "domain", url: "https://cdn.jsdmirror.com/gh/Kwisma/clash-rules@release/direct.mrs", path: "./ruleset/CN_Domain.mrs" },
    "Private": { ...ruleProviderCommon, behavior: "domain", url: "https://cdn.jsdmirror.com/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/private.mrs", path: "./ruleset/Private_Domain.mrs" },
    "Fakeip_Filter": { ...ruleProviderCommon, behavior: "domain", url: "https://cdn.jsdmirror.com/gh/DustinWin/ruleset_geodata@mihomo-ruleset/fakeip-filter.mrs", path: "./ruleset/Fakeip_Filter_Domain.mrs" },
    "awavenue": { ...ruleProviderCommon, behavior: "domain", url: "https://cdn.jsdmirror.com/gh/TG-Twilight/AWAvenue-Ads-Rule@main/Filters/AWAvenue-Ads-Rule-Clash.mrs", path: "./ruleset/awavenue.mrs" },
    "Private-ip": { ...ruleProviderCommon, behavior: "ipcidr", url: "https://cdn.jsdmirror.com/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/private.mrs", path: "./ruleset/Private_IP.mrs" },
    "CN-ip": { ...ruleProviderCommon, behavior: "ipcidr", url: "https://cdn.jsdmirror.com/gh/Kwisma/clash-rules@release/cncidr.mrs", path: "./ruleset/CN_IP.mrs" },
    "STUN": { ...ruleProviderCommon, behavior: "domain", url: "https://cdn.jsdmirror.com/gh/Kwisma/rules@main/rules/mihomo/STUN/STUN_Domain.mrs", path: "./ruleset/STUN_Domain.mrs" }
  };

  // 规则
  config["rules"] = [
    "SUB-RULE,(OR,((NETWORK,UDP),(NETWORK,TCP))),SUB-REJECT",
    "SUB-RULE,(OR,((NETWORK,UDP),(NETWORK,TCP))),SUB-LAN",
    "SUB-RULE,(OR,((NETWORK,UDP),(NETWORK,TCP))),SUB-DIRECT",
    "MATCH,Final"
  ];
  config["sub-rules"] = {
    "SUB-REJECT": ["RULE-SET,awavenue,REJECT-DROP", "RULE-SET,STUN,REJECT-DROP"],
    "SUB-LAN": ["RULE-SET,Private,DIRECT", "RULE-SET,Private-ip,DIRECT,no-resolve"],
    "SUB-DIRECT": ["RULE-SET,CN,DIRECT", "RULE-SET,CN-ip,DIRECT,no-resolve", "RULE-SET,Fakeip_Filter,DIRECT"]
  };

  return config;
};
