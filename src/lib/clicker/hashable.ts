/**
 * Marker interface for objects that can produce a shallow copy of themselves.
 * Used by {@link Model} to snapshot state before and after mutations.
 */
export interface Hashable {
  copy(): unknown;
}
