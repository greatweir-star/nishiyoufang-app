// 倪师有方 APP 核心逻辑
const app = {
  currentPage: 'home',
  diagnoseState: {},
  data: {
    fang: [],
    herbs: [],
    cases: [],
    quotes: [],
    index: null
  }
};

// 初始化轻量示例数据
function initLocalData() {
  app.data.fang = [
    { name: "麻黄汤", tags: ["太阳病", "伤寒"], desc: "无汗恶寒、体痛——寒束于表。麻黄开毛孔，桂枝解肌，杏仁降气。" },
    { name: "桂枝汤", tags: ["太阳病", "中风"], desc: "汗出恶风、脉浮缓。调和营卫，解肌发表。" },
    { name: "小柴胡汤", tags: ["少阳病"], desc: "少阳病主方。口苦、咽干、目眩、往来寒热——但见一证便是。" },
    { name: "大承气汤", tags: ["阳明病"], desc: "阳明腑实，痞满燥实俱备。峻下热结。" },
    { name: "理中汤", tags: ["太阴病"], desc: "太阴脾寒，腹痛下利。温中祛寒，补气健脾。" },
    { name: "四逆汤", tags: ["少阴病"], desc: "少阴寒化，四肢厥逆。回阳救逆。" },
    { name: "乌梅丸", tags: ["厥阴病"], desc: "厥阴病，上热下寒，蛔厥。寒热并用，安蛔止痛。" },
    { name: "白虎汤", tags: ["阳明病", "气分热"], desc: "阳明经证，大热大汗大渴。清热生津。" }
  ];

  app.data.herbs = [
    { name: "麻黄", tags: ["辛温", "发汗解表"], desc: "宣肺气，开毛孔，发汗解表，平喘止咳。" },
    { name: "桂枝", tags: ["辛甘温", "解肌发表"], desc: "发汗解肌，温通经脉，助阳化气。" },
    { name: "附子", tags: ["辛甘大热", "回阳救逆"], desc: "回阳救逆，补火助阳，散寒止痛。生附子走里，炮附子固表。" },
    { name: "干姜", tags: ["辛热", "温中散寒"], desc: "温中散寒，回阳通脉，温肺化饮。" },
    { name: "人参", tags: ["甘微苦微温", "大补元气"], desc: "大补元气，复脉固脱，补脾益肺，生津养血。" },
    { name: "甘草", tags: ["甘平", "调和诸药"], desc: "补脾益气，清热解毒，祛痰止咳，缓急止痛，调和诸药。" },
    { name: "黄芩", tags: ["苦寒", "清热燥湿"], desc: "清热燥湿，泻火解毒，止血安胎。" },
    { name: "柴胡", tags: ["苦辛微寒", "疏肝升阳"], desc: "疏散退热，疏肝解郁，升举阳气。" }
  ];

  app.data.quotes = [
    { text: "中医很简单，就是阴阳气血。你搞懂了，一通百通。", author: "倪海厦" },
    { text: "真正重要的东西，用眼睛是看不见的。", author: "《小王子》" },
    { text: "你要永远为你驯化的东西负责。", author: "《小王子》" }
  ];
}

async function loadKnowledgeIndex() {
  try {
    const res = await fetch('data/index.json');
    app.data.index = await res.json();
  } catch (e) {
    console.error('Failed to load knowledge index', e);
    app.data.index = { modules: [], cases: [] };
  }
}

// Markdown 转简单 HTML
function mdToHtml(md) {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>');
}

// 页面路由
function renderPage(page) {
  app.currentPage = page;
  const main = document.getElementById('main-content');
  main.innerHTML = '';

  switch(page) {
    case 'home': renderHome(main); break;
    case 'diagnose': renderDiagnose(main); break;
    case 'fang': renderFang(main); break;
    case 'cases': renderCases(main); break;
    case 'more': renderMore(main); break;
  }

  updateTabBar(page);
}

