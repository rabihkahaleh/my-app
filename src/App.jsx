import { useState, useRef } from 'react';
import Papa from 'papaparse';
import './App.css';

const API_URL = 'http://localhost:3001/api';

// Program configurations
const PROGRAMS = {
  education: {
    label: 'AI in Education',
    subject: 'Invitation to AI in Education Certificate Program - University of Balamand',
    cc: 'rabih.kahaleh@balamand.edu.lb; Guenia.Zgheib@balamand.edu.lb; Jacky.Nicolas@balamand.edu.lb; izakhem@balamand.edu.lb',
    bcc: 'rabih.kahaleh@balamand.edu.lb',
    headerColor: '#1a5276',
  },
  business: {
    label: 'AI in Business Automation',
    subject: 'Invitation to AI in Action: Business Automation & Decision-Making - University of Balamand',
    cc: 'rabih.kahaleh@balamand.edu.lb',
    bcc: 'rabih.kahaleh@balamand.edu.lb',
    headerColor: '#1a5276',
  },
};

// Common female first names (Lebanese/Arabic + international)
const FEMALE_NAMES = new Set([
  'may', 'maya', 'yara', 'paula', 'dana', 'manal', 'beatrice', 'amal', 'hanan',
  'zainab', 'barbara', 'salma', 'talar', 'rafa', 'diana', 'dina', 'mabelle',
  'eliane', 'faten', 'fadia', 'mariane', 'nicole', 'fida', 'donna', 'yvonne',
  'dayana', 'maria', 'razane', 'reina', 'zaynab', 'warde', 'razan', 'slaiby',
  'frida', 'donna-maria', 'jacky', 'sara', 'lina', 'nour', 'rima', 'nadine',
  'carmen', 'joelle', 'celine', 'marie', 'mirna', 'rita', 'rania', 'sylvie',
  'alaa', 'zaynabt', 'nathalie', 'layal',
]);

const MALE_NAMES = new Set([
  'georges', 'joe', 'kamel', 'rodolph', 'hasan', 'michel', 'rabih', 'imad',
  'pierre', 'elie', 'tony', 'antoine', 'charbel', 'sami', 'walid', 'omar',
  'hassan', 'ali', 'ahmad', 'khalil', 'fadi', 'rami', 'samir', 'nabil',
]);

function guessTitle(fullName) {
  const firstName = (fullName || '').trim().split(/\s+/)[0].toLowerCase();
  if (MALE_NAMES.has(firstName)) return 'Mr.';
  if (FEMALE_NAMES.has(firstName)) return 'Ms.';
  return 'Ms.';
}

// ==================== AI IN EDUCATION TEMPLATE ====================

