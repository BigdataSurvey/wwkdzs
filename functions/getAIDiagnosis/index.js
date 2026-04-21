const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const { qaRecord, industryName = '餐饮' } = event;

  // 1. 设置 AI 的人设（System Prompt）
  const systemPrompt = `你是一位专注${industryName}行业10年的创业顾问，风格辛辣、一针见血，专门帮老板排雷。`;
  
  // 2. 构造对话报文
  const userContent = `用户在《${industryName}开店体检》中的表现如下：\n\n${qaRecord}\n\n请以此生成一份简短但极具洞察力的诊断。要求：1. 指出最致命的一个点；2. 给出两个具体的破局动作；3. 总字数控制在150字内；4. 纯文本输出，不要包含Markdown符号。`;

  const postData = JSON.stringify({
    model: "qwen-plus",
    input: {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ]
    },
    parameters: {
      result_format: "message"
    }
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'dashscope.aliyuncs.com',
      port: 443,
      path: '/api/v1/services/aigc/text-generation/generation',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk-0d36e2a6380e444b9c4a491acfc05570',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.output && parsed.output.choices) {
            resolve({ code: 0, content: parsed.output.choices[0].message.content });
          } else {
            resolve({ code: -1, msg: 'AI 返回异常', raw: parsed });
          }
        } catch (e) {
          resolve({ code: -1, msg: '解析失败', raw: body });
        }
      });
    });

    req.on('error', (e) => resolve({ code: -1, msg: e.message }));
    req.write(postData);
    req.end();
  });
};