import * as Y from 'yjs';

/**
 * Creates a new Yjs document.
 * @returns A new Y.Doc instance.
 */
export function createDocument(): Y.Doc {
  return new Y.Doc();
}

/**
 * Retrieves a Y.Text instance from a Y.Doc.
 * @param doc The Y.Doc instance.
 * @param key The key for the Y.Text instance.
 * @returns The Y.Text instance.
 */
export function getText(doc: Y.Doc, key: string): Y.Text {
  return doc.getText(key);
}

/**
 * Updates the content of a Y.Text instance.
 * @param doc The Y.Doc instance.
 * @param key The key for the Y.Text instance.
 * @param content The new content.
 */
export function updateText(doc: Y.Doc, key: string, content: string) {
  const yText = doc.getText(key);
  // We replace the whole content for simplicity in this basic implementation.
  yText.delete(0, yText.length);
  yText.insert(0, content);
}

/**
 * Applies a Yjs update to a document.
 * @param doc The Y.Doc to apply the update to.
 * @param update The update to apply (Uint8Array).
 */
export function applyUpdate(doc: Y.Doc, update: Uint8Array) {
  Y.applyUpdate(doc, update);
}

/**
 * Encodes the state of a Yjs document as an update.
 * This update can be used to bring another document up to date.
 * @param doc The Y.Doc to get the state from.
 * @returns The document state as a Uint8Array.
 */
export function getUpdate(doc: Y.Doc): Uint8Array {
  return Y.encodeStateAsUpdate(doc);
}