function generateEducationIntro(jobTitle) {
  const jt = (jobTitle || '').toLowerCase();

  if (jt.includes('student')) {
    return `As a university student, developing strong AI literacy and practical integration skills can significantly enhance your academic performance and future career opportunities. I would be pleased to personally invite you to join the <strong>AI in Education Certificate Program</strong>, a live and practical training offered by the <strong>University of Balamand</strong>. The program is designed to equip participants with structured, responsible, and effective AI integration skills applicable in both academic and professional contexts.`;
  }
  if (jt.includes('director') || jt.includes('general manager') || jt.includes('manager') || jt.includes('head') || jt.includes('principal') || jt.includes('coordinator')) {
    return `As a leader in <strong>${jobTitle}</strong>, integrating AI into your organization's strategy can drive innovation, improve decision-making, and prepare your teams for the future of education. I would be pleased to personally invite you to join the <strong>AI in Education Certificate Program</strong>, a live and practical training offered by the <strong>University of Balamand</strong>. The program is designed to equip leaders and professionals with structured, responsible, and effective AI integration skills applicable across academic and institutional contexts.`;
  }
  if (jt.includes('instructor') || jt.includes('lecturer') || jt.includes('professor') || jt.includes('faculty')) {
    return `As a higher education professional serving as <strong>${jobTitle}</strong>, incorporating AI into your teaching practice can transform how you design courses, engage students, and assess learning outcomes. I would be pleased to personally invite you to join the <strong>AI in Education Certificate Program</strong>, a live and practical training offered by the <strong>University of Balamand</strong>. The program is designed to equip educators with structured, responsible, and effective AI integration skills directly applicable to academic instruction.`;
  }
  if (jt.includes('teacher') || jt.includes('enseignant') || jt.includes('homeroom') || jt.includes('teaching')) {
    const subject = jt.includes('math') ? 'mathematics' :
      jt.includes('english') ? 'English language' :
      jt.includes('biology') ? 'biology' :
      jt.includes('chemistry') ? 'chemistry' :
      jt.includes('physics') ? 'physics' :
      jt.includes('science') ? 'science' :
      jt.includes('german') ? 'German language' : null;

    const subjectPhrase = subject
      ? `As a dedicated <strong>${jobTitle}</strong>, leveraging AI tools can help you create more engaging ${subject} lessons, personalize learning for your students, and streamline your assessment workflows.`
      : `As a dedicated <strong>${jobTitle}</strong>, leveraging AI tools can help you create more engaging lessons, personalize learning for your students, and streamline your assessment workflows.`;

    return `${subjectPhrase} I would be pleased to personally invite you to join the <strong>AI in Education Certificate Program</strong>, a live and practical training offered by the <strong>University of Balamand</strong>. The program is designed to equip educators with structured, responsible, and effective AI integration skills applicable in classroom settings.`;
  }
  if (jt.includes('psycholog') || jt.includes('therapist') || jt.includes('counsel')) {
    return `As a professional in <strong>${jobTitle}</strong>, understanding how AI is shaping education and student support can enhance your practice and help you better serve your clients and institutions. I would be pleased to personally invite you to join the <strong>AI in Education Certificate Program</strong>, a live and practical training offered by the <strong>University of Balamand</strong>. The program is designed to equip professionals with structured, responsible, and effective AI integration skills applicable across educational and clinical contexts.`;
  }
  if (jt.includes('translat') || jt.includes('freelance') || jt.includes('writer')) {
    return `As a professional working as <strong>${jobTitle}</strong>, AI tools are rapidly transforming how content is created, translated, and adapted across languages and contexts. I would be pleased to personally invite you to join the <strong>AI in Education Certificate Program</strong>, a live and practical training offered by the <strong>University of Balamand</strong>. The program is designed to equip professionals with structured, responsible, and effective AI integration skills that can enhance your workflow and career prospects.`;
  }
  if (jt.includes('assessment') || jt.includes('evaluation') || jt.includes('quality')) {
    return `As a professional in <strong>${jobTitle}</strong>, AI is transforming how assessments are designed, administered, and analyzed in educational settings. I would be pleased to personally invite you to join the <strong>AI in Education Certificate Program</strong>, a live and practical training offered by the <strong>University of Balamand</strong>. The program is designed to equip professionals with structured, responsible, and effective AI integration skills directly applicable to assessment and quality assurance in education.`;
  }
  return `As a dedicated professional in <strong>${jobTitle || 'your field'}</strong>, developing strong AI literacy and practical integration skills can significantly enhance your performance and open new opportunities. I would be pleased to personally invite you to join the <strong>AI in Education Certificate Program</strong>, a live and practical training offered by the <strong>University of Balamand</strong>. The program is designed to equip participants with structured, responsible, and effective AI integration skills applicable in academic and professional contexts.`;
}

