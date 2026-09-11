# CareerSim AI — AI Career Simulation Lab

> **Practice. Assess. Improve. Get Career Ready.**  
> A career interview simulation platform designed for college students and early-career candidates preparing for technical software engineering, data science, and web development interviews.

---

## 📌 Problem Statement

College students and early-career candidates preparing for technical interviews face critical roadblocks:
1. **Keyword-Stuffing Blindspots in Automated Screeners**: Traditional keyword matchers reward candidates who dump technical buzzwords ("Python, React, Java, SQL, TensorFlow") even when the answer does not address the actual question.
2. **Uncertainty Around Technical Readiness**: Candidates lack objective feedback on whether their explanation depth, correctness, and relevance meet industry standards.
3. **Lack of Actionable Roadmaps**: Binary pass/fail outcomes provide zero structured guidance on how to systematically close identified skill gaps.

---

## 💡 Solution: Semantic AI Evaluation Architecture

**CareerSim AI** integrates **OpenRouter API** for semantic answer evaluation alongside an offline-resilient local deterministic fallback.

The system evaluates **every interview answer independently**, understanding the candidate's actual conceptual meaning rather than counting keywords:

```
Candidate Submits Answer (Per Question)
                 ↓
      "Analyzing your answer..."
                 ↓
    POST /api/evaluate (Secure Server-Side Proxy)
                 ↓
    ┌───────────────────────────────┐
    │  OPENROUTER_API_KEY present?  │
    └──────────────┬────────────────┘
           Yes     │           No / Timeout / Network Error
                   ▼                                     ▼
        OpenRouter API                             Enhanced Local Fallback
    (Semantic JSON Evaluation)                   (Deterministic Concept Engine)
                   │                                     │
                   └─────────────────┬───────────────────┘
                                     ▼
                      Sanitization & Relevance Gate
                                     ▼
           Independent Question Evaluation Result Saved
                                     ▼
   Repeat for 5 Questions → Composite Career Readiness Report
```

---

## 🧠 Critical Semantic Evaluation Dimensions

Every submitted response is analyzed across **5 evaluation dimensions** and structured criteria:

| Dimension | Weight | Criteria |
|---|---|---|
| **Relevance** | **35%** | Did the candidate directly answer the exact question? Identifies on-topic vs off-topic statements. Unrelated technical keywords are treated as irrelevant. |
| **Technical Correctness** | **30%** | Isolates statements that are technically accurate versus inaccurate. Mixed answers are not blindly classified as wholly correct. |
| **Concept Understanding** | **20%** | Measures understanding of core domain principles, covered concepts, and missing concepts. |
| **Completeness & Depth** | **10%** | Measures explanation depth. **Concise correct answers are rewarded without penalty for brevity.** |
| **Clarity** | **5%** | Evaluates logical organization and coherent technical communication. |

### 🛡️ Mandatory Relevance Gate
To eliminate keyword-stuffing vulnerabilities, the final score enforces a strict relevance gate:
- **Relevance < 20%**: Maximum final score = **10/100** (hard cap).
- **Relevance 20% – 39%**: Maximum final score = **25/100** (hard cap).
- **Relevance 40% – 59%**: Maximum final score = **50/100** (hard cap).
- **Relevance ≥ 60%**: Normal weighted scoring permitted.

### 🔍 Mixed Answer Categorization
Candidates often provide answers containing correct facts, mistakes, and off-topic thoughts concurrently. CareerSim AI separates each category:
- **✓ Correct points**: Specific statements that accurately explain the concept.
- **✗ Incorrect points**: Specific inaccuracies or false technical claims with explanations.
- **⚠ Irrelevant points**: Unrelated tools, languages, or statements that do not answer the question.
- **→ Missing concepts**: Crucial architectural or theoretical points omitted from the explanation.

---

## 🔐 Security Architecture

To protect API credentials:
- **Zero Client-Side Exposure**: `OPENROUTER_API_KEY` is **NEVER** bundled into React source code, `App.jsx`, `evaluation.js`, browser-exposed environment variables, or GitHub commits.
- **Server-Side Proxy**: The React frontend only communicates with our internal `/api/evaluate` endpoint (handled via Vite middleware in development and preview, and via `api/evaluate.js` in production).
- **Git Protection**: `.env` and `.env.*` are added to `.gitignore`.
- **Template Configuration**: `.env.example` is provided with empty keys for quick onboarding.

---

## 🚀 Key Features

