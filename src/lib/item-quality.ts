const PLACEHOLDER_NAMES = new Set([
  'test', 'testing', 'asdf', 'qwerty', 'sample', 'example',
  'foo', 'bar', 'baz', 'hello', 'hi', 'placeholder',
  'temp', 'tmp', 'xxx', 'aaa', 'zzz', 'abc', 'blah',
  'stuff', 'thing', 'item', 'n/a', 'none', 'todo', 'tbd',
])

/**
 * Returns true if an item name looks like a real gift (not placeholder/test data).
 * Used to gate AI suggestions — we need at least one meaningful item.
 */
export function isMeaningfulItem(name: string): boolean {
  const trimmed = name.trim().toLowerCase()
  if (trimmed.length < 4) return false
  if (!/[a-z]/.test(trimmed)) return false
  if (PLACEHOLDER_NAMES.has(trimmed)) return false
  if (/^(.)\1+$/.test(trimmed)) return false
  return true
}
