type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Loading the story...' }: LoadingStateProps) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-state__line" />
      <p>{label}</p>
    </div>
  );
}
