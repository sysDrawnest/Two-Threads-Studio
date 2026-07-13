export interface EventDispatcher {
  emit(event: string, payload: any): Promise<void>;
}
