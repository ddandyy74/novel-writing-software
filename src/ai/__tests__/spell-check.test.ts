/**
 * AI 功能测试示例
 */

import { checkSpelling, batchCheckSpelling } from '../spell-check';
import { generateOutline, outlineToMarkdown } from '../outline-gen';
import { generateCover } from '../cover-gen';

// ============= 错别字检测测试 =============

async function testSpellCheck() {
  console.log('=== 测试错别字检测 ===\n');

  const text = `
    他来到这个城市已经三年了，从一个小镇青年变成了一个成功的的企业家。
    他的公司在行业内做的风生水起，虽然过程中经历了许多波折，但他始终坚持自己的信念。
    今天，他站在公司大楼的顶层，俯瞰着这座繁华的都市，心中感慨万千。
    三年前的那个晚上，他拖着行李箱来到这里，身无分文，只有一腔热血。
    如今，他己经实现了当初的梦想，但他知道，这只是开始。
  `;

  try {
    // 使用本地模型检测
    console.log('1. 本地模型检测：');
    const localResult = await checkSpelling(text, { useLocal: true });
    console.log(`处理时间: ${localResult.processingTime}ms`);
    console.log(`检测到 ${localResult.errors.length} 个错误：`);
    localResult.errors.forEach((error) => {
      console.log(
        `  - 位置 ${error.position}: "${error.original}" → "${error.suggestion}" (${error.type})`,
      );
    });

    // 使用云端 API 检测（需要配置 API Key）
    console.log('\n2. 云端 API 检测：');
    // const cloudResult = await checkSpelling(text, {
    //   openaiApiKey: process.env.OPENAI_API_KEY,
    // });
    // console.log(`处理时间: ${cloudResult.processingTime}ms`);
    // console.log(`检测到 ${cloudResult.errors.length} 个错误：`);
    // cloudResult.errors.forEach(error => {
    //   console.log(`  - 位置 ${error.position}: "${error.original}" → "${error.suggestion}" (${error.type})`);
    // });
  } catch (error) {
    console.error('错误:', error);
  }
}

// ============= 大纲生成测试 =============

async function testOutlineGeneration() {
  console.log('\n=== 测试大纲生成 ===\n');

  const chapterContent = `
    第一章 风起云涌

    凌晨三点，李明从噩梦中惊醒，满头大汗。

    他做了一个奇怪的梦，梦见自己站在一座破败的古庙前，庙门上挂着一块斑驳的牌匾，上面依稀可见"天机阁"三个字。

    正当他想推开庙门时，一个苍老的声音在他耳边响起："天机已现，劫数难逃。"

    李明摇了摇头，试图甩掉这个奇怪的梦境。他起身走到窗前，看着窗外的城市夜景，灯火阑珊。

    就在这时，他的手机响了。是一个陌生号码。

    "喂，你好？"

    "李明先生，我是天机阁的守阁人。你被选中了。"

    李明愣住了，这个声音，和梦中的声音一模一样！

    电话那头继续说道："今晚十二点，城郊的天机阁见。记住，这是一个改变命运的机会，也是一个危险的开始。"

    电话挂断了。李明握着手机，心跳加速。

    他看了一眼时间，现在是凌晨三点十五分。距离十二点，还有将近二十一个小时。

    他决定去看看，不管这是不是一个恶作剧。
  `;

  try {
    // 生成大纲（需要配置 API Key）
    console.log('生成章节大纲...');
    // const result = await generateOutline(
    //   {
    //     workId: 'work-001',
    //     chapterId: 'chapter-001',
    //     chapterTitle: '风起云涌',
    //     chapterContent,
    //   },
    //   {
    //     anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    //   }
    // );

    // console.log('生成的大纲（JSON）：');
    // console.log(JSON.stringify(result.outline, null, 2));

    // console.log('\n生成的大纲（Markdown）：');
    // console.log(outlineToMarkdown(result.outline));
  } catch (error) {
    console.error('错误:', error);
  }
}

// ============= 封面生成测试 =============

async function testCoverGeneration() {
  console.log('\n=== 测试封面生成 ===\n');

  try {
    // 生成封面（需要配置 API Key）
    console.log('生成玄幻风格封面...');
    // const result = await generateCover(
    //   {
    //     workId: 'work-001',
    //     workTitle: '天机阁',
    //     author: '李明',
    //     genre: '玄幻',
    //     style: '玄幻',
    //     tags: ['修仙', '神秘', '古风'],
    //     description: '一个普通的都市青年，意外卷入修仙世界的纷争，从此踏上了逆天改命的道路。',
    //     options: {
    //       samples: 2,
    //     },
    //   },
    //   {
    //     stabilityApiKey: process.env.STABILITY_API_KEY,
    //   }
    // );

    // console.log(`生成时间: ${result.processingTime}ms`);
    // console.log(`生成了 ${result.images.length} 张封面：`);
    // result.images.forEach((img, i) => {
    //   console.log(`  ${i + 1}. ${img.versionId} (${img.width}x${img.height})`);
    // });
  } catch (error) {
    console.error('错误:', error);
  }
}

// ============= 批量检测测试 =============

async function testBatchSpellCheck() {
  console.log('\n=== 测试批量错别字检测 ===\n');

  const texts = [
    '他来到这个城市已经三年了，从一个小镇青年变成了一个成功的的企业家。',
    '他的公司在行业内做的风生水起，虽然过程中经历了许多波折。',
    '如今，他己经实现了当初的梦想，但他知道，这只是开始。',
  ];

  try {
    console.log('批量检测 3 段文本...');
    const results = await batchCheckSpelling(texts, { useLocal: true });

    results.forEach((result, i) => {
      console.log(`\n第 ${i + 1} 段文本：`);
      console.log(`  检测到 ${result.errors.length} 个错误`);
      result.errors.forEach((error) => {
        console.log(
          `  - "${error.original}" → "${error.suggestion}" (${error.type})`,
        );
      });
    });
  } catch (error) {
    console.error('错误:', error);
  }
}

// ============= 运行所有测试 =============

async function runAllTests() {
  console.log('开始测试 AI 功能...\n');

  await testSpellCheck();
  await testBatchSpellCheck();
  // await testOutlineGeneration(); // 需要配置 API Key
  // await testCoverGeneration(); // 需要配置 API Key

  console.log('\n测试完成！');
}

// 运行测试
runAllTests().catch(console.error);
