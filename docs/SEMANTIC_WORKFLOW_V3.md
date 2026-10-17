# 开源能力配置与《西西弗斯》V3 极简语义动画

## 研究结论
- **Motion Canvas** ([motion-canvas/motion-canvas](https://github.com/motion-canvas/motion-canvas)): MIT 开源 TypeScript/generator 引擎，专为信息解释型矢量动画设计，拥有音频同步编辑器。引擎本身很合适，但迁移现成 Remotion 音频管道对本次不划算。
- **Remotion 官方 motion graphics Skills** ([remotion-dev/skills](https://github.com/remotion-dev/skills)) 及官方 [template-prompt-to-motion-graphics-saas](https://github.com/remotion-dev/template-prompt-to-motion-graphics-saas)：现成 best-practices、spring physics、sequencing、transitions、captions、social-media 规范。适合直接配置在本仓库的 Remotion 生产线中。**本项目采用其思路，并维护最小本地适配 Skill，不冒充官方项目的复制品。**
- **HyperFrames / GSAP** ([heygen-com/hyperframes](https://github.com/heygen-com/hyperframes))：寻址每一帧、可作为另一种渲染后端；本次动画的瓶颈不在渲染器，故保持 Remotion。

## 配置（已进入仓库，可在每次视频生产前加载）
- `.agents/skills/semantic-motion-director/SKILL.md`：为后续 agent 定义每句对白对应一个有明确动词/物体/起止状态的场景与审核义务。
- `content/sisyphus_v3.json`：14 场按旁白逐句对应的执行合同和验收条件。
- `src/SisyphusV3.tsx`：没有需要复杂画工的人物 anatomy；仅用圆、线、点、火柴人和简单几何关系表现运动。
- `.github/workflows/sisyphus_v3.yml`：云端 TTS、音乐、视频编码和逐句/高密度动作段抽帧；仅当从**真实 MP4 解码**检查通过才上传产物。
- `scripts/sisyphus_v3_qc.py`：同一镜头至少抽取开始/中点/尾端3帧（共42张）；转场重要动作另外抽32张；14场一览和4条动作帧带、自动检测“动了没有”，但不把自动指标叫做美术验收。

## 不改变的论点
加缪的荒诞英雄：石头总会滚下、世界没有对意义的保证，英雄性不是获得胜利，而是清醒后仍做出自己的选择。绝不将其改写为“努力就能成功”。人物不是希腊神话里的字面巨人；比喻图形可夸张。

## 分镜阶段性验证门槛
1. 验证角色和球的轨迹（18–24s）、命运轮回（57–64s）、走出下一步（64–71s）、再次推石（78–85s）、最终未登顶（85–90s）。
2. 逐句默片阅读图像：遮住底部字幕能否看懂动词？
3. 检查场景中是否有无意义的标题卡/缓慢平移混充叙事。
4. 验证音频、字幕、场景在统一时间戳，不人为歪曲概念。
5. 只有在实际 MP4 抽帧审查与修复后，才在 GitHub Releases 公开独立可下载的永久 MP4。