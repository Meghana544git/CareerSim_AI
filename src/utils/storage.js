/**
 * Defensive localStorage manager for CareerSim AI.
 * Handles state persistence across browser refreshes and session restarts.
 */

const STORAGE_KEYS = {
  ACTIVE_SESSION: 'careersim_active_session_v1',
  HISTORY: 'careersim_assessment_history_v1',
  ROADMAP_PROGRESS: 'careersim_roadmap_progress_v1'
};

/**
 * Safely parse JSON from localStorage
 */
function safeGetItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[CareerSim] Failed to load key "${key}" from localStorage:`, err);
    return defaultValue;
  }
}

/**
 * Safely write JSON to localStorage
 */
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[CareerSim] Failed to save key "${key}" to localStorage:`, err);
    return false;
  }
}

/**
 * Safely remove key from localStorage
 */
function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[CareerSim] Failed to remove key "${key}" from localStorage:`, err);
  }
}

// ==========================================
// SESSION MANAGEMENT (For Refresh Resilience)
// ==========================================

export function saveActiveSession(sessionData) {
  return safeSetItem(STORAGE_KEYS.ACTIVE_SESSION, {
    ...sessionData,
    updatedAt: new Date().toISOString()
  });
}

export function loadActiveSession() {
  const session = safeGetItem(STORAGE_KEYS.ACTIVE_SESSION, null);
  if (!session) return null;

  // Basic validation to prevent corrupted state
  if (!session.screen || !['home', 'interview', 'results'].includes(session.screen)) {
    return null;
  }

  return session;
}

export function clearActiveSession() {
  safeRemoveItem(STORAGE_KEYS.ACTIVE_SESSION);
}

// ==========================================
// ASSESSMENT HISTORY (Stretch Feature 1)
// ==========================================

export function getAssessmentHistory() {
  return safeGetItem(STORAGE_KEYS.HISTORY, []);
}

export function saveAssessmentToHistory(assessmentResult) {
  if (!assessmentResult) return [];
  const existing = getAssessmentHistory();
  
  const historyEntry = {
    id: `history-${Date.now()}`,
    timestamp: new Date().toISOString(),
    roleId: assessmentResult.roleId,
    roleTitle: assessmentResult.roleTitle,
    overallReadiness: assessmentResult.overallReadiness,
    readinessTier: assessmentResult.readinessTier,
    skillBreakdown: assessmentResult.skillBreakdown,
    summary: assessmentResult.summary
  };

  // Keep most recent 15 entries
  const updated = [historyEntry, ...existing].slice(0, 15);
  safeSetItem(STORAGE_KEYS.HISTORY, updated);
  return updated;
}

export function clearAssessmentHistory() {
  safeRemoveItem(STORAGE_KEYS.HISTORY);
  return [];
}

// ==========================================
// ROADMAP PROGRESS TRACKING
// ==========================================

export function getRoadmapProgress() {
  return safeGetItem(STORAGE_KEYS.ROADMAP_PROGRESS, {});
}

export function toggleRoadmapItemProgress(stepId) {
  const current = getRoadmapProgress();
  const updated = {
    ...current,
    [stepId]: !current[stepId]
  };
  safeSetItem(STORAGE_KEYS.ROADMAP_PROGRESS, updated);
  return updated;
}

export function clearRoadmapProgress() {
  safeRemoveItem(STORAGE_KEYS.ROADMAP_PROGRESS);
  return {};
}