function generateEducationEmail(fullName, jobTitle, aiIntro, title) {
  const name = fullName?.trim() || 'Participant';
  const greeting = title ? `${title} ${name}` : name;
  const introParagraph = aiIntro || generateEducationIntro(jobTitle);

  return `
<div style="font-family: Calibri, Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
  <p>Dear ${greeting},</p>
  <p>I hope this message finds you well.</p>
  <p>${introParagraph}</p>
  <h3 style="color: #1a5276;">Information Session</h3>
  <p>
    &#x1F4C5; <strong>Friday, February 27, 2026</strong><br/>
    &#x1F554; <strong>5:30 PM</strong> (Online via Microsoft Teams)<br/>
    &#x1F517; <strong>Information Session Link:</strong><br/>
    <a href="https://events.teams.microsoft.com/event/96f7a06c-df3d-4fe4-9a21-02f6b8b0f17e@8a122edf-f8bc-4af9-abca-7a7977b9e7cf" style="color: #2980b9;">Join the Information Session</a>
  </p>
  <p>During this session, we will present the full course structure, learning outcomes, practical applications, and answer any questions you may have before registration.</p>
  <h3 style="color: #1a5276;">&#x1F4D8; Program Summary</h3>
  <ul style="list-style: none; padding-left: 0;">
    <li><strong>Program Start Date:</strong> March 6, 2026</li>
    <li><strong>Total Duration:</strong> 24 hours (8 sessions, 3 hours each, scheduled from 5:00 PM to 8:00 PM)</li>
    <li><strong>Format:</strong> Live, 100% online</li>
    <li><strong>Program Fee:</strong> $250</li>
    <li><strong>Facilitator:</strong> Rabih Kahaleh, M.A., Ph.D. Researcher in Generative AI in Education</li>
  </ul>
  <h3 style="color: #1a5276;">&#x1F393; Certification</h3>
  <p>Participants who successfully complete the program and meet the certificate requirements will receive an official <strong>Certificate of Completion</strong> issued by the <strong>University of Balamand</strong>.</p>
  <h3 style="color: #1a5276;">&#x1F3AF; What You'll Gain</h3>
  <p>By the end of the program, you will be able to:</p>
  <ul>
    <li>Understand key AI applications in education</li>
    <li>Differentiate between generative and traditional AI models</li>
    <li>Critically evaluate AI tools for instructional use</li>
    <li>Design AI-enhanced learning activities</li>
    <li>Apply responsible and ethical AI practices</li>
    <li>Develop a practical final project aligned with your teaching context</li>
  </ul>
  <h3 style="color: #1a5276;">&#x1F4CC; Registration (Required First Step)</h3>
  <p>Please complete your registration first using the link below:<br/>
    <a href="https://sisweb.balamand.edu.lb/pls/apex/f?p=100:101:::::P101_MAJOR:3426" style="color: #2980b9;">Register Here</a>
  </p>
  <p><strong>Important:</strong> Registration must be completed before proceeding with payment. Otherwise, your payment will not be linked to your registration record in the system.</p>
  <h3 style="color: #1a5276;">&#x1F4CC; Payment (After Registration)</h3>
  <p>After registering, you may complete your payment through:<br/>
    <a href="https://forms.balamand.edu.lb/Certificates/" style="color: #2980b9;">Payment Portal</a><br/>
    (Select <strong>"AI in Education"</strong> from the Certificate Name dropdown menu.)
  </p>
  <p>For assistance with registration or payment, you may contact:<br/>
    <strong>Mrs. Jacky Nicolas</strong> - <a href="mailto:jacky.nicolas@balamand.edu.lb">jacky.nicolas@balamand.edu.lb</a><br/>
    <strong>Dr. Imad Zakhem</strong> - <a href="mailto:izakhem@balamand.edu.lb">izakhem@balamand.edu.lb</a>
  </p>
  <p>For any academic or course-related questions, please feel free to contact me directly. I look forward to welcoming you to the information session and to the program.</p>
  <p style="margin-top: 20px;">
    Warm regards,<br/>
    <strong>Rabih Kahaleh</strong><br/>
    M.A., Ph.D. Researcher in Generative AI in Education<br/>
    University of Balamand<br/>
    <a href="mailto:rabih.kahaleh@balamand.edu.lb">rabih.kahaleh@balamand.edu.lb</a>
  </p>
</div>`;
}

// ==================== AI IN BUSINESS AUTOMATION TEMPLATE ====================