function updateTabBar(page) {
  document.querySelectorAll('.tab-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
}

// 首页
function renderHome(container) {
  const quote = app.data.quotes[Math.floor(Math.random() * app.data.quotes.length)];

  container.innerHTML = `
    <div class="hero-card">
      <h1>不舒服？倪师有方</h1>
      <p>把倪海厦 3.5M 字讲义、849 个医案装进手机</p>
    </div>

    <div class="search-box" onclick="goSearch()">
      <span>🔍</span>
      <input type="text" placeholder="搜症状、方剂、草药、医案…" readonly>
    </div>

    <div class="quick-grid">
      <div class="quick-item" onclick="renderPage('diagnose')">
        <div class="quick-icon">🔥</div>
        <div class="quick-label">六经辨证</div>
      </div>
      <div class="quick-item" onclick="renderPage('fang')">
        <div class="quick-icon">📜</div>
        <div class="quick-label">经方速查</div>
      </div>
      <div class="quick-item" onclick="renderPage('fang')">
        <div class="quick-icon">🌿</div>
        <div class="quick-label">本草性味</div>
      </div>
      <div class="quick-item" onclick="renderPage('cases')">
        <div class="quick-icon">📚</div>
        <div class="quick-label">医案参考</div>
      </div>
    </div>

    <div class="section-title">今日一句</div>
    <div class="quote-card">
      ${quote.text}
      <div class="author">— ${quote.author}</div>
    </div>

    <div class="section-title">热门经方</div>
    ${app.data.fang.slice(0, 3).map(f => `
      <div class="list-card" onclick="showFangDetail('${f.name}')">
        <h3>${f.name}</h3>
        <p>${f.desc}</p>
        ${f.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    `).join('')}
  `;
}

// 辨证页
function renderDiagnose(container) {
  container.innerHTML = `
    <div class="diagnose-flow">
      <h2 style="margin-bottom:16px;font-size:1.1rem">六经辨证快速问诊</h2>

      <div class="diagnose-step">
        <h3>1. 怕冷还是怕热？</h3>
        <div class="option-group">
          <button class="option-btn" onclick="selectDiagnose('thermal', '怕冷', this)">怕冷</button>
          <button class="option-btn" onclick="selectDiagnose('thermal', '怕热', this)">怕热</button>
          <button class="option-btn" onclick="selectDiagnose('thermal', '寒热往来', this)">寒热往来</button>
        </div>
      </div>

      <div class="diagnose-step">
        <h3>2. 出汗情况？</h3>
        <div class="option-group">
          <button class="option-btn" onclick="selectDiagnose('sweat', '无汗', this)">无汗</button>
          <button class="option-btn" onclick="selectDiagnose('sweat', '有汗', this)">有汗</button>
          <button class="option-btn" onclick="selectDiagnose('sweat', '盗汗', this)">盗汗</button>
        </div>
      </div>

      <div class="diagnose-step">
        <h3>3. 主要疼痛部位？</h3>
        <div class="option-group">
          <button class="option-btn" onclick="selectDiagnose('pain', '头项强痛', this)">头项强痛</button>
          <button class="option-btn" onclick="selectDiagnose('pain', '胸胁苦满', this)">胸胁苦满</button>
          <button class="option-btn" onclick="selectDiagnose('pain', '腹痛', this)">腹痛</button>
          <button class="option-btn" onclick="selectDiagnose('pain', '四肢厥冷', this)">四肢厥冷</button>
        </div>
      </div>

      <div class="diagnose-step">
        <h3>4. 二便情况？</h3>
        <div class="option-group">
          <button class="option-btn" onclick="selectDiagnose('stool', '便秘', this)">便秘</button>
          <button class="option-btn" onclick="selectDiagnose('stool', '下利清谷', this)">下利清谷</button>
          <button class="option-btn" onclick="selectDiagnose('stool', '小便不利', this)">小便不利</button>
        </div>
      </div>

      <button class="primary-btn" onclick="runDiagnose()">开始辨证</button>
      <div id="diagnose-result"></div>
    </div>
  `;
}

function selectDiagnose(key, value, el) {
  app.diagnoseState[key] = value;
  const group = el.parentElement;
  group.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
  el.classList.add('selected');
}

function runDiagnose() {
  const s = app.diagnoseState;
  let result = {};

  if (s.thermal === '怕冷' && s.sweat === '无汗' && s.pain === '头项强痛') {
    result = { name: '太阳伤寒（麻黄汤证）', desc: '寒邪束表，腠理闭塞。症见恶寒、无汗、头项强痛、体痛。治以发汗解表，宣肺平喘。', fang: '麻黄汤' };
  } else if (s.thermal === '怕冷' && s.sweat === '有汗') {
    result = { name: '太阳中风（桂枝汤证）', desc: '风邪袭表，营卫不和。症见汗出恶风、脉浮缓。治以解肌发表，调和营卫。', fang: '桂枝汤' };
  } else if (s.thermal === '寒热往来' || s.pain === '胸胁苦满') {
    result = { name: '少阳病（小柴胡汤证）', desc: '邪在少阳，半表半里。口苦、咽干、目眩、往来寒热、胸胁苦满——但见一证便是。', fang: '小柴胡汤' };
  } else if (s.thermal === '怕热' && s.stool === '便秘') {
    result = { name: '阳明腑实（承气汤证）', desc: '热邪入里，燥屎内结。腹满便结、潮热谵语。治以峻下热结。', fang: '大承气汤' };
  } else if (s.stool === '下利清谷' || s.pain === '四肢厥冷') {
    result = { name: '少阴寒化（四逆汤证）', desc: '心肾阳虚，阴寒内盛。四肢厥冷、下利清谷、脉微欲绝。急当回阳救逆。', fang: '四逆汤' };
  } else {
    result = { name: '信息不足，建议进一步辨证', desc: '请补充更多症状信息，或参考医案与经方数据库进一步判断。中医讲究四诊合参，不可仅凭单一症状定方。', fang: '' };
  }

  document.getElementById('diagnose-result').innerHTML = `
    <div class="result-box">
      <h3>${result.name}</h3>
      <p>${result.desc}</p>
      ${result.fang ? `<p style="color:var(--cinnabar)"><b>参考用方：${result.fang}</b></p>` : ''}
      <p style="font-size:0.8rem;margin-top:12px;color:#999">提示：本 APP 为学习参考工具，不能替代专业医师诊疗。</p>
    </div>
  `;
}

// 经方页
function renderFang(container) {
  container.innerHTML = `
    <div class="search-box" style="margin-bottom:12px">
      <span>🔍</span>
      <input type="text" id="fang-search" placeholder="搜索经方、本草、症状…" oninput="filterKnowledge(this.value)">
    </div>
    <div id="knowledge-list"></div>
  `;
  renderKnowledgeList('');
}

function renderKnowledgeList(keyword) {
  const list = document.getElementById('knowledge-list');
  if (!list) return;
  const kw = (keyword || '').toLowerCase();
  const idx = app.data.index || { modules: [], cases: [] };

  let items = [];
  if (!kw) {
    items = [
      ...idx.modules.map(m => ({ title: m.title, file: m.file, kind: 'module', desc: m.preview, tags: [] })),
      ...app.data.fang.map(f => ({ title: f.name, kind: 'fang', desc: f.desc, tags: f.tags })),
      ...app.data.herbs.map(h => ({ title: h.name, kind: 'herb', desc: h.desc, tags: h.tags }))
    ];
  } else {
    items = [
      ...idx.modules.filter(m => m.title.toLowerCase().includes(kw) || m.preview.toLowerCase().includes(kw)).map(m => ({ title: m.title, file: m.file, kind: 'module', desc: m.preview, tags: [] })),
      ...app.data.fang.filter(f => f.name.includes(kw) || f.tags.some(t => t.includes(kw))).map(f => ({ title: f.name, kind: 'fang', desc: f.desc, tags: f.tags })),
      ...app.data.herbs.filter(h => h.name.includes(kw) || h.tags.some(t => t.includes(kw))).map(h => ({ title: h.name, kind: 'herb', desc: h.desc, tags: h.tags }))
    ];
  }

  list.innerHTML = items.map(item => `
    <div class="list-card" onclick="showKnowledgeDetail('${item.kind}', '${item.file || item.title}')">
      <h3>${item.title}</h3>
      <p>${(item.desc || '').slice(0, 120)}${(item.desc || '').length > 120 ? '…' : ''}</p>
      ${(item.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
      ${item.kind === 'module' ? '<span class="tag">知识库</span>' : ''}
    </div>
  `).join('') || '<div class="empty-state"><div class="icon">🌿</div><p>未找到相关内容</p></div>';
}

function filterKnowledge(keyword) {
  renderKnowledgeList(keyword);
}

async function showKnowledgeDetail(kind, id) {
  const main = document.getElementById('main-content');

  if (kind === 'fang' || kind === 'herb') {
    const item = kind === 'fang'
      ? app.data.fang.find(i => i.name === id)
      : app.data.herbs.find(i => i.name === id);
    if (!item) return;
    main.innerHTML = `
      <button class="back-btn" onclick="renderPage('fang')">← 返回</button>
      <div class="detail-content">
        <h2>${item.name}</h2>
        <p>${item.desc}</p>
        <p>${item.tags.map(t => `<span class="tag">${t}</span>`).join(' ')}</p>
      </div>
    `;
    return;
  }

  const folder = kind === 'case' ? 'cases' : 'modules';
  try {
    const res = await fetch(`data/${folder}/${id}`);
    const md = await res.text();
    const html = mdToHtml(md);
    main.innerHTML = `
      <button class="back-btn" onclick="renderPage('${kind === 'case' ? 'cases' : 'fang'}')">← 返回</button>
      <div class="detail-content"><p>${html}</p></div>
    `;
  } catch (e) {
    main.innerHTML = `
      <button class="back-btn" onclick="renderPage('fang')">← 返回</button>
      <div class="empty-state"><p>加载失败，请稍后再试</p></div>
    `;
  }
}

function showFangDetail(name) {
  showKnowledgeDetail('fang', name);
}

// 医案页
function renderCases(container) {
  container.innerHTML = `
    <div class="search-box" style="margin-bottom:12px">
      <span>🔍</span>
      <input type="text" id="case-search" placeholder="搜索医案类型、病症…" oninput="filterCases(this.value)">
    </div>
    <div id="case-list"></div>
  `;
  filterCases('');
}

function filterCases(keyword) {
  const list = document.getElementById('case-list');
  if (!list) return;
  const kw = (keyword || '').toLowerCase();
  const cases = app.data.index ? app.data.index.cases : [];

  const items = !kw ? cases : cases.filter(c => c.title.toLowerCase().includes(kw) || c.preview.toLowerCase().includes(kw));

  list.innerHTML = items.map(c => `
    <div class="list-card" onclick="showKnowledgeDetail('case', '${c.file}')">
      <h3>${c.title}</h3>
      <p>${c.preview.slice(0, 120)}…</p>
      <span class="tag">医案</span>
    </div>
  `).join('') || '<div class="empty-state"><div class="icon">📚</div><p>未找到相关医案</p></div>';
}

// 更多页
function renderMore(container) {
  container.innerHTML = `
    <div class="about-box">
      <div class="logo">方</div>
      <h2>倪师有方</h2>
      <p>口袋经方中医 AI · v1.0.0</p>
      <p style="margin-top:12px">本项目基于倪海厦老师公开教学资料整理，<br>仅供中医学习与研究参考。</p>
    </div>

    <div class="section-title">设置与关于</div>
    <div class="menu-list">
      <div class="menu-item" onclick="alert('离线数据包已内置。当前包含伤寒论、金匮、黄帝内经、针灸本草、医案等核心资料。')">
        <span>离线知识库</span>
        <span>›</span>
      </div>
      <div class="menu-item" onclick="alert('数据来源：倪海厦人纪、天纪、医案集、梁冬对话等公开资料')">
        <span>数据来源</span>
        <span>›</span>
      </div>
      <div class="menu-item" onclick="alert('本 APP 为学习工具，不能替代医师诊疗。身体不适请及时就医。')">
        <span>免责声明</span>
        <span>›</span>
      </div>
      <div class="menu-item" onclick="alert('意见反馈：请通过项目 GitHub 提交 issue')">
        <span>意见反馈</span>
        <span>›</span>
      </div>
    </div>
  `;
}

function goSearch() {
  renderPage('fang');
  setTimeout(() => {
    const input = document.getElementById('fang-search');
    if (input) input.focus();
  }, 100);
}

// 启动
document.addEventListener('DOMContentLoaded', async () => {
  initLocalData();
  await loadKnowledgeIndex();
  renderPage('home');

  document.querySelectorAll('.tab-item').forEach(btn => {
    btn.addEventListener('click', () => renderPage(btn.dataset.page));
  });
});
