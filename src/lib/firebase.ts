// Firebase removed — frontend shim that implements a small subset
// of auth/firestore functions used by the UI and proxies them to the
// standalone backend service (Prisma + Postgres). This lets the
// frontend run without the Firebase SDK while keeping existing imports.

const app = null;

const API_BASE = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL)
    ? process.env.NEXT_PUBLIC_API_URL
    : '';

async function fetchToBackend(path: string, opts: any = {}) {
    const url = `${API_BASE.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`;
    let res: Response | null = null;
    try {
        res = await fetch(url, opts);
    } catch (e) {
        console.warn('fetchToBackend network error', e, url);
        return {};
    }

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        const err = new Error(`Backend error ${res.status}: ${text}`);
        // @ts-ignore
        err.status = res.status;
        throw err;
    }
    return res.json().catch(() => ({}));
}

const auth: any = {
    currentUser: null,
    onAuthStateChanged: (cb: (u: any) => void) => {
        try { cb(null); } catch (e) {}
        return () => {};
    }
};

const db = {
    collection: (name: string) => ({
        onSnapshot: (cb: any) => {
            // One-time fetch + no real-time updates (polling could be added)
            (async () => {
                try {
                    if (name === 'teachers' || name === 'teacherProfiles') {
                        const data = await fetchToBackend('/api/list-teachers');
                        const docs = (data.teachers || []).map((t: any) => ({ id: t.id, data: () => t }));
                        cb({ docs });
                    } else {
                        cb({ docs: [] });
                    }
                } catch (e) {
                    console.error('collection.onSnapshot error', e);
                    cb({ docs: [] });
                }
            })();
            return () => {};
        },
        get: async () => {
            if (name === 'teachers' || name === 'teacherProfiles') {
                const data = await fetchToBackend('/api/list-teachers');
                return { docs: (data.teachers || []).map((t: any) => ({ id: t.id, data: () => t })) };
            }
            return { docs: [] };
        }
    }),
    doc: (_db: any, col: string, id?: string) => ({ id })
};

const storage = null;

// Auth helpers that proxy to backend minimal endpoints
async function signInWithEmailAndPassword(_auth: any, email: string) {
    // backend login returns user if exists
    return await fetchToBackend('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
}
async function createUserWithEmailAndPassword(_auth: any, email: string, _password: string) {
    // Create user record; in a production app you'd also create credentials.
    return await fetchToBackend('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: email, name: email.split('@')[0], email, role: 'student' }) });
}
async function updateProfile(_user: any, _data: any) { return; }
async function signOut(_auth: any) { return; }
async function deleteUser(_user: any) { return; }
async function updatePassword(_user: any, _newPassword: string) { return; }

// Firestore-lite helpers backed by the backend
async function getDoc(ref: any) {
    try {
        const id = ref && ref.id;
        if (!id) return { exists: () => false, data: () => null };
        const data = await fetchToBackend(`/api/teacher/${encodeURIComponent(id)}`);
        if (!data || !data.teacher) return { exists: () => false, data: () => null };
        return { exists: () => true, data: () => data.teacher };
    } catch (e) {
        return { exists: () => false, data: () => null };
    }
}
async function updateDoc(_ref: any, _data: any) { return; }
async function deleteDoc(_ref: any) { return; }

function onAuthStateChanged(_authObj: any, cb: (u: any) => void) { return auth.onAuthStateChanged(cb); }
function collection(_db: any, name: string) { return db.collection(name); }
function onSnapshot(colRef: any, cb: any) { if (colRef && typeof colRef.onSnapshot === 'function') return colRef.onSnapshot(cb); return () => {}; }
function doc(_db: any, col: string, id?: string) { return db.doc(_db, col, id); }

export {
    app,
    auth,
    db,
    storage,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    deleteUser,
    updatePassword,
    getDoc,
    updateDoc,
    deleteDoc,
    // compatibility helpers
    onAuthStateChanged,
    collection,
    onSnapshot,
    doc,
};
