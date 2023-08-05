import ParseHTML, { parseOptions } from '../parse-html';

test('测试 ParseHTML 类, 进行切割模板', () => {
  // 标签身上带hash <div id="biliMainHeader" style="height:64px;" data-v-2d1eebe4>
  const html = `
    <p class="nav" id="nav_id" style="height:64px;">
      <span> {{ name }} </span>
      <span> hello </span>
    <p>
  `;
  const parseHtml = new ParseHTML(html.trim(), parseOptions);
  expect(parseHtml.html).toBe('');
});