function generateBusinessRoleParagraph(jobTitle) {
  const jt = (jobTitle || '').toLowerCase();

  if (jt.includes('intern')) {
    return `Given your role as <strong>${jobTitle}</strong>, I believe you may find this certificate especially relevant because it focuses on how AI can help you build practical AI skills that strengthen your career profile early, learn how AI supports real business workflows without coding, improve productivity in reporting, communication, and task management, and gain hands-on experience with tools used in modern workplaces.`;
  }
  if (jt.includes('creative') || jt.includes('design') || jt.includes('art director') || jt.includes('graphic')) {
    return `Given your role as <strong>${jobTitle}</strong>, I believe you may find this certificate especially relevant because it focuses on how AI can enhance creative and communication workflows in practical ways\u2014such as accelerating content production, improving campaign planning, supporting creative ideation, streamlining client communication, and optimizing internal team collaboration through AI-assisted automation.`;
  }
  if (jt.includes('director') || jt.includes('general manager') || jt.includes('ceo') || jt.includes('cfo') || jt.includes('coo') || jt.includes('vp') || jt.includes('vice president')) {
    return `Given your role as <strong>${jobTitle}</strong>, I believe you may find this certificate especially relevant because it focuses on how AI can support strategic decision-making, enhance business intelligence, streamline operations, and empower leadership teams to drive AI adoption with confidence and clarity.`;
  }
  if (jt.includes('manager') || jt.includes('head') || jt.includes('supervisor') || jt.includes('coordinator') || jt.includes('lead')) {
    return `Given your role as <strong>${jobTitle}</strong>, I believe you may find this certificate especially relevant because it focuses on how AI can help automate repetitive tasks, streamline team workflows, support data-driven reporting and performance tracking, and enable faster, more informed decision-making.`;
  }
  if (jt.includes('accountant') || jt.includes('finance') || jt.includes('auditor') || jt.includes('banking')) {
    return `Given your role as <strong>${jobTitle}</strong>, I believe you may find this certificate especially relevant because it focuses on how AI can automate financial reporting and data analysis, identify patterns and trends in financial data, streamline compliance and audit workflows, and enhance decision support with AI-generated insights.`;
  }
  if (jt.includes('sales') || jt.includes('marketing') || jt.includes('business develop')) {
    return `Given your role as <strong>${jobTitle}</strong>, I believe you may find this certificate especially relevant because it focuses on how AI can automate customer outreach and follow-ups, support market analysis and lead qualification, generate compelling content and proposals, and optimize sales pipelines and marketing campaigns.`;
  }
  if (jt.includes('hr') || jt.includes('human resource') || jt.includes('recruit') || jt.includes('talent')) {
    return `Given your role as <strong>${jobTitle}</strong>, I believe you may find this certificate especially relevant because it focuses on how AI can streamline recruitment and candidate screening, automate HR communications and onboarding, support workforce analytics, and enhance employee engagement through data-driven strategies.`;
  }
  if (jt.includes('engineer') || jt.includes('developer') || jt.includes('technical') || jt.includes('it') || jt.includes('software')) {
    return `Given your role as <strong>${jobTitle}</strong>, I believe you may find this certificate especially relevant because it focuses on how AI can be applied to automate workflows beyond traditional coding, support intelligent reporting and system monitoring, enhance productivity with AI-powered tools, and bridge technical and business AI applications.`;
  }
  if (jt.includes('admin') || jt.includes('assistant') || jt.includes('secretary') || jt.includes('office')) {
    return `Given your role as <strong>${jobTitle}</strong>, I believe you may find this certificate especially relevant because it focuses on how AI can automate routine administrative tasks and communications, organize and summarize information efficiently, improve productivity in scheduling, reporting, and coordination.`;
  }
  // Default
  return `Given your role as <strong>${jobTitle || 'a professional'}</strong>, I believe you may find this certificate especially relevant because it focuses on how AI can help you automate workflows, boost daily productivity, support real business decisions without coding, and improve reporting, communication, and task management.`;
}

