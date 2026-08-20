export function PacmanLoader(props: { color: string }) {
  return (
    <span class="pacman-loader" style={{ "--loader-color": props.color }}>
      <span class="pacman-loader__pacman-1" />
      <span class="pacman-loader__pacman-2" />
      <span class="pacman-loader__ball" />
      <span class="pacman-loader__ball" />
      <span class="pacman-loader__ball" />
      <span class="pacman-loader__ball" />
    </span>
  );
}
