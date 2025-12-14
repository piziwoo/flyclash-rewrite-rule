#简单配置
mixed-port: 7890
ipv6: false
mode: Rule
allow-lan: false
bind-address: "*"
disable-keep-alive: true
unified-delay: true
tcp-concurrent: true
log-level: silent
find-process-mode: strict
global-client-fingerprint: random
external-controller: 127.0.0.1:9090
external-controller-cors:
  allow-origins:
    - "*"
  allow-private-network: true

dns:
  enable: true
  ipv6: false
  listen: 0.0.0.0:1053
  prefer-h3: false
  respect-rules: true
  cache-algorithm: arc
  cache-size: 2048
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - "*"
    - "+.lan"
    - "+.local"
    - "time.*.com"
    - "ntp.*.com"
    - "RULE-SET:Private_Domain"
  default-nameserver:
    - 223.5.5.5
    - 119.29.29.29
    - 223.6.6.6
  direct-nameserver:
    - https://dns.alidns.com/dns-query
    - https://doh.pub/dns-query
  proxy-server-nameserver:
    - https://dns.alidns.com/dns-query
    - https://doh.pub/dns-query
  nameserver:
    - https://dns.google/dns-query
    - https://cloudflare-dns.com/dns-query

proxy-groups:

  # 主开关，手动选择地区
  - name: PROXY
    icon: "https://cdn.jsdelivr.net/gh/GitMetaio/Surfing@rm/Home/icon/All.svg"
    type: select
    include-all: true
    proxies:
      - 香港
      - 新加坡
      - 台湾
      - 日本
      - 美国
      - 其他

  # 以下各地区组：自动测速 + 自动选最佳节点
  - name: 香港
    icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    include-all: true
    filter: (?i)港|HK|hk|Hong Kong|HongKong|hongkong

  - name: 新加坡
    icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    include-all: true
    filter: (?i)新加坡|坡|狮城|SG|Singapore

  - name: 台湾
    icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Taiwan.png"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    include-all: true
    filter: (?i)台|新北|彰化|TW|Taiwan

  - name: 日本
    icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    include-all: true
    filter: (?i)日本|川日|东京|大阪|泉日|埼玉|沪日|深日|[^-]日|JP|Japan

  - name: 美国
    icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    include-all: true
    filter: (?i)美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States|UnitedStates

  - name: 其他
    icon: "https://cdn.jsdelivr.net/gh/GitMetaio/Surfing@rm/Home/icon/Globe.svg"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    include-all: true
    exclude-filter: (?i)港|HK|hk|Hong Kong|HongKong|hongkong|日本|川日|东京|大阪|泉日|埼玉|沪日|深日|[^-]日|JP|Japan|美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States|UnitedStates|台|新北|彰化|TW|Taiwan|新加坡|坡|狮城|SG|Singapore|灾|网易|Netease|套餐|重置|剩余|到期|订阅|群|账户|流量|有效期|时间|官网

rule-anchor:
  Classical: &Classical
    {type: http, behavior: classical, format: text, interval: 86400}
  YAML: &YAML
    {type: http, behavior: classical, format: yaml, interval: 86400}
  IPCIDR: &IPCIDR
    {type: http, behavior: ipcidr, format: mrs, interval: 86400}
  Domain: &Domain
    {type: http, behavior: domain, format: mrs, interval: 86400}

rule-providers:

#防泄漏
  WebRTC:
    <<: *Classical
    path: ./rules/WebRTC.list
    url: "https://cdn.jsdelivr.net/gh/GitMetaio/Surfing@rm/Home/rules/WebRTC.list"

#私有/内网
  Private_Domain:
    <<: *Domain
    path: ./rules/LAN_Domain.mrs
    url: "https://github.com/GitMetaio/rule/raw/refs/heads/master/rule/Clash/Lan/Lan_OCD_Domain.mrs"
  Private_IP:
    <<: *IPCIDR
    path: ./rules/LAN_IP.mrs
    url: "https://github.com/GitMetaio/rule/raw/refs/heads/master/rule/Clash/Lan/Lan_OCD_IP.mrs"

#代理规则
  Global_Domain:
    <<: *Domain
    path: ./rules/Global_OCD_Domain.mrs
    url: "https://cdn.jsdelivr.net/gh/GitMetaio/rule@master/rule/Clash/Global/Global_OCD_Domain.mrs"
  Global_IP:
    <<: *IPCIDR
    path: ./rules/Global_OCD_IP.mrs
    url: "https://cdn.jsdelivr.net/gh/GitMetaio/rule@master/rule/Clash/Global/Global_OCD_IP.mrs"

#去广告
  AWAvenue_Ads_Rule:
    <<: *YAML
    path: ./ruleset/AWAvenue_Ads_Rule_Clash.yaml
    url: "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Clash.yaml"

rules:
  - DST-PORT,53,DIRECT
  - DST-PORT,853,DIRECT
  - RULE-SET,WebRTC,REJECT
  - RULE-SET,AWAvenue_Ads_Rule,REJECT
  - RULE-SET,Private_Domain,DIRECT
  - RULE-SET,Private_IP,DIRECT
  - RULE-SET,Global_Domain,PROXY
  - RULE-SET,Global_IP,PROXY
  - MATCH,DIRECT