function generateBusinessEmail(fullName, jobTitle, aiIntro, title) {
  const name = fullName?.trim() || 'Participant';
  const greeting = title ? `${title} ${name}` : name;
  const roleParagraph = generateBusinessRoleParagraph(jobTitle);

  return `
<div style="font-family: Calibri, Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
  <p>Dear ${greeting},</p>
  <p>I hope this message finds you well.</p>
  <p>I am writing to invite you to the <strong>AI in Action: Business Automation &amp; Decision-Making Certificate Program</strong>, a live and fully online program offered by the <strong>University of Balamand</strong>. This practical and hands-on program equips professionals with the skills to apply AI in real business workflows\u2014particularly in decision support, reporting, process automation, and productivity\u2014without requiring any programming background.</p>
  <p>${roleParagraph}</p>
  <p>This program was designed with one main idea in mind: AI is not only for big companies or technical teams\u2014it is for professionals who want to work smarter, faster, and more strategically. Across its interactive sessions and hands-on activities, the course demonstrates how AI can be applied to real business challenges in a structured and practical way.</p>
  <h3 style="color: #1a5276;">&#x1F3AF; What You'll Gain</h3>
  <ul>
    <li>A clear understanding of how AI is applied in modern business operations</li>
    <li>Practical skills in prompt engineering and workflow automation</li>
    <li>Experience using AI to automate communication and follow-ups</li>
    <li>The ability to generate business reports and insights from spreadsheets</li>
    <li>Confidence applying AI to finance, operations, and business strategy</li>
    <li>Ethical and strategic insight into responsible AI use and decision-making</li>
  </ul>
  <h3 style="color: #1a5276;">&#x1F464; Is This for You?</h3>
  <p>Yes\u2014this program is built for professionals like you. You don't need a technical background\u2014just curiosity, initiative, and real workplace challenges you want to solve more efficiently.</p>
  <h3 style="color: #1a5276;">&#x1F4D8; Program Summary</h3>
  <ul style="list-style: none; padding-left: 0;">
    <li><strong>Format:</strong> Live, 100% online, highly interactive</li>
    <li><strong>Duration:</strong> 18 hours (6 sessions \u00d7 3 hours)</li>
    <li><strong>Program Fee:</strong> $500</li>
    <li><strong>Hands-On Tools:</strong> Google Sheets, Gemini API, ChatGPT, Claude, Microsoft Copilot</li>
    <li><strong>Facilitator:</strong> Rabih Kahaleh, M.A., Ph.D. Researcher in Generative AI in Education</li>
    <li><strong>Modules:</strong>
      <ul style="margin-top: 4px;">
        <li>Module 1: AI Foundations &amp; Workflow Automation</li>
        <li>Module 2: Data Intelligence &amp; Decision Support</li>
        <li>Module 3: AI for Customer Engagement &amp; Ethical Deployment</li>
      </ul>
    </li>
  </ul>
  <p><strong>Program Details:</strong><br/>
    <a href="https://www.balamand.edu.lb/faculties/FOBM/AICertificate/Pages/default.aspx" style="color: #2980b9;">https://www.balamand.edu.lb/faculties/FOBM/AICertificate/Pages/default.aspx</a>
  </p>
  <h3 style="color: #1a5276;">&#x1F4CC; Registration (Online)</h3>
  <p>To apply online, please use the link below:<br/>
    <a href="https://sisweb.balamand.edu.lb/pls/apex/f?p=100:101:::::P101_MAJOR:3476" style="color: #2980b9;">https://sisweb.balamand.edu.lb/pls/apex/f?p=100:101:::::P101_MAJOR:3476</a>
  </p>
  <p>If you need any assistance with the registration process, you may also contact:<br/>
    <strong>Mrs. Nathalie Ashkar</strong> \u2013 <a href="mailto:nathalie.ashkar@balamand.edu.lb">nathalie.ashkar@balamand.edu.lb</a>, +961 70 647 286<br/>
    <strong>Dr. Layal Omran</strong> \u2013 <a href="mailto:layal.n.omran@fty.balamand.edu.lb">layal.n.omran@fty.balamand.edu.lb</a>, +961 70 791 792
  </p>
  <p>For any academic or content-related questions, please feel free to contact me directly.</p>
  <p style="margin-top: 20px;">
    <strong>Rabih Kahaleh</strong><br/>
    Ph.D. Researcher in AI in Education<br/>
    Software &amp; Web Development Manager<br/>
    Information Technology<br/>
    T: +961 6 930 250 | EXT: 3566<br/>
    <a href="http://www.balamand.edu.lb/" style="color: #2980b9;">http://www.balamand.edu.lb/</a>
  </p>
</div>`;
}

// ==================== UNIFIED EMAIL GENERATOR ====================

function generateEmailHTML(program, fullName, jobTitle, aiIntro, title) {
  if (program === 'business') {
    return generateBusinessEmail(fullName, jobTitle, aiIntro, title);
  }
  return generateEducationEmail(fullName, jobTitle, aiIntro, title);
}

// ==================== APP COMPONENT ====================

