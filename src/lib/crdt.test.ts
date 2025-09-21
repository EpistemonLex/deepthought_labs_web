import * as Y from 'yjs';
import {
  createDocument,
  getText,
  updateText,
  applyUpdate,
  getUpdate,
} from './crdt';

describe('CRDT Library', () => {
  it('should create a new document', () => {
    const doc = createDocument();
    expect(doc).toBeInstanceOf(Y.Doc);
  });

  it('should get and update text', () => {
    const doc = createDocument();
    const key = 'test-text';

    // Get text, which should be empty initially
    let yText = getText(doc, key);
    expect(yText).toBeInstanceOf(Y.Text);
    expect(yText.toString()).toBe('');

    // Update the text
    const newContent = 'hello world';
    updateText(doc, key, newContent);

    // Get the text again and check the content
    yText = getText(doc, key);
    expect(yText.toString()).toBe(newContent);
  });

  it('should simulate two clients collaborating and merge changes', () => {
    // --- Test 1: Simple sync ---
    const doc1 = createDocument();
    const doc2 = createDocument();
    const key = 'shared-text';

    // Client 1 makes a change
    updateText(doc1, key, 'hello from client 1');
    const update1 = getUpdate(doc1);
    applyUpdate(doc2, update1);

    // Verify client 2 has the changes
    expect(getText(doc2, key).toString()).toBe('hello from client 1');

    // Client 2 makes a change (overwriting the whole text)
    updateText(doc2, key, 'hello from client 2');
    const update2 = getUpdate(doc2);
    applyUpdate(doc1, update2);

    // Verify both are in sync with the latest change
    expect(getText(doc1, key).toString()).toBe('hello from client 2');
    expect(getText(doc2, key).toString()).toBe('hello from client 2');

    // --- Test 2: True CRDT merge ---
    const docA = createDocument();
    const docB = createDocument();
    const sharedKey = 'merge-text';

    // Make concurrent, non-conflicting changes
    const textA = getText(docA, sharedKey);
    textA.insert(0, 'world');

    const textB = getText(docB, sharedKey);
    textB.insert(0, 'hello ');

    // Sync docA with docB's changes
    const updateFromB = Y.encodeStateAsUpdate(docB);
    applyUpdate(docA, updateFromB);

    // Sync docB with docA's changes (as it was before getting B's update)
    const updateFromA = Y.encodeStateAsUpdate(docA);
    applyUpdate(docB, updateFromA);

    // After syncing, both should have the merged content.
    // The exact order depends on clientIDs, but they must be identical.
    expect(getText(docA, sharedKey).toString()).toBe(getText(docB, sharedKey).toString());
    // And check if the content is what we expect (either "hello world" or "worldhello ")
    expect(getText(docA, sharedKey).toString().includes('hello')).toBe(true);
    expect(getText(docA, sharedKey).toString().includes('world')).toBe(true);
  });
});
