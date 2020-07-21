# 关于安装包的病毒检测

病毒检测工具：[VirusTotal](https://www.virustotal.com/gui/home/upload)
（*该地址可直接用于上传文件并检测病毒。*）

### [VirusTotal 简介](https://support.virustotal.com/hc/en-us/articles/115002126889-How-it-works)
VirusTotal 是一个免费的病毒、蠕虫、木马和各种恶意软件分析服务，可以针对可疑文件和网址进行快速检测。它与传统杀毒软件的不同之处是它通过多种（目前已达 70 种）杀毒引擎扫描文件。使用多种反病毒引擎可以令用户们通过各杀毒引擎的侦测结果，判断上传的文件是否为恶意软件。

### 病毒检测方案

可能的方案：在安装包打包已完成，但正式上传/发布之前先做病毒检测。

至于具体如何操作，基于项目的部署/发布流程增加脚本即可（推荐使用 gulp）。

### 病毒检测流程

1. 发起请求前需在 VirusTotal 注册账号，并获取账号的 virusAPIKey。

2. 请求 API https://www.virustotal.com/api/v3/files/upload_url 获取上传地址（安装包大于 32M，不能直接上传，必须先获取一个上传地址）。

3. 获取上传地址后将文件上传，上传完成后其返回结果为 analyseId。

4. 使用此 analyseId 请求 https://www.virustotal.com/api/v3/analyses/:analyseId 即可获取分析结果。

5. 或在文件上传完成后使用文件 hash 访问地址：
https://www.virustotal.com/gui/file/${fileHash}/detection 可获取可视化结果。
