import { describe, it, expect } from 'vitest';
import * as Y from 'yjs';
import {
  createDocument,
  getText,
  updateText,
  applyUpdate,
  getUpdate,
} from './crdt';

describe('CRDT', () => {
  it('should create a new document', () => {
    const doc = createDocument();
    expect(doc).toBeInstanceOf(Y.Doc);
  });

  it('should get a text instance from a document', () => {
    const doc = createDocument();
    const text = getText(doc, 'test');
    expect(text).toBeInstanceOf(Y.Text);
  });

  it('should update the content of a text instance', () => {
    const doc = createDocument();
    const text = getText(doc, 'test');
    updateText(doc, 'test', 'hello world');
    expect(text.toString()).toBe('hello world');
  });

  it('should apply an update to a document', () => {
    const doc1 = createDocument();
    const doc2 = createDocument();
    updateText(doc1, 'test', 'hello world');
    const update = getUpdate(doc1);
    applyUpdate(doc2, update);
    const text = getText(doc2, 'test');
    expect(text.toString()).toBe('hello world');
  });

  it('should get an update from a document', () => {
    const doc = createDocument();
    updateText(doc, 'test', 'hello world');
    const update = getUpdate(doc);
    expect(update).toBeInstanceOf(Uint8Array);
  });
});