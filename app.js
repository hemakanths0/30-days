const STORAGE_KEY = 'my30DayReset.v1';
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HABITS = [
  { id: 'learning', label: 'Python / ML practice' },
  { id: 'college', label: 'College revision' },
  { id: 'movement', label: 'Gym or planned recovery' },
  { id: 'reels', label: 'Kept Reels within my limit' },
  { id: 'sleep', label: 'Protected my sleep window' },
  { id: 'reflection', label: 'Personal reflection' }
];

const ROADMAP = [
  ['Set up Python and run a first script.', ['Install or open a Python environment', 'Print a greeting and save the file']],
  ['Use variables and core data types: strings, integers, floats, and booleans.', ['Create variables for a simple profile', 'Check values with type()']],
  ['Take input, format output, and convert between types.', ['Ask for a name and age', 'Print a formatted sentence']],
  ['Use arithmetic, comparison, and logical operators.', ['Calculate a simple bill total', 'Try comparisons with two values']],
  ['Control program flow with if, elif, and else.', ['Build a pass/fail checker', 'Add one extra condition']],
  ['Repeat work with for and while loops.', ['Print a number sequence', 'Use a loop to total a few values']],
  ['Review fundamentals by building a small number-guessing or quiz program.', ['Write the program without copying a tutorial', 'Note one thing that still feels unclear']],
  ['Work with lists: indexing, slicing, and changing items.', ['Create and update a subject list', 'Read the first and last item']],
  ['Use list methods and loop through collections.', ['Add, remove, and sort items', 'Print each item with a loop']],
  ['Understand tuples and sets, and when unique values are useful.', ['Create a tuple and a set', 'Remove duplicates from sample data']],
  ['Store related information with dictionaries.', ['Create a student record dictionary', 'Read, update, and loop over key/value pairs']],
  ['Write reusable functions with parameters.', ['Write a function that accepts an input', 'Call it with two different values']],
  ['Return results and split a small program into functions.', ['Write a function that returns a result', 'Use that result in another calculation']],
  ['Combine lists, dictionaries, and functions in a small practical program.', ['Build a simple marks tracker', 'Handle an empty or unexpected input']],
  ['Learn the ML workflow: problem, features, labels, train, and evaluate.', ['Describe a classification problem', 'Identify possible features and a label']],
  ['Create and inspect NumPy arrays.', ['Make a 1D and 2D array', 'Check shape and data type']],
  ['Use NumPy indexing, vectorized operations, and basic summaries.', ['Select rows or columns', 'Calculate a mean and a total']],
  ['Load a dataset into pandas and inspect a DataFrame.', ['Create or load a small DataFrame', 'Use head(), shape, and info()']],
  ['Clean missing values and select useful rows or columns.', ['Find missing values', 'Choose a simple fill or drop strategy']],
  ['Explore distributions and relationships with pandas summaries.', ['Use describe() and value_counts()', 'Write two observations about the data']],
  ['Practice a complete data-preparation pass on a small dataset.', ['Choose a public or sample dataset', 'Record target, features, and cleanup steps']],
  ['Frame the beginner classification project and choose a dataset.', ['Pick a small labelled dataset', 'Write the question your model will answer']],
  ['Separate features from the target and create a train/test split.', ['Build X and y', 'Make a reproducible train/test split']],
  ['Train a baseline classifier with scikit-learn.', ['Fit a simple baseline model', 'Record the first score without overclaiming']],
  ['Evaluate predictions with accuracy and a confusion matrix.', ['Generate test predictions', 'Inspect correct and incorrect cases']],
  ['Compare a second beginner-friendly classification model.', ['Train a second model', 'Compare results using the same split']],
  ['Improve the workflow with scaling or a simple preprocessing pipeline.', ['Add suitable preprocessing', 'Check that preprocessing is fit on training data only']],
  ['Inspect errors and improve one part of the model or features.', ['Review a few misclassified examples', 'Make one measured change']],
  ['Tidy the notebook or script and explain the project clearly.', ['Add a short README or project summary', 'Make sure the script runs from a clean start']],
  ['Review the 30-day journey and choose the next learning milestone.', ['Summarize what you can now do', 'Choose one next project and a sustainable weekly pace']]
];

const DEFAULT_SCHEDULE = [
  { id: 'morning', time: '07:00', title: 'Wake up & morning routine', duration: 30 },
  { id: 'prepare', time: '07:30', title: 'Breakfast and getting ready', duration: 45 },
  { id: 'college', time: '', title: 'College classes & travel (set your hours)', duration: 0 },
  { id: 'meal', time: '', title: 'Meals and proper breaks (fit around classes)', duration: 45 },
  { id: 'learning', time: '', title: 'Python / ML practice', duration: 45 },
  { id: 'revision', time: '', title: 'College revision & assignments', duration: 60 },
  { id: 'gym', time: '', title: 'Gym block including travel / preparation', duration: 120 },
  { id: 'family', time: '20:00', title: 'Dinner, relaxation & family time', duration: 90 },
  { id: 'sleep', time: '22:30', title: 'Wind down & sleep (aim for 8 hours)', duration: 480 }
];

const DEFAULT_EXERCISES = {
  'Strength A': [
    { name: 'Goblet squat', sets: '3', reps: '8-10', rest: '90 sec' },
    { name: 'Push-up or chest press', sets: '3', reps: '8-12', rest: '90 sec' },
    { name: 'Cable or dumbbell row', sets: '3', reps: '8-12', rest: '90 sec' }
  ],
  'Strength B': [
    { name: 'Romanian deadlift', sets: '3', reps: '8-10', rest: '120 sec' },
    { name: 'Overhead press', sets: '3', reps: '8-10', rest: '90 sec' },
    { name: 'Lat pulldown', sets: '3', reps: '8-12', rest: '90 sec' }
  ],
  'Light recovery': [],
  'Easy cardio / mobility': [],
  'Rest': []
};
const DEFAULT_WORKOUTS = [
  { type: 'Strength A', exercises: DEFAULT_EXERCISES['Strength A'] },
  { type: 'Light recovery', exercises: [] },
  { type: 'Strength B', exercises: DEFAULT_EXERCISES['Strength B'] },
  { type: 'Rest', exercises: [] },
  { type: 'Strength A', exercises: DEFAULT_EXERCISES['Strength A'] },
  { type: 'Easy cardio / mobility', exercises: [] },
  { type: 'Rest', exercises: [] }
];