function App() {
  const [program, setProgram] = useState('education');
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [smtpConfig, setSmtpConfig] = useState({
    host: '172.16.1.114',
    port: '25',
    secure: false,
  });
  const [fromEmail] = useState('rabih.kahaleh@balamand.edu.lb');
  const [subject, setSubject] = useState(PROGRAMS.education.subject);
  const [smtpConnected, setSmtpConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResults, setSendResults] = useState([]);
  const [previewContact, setPreviewContact] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const fileInputRef = useRef(null);

  // Gemini AI state
  const [geminiKey, setGeminiKey] = useState('AIzaSyBRQ7XjoEFXh0aoPlszcxnsWIawa1DAegc');
  const [aiIntros, setAiIntros] = useState({});
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState({ current: 0, total: 0 });
  const [sendingOne, setSendingOne] = useState(null);

  const currentProgram = PROGRAMS[program];

  const handleProgramChange = (newProgram) => {
    setProgram(newProgram);
    setSubject(PROGRAMS[newProgram].subject);
    setSendResults([]);
    setStatusMsg('');
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleaned = results.data
          .filter(row => row.email && row.email.trim())
          .map((row, i) => {
            const fullName = (row.full_name || '').replace(/[^\w\s.'-]/g, '').trim();
            return {
              id: i,
              full_name: fullName,
              title: guessTitle(fullName),
              email: (row.email || '').replace(/[^\w@.+\-]/g, '').trim(),
              phone_number: row.phone_number || '',
              country: row.country || '',
              job_title: (row.job_title || '').trim(),
            };
          });
        setContacts(cleaned);
        setSelected(new Set(cleaned.map(c => c.id)));
        setAiIntros({});
        setSendResults([]);
      }
    });
  };

  const handleConnectSMTP = async () => {
    setStatusMsg('Connecting to SMTP...');
    try {
      const res = await fetch(`${API_URL}/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpConfig),
      });
      const data = await res.json();
      if (data.success) {
        setSmtpConnected(true);
        setStatusMsg('SMTP connected successfully!');
      } else {
        setStatusMsg(`SMTP error: ${data.error}`);
      }
    } catch (err) {
      setStatusMsg(`Connection failed: ${err.message}`);
    }
  };

  const handleGenerateIntros = async (contactsList) => {
    if (!geminiKey) {
      setStatusMsg('Please enter your Gemini API key first.');
      return;
    }

    const toGenerate = contactsList || contacts.filter(c => selected.has(c.id));
    if (toGenerate.length === 0) return;

    setGenerating(true);
    setGenProgress({ current: 0, total: toGenerate.length });
    setStatusMsg(`Generating AI intros... 0/${toGenerate.length}`);
    const newIntros = { ...aiIntros };

    for (let i = 0; i < toGenerate.length; i++) {
      const c = toGenerate[i];

      if (newIntros[c.id]) {
        setGenProgress({ current: i + 1, total: toGenerate.length });
        setStatusMsg(`Generating AI intros... ${i + 1}/${toGenerate.length}`);
        continue;
      }

      try {
        const res = await fetch(`${API_URL}/generate-intro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: geminiKey,
            name: c.full_name,
            jobTitle: c.job_title,
          }),
        });
        const data = await res.json();
        if (data.success) {
          newIntros[c.id] = data.intro;
        } else {
          console.error(`Failed for ${c.full_name}: ${data.error}`);
        }
      } catch (err) {
        console.error(`Error for ${c.full_name}: ${err.message}`);
      }

      setGenProgress({ current: i + 1, total: toGenerate.length });
      setStatusMsg(`Generating AI intros... ${i + 1}/${toGenerate.length}`);

      if (i < toGenerate.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 4000));
      }
    }

    setAiIntros(newIntros);
    const generatedCount = Object.keys(newIntros).length;
    setStatusMsg(`Done! ${generatedCount} personalized intros generated.`);
    setGenerating(false);
  };

  const updateTitle = (id, newTitle) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === contacts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(contacts.map(c => c.id)));
    }
  };

  const handleSendAll = async () => {
    const toSend = contacts.filter(c => selected.has(c.id));
    if (toSend.length === 0) return;

    setSending(true);
    setSendResults([]);
    setStatusMsg(`Sending ${toSend.length} emails...`);

    const emails = toSend.map(c => ({
      to: c.email,
      html: generateEmailHTML(program, c.full_name, c.job_title, aiIntros[c.id] || null, c.title),
    }));

    try {
      const res = await fetch(`${API_URL}/send-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails, from: fromEmail, subject, cc: currentProgram.cc, bcc: currentProgram.bcc, delayMs: 2000 }),
      });
      const data = await res.json();
      if (data.success) {
        setSendResults(data.results);
        const successCount = data.results.filter(r => r.success).length;
        setStatusMsg(`Done! ${successCount}/${data.results.length} emails sent successfully.`);
      } else {
        setStatusMsg(`Error: ${data.error}`);
      }
    } catch (err) {
      setStatusMsg(`Send failed: ${err.message}`);
    }
    setSending(false);
  };

  const handleSendOne = async (contact) => {
    if (!smtpConnected) {
      setStatusMsg('Connect to SMTP first.');
      return;
    }
    setSendingOne(contact.id);
    try {
      const res = await fetch(`${API_URL}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromEmail,
          to: contact.email,
          cc: currentProgram.cc,
          bcc: currentProgram.bcc,
          subject,
          html: generateEmailHTML(program, contact.full_name, contact.job_title, aiIntros[contact.id] || null, contact.title),
        }),
      });
      const data = await res.json();
      setSendResults(prev => [
        ...prev.filter(r => r.to !== contact.email),
        { to: contact.email, success: data.success, error: data.error, messageId: data.messageId }
      ]);
      if (data.success) {
        setStatusMsg(`Email sent to ${contact.full_name}!`);
      } else {
        setStatusMsg(`Failed to send to ${contact.full_name}: ${data.error}`);
      }
    } catch (err) {
      setSendResults(prev => [
        ...prev.filter(r => r.to !== contact.email),
        { to: contact.email, success: false, error: err.message }
      ]);
      setStatusMsg(`Error sending to ${contact.full_name}: ${err.message}`);
    }
    setSendingOne(null);
  };

  const getResultForEmail = (email) => sendResults.find(r => r.to === email);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Email Invitation Sender</h1>
        <p className="subtitle">University of Balamand Certificate Programs</p>
        <div className="program-selector">
          <button
            className={`program-btn ${program === 'education' ? 'active' : ''}`}
            onClick={() => handleProgramChange('education')}
          >
            AI in Education
          </button>
          <button
            className={`program-btn ${program === 'business' ? 'active' : ''}`}
            onClick={() => handleProgramChange('business')}
          >
            AI in Business Automation
          </button>
        </div>
      </header>

      {/* SMTP Configuration */}
      <section className="card">
        <h2>1. SMTP Configuration</h2>
        <div className="smtp-form">
          <div className="form-row">
            <label>
              SMTP Host
              <input
                type="text"
                value={smtpConfig.host}
                onChange={e => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                placeholder="172.16.1.114"
              />
            </label>
            <label>
              Port
              <input
                type="text"
                value={smtpConfig.port}
                onChange={e => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                placeholder="25"
              />
            </label>
            <button onClick={handleConnectSMTP} disabled={smtpConnected}>
              {smtpConnected ? 'Connected' : 'Connect'}
            </button>
          </div>
        </div>
        {smtpConnected && <div className="status success">SMTP Connected</div>}
        {!smtpConnected && statusMsg && (
          <div className="status error">{statusMsg}</div>
        )}
      </section>

      {/* CSV Upload */}
      <section className="card">
        <h2>2. Load Contacts (CSV)</h2>
        <div className="form-row">
          <button onClick={() => fileInputRef.current?.click()}>
            Upload CSV File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            style={{ display: 'none' }}
          />
          {contacts.length > 0 && (
            <span className="contact-count">{contacts.length} contacts loaded</span>
          )}
        </div>
      </section>

      {/* Gemini AI Personalization - only for education */}
      {contacts.length > 0 && program === 'education' && (
        <section className="card">
          <h2>3. AI Personalization (Gemini)</h2>
          <p className="section-desc">
            Enter your Gemini API key to generate a unique, personalized intro paragraph for each contact based on their job title.
          </p>
          <div className="form-row">
            <label>
              Gemini API Key
              <input
                type="password"
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
                placeholder="Paste your Gemini API key here"
              />
            </label>
            <button
              onClick={handleGenerateIntros}
              disabled={generating || !geminiKey}
              className="btn-generate"
            >
              {generating
                ? `Generating... ${genProgress.current}/${genProgress.total}`
                : `Generate Intros for ${selected.size} Contacts`
              }
            </button>
          </div>
          {Object.keys(aiIntros).length > 0 && (
            <div className="status success">
              {Object.keys(aiIntros).length} personalized intros ready
            </div>
          )}
        </section>
      )}

      {/* Email Subject */}
      {contacts.length > 0 && (
        <section className="card">
          <h2>{program === 'education' ? '4' : '3'}. Email Subject</h2>
          <input
            type="text"
            className="subject-input"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </section>
      )}

      {/* Contacts Table */}
      {contacts.length > 0 && (
        <section className="card">
          <h2>{program === 'education' ? '5' : '4'}. Contacts ({selected.size} of {contacts.length} selected)</h2>
          <table className="contacts-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selected.size === contacts.length}
                    onChange={toggleAll}
                  />
                </th>
                <th>#</th>
                <th>Title</th>
                <th>Name</th>
                <th>Email</th>
                <th>Job Title</th>
                {program === 'education' && <th>AI Intro</th>}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => {
                const result = getResultForEmail(c.email);
                return (
                  <tr key={c.id} className={selected.has(c.id) ? '' : 'deselected'}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => toggleSelect(c.id)}
                      />
                    </td>
                    <td>{i + 1}</td>
                    <td>
                      <select
                        value={c.title}
                        onChange={e => updateTitle(c.id, e.target.value)}
                        className="title-select"
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                      </select>
                    </td>
                    <td>{c.full_name}</td>
                    <td>{c.email}</td>
                    <td>{c.job_title}</td>
                    {program === 'education' && (
                      <td>
                        {aiIntros[c.id] ? (
                          <span className="badge sent">Ready</span>
                        ) : (
                          <span className="badge pending">Default</span>
                        )}
                      </td>
                    )}
                    <td>
                      {result ? (
                        result.success ? (
                          <span className="badge sent">Sent</span>
                        ) : (
                          <span className="badge failed" title={result.error}>Failed</span>
                        )
                      ) : (
                        <span className="badge pending">Pending</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <button className="btn-small" onClick={() => setPreviewContact(c)}>
                        Preview
                      </button>
                      <button
                        className="btn-small btn-send-one"
                        onClick={() => handleSendOne(c)}
                        disabled={!smtpConnected || sendingOne === c.id || (result && result.success)}
                      >
                        {sendingOne === c.id ? '...' : result?.success ? 'Sent' : 'Send'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {/* Send Button */}
      {contacts.length > 0 && (
        <section className="card send-section">
          <button
            className="btn-send"
            onClick={handleSendAll}
            disabled={!smtpConnected || sending || selected.size === 0}
          >
            {sending ? 'Sending...' : `Send ${selected.size} Emails`}
          </button>
          {statusMsg && <p className="status-msg">{statusMsg}</p>}
        </section>
      )}

      {/* Email Preview Modal */}
      {previewContact && (
        <div className="modal-overlay" onClick={() => setPreviewContact(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Email Preview - {previewContact.full_name}</h3>
              <button className="btn-close" onClick={() => setPreviewContact(null)}>x</button>
            </div>
            <div className="modal-meta">
              <p><strong>To:</strong> {previewContact.email}</p>
              <p><strong>CC:</strong> {currentProgram.cc}</p>
              <p><strong>From:</strong> {fromEmail}</p>
              <p><strong>Subject:</strong> {subject}</p>
              {program === 'education' && aiIntros[previewContact.id] && (
                <p className="ai-badge-meta"><strong>AI-Personalized Intro</strong></p>
              )}
            </div>
            <div
              className="email-preview"
              dangerouslySetInnerHTML={{
                __html: generateEmailHTML(
                  program,
                  previewContact.full_name,
                  previewContact.job_title,
                  aiIntros[previewContact.id] || null,
                  previewContact.title
                )
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
