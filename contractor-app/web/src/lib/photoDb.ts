// lib/photoDb.ts — IndexedDB persistence for captured photos (blueprint §"iOS offline-photo handling").
// localStorage can't hold real image blobs (~5MB total quota); IndexedDB can. Records are keyed by the
// client idempotency key so a retake of the same slot replaces the old blob instead of accumulating.
// "A photo is never lost": the blob lives here from the moment of capture until well after upload.
import type { CapturedPhoto } from '../types';

const DB_NAME = 'tj-photos';
const STORE = 'photos';
const VERSION = 1;

/** What we persist: the photo metadata + the actual bytes. `localUri` is NOT stored — it's a
 *  session-scoped object URL recreated from the blob on load. */
export type StoredPhoto = Omit<CapturedPhoto, 'localUri'> & { blob: Blob; created_at: number };

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    try {
      if (!('indexedDB' in window)) return resolve(null);
      const req = indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'client_idem_key' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null); // private-mode / quota failures degrade gracefully
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

function tx<T>(db: IDBDatabase, mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T | null> {
  return new Promise((resolve) => {
    try {
      const t = db.transaction(STORE, mode);
      const req = run(t.objectStore(STORE));
      req.onsuccess = () => resolve(req.result as T);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function putPhoto(photo: StoredPhoto): Promise<void> {
  const db = await openDb();
  if (!db) return;
  await tx(db, 'readwrite', (s) => s.put(photo));
}

export async function getAllPhotos(): Promise<StoredPhoto[]> {
  const db = await openDb();
  if (!db) return [];
  const all = await tx<StoredPhoto[]>(db, 'readonly', (s) => s.getAll() as IDBRequest<StoredPhoto[]>);
  return all ?? [];
}

export async function getPhoto(idemKey: string): Promise<StoredPhoto | null> {
  const db = await openDb();
  if (!db) return null;
  return await tx<StoredPhoto>(db, 'readonly', (s) => s.get(idemKey) as IDBRequest<StoredPhoto>);
}

export async function updatePhotoStatusDb(idemKey: string, status: CapturedPhoto['upload_status']): Promise<void> {
  const existing = await getPhoto(idemKey);
  if (!existing) return;
  await putPhoto({ ...existing, upload_status: status });
}