### Core Features
- **4 Career Tracks**: Frontend Developer, ML Engineer, Data Analyst, Software Engineer.
- **5-Question Structured Simulation**: One question at a time with category badges, guidance hints, real-time word/character counters, and inline validation.
- **Independent Answer Evaluation**: Every question is evaluated asynchronously with `"Analyzing your answer..."` state and double-click submission prevention.
- **Question-by-Question Breakdown**: Detailed interactive review cards on the Results screen showing ✓ correct, ✗ incorrect, ⚠ irrelevant, → missing points, and detection flags.
- **Dual-Mode Evaluation Indicator**: Transparently displays `AI Evaluated` (sparkle badge) or `Deterministic Fallback` (shield badge).
- **Strengths & Weaknesses**: Derived directly from evaluation findings (e.g. "Strong technical understanding", "Needs to improve answer focus and relevance", "Needs greater depth in technical explanations").
- **Personalized Improvement Roadmap**: 4 milestones dynamically targeting lowest-scoring competencies with interactive checkbox tracking.

### Stretch Features
- **Assessment History**: Persisted timeline of attempts in `localStorage` with scores, dates, and competency breakdowns.
- **Retake Simulation**: Fast reset to practice repeatedly and track score progression.
- **Session Recovery**: Defensive `localStorage` hydration recovers in-progress answers and evaluation states across browser refreshes.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS v3, Lucide React
- **Semantic Evaluator**: OpenRouter API (`openai/gpt-4o-mini`, `google/gemini-2.0-flash-001`, etc.)
- **Server / Middleware**: Vite Connect Middleware (`server/evaluateHandler.js`), Vercel Serverless Function (`api/evaluate.js`)
- **Fallback Engine**: Enhanced deterministic concept pattern matcher (`src/utils/evaluation.js`)
- **Persistence**: Defensive `localStorage` with JSON validation

---

## 💻 How to Configure and Run Locally

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 2. Clone and Install
```bash
cd ai-simulated
npm install
```

### 3. Configure OpenRouter API Key
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and insert your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_MODEL=openai/gpt-4o-mini
   ```
   > **Note**: If `OPENROUTER_API_KEY` is omitted or left blank, CareerSim AI will automatically and seamlessly use the enhanced local deterministic evaluator as fallback. The application will never crash.

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build and Preview for Production
```bash
npm run build
npm run preview
```

---

## 🧪 Testing the Evaluator

Run the automated test suite covering all 18 evaluation scenarios:
```bash
npm test
```

### Verified Test Cases:
1. **Excellent Relevant Answer**: Scores in high 80–100 range with multiple identified correct points.
2. **Short but Correct Answer**: Concise correct definitions are rewarded fairly without penalty for brevity.
3. **Mostly Correct Answer**: Scores in 65–85 range with constructive feedback.
4. **Partially Correct Answer**: Scores in 25–65 range with missing concepts clearly highlighted.
5. **Completely Irrelevant Answer**: Random off-topic text scores ≤ 10 with `is_relevant: false`.
6. **Keyword-Stuffed Irrelevant Answer (MOST IMPORTANT TEST)**: Responses dumping technical terms ("Python, Java, SQL, React...") to an unrelated question are strictly capped at **≤ 10/100**.
7. **Correct + Incorrect Information**: Evaluator identifies both correct and incorrect statements separately.
8. **Correct + Irrelevant Information**: Relevant content contributes to the score while irrelevant mentions do not artificially inflate the score.
9. **Correct + Incorrect + Irrelevant Information**: Isolates all three categories concurrently.
10. **Empty Answer**: Evaluated to 0 score without network calls.
11. **Technically Incorrect Answer**: Misconceptions identified and scored low.
12. **Frontend Keyword Stuffing**: Tech dumps on frontend questions capped at ≤ 10.
13. **API Failure Fallback**: Gracefully uses local evaluator with `evaluationMode: "fallback"` when API key is missing or network fails.
14. **Invalid JSON from AI**: Safely sanitizes missing fields without crashing.
15. **Scores Above 100**: Clamped strictly to ≤ 100.
16. **Negative Scores**: Clamped to ≥ 0 and relevance gate enforced.
17. **Double Submission Guard**: Blocks rapid duplicate submit clicks.
18. **Composite Interview Readiness**: Aggregates 5 independent answers into skill breakdown, readiness tier, and roadmap.

---

## 📱 Mobile Responsiveness

- Verified across desktop screens down to **375px mobile viewports**.
- Zero horizontal overflow.
- Clean collapsible question breakdown cards with touch-friendly tap targets.

---

## 🤖 AI Tools Disclosure

In accordance with hackathon guidelines, the following AI tools were utilized during the development of this project:
- **Google Antigravity**: Primary development assistant for architecture planning, component implementation, evaluation engine design, and test suite creation.
- **OpenRouter AI**: Used at runtime for semantic answer evaluation across relevance, technical correctness, concept understanding, completeness, and clarity.
- **ChatGPT**: Used for initial ideation of question rubrics and role competencies.