const CHAT_STORAGE_KEY = 'my30DayReset.chat.v1';
const CHAT_ENDPOINT = '/api/chat';
const QUICK_PROMPTS = [
  'Plan my day.',
  'Teach me Python.',
  'Explain a machine-learning concept.',
  'Help me get back on track.',
  'Review my daily progress.'
];
let chatHistory = loadChatHistory();
let chatBusy = false;
let speechRecognition = null;

function loadChatHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter(message => message && ['user', 'assistant'].includes(message.role) && typeof message.content === 'string').map(message => ({ ...message, retry: Boolean(message.retry) })).slice(-60) : [];
  } catch (error) {
    console.warn('Saved assistant chat could not be read.', error);
    return [];
  }
}
function saveChatHistory() {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory.slice(-60)));
  } catch (error) {
    console.warn('Assistant chat could not be saved.', error);
    showToast('Chat could not be saved in this browser.');
  }
}
function assistantMessage(role, content, stateName = '', retryable = false) {
  const bubble = document.createElement('article');
  bubble.className = `assistant-message ${role}${stateName ? ` ${stateName}` : ''}`;
  if (retryable) bubble.classList.add('retryable');
  if (stateName === 'loading') {
    bubble.innerHTML = '<span class="assistant-loading-dots"><i></i><i></i><i></i></span><span>Thinking through a helpful next step...</span>';
  } else {
    const label = document.createElement('span');
    label.className = 'assistant-message-label';
    label.textContent = role === 'user' ? 'You' : 'Assistant';
    const text = document.createElement('p');
    text.textContent = content;
    bubble.append(label, text);
    if (role === 'assistant') {
      if (bubble.classList.contains('retryable')) {
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'assistant-retry';
        retry.dataset.retry = 'true';
        retry.innerHTML = '<i data-lucide="rotate-cw"></i> Retry';
        bubble.append(retry);
        return bubble;
      }
      const speak = document.createElement('button');
      speak.type = 'button';
      speak.className = 'assistant-speak';
      speak.dataset.speak = 'true';
      speak.disabled = !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined';
      speak.title = speak.disabled ? 'Spoken replies are not supported in this browser' : 'Read this reply aloud';
      speak.setAttribute('aria-label', speak.title);
      speak.innerHTML = '<i data-lucide="volume-2"></i> Read aloud';
      bubble.append(speak);
    }
  }
  return bubble;
}
function renderChat() {
  const container = document.getElementById('assistant-messages');
  container.replaceChildren();
  if (!chatHistory.length) {
    const welcome = assistantMessage('assistant', 'Hi. I can help you choose a realistic next step for study, learning, or your routine. What would feel useful right now?');
    container.append(welcome);
  } else {
    chatHistory.forEach(message => {
      const bubble = assistantMessage(message.role, message.content, '', message.retry);
      container.append(bubble);
    });
  }
  if (chatBusy) container.append(assistantMessage('assistant', '', 'loading'));
  if (window.lucide) window.lucide.createIcons();
  container.scrollTop = container.scrollHeight;
  document.getElementById('assistant-prompts').hidden = chatHistory.length > 0;
  document.getElementById('assistant-send').disabled = chatBusy;
  document.getElementById('assistant-input').disabled = chatBusy;
}
function setAssistantOpen(open) {
  const panel = document.getElementById('assistant-panel');
  const launcher = document.getElementById('assistant-launcher');
  panel.classList.toggle('open', open);
  panel.setAttribute('aria-hidden', String(!open));
  launcher.setAttribute('aria-expanded', String(open));
  launcher.setAttribute('aria-label', open ? 'Close AI chat assistant' : 'Open AI chat assistant');
  if (open) {
    renderChat();
    window.setTimeout(() => document.getElementById('assistant-input').focus(), 120);
  }
}
function getProgressContext() {
  const today = localDate();
  const daily = dayData(today);
  const tasks = taskProgress(today);
  const todayGym = gymData(today);
  return {
    date: today,
    challengeDay: Math.min(30, challengeDay()),
    tasksCompleted: tasks.done,
    tasksTotal: tasks.total,
    learningMinutes: Number(daily.learningMinutes) || 0,
    collegeStudyCheckedIn: daily.collegeDone,
    gymStatus: todayStatusLabel(todayGym.status),
    mood: daily.mood || 'not checked in',
    energy: daily.energy || 'not checked in',
    schedule: state.schedule.map(block => ({ time: block.time, activity: block.title, durationMinutes: block.duration }))
  };
}
async function requestAssistantReply(messages) {
  const response = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context: getProgressContext() })
  });
  let payload;
  try { payload = await response.json(); }
  catch { throw new Error(`The AI service returned an unreadable response (${response.status}).`); }
  if (!response.ok) throw new Error(payload.error || `The AI service returned ${response.status}.`);
  const reply = typeof payload.reply === 'string' ? payload.reply : typeof payload.message === 'string' ? payload.message : '';
  if (!reply.trim()) throw new Error('The AI service returned an empty reply.');
  return reply.trim();
}
function friendlyServiceError(error) {
  if (error instanceof TypeError) return 'I can’t reach the chat server. Check that `npm run dev` is running, then retry. Your dashboard and saved progress are unaffected.';
  return `I couldn’t get a reply just now. ${error.message} Please try again in a moment.`;
}
async function sendAssistantMessage(text, retry = false) {
  const content = text.trim();
  if ((!content && !retry) || chatBusy) return;
  if (retry) {
    const lastAssistantIndex = chatHistory.map(message => message.role).lastIndexOf('assistant');
    const lastUserIndex = chatHistory.map(message => message.role).lastIndexOf('user');
    if (lastUserIndex < 0 || lastAssistantIndex < lastUserIndex || !chatHistory[lastAssistantIndex]?.retry) return;
    chatHistory.splice(lastAssistantIndex, 1);
  } else {
    chatHistory.push({ role: 'user', content });
  }
  saveChatHistory();
  chatBusy = true;
  renderChat();
  try {
    const reply = await requestAssistantReply(chatHistory.filter(message => !message.retry).slice(-30).map(({ role, content: message }) => ({ role, content: message })));
    chatHistory.push({ role: 'assistant', content: reply });
    saveChatHistory();
  } catch (error) {
    chatHistory.push({ role: 'assistant', content: friendlyServiceError(error), retry: true });
    saveChatHistory();
  } finally {
    chatBusy = false;
    renderChat();
    document.getElementById('assistant-input').focus();
  }
}
function clearAssistantChat() {
  if (!chatHistory.length || !confirm('Clear this assistant conversation from this browser?')) return;
  chatHistory = [];
  localStorage.removeItem(CHAT_STORAGE_KEY);
  renderChat();
}
function setupSpeechRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const button = document.getElementById('assistant-voice');
  if (!Recognition) {
    button.title = 'Voice input is not supported in this browser';
    button.setAttribute('aria-label', 'Voice input is not supported');
    button.disabled = true;
  } else {
    speechRecognition = new Recognition();
    speechRecognition.lang = navigator.language || 'en-US';
    speechRecognition.interimResults = true;
    speechRecognition.continuous = false;
    speechRecognition.onresult = event => {
      let transcript = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) transcript += event.results[index][0].transcript;
      document.getElementById('assistant-input').value = transcript;
    };
    speechRecognition.onerror = event => {
      showToast(event.error === 'not-allowed' ? 'Allow microphone access to use voice input.' : 'Voice input stopped. You can type your message instead.');
      button.classList.remove('listening');
    };
    speechRecognition.onend = () => button.classList.remove('listening');
    button.addEventListener('click', () => {
      if (button.classList.contains('listening')) speechRecognition.stop();
      else {
        try { speechRecognition.start(); button.classList.add('listening'); }
        catch { showToast('Voice input is already starting.'); }
      }
    });
  }
  const speechOutputSupported = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  const unsupported = [];
  if (!Recognition) unsupported.push('Voice input is unavailable; type your message instead.');
  if (!speechOutputSupported) {
    unsupported.push('Spoken replies are unavailable in this browser.');
    const stopButton = document.getElementById('assistant-stop-speaking');
    stopButton.disabled = true;
    stopButton.title = 'Spoken replies are not supported in this browser';
  }
  if (unsupported.length) document.getElementById('assistant-disclaimer').textContent = `${unsupported.join(' ')} AI replies use the configured server.`;
}
function speakAssistantReply(content) {
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
    showToast('Spoken replies are not supported in this browser.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(content);
  utterance.lang = navigator.language || 'en-US';
  window.speechSynthesis.speak(utterance);
}

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function offsetDate(dateKey, amount) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + amount);
  return localDate(date);
}
function dateLabel(dateKey, options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, options);
}
function freshState() {
  return {
    startDate: localDate(),
    schedule: structuredClone(DEFAULT_SCHEDULE),
    daily: {},
    habits: {},
    gym: {},
    roadmap: { selectedDay: 1, completed: {}, checks: {}, notes: {} },
    workouts: structuredClone(DEFAULT_WORKOUTS)
  };
}
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') {
      const defaults = freshState();
      return {
        ...defaults,
        ...saved,
        schedule: Array.isArray(saved.schedule) ? saved.schedule : defaults.schedule,
        daily: saved.daily || {}, habits: saved.habits || {}, gym: saved.gym || {},
        roadmap: { ...defaults.roadmap, ...(saved.roadmap || {}) },
        workouts: Array.isArray(saved.workouts) && saved.workouts.length === 7 ? saved.workouts : defaults.workouts
      };
    }
  } catch (error) {
    console.warn('Saved dashboard data could not be read.', error);
  }
  return freshState();
}
let state = loadState();
let currentView = 'overview';
let toastTimer;

