# Opus 5.5 动画实现方式复盘：不能把问题归咎于 Python

日期：2026-10-17。本文件是基于公开源码的技术复盘，不是宣称所有 Opus 成片使用同一种引擎。

## 查证过的实现方案（可复核）

1. JohnHeibel/ClaudeAnimationBase：p5.js + p5.brush + JavaScript；预先设计角色不同朝向、表情、动作；无头 Chrome 逐帧渲染；对运动关键片段连续抽帧而不是只取起终两帧。https://github.com/JohnHeibel/ClaudeAnimationBase
2. heygen-com/hyperframes：HTML + GSAP（paused seekable timeline）+ Chrome BeginFrame + FFmpeg；可在画面层混合 Three.js、Lottie、WebGL、真实素材。HyperFrames 是确定性渲染器，不会自动创作镜头或让低质量资源变专业。https://github.com/heygen-com/hyperframes
3. VisualxIntelligence/motion-tools-and-skills 的 SOURCES.md：十个实仓涵盖 2D p5 绘画、Three.js/WebGPU、Blender/Unreal、Remotion、混合素材制作。不能简单说「Opus的视频不是 Python」。https://github.com/VisualxIntelligence/motion-tools-and-skills/blob/main/SOURCES.md
4. bilaldemirerr/opus-video-recipes：提供真视频及实际代码，有 Remotion 路线也有 HyperFrames 路线。https://github.com/bilaldemirerr/opus-video-recipes

## 对本库 V2 的准确诊断

本库画面是 src/SisyphusV2.tsx：React + TypeScript + SVG + Remotion。Python 出现在 scripts/sisyphus_audio.py（配音、音乐）和 scripts/sisyphus_v2_qc.py（音画格式与帧像素差），**不是画面运动引擎**。

1. 人物无真正的骨骼绑定/IK/走路动画；固定 SVG 路径构成四肢，只能在外层平移、缩放或有限形变，不能保证有力学意义的姿势。
2. 石头是多面路径拼成的 SVG 圆形；没有可信体积材质、物理交互、透视、复杂光影。
3. 复杂镜头的戏剧编排（情绪微动作、不同景别、镜头轴线、节奏）依然稀少；「14个分镜」只是分类，不等于14个充分设计、执行精确的动作镜头。
4. 原先检查的是 MP4 是否有画面变化以及字幕时间戳，不是动作是否物理正确、主次关系是否明确。V2 虽改进叙事构图，也远不是充分审查的专业动画。
5. 即便引擎相同，高质量 Opus 示例往往具备成熟角色基建/图形系统、角色 model sheets、素材、更多开发时间、连续审查和高强度模型推理；不能把效果差全归因于主模型。

## 已执行的对照实验

在 experiments/opus-method 中独立实现一段 **6s / 720×1280 / 30 FPS** 三维动作：
- 完全不用 Python 绘制画面；
- 使用 HTML + Three.js + GSAP + HyperFrames + FFmpeg；
- 手部与巨石的接触点来自同一 world-state；石头底部紧贴参数化坡面；脚部 y 随坡面约束；3.25s 切换推石到松手/坠落；
- 181帧状态断言以及实际渲染帧检查；
- 首次成功 Actions run 38954172935，已经实际观察 12 张分镜抽帧。

**结论：更换 JS/3D 工具链没有神奇解决问题。** 首次实测：圆柱四肢 + 球形关节仍然像简陋人偶，运动周期没有真实走步（脚滑），石头与地面在透视构图中的视觉接触仍不够可信，角色缺少演出。比 SVG 增加了真实三维光照、体积和相机，但不是用户描述的 Opus 成片效果。后续补强手部接触的严格半径约束，并触发回归工作流。

## 推荐的新动画制作线路

**针对西西弗斯这类「英雄的身体与巨石发生复杂交互」的电影叙事：**

- 主角色：商业授权兼容的 skinned GLB/FBX 人物模型；Blender Rigify 或类似骨骼 + 走路/用力表演动作片段；IK 约束双脚、手掌接触点；动作叠加表情和身体重心。
- 巨石：真正的 3D 扫描/雕刻模型 + PBR 材质；碰撞与滚动计算共享坐标系，不能只凭眼睛编辑两个独立的位移。
- 空间场景：Blender 或 Three.js 的三维岩坡、雾、体积光；有目的的机位、焦段、近中远景切换。
- 2D 科普符号镜头：仍由 Remotion/SVG 或 HTML/GSAP 驱动，保留科学公式、字幕与信息排版的优势。
- 最终合成：FFmpeg/Remotion/HyperFrames 均可。优先保留已经正常工作的 Remotion + FFmpeg，不为「不用 Python」而重新造轮子。
- 测试门槛：先制作最难的 6–10 秒动作镜头并验收角色、手、足、石的物理空间关系和视觉演出；然后制作 90s 完整 animatic；最后生产全片。先过样片门槛再扩大时长。
- QC：数据断言 + 每条旁白画面首中末帧 + 高密度过渡帧带 + **逐镜叙事语义人工验收**（不能只靠像素差）。
- 主模型 A/B：在同一批已授权资产、同样时间/Token、相同导演 brief 和 QC 规则下，分别让模型制作同一段 8s 样片，再评价「模型差距」。否则无法得出科学结论。

## 适用域

- 3D 人物神话/动作片：Blender + Three.js/WebGL 或 Blender 渲染器优先。
- 手绘故事动画：p5.js + p5.brush + model sheets + 逐帧抽帧。
- 数学/数据/无角色科普：Remotion、Canvas、SVG、Manim；Python 也完全可以优秀。
- UI MG/广告宣传：HyperFrames + GSAP 和 Remotion 都合适。

判据不是语言，而是角色是否能表演、物体是否共享物理状态、镜头是否传达信息，以及模型是否看过真实渲染结果并修正。