function saveState(message) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (message) showToast(message);
  } catch (error) {
    showToast('Could not save. Check available browser storage.');
    console.error(error);
  }
}
function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}
function icon(name, className = '') {
  return `<i data-lucide="${name}"${className ? ` class="${className}"` : ''}></i>`;
}
function dayData(dateKey) {
  if (!state.daily[dateKey]) {
    state.daily[dateKey] = {
      tasks: [
        { id: 'learning', label: 'Python / ML practice', done: false },
        { id: 'college', label: 'College revision or assignment', done: false },
        { id: 'movement', label: 'Gym or planned recovery', done: false },
        { id: 'reels', label: 'Keep Reels within my limit', done: false },
        { id: 'sleep', label: 'Protect my sleep window', done: false },
        { id: 'reflection', label: 'Take a moment to reflect', done: false }
      ], learningMinutes: '', reelsMinutes: '', mood: '', energy: '', reflection: '', collegeDone: false
    };
  }
  return state.daily[dateKey];
}
function habitData(dateKey) {
  if (!state.habits[dateKey]) state.habits[dateKey] = {};
  return state.habits[dateKey];
}
function gymData(dateKey) {
  if (!state.gym[dateKey]) state.gym[dateKey] = { status: 'planned', water: 0, recovery: '', notes: '' };
  return state.gym[dateKey];
}
function challengeDay() {
  const start = new Date(`${state.startDate}T00:00:00`);
  const today = new Date(`${localDate()}T00:00:00`);
  return Math.max(1, Math.floor((today - start) / 86400000) + 1);
}
function percent(done, total) { return total ? Math.round(done / total * 100) : 0; }
function taskProgress(dateKey) {
  const tasks = dayData(dateKey).tasks;
  return { done: tasks.filter(task => task.done).length, total: tasks.length };
}
function todayStatusLabel(status) {
  return ({ planned: 'Planned', complete: 'Completed', partial: 'Partially done', rested: 'Rested' })[status] || 'Planned';
}
function weekDates(end = localDate()) {
  return Array.from({ length: 7 }, (_, index) => offsetDate(end, index - 6));
}
function renderHeader() {
  const day = challengeDay();
  document.getElementById('header-date').textContent = dateLabel(localDate(), { weekday: 'short', month: 'short', day: 'numeric' });
  document.getElementById('sidebar-day').textContent = `Day ${day} of 30`;
  document.getElementById('sidebar-progress').style.width = `${Math.min(100, day / 30 * 100)}%`;
  document.getElementById('sidebar-start-label').textContent = day > 30 ? 'Keep your momentum going.' : 'A little progress, daily.';
  const titles = { overview: 'Overview', planner: 'Daily planner', learning: 'Learning roadmap', gym: 'Gym tracker', habits: 'Habit tracker', reports: 'Progress reports' };
  document.getElementById('page-title').textContent = titles[currentView];
  document.querySelectorAll('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.view === currentView));
}
function render() {
  renderHeader();
  const views = { overview: renderOverview, planner: renderPlanner, learning: renderLearning, gym: renderGym, habits: renderHabits, reports: renderReports };
  document.getElementById('view-root').innerHTML = views[currentView]();
  if (window.lucide) window.lucide.createIcons();
}
function pageHeading(kicker, title, copy, action = '') {
  return `<div class="page-heading"><div><div class="heading-kicker">${kicker}</div><h2>${title}</h2><p>${copy}</p></div>${action}</div>`;
}
function metricCard(label, value, foot, iconName, tone = '') {
  return `<article class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon">${icon(iconName)}</span></div><strong class="metric-value ${tone}">${value}</strong><small class="metric-foot">${foot}</small></article>`;
}
function taskMarkup(task, dateKey, removable = false) {
  return `<label class="task-row"><input class="check-input" type="checkbox" data-action="task-check" data-date="${dateKey}" data-id="${escapeHtml(task.id)}" ${task.done ? 'checked' : ''}><span class="task-copy ${task.done ? 'done' : ''}">${escapeHtml(task.label)}</span>${removable ? `<button class="task-remove" type="button" data-action="remove-task" data-date="${dateKey}" data-id="${escapeHtml(task.id)}" aria-label="Remove task">${icon('x')}</button>` : ''}</label>`;
}
function taskPanel(dateKey, title = 'Today’s priorities', compact = false) {
  const item = dayData(dateKey);
  const progress = taskProgress(dateKey);
  return `<section class="panel"><div class="panel-header"><div><h2>${title}</h2><p>${dateLabel(dateKey, { weekday: 'long', month: 'short', day: 'numeric' })} · ${progress.done} of ${progress.total} complete</p></div><span class="badge ${progress.done === progress.total && progress.total ? 'complete' : ''}">${percent(progress.done, progress.total)}%</span></div><div class="task-list">${item.tasks.length ? item.tasks.map(task => taskMarkup(task, dateKey, true)).join('') : '<div class="empty-state">Nothing on the list yet. Add one small priority below.</div>'}</div><form class="task-add" data-form="add-task" data-date="${dateKey}"><input class="field" name="task" maxlength="90" placeholder="Add a priority" aria-label="New priority"><button class="button button-primary button-small" type="submit">Add</button></form></section>`;
}
function renderOverview() {
  const today = localDate();
  const daily = dayData(today);
  const gym = gymData(today);
  const tasks = taskProgress(today);
  const completion = percent(tasks.done, tasks.total);
  const tomorrow = offsetDate(today, 1);
  const day = challengeDay();
  const dateWord = dateLabel(today, { weekday: 'long' });
  return `${pageHeading('Personal reset dashboard', 'Make today count, gently.', `${dateWord} · Day ${day} of your 30-day reset. Build consistency without expecting a perfect day.`)}
    <section class="overview-hero"><div class="hero-copy"><div class="heading-kicker">YOUR DAILY CHECK-IN</div><h2>Show up for the next small step.</h2><p>Progress is personal. Pick a manageable priority, protect your energy, and start where you are.</p></div><div class="hero-progress"><div class="progress-ring" style="--progress:${completion}%"><span>${completion}%</span></div><div class="hero-progress-label"><strong>${tasks.done} of ${tasks.total} done</strong><small>today’s priorities</small></div></div></section>
    <div class="metric-grid">${metricCard('Python / ML learning', `${Number(daily.learningMinutes) || 0}<small> min</small>`, 'Time logged today', 'brain-circuit')}${metricCard('Gym session', todayStatusLabel(gym.status), gym.status === 'complete' ? 'Nice work showing up' : gym.status === 'rested' ? 'Recovery is training too' : 'Your plan, your pace', 'dumbbell', gym.status === 'complete' ? 'good' : '')}${metricCard('College study', daily.collegeDone ? 'Checked in' : 'Not checked yet', 'Revision or assignment', 'graduation-cap', daily.collegeDone ? 'good' : '')}${metricCard('Reels check-in', daily.reelsMinutes === '' ? 'Not logged' : `${daily.reelsMinutes} min`, 'Honest check-in, no judgment', 'smartphone', daily.reelsMinutes !== '' && Number(daily.reelsMinutes) <= 30 ? 'good' : '')}</div>
    <div class="overview-grid">${taskPanel(today)}<section class="panel tomorrow-card"><div class="panel-header"><div><h2>Set up tomorrow</h2><p>A short list makes the next start easier.</p></div>${icon('sunrise')}</div><div class="task-list">${dayData(tomorrow).tasks.length ? dayData(tomorrow).tasks.map(task => taskMarkup(task, tomorrow, true)).join('') : '<div class="empty-state">Keep tomorrow light. Add the first thing you want to make space for.</div>'}</div><form class="task-add" data-form="add-task" data-date="${tomorrow}"><input class="field" name="task" maxlength="90" placeholder="Add tomorrow’s task" aria-label="Tomorrow task"><button class="button button-primary button-small" type="submit">Add</button></form></section></div>
    <div class="checkin-grid"><label class="checkin-box"><span class="checkin-title">${icon('brain')} Mood today</span><select class="select-field" data-action="daily-field" data-field="mood" data-date="${today}"><option value="">Choose a mood</option>${['Low', 'A little low', 'Okay', 'Good', 'Great'].map(value => `<option ${daily.mood === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label><label class="checkin-box"><span class="checkin-title">${icon('battery-medium')} Energy</span><select class="select-field" data-action="daily-field" data-field="energy" data-date="${today}"><option value="">Check in</option>${['Very low', 'Low', 'Steady', 'Good', 'High'].map(value => `<option ${daily.energy === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label><label class="checkin-box"><span class="checkin-title">${icon('book-open')} Learning time</span><input class="field" type="number" min="0" max="1440" data-action="daily-field" data-field="learningMinutes" data-date="${today}" value="${escapeHtml(daily.learningMinutes)}" placeholder="Minutes" aria-label="Learning minutes"></label><label class="checkin-box"><span class="checkin-title">${icon('smartphone')} Reels / screen time</span><input class="field" type="number" min="0" max="1440" data-action="daily-field" data-field="reelsMinutes" data-date="${today}" value="${escapeHtml(daily.reelsMinutes)}" placeholder="Minutes" aria-label="Reels minutes"></label></div>`;
}
function renderPlanner() {
  const today = localDate();
  const rows = state.schedule.map(row => `<div class="schedule-row"><input class="field" type="time" aria-label="${escapeHtml(row.title)} time" data-action="schedule-field" data-id="${row.id}" data-field="time" value="${escapeHtml(row.time)}"><input class="field" aria-label="Schedule item" maxlength="90" data-action="schedule-field" data-id="${row.id}" data-field="title" value="${escapeHtml(row.title)}"><div class="schedule-duration"><input class="field" type="number" min="0" max="1440" aria-label="Duration in minutes" data-action="schedule-field" data-id="${row.id}" data-field="duration" value="${row.duration}"><span>min</span></div><button class="task-remove schedule-remove" type="button" data-action="remove-schedule" data-id="${row.id}" aria-label="Remove schedule block">${icon('x')}</button></div>`).join('');
  const daily = dayData(today);
  return `${pageHeading('Plan with your real timetable', 'A day that fits your life.', 'Set class and travel hours around your actual college schedule. Move blocks, change durations, and leave breathing room between commitments.')}
    <div class="section-grid"><section class="panel"><div class="panel-header"><div><h2>Your editable timetable</h2><p>College and gym time are intentionally left for you to set.</p></div>${icon('calendar-clock')}</div><div class="planner-list">${rows || '<div class="empty-state">Your schedule is clear. Add a block to begin.</div>'}</div><button class="button button-quiet button-small" type="button" data-action="add-schedule" style="margin-top:12px">${icon('plus')} Add time block</button><p class="form-hint">Include travel, meals, short breaks, learning (30–60 min), revision, a planned 2-hour gym window, and a consistent sleep window. Edit any block to suit your classes.</p></section><div class="planner-side">${taskPanel(today, 'Today’s priorities')}<section class="panel" style="margin-top:14px"><div class="panel-header"><div><h2>Study check-in</h2><p>Count focused revision or assignment time.</p></div>${icon('graduation-cap')}</div><label class="status-line"><input type="checkbox" class="check-input" data-action="college-check" data-date="${today}" ${daily.collegeDone ? 'checked' : ''}>I made space for college work today</label><label class="form-label" style="margin-top:16px">Daily reflection</label><textarea class="text-field" maxlength="1000" placeholder="What went well? What would help tomorrow?" data-action="daily-field" data-field="reflection" data-date="${today}">${escapeHtml(daily.reflection)}</textarea><p class="form-hint">A few honest lines are enough. Your notes stay in this browser.</p></section></div></div>`;
}
function renderLearning() {
  const selected = Math.min(30, Math.max(1, Number(state.roadmap.selectedDay) || 1));
  const weeks = [{ label: 'WEEK 01 · PYTHON FOUNDATIONS', start: 1, end: 7 }, { label: 'WEEK 02 · COLLECTIONS & PROGRAMS', start: 8, end: 14 }, { label: 'WEEK 03 · DATA & ML CONCEPTS', start: 15, end: 21 }, { label: 'WEEK 04 · CLASSIFICATION PROJECT', start: 22, end: 30 }];
  const weekNav = weeks.map(week => `<div class="week-group"><div class="week-title">${week.label}</div><div class="roadmap-days">${Array.from({ length: week.end - week.start + 1 }, (_, index) => { const day = week.start + index; return `<button class="roadmap-day ${selected === day ? 'active' : ''} ${state.roadmap.completed[day] ? 'done' : ''}" data-action="select-roadmap-day" data-day="${day}" aria-label="Day ${day}${state.roadmap.completed[day] ? ', complete' : ''}">${String(day).padStart(2, '0')}</button>`; }).join('')}</div></div>`).join('');
  const [objective, checklist] = ROADMAP[selected - 1];
  const done = Boolean(state.roadmap.completed[selected]);
  const checks = state.roadmap.checks[selected] || [];
  const completedCount = Object.values(state.roadmap.completed).filter(Boolean).length;
  const selectedDate = localDate();
  return `${pageHeading('30 days · learn at your pace', 'Python to your first ML project.', `${completedCount} of 30 topics marked complete. Unfinished days stay here until you’re ready; there is no reset for missed days.`)}
    <div class="learning-layout"><aside class="panel roadmap-sidebar"><div class="panel-header"><div><h2>Learning plan</h2><p>Choose a day to work on.</p></div><span class="badge">${completedCount}/30</span></div>${weekNav}</aside><section class="panel roadmap-detail"><div class="panel-header"><div><div class="heading-kicker">DAY ${String(selected).padStart(2, '0')} · ${selected <= 7 ? 'PYTHON FUNDAMENTALS' : selected <= 14 ? 'PYTHON PRACTICE' : selected <= 21 ? 'DATA & ML' : 'CLASSIFICATION PROJECT'}</div><h2>${escapeHtml(objective)}</h2><p>One focused session is enough. Log your time when you’re done.</p></div><button class="button ${done ? 'button-quiet' : 'button-primary'} button-small" type="button" data-action="toggle-roadmap-done" data-day="${selected}">${icon(done ? 'rotate-ccw' : 'check')} ${done ? 'Revisit topic' : 'Mark complete'}</button></div><div class="objective"><strong>Today’s learning objective</strong>${escapeHtml(objective)}</div><h3>Short task checklist</h3><ul class="roadmap-checklist">${checklist.map((task, index) => `<li class="task-row"><input class="check-input" type="checkbox" data-action="roadmap-check" data-day="${selected}" data-index="${index}" ${(checks[index] || false) ? 'checked' : ''}><span class="task-copy ${(checks[index] || false) ? 'done' : ''}">${escapeHtml(task)}</span></li>`).join('')}</ul><label class="form-label">Learning notes</label><textarea class="text-field" maxlength="2000" data-action="roadmap-notes" data-day="${selected}" placeholder="What clicked? What should you revisit?">${escapeHtml(state.roadmap.notes[selected] || '')}</textarea><div class="task-add"><label class="form-label" for="learning-time" style="margin:0;align-self:center">Minutes learned today</label><input id="learning-time" class="field" style="max-width:120px" type="number" min="0" max="1440" data-action="daily-field" data-field="learningMinutes" data-date="${selectedDate}" value="${escapeHtml(dayData(selectedDate).learningMinutes)}"><span class="form-hint" style="align-self:center;margin:0">Aim for 30–60 minutes when it fits.</span></div><div class="panel-header" style="margin-top:21px;margin-bottom:0"><button class="button button-quiet button-small" type="button" data-action="select-roadmap-day" data-day="${Math.max(1, selected - 1)}" ${selected === 1 ? 'disabled' : ''}>${icon('arrow-left')} Previous day</button><button class="button button-quiet button-small" type="button" data-action="select-roadmap-day" data-day="${Math.min(30, selected + 1)}" ${selected === 30 ? 'disabled' : ''}>Next day ${icon('arrow-right')}</button></div></section></div>`;
}
function workoutForDay(dayIndex) {
  return state.workouts[dayIndex] || { type: 'Rest', exercises: [] };
}
function renderGym() {
  const today = localDate();
  const index = new Date(`${today}T00:00:00`).getDay();
  const plan = workoutForDay(index);
  const log = gymData(today);
  const exerciseRows = (plan.exercises || []).map((exercise, exerciseIndex) => `<tr><td><input class="field" maxlength="70" aria-label="Exercise name" data-action="exercise-field" data-day="${index}" data-index="${exerciseIndex}" data-field="name" value="${escapeHtml(exercise.name)}"></td><td class="sets-col"><input class="field" maxlength="12" aria-label="Sets" data-action="exercise-field" data-day="${index}" data-index="${exerciseIndex}" data-field="sets" value="${escapeHtml(exercise.sets)}"></td><td><input class="field" maxlength="15" aria-label="Reps" data-action="exercise-field" data-day="${index}" data-index="${exerciseIndex}" data-field="reps" value="${escapeHtml(exercise.reps)}"></td><td class="rest-col"><input class="field" maxlength="15" aria-label="Rest period" data-action="exercise-field" data-day="${index}" data-index="${exerciseIndex}" data-field="rest" value="${escapeHtml(exercise.rest)}"></td><td><button class="task-remove exercise-remove" type="button" data-action="remove-exercise" data-day="${index}" data-index="${exerciseIndex}" aria-label="Remove exercise">${icon('x')}</button></td></tr>`).join('');
  const history = Object.entries(state.gym).filter(([date, entry]) => date !== today && entry.status && entry.status !== 'planned').sort(([first], [second]) => second.localeCompare(first)).slice(0, 6);
  return `${pageHeading('Move well · recover well', 'Train for consistency, not punishment.', 'The daily block is a flexible 2-hour window including travel and prep, not a requirement for two hours of intense exercise. Choose rest or light recovery whenever needed.')}
    <div class="section-grid"><div><section class="panel"><div class="panel-header"><div><h2>Today’s 2-hour block</h2><p>${dateLabel(today, { weekday: 'long', month: 'short', day: 'numeric' })} · ${WEEKDAYS[index]}</p></div><span class="badge">${escapeHtml(plan.type)}</span></div><label class="form-label">Session status</label><div class="gym-status-buttons">${[['planned', 'Planned'], ['complete', 'Completed'], ['partial', 'Partial'], ['rested', 'Rested']].map(([value, label]) => `<button class="status-button ${log.status === value ? 'active' : ''}" type="button" data-action="gym-status" data-value="${value}" data-date="${today}">${label}</button>`).join('')}</div><div class="recovery-banner">${icon('heart-pulse')}<div><strong>Warm up and cool down</strong>Start with 5–10 minutes of easy movement and finish with a gentle cool-down. Scale effort to your experience, sleep, and how you feel today.</div></div><div class="panel-header" style="margin-top:22px"><div><h2>Today’s workout plan</h2><p>Adjust day type and exercises to your level.</p></div></div><label class="form-label" for="workout-type">Workout type</label><select id="workout-type" class="select-field" data-action="workout-type" data-day="${index}">${['Strength A', 'Strength B', 'Light recovery', 'Easy cardio / mobility', 'Rest', 'Custom'].map(type => `<option value="${type}" ${plan.type === type ? 'selected' : ''}>${type}</option>`).join('')}</select><div style="overflow-x:auto;margin-top:13px"><table class="exercise-table"><thead><tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>Rest</th><th></th></tr></thead><tbody>${exerciseRows || '<tr><td colspan="5"><div class="empty-state">No exercises planned. Rest or recovery is a valid session.</div></td></tr>'}</tbody></table></div><button class="button button-quiet button-small" type="button" data-action="add-exercise" data-day="${index}" style="margin-top:10px">${icon('plus')} Add exercise</button></section>
    <section class="panel" style="margin-top:14px"><div class="panel-header"><div><h2>Hydration & recovery</h2><p>Gentle signals to help look after yourself.</p></div>${icon('droplets')}</div><div class="gym-check-grid"><div><label class="form-label">Water check-in</label><div class="task-add"><input class="field" type="number" min="0" max="40" data-action="gym-field" data-field="water" data-date="${today}" value="${escapeHtml(log.water)}" aria-label="Glasses of water"><span class="form-hint" style="align-self:center;margin:0">glasses (set your own target)</span></div></div><div><label class="form-label" for="recovery-check">How does your body feel?</label><select id="recovery-check" class="select-field" data-action="gym-field" data-field="recovery" data-date="${today}"><option value="">Check in</option>${['Fresh', 'Okay', 'Tired', 'Sore', 'Unwell'].map(value => `<option ${log.recovery === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div></div><label class="form-label" style="margin-top:15px">Workout notes</label><textarea class="text-field" maxlength="1200" data-action="gym-field" data-field="notes" data-date="${today}" placeholder="What did you do? How did it feel? Any progress to remember?">${escapeHtml(log.notes)}</textarea></section></div>
    <div><section class="panel"><div class="panel-header"><div><h2>Weekly workout rhythm</h2><p>Editable template · balanced with recovery.</p></div><button class="panel-action" type="button" data-action="reset-workouts">Reset template</button></div><div class="planner-list">${state.workouts.map((workout, day) => `<label class="schedule-row" style="grid-template-columns:55px 1fr"><span class="form-label" style="margin:0">${WEEKDAYS[day]}</span><select class="select-field" data-action="workout-type" data-day="${day}">${['Strength A', 'Strength B', 'Light recovery', 'Easy cardio / mobility', 'Rest', 'Custom'].map(type => `<option value="${type}" ${workout.type === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label>`).join('')}</div><p class="form-hint">A sample, editable rhythm with recovery built in. Adapt exercises, load, and frequency to your experience; stop if you feel unwell or have pain.</p></section>
    <section class="panel" style="margin-top:14px"><div class="panel-header"><div><h2>Recent sessions</h2><p>Your saved training history.</p></div>${icon('history')}</div><div class="history-list">${history.length ? history.map(([date, entry]) => `<div class="history-row"><div><div class="history-date">${dateLabel(date, { weekday: 'short', month: 'short', day: 'numeric' })}</div><div class="history-sub">${escapeHtml(entry.notes || entry.recovery || 'Session logged')}</div></div><span class="badge ${entry.status}">${todayStatusLabel(entry.status)}</span></div>`).join('') : '<div class="empty-state">Your completed, partial, and recovery sessions will appear here.</div>'}</div></section></div></div>`;
}
function renderHabits() {
  const dates = weekDates();
  const weekDone = dates.reduce((sum, date) => sum + HABITS.filter(habit => state.habits[date]?.[habit.id]).length, 0);
  const weekPossible = dates.length * HABITS.length;
  return `${pageHeading('Return to the habit, not the streak', 'Consistency without the all-or-nothing.', 'Check off what happened, one day at a time. Missing a day never clears your history or asks you to start over.')}
    <section class="panel"><div class="panel-header"><div><h2>This week</h2><p>${dateLabel(dates[0], { month: 'short', day: 'numeric' })} – ${dateLabel(dates[6], { month: 'short', day: 'numeric' })} · ${weekDone} of ${weekPossible} check-ins</p></div><div class="weekly-score"><strong>${percent(weekDone, weekPossible)}%</strong><span>weekly<br>completion</span></div></div><div style="overflow-x:auto"><table class="habit-table"><thead><tr><th>Daily habit</th>${dates.map(date => `<th>${dateLabel(date, { weekday: 'short' })}<br>${dateLabel(date, { day: 'numeric' })}</th>`).join('')}</tr></thead><tbody>${HABITS.map(habit => `<tr><td class="habit-name">${escapeHtml(habit.label)}</td>${dates.map(date => `<td><label class="habit-day"><input type="checkbox" aria-label="${escapeHtml(habit.label)} on ${date}" data-action="habit-check" data-date="${date}" data-habit="${habit.id}" ${state.habits[date]?.[habit.id] ? 'checked' : ''}></label></td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="form-hint">Today’s checkboxes update your weekly total immediately. Older days remain editable for honest backfilling.</p></section>
    <div class="overview-grid" style="margin-top:14px"><section class="panel"><div class="panel-header"><div><h2>Habit guide</h2><p>Small, repeatable signals of a steady day.</p></div>${icon('check-check')}</div><div class="task-list">${HABITS.map((habit, index) => `<div class="task-row"><span class="metric-icon">${icon(['brain', 'graduation-cap', 'activity', 'smartphone', 'moon', 'notebook-pen'][index])}</span><span class="task-copy">${escapeHtml(habit.label)}</span></div>`).join('')}</div></section><section class="panel"><div class="panel-header"><div><h2>Keep it sustainable</h2><p>Build the routine around the life you have.</p></div>${icon('leaf')}</div><p style="color:#b3bfd0;font-size:12px;line-height:1.7;margin:0">A planned recovery day counts. A shorter study session counts. When you miss a habit, simply return to it at the next opportunity. You’re tracking patterns, not proving your worth.</p></section></div>`;
}
function renderReports() {
  const dates = weekDates();
  const values = dates.map(date => percent(HABITS.filter(habit => state.habits[date]?.[habit.id]).length, HABITS.length));
  const sumLearning = Object.values(state.daily).reduce((sum, entry) => sum + (Number(entry.learningMinutes) || 0), 0);
  const loggedDays = Object.entries(state.habits).filter(([, habits]) => Object.keys(habits).length > 0).length;
  const completedTopics = Object.values(state.roadmap.completed).filter(Boolean).length;
  const gymSessions = Object.values(state.gym).filter(entry => ['complete', 'partial'].includes(entry.status)).length;
  const reflections = Object.entries(state.daily).filter(([, entry]) => entry.reflection && entry.reflection.trim()).sort(([first], [second]) => second.localeCompare(first)).slice(0, 5);
  return `${pageHeading('Notice the progress you are making', 'Your progress, honestly measured.', 'These reports use only the check-ins and learning time you have actually logged in this browser. No sample stats, no synced devices.')}
    <section class="panel"><div class="panel-header"><div><h2>Habit completion · last 7 days</h2><p>Daily share of six habits checked off.</p></div><div class="report-start"><label class="form-label" for="start-date" style="margin:0">Challenge start</label><input id="start-date" class="field" type="date" data-action="start-date" value="${escapeHtml(state.startDate)}"></div></div><div class="chart-wrap">${values.map((value, index) => `<div class="chart-column"><span class="chart-value">${value}%</span><div class="chart-bar-track"><div class="chart-bar" style="height:${value}%"></div></div><span class="chart-label">${dateLabel(dates[index], { weekday: 'short' })}</span></div>`).join('')}</div><div class="report-stat-grid"><div class="report-stat"><strong>${loggedDays}</strong><span>days with habit check-ins</span></div><div class="report-stat"><strong>${sumLearning} min</strong><span>learning time logged</span></div><div class="report-stat"><strong>${gymSessions}</strong><span>completed or partial gym sessions</span></div></div></section>
    <div class="overview-grid" style="margin-top:14px"><section class="panel"><div class="panel-header"><div><h2>Learning roadmap</h2><p>Only topics you marked complete are counted.</p></div>${icon('book-open-check')}</div><div class="weekly-score"><strong>${completedTopics}<span style="font:500 12px 'DM Sans',sans-serif;color:#8996ac"> / 30</span></strong><span>topics completed<br>or revisited</span></div><div class="progress-track" style="margin-top:15px;height:7px"><span style="width:${completedTopics / 30 * 100}%"></span></div></section><section class="panel"><div class="panel-header"><div><h2>Recent reflections</h2><p>Your notes are private to this browser.</p></div>${icon('notebook-pen')}</div>${reflections.length ? reflections.map(([date, entry]) => `<div class="reflection-entry"><time>${dateLabel(date, { weekday: 'short', month: 'short', day: 'numeric' })}</time><p>${escapeHtml(entry.reflection)}</p></div>`).join('') : '<div class="empty-state">Reflections you write in the daily planner will appear here.</div>'}</section></div>`;
}
function updateAndRender(message) { saveState(message); render(); }
function handleClick(event) {
  const nav = event.target.closest('[data-view]');
  if (nav) {
    currentView = nav.dataset.view;
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('mobile-scrim').classList.remove('visible');
    render();
    document.getElementById('view-root').focus({ preventScroll: true });
    return;
  }
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { action } = button.dataset;
  if (action === 'add-schedule') {
    state.schedule.push({ id: `block-${Date.now()}`, time: '', title: 'New time block', duration: 30 });
    updateAndRender('Time block added.');
  } else if (action === 'remove-schedule') {
    state.schedule = state.schedule.filter(row => row.id !== button.dataset.id);
    updateAndRender('Time block removed.');
  } else if (action === 'select-roadmap-day') {
    state.roadmap.selectedDay = Number(button.dataset.day);
    saveState(); render();
  } else if (action === 'toggle-roadmap-done') {
    const day = button.dataset.day;
    state.roadmap.completed[day] = !state.roadmap.completed[day];
    updateAndRender(state.roadmap.completed[day] ? 'Topic marked complete.' : 'Topic ready to revisit.');
  } else if (action === 'gym-status') {
    gymData(button.dataset.date).status = button.dataset.value;
    updateAndRender('Gym check-in saved.');
  } else if (action === 'add-exercise') {
    workoutForDay(Number(button.dataset.day)).exercises.push({ name: '', sets: '3', reps: '8-10', rest: '90 sec' });
    updateAndRender('Exercise added.');
  } else if (action === 'remove-exercise') {
    workoutForDay(Number(button.dataset.day)).exercises.splice(Number(button.dataset.index), 1);
    updateAndRender('Exercise removed.');
  } else if (action === 'reset-workouts') {
    if (confirm('Reset the weekly workout schedule to the original editable template?')) {
      state.workouts = structuredClone(DEFAULT_WORKOUTS);
      updateAndRender('Workout template restored.');
    }
  }
}
function handleChange(event) {
  const target = event.target;
  const action = target.dataset.action;
  if (!action) return;
  const { date, field, id, day, index } = target.dataset;
  if (action === 'task-check') {
    const task = dayData(date).tasks.find(item => item.id === id);
    if (task) task.done = target.checked;
    updateAndRender();
  } else if (action === 'remove-task') {
    const item = dayData(date);
    item.tasks = item.tasks.filter(task => task.id !== id);
    updateAndRender('Priority removed.');
  } else if (action === 'daily-field') {
    dayData(date)[field] = target.value;
    updateAndRender();
  } else if (action === 'college-check') {
    dayData(date).collegeDone = target.checked;
    updateAndRender('Study check-in saved.');
  } else if (action === 'schedule-field') {
    const row = state.schedule.find(item => item.id === id);
    if (row) row[field] = field === 'duration' ? Math.max(0, Number(target.value) || 0) : target.value;
    updateAndRender();
  } else if (action === 'roadmap-check') {
    const checks = state.roadmap.checks[day] || [];
    checks[index] = target.checked;
    state.roadmap.checks[day] = checks;
    updateAndRender();
  } else if (action === 'roadmap-notes') {
    state.roadmap.notes[day] = target.value;
    saveState();
  } else if (action === 'habit-check') {
    habitData(date)[target.dataset.habit] = target.checked;
    updateAndRender();
  } else if (action === 'gym-field') {
    const entry = gymData(date);
    entry[field] = field === 'water' ? Math.max(0, Number(target.value) || 0) : target.value;
    updateAndRender();
  } else if (action === 'workout-type') {
    state.workouts[Number(day)].type = target.value;
    if (target.value !== 'Custom') state.workouts[Number(day)].exercises = structuredClone(DEFAULT_EXERCISES[target.value] || []);
    updateAndRender('Weekly workout schedule saved.');
  } else if (action === 'exercise-field') {
    workoutForDay(Number(day)).exercises[Number(index)][field] = target.value;
    saveState();
  } else if (action === 'start-date') {
    state.startDate = target.value || localDate();
    updateAndRender('Challenge start date updated.');
  }
}
function handleSubmit(event) {
  const form = event.target.closest('[data-form="add-task"]');
  if (!form) return;
  event.preventDefault();
  const input = form.elements.task;
  const label = input.value.trim();
  if (!label) { input.focus(); return; }
  dayData(form.dataset.date).tasks.push({ id: `task-${Date.now()}`, label, done: false });
  updateAndRender('Priority added.');
}
function exportData() {
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), app: 'My 30-Day Reset', data: state }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `my-30-day-reset-${localDate()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('Your dashboard data has been exported.');
}
function clearData() {
  if (!confirm('Clear all saved tasks, check-ins, schedule edits, workout records, and reflections from this browser? This cannot be undone. Export first if you want a backup.')) return;
  localStorage.removeItem(STORAGE_KEY);
  state = freshState();
  updateAndRender('Saved data cleared.');
}

document.addEventListener('click', handleClick);
document.addEventListener('change', handleChange);
document.addEventListener('submit', event => {
  if (event.target.id === 'assistant-form') {
    event.preventDefault();
    const input = document.getElementById('assistant-input');
    const message = input.value;
    input.value = '';
    sendAssistantMessage(message);
    return;
  }
  handleSubmit(event);
});
document.getElementById('export-data').addEventListener('click', exportData);
document.getElementById('clear-data').addEventListener('click', clearData);
document.getElementById('assistant-launcher').addEventListener('click', () => {
  setAssistantOpen(!document.getElementById('assistant-panel').classList.contains('open'));
});
document.getElementById('assistant-close').addEventListener('click', () => setAssistantOpen(false));
document.getElementById('assistant-clear').addEventListener('click', clearAssistantChat);
document.getElementById('assistant-prompts').addEventListener('click', event => {
  const prompt = event.target.closest('[data-prompt]');
  if (!prompt) return;
  sendAssistantMessage(prompt.dataset.prompt);
});
document.getElementById('assistant-messages').addEventListener('click', event => {
  const button = event.target.closest('[data-speak]');
  if (button) speakAssistantReply(button.closest('.assistant-message').querySelector('p').textContent);
  const retry = event.target.closest('[data-retry]');
  if (retry) sendAssistantMessage('', true);
});
document.getElementById('assistant-stop-speaking').addEventListener('click', () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
});
document.getElementById('assistant-input').addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    document.getElementById('assistant-form').requestSubmit();
  }
});
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('mobile-scrim').classList.add('visible');
});
document.getElementById('mobile-scrim').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('mobile-scrim').classList.remove('visible');
});
setupSpeechRecognition();
render();
