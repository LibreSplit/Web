import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { Star } from "lucide-solid";
import {
  type ComponentProps,
  type JSX,
  type Resource,
  Show,
  createEffect,
  createSignal,
  mergeProps,
  on,
  onCleanup,
  splitProps,
  untrack,
} from "solid-js";

const githubButtonVariants = cva(
  "cursor-pointer relative overflow-hidden will-change-transform backface-visibility-hidden transform-gpu transition-transform duration-200 ease-out hover:scale-105 group whitespace-nowrap focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-950 hover:bg-zinc-900 text-white border-gray-700 dark:bg-zinc-50 dark:border-gray-300 dark:text-zinc-950 dark:hover:bg-zinc-50",
        outline:
          "bg-background text-accent-foreground border border-input hover:bg-accent",
      },
      size: {
        default:
          "h-8.5 rounded-md px-3 gap-2 text-[0.8125rem] leading-none [&_svg]:size-4 gap-2",
        sm: "h-7 rounded-md px-2.5 gap-1.5 text-xs leading-none [&_svg]:size-3.5 gap-1.5",
        lg: "h-10 rounded-md px-4 gap-2.5 text-sm leading-none [&_svg]:size-5 gap-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type UseInViewOptions = IntersectionObserverInit & { once?: boolean };

interface GithubButtonProps
  extends
    Omit<ComponentProps<"button">, "class" | "onClick" | "onKeyDown" | "ref">,
    VariantProps<typeof githubButtonVariants> {
  class?: string;
  /** Whether to round stars */
  roundStars?: boolean;
  /** Whether to show Github icon */
  fixedWidth?: boolean;
  /** Initial number of stars */
  initialStars?: number;
  /** Class for stars */
  starsClass?: string;
  /** Resource that fetches stars from the github API */
  stars?: Resource<number>;
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Animation delay in seconds */
  animationDelay?: number;
  /** Whether to start animation automatically */
  autoAnimate?: boolean;
  /** Whether to show Github icon */
  showGithubIcon?: boolean;
  /** Whether to show star icon */
  showStarIcon?: boolean;
  /** Whether to show separator */
  separator?: boolean;
  /** Whether stars should be filled */
  filled?: boolean;
  /** Repository URL for actual Github integration */
  repoUrl?: string;
  /** Button text label */
  label?: string;
  /** Use in-view detection to trigger animation */
  useInViewTrigger?: boolean;
  /** In-view options */
  inViewOptions?: UseInViewOptions;
  /** Click event handler */
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  /** Keydown event handler */
  onKeyDown?: JSX.EventHandler<HTMLButtonElement, KeyboardEvent>;
  /** Custom element ref */
  ref?: HTMLButtonElement | ((element: HTMLButtonElement) => void);
}

function GithubButton(receivedProps: GithubButtonProps) {
  const props = mergeProps(
    {
      initialStars: 0,
      starsClass: "",
      fixedWidth: true,
      animationDuration: 2,
      animationDelay: 0,
      autoAnimate: true,
      variant: "default" as const,
      size: "default" as const,
      showGithubIcon: true,
      showStarIcon: true,
      roundStars: false,
      separator: false,
      filled: false,
      label: "",
      useInViewTrigger: false,
      inViewOptions: { once: true } as UseInViewOptions,
    },
    receivedProps,
  );
  const [local, buttonProps] = splitProps(props, [
    "initialStars",
    "stars",
    "starsClass",
    "fixedWidth",
    "animationDuration",
    "animationDelay",
    "autoAnimate",
    "class",
    "variant",
    "size",
    "showGithubIcon",
    "showStarIcon",
    "roundStars",
    "separator",
    "filled",
    "repoUrl",
    "onClick",
    "onKeyDown",
    "label",
    "useInViewTrigger",
    "inViewOptions",
    "ref",
  ]);

  const [currentStars, setCurrentStars] = createSignal(local.initialStars);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [starProgress, setStarProgress] = createSignal(0);
  const [hasAnimated, setHasAnimated] = createSignal(false);
  const [isInView, setIsInView] = createSignal(false);
  let buttonRef: HTMLButtonElement | undefined;
  let animationFrame: number | undefined;
  let animationTimer: number | undefined;

  const targetStars = () => {
    if (
      local.stars &&
      (local.stars.state === "ready" || local.stars.state === "refreshing")
    ) {
      return local.stars.latest;
    }

    return local.initialStars;
  };

  const canAnimate = () => {
    if (!local.stars) return local.autoAnimate;
    return local.stars.state === "ready" || local.stars.state === "refreshing";
  };

  const hasResourceError = () => local.stars?.state === "errored";

  const cancelAnimation = () => {
    if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    if (animationTimer !== undefined) clearTimeout(animationTimer);
    animationFrame = undefined;
    animationTimer = undefined;
  };

  // Format number with units
  const formatNumber = (num: number) => {
    const units = ["k", "M", "B", "T"];

    if (local.roundStars && num >= 1000) {
      let unitIndex = -1;
      let value = num;

      while (value >= 1000 && unitIndex < units.length - 1) {
        value /= 1000;
        unitIndex++;
      }

      // Format to 1 decimal place if needed, otherwise show whole number
      const formatted = value % 1 === 0 ? value.toString() : value.toFixed(1);
      return `${formatted}${units[unitIndex]}`;
    }

    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Start animation
  const startAnimation = () => {
    if (isAnimating() || hasAnimated()) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = 0; // Always start from 0 for number animation
    const endValue = targetStars();
    const duration = local.animationDuration * 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      // Update star count from 0 to target with more frequent updates
      const newStars = Math.round(
        startValue + (endValue - startValue) * easeOutQuart,
      );
      setCurrentStars(newStars);

      // Update star fill progress (0 to 100)
      setStarProgress(progress * 100);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        animationFrame = undefined;
        setCurrentStars(endValue);
        setStarProgress(100);
        setIsAnimating(false);
        setHasAnimated(true);
      }
    };

    animationTimer = window.setTimeout(() => {
      animationTimer = undefined;
      animationFrame = requestAnimationFrame(animate);
    }, local.animationDelay * 1000);
  };

  // Reset animation state when targetStars changes
  createEffect(
    on([targetStars, () => local.initialStars], ([, initialStars]) => {
      cancelAnimation();
      setIsAnimating(false);
      setHasAnimated(false);
      setCurrentStars(initialStars);
    }),
  );

  // Auto-start animation or use in-view trigger
  createEffect(() => {
    // use `untrack` to prevent startAnimation triggering effect again.
    if (local.useInViewTrigger) {
      if (isInView() && !hasAnimated()) untrack(startAnimation);
    } else if (canAnimate() && !hasAnimated()) {
      untrack(startAnimation);
    }
  });

  // Use in-view detection if enabled
  createEffect(() => {
    if (!local.useInViewTrigger || !buttonRef) return;

    const { once, ...observerOptions } = local.inViewOptions;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries[0]?.isIntersecting ?? false;
      setIsInView(visible);
      if (visible && once) observer.disconnect();
    }, observerOptions);
    observer.observe(buttonRef);
    onCleanup(() => observer.disconnect());
  });

  onCleanup(cancelAnimation);

  const navigateToRepo = () => {
    if (!local.repoUrl) return;

    try {
      // Create a temporary anchor element for reliable navigation
      const link = document.createElement("a");
      link.href = local.repoUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      // Temporarily add to DOM and click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Fallback to window.open
      try {
        window.open(local.repoUrl, "_blank", "noopener,noreferrer");
      } catch {
        // Final fallback
        window.location.href = local.repoUrl;
      }
    }
  };

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    event,
  ) => {
    if (local.onClick) {
      local.onClick(event);
      return;
    }

    if (local.repoUrl) navigateToRepo();
    else if (!hasAnimated()) startAnimation();
  };

  const handleKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (
    event,
  ) => {
    if (local.onKeyDown) {
      local.onKeyDown(event);
      return;
    }

    // Handle Enter and Space key presses for accessibility
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (local.repoUrl) navigateToRepo();
      else if (!hasAnimated()) startAnimation();
    }
  };

  const setButtonRef = (element: HTMLButtonElement) => {
    buttonRef = element;
    if (typeof local.ref === "function") local.ref(element);
  };

  return (
    <button
      ref={setButtonRef}
      class={cn(
        githubButtonVariants({
          variant: local.variant,
          size: local.size,
          class: local.class,
        }),
        local.separator && "ps-0",
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={local.repoUrl ? `Star ${local.label} on GitHub` : local.label}
      {...buttonProps}
    >
      <Show when={local.showGithubIcon}>
        <div
          class={cn(
            "relative flex h-full items-center justify-center",
            local.separator && "w-9 border-e border-input bg-muted/60",
          )}
        >
          <svg role="img" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </div>
      </Show>

      <Show when={local.label}>{(label) => <span>{label()}</span>}</Show>

      {/* Animated Star Icon */}
      <Show when={!hasResourceError() && local.showStarIcon}>
        <div class="relative inline-flex shrink-0">
          <Star
            class="fill-muted-foreground text-muted-foreground"
            aria-hidden="true"
          />
          <Star
            class="absolute inset-s-0 top-0 fill-yellow-400 text-yellow-400"
            size={18}
            aria-hidden="true"
            style={{
              "clip-path": `inset(${100 - (local.filled ? 100 : starProgress())}% 0 0 0)`,
            }}
          />
        </div>
      </Show>

      {/* Animated Number Counter with Ticker Effect */}
      <Show when={!hasResourceError()}>
        <div
          class={cn(
            "relative flex flex-col overflow-hidden font-semibold",
            local.starsClass,
          )}
        >
          <div class="tabular-nums">
            <span>{formatNumber(currentStars())}</span>
          </div>
          <Show when={local.fixedWidth}>
            <span class="h-0 overflow-hidden tabular-nums opacity-0">
              {formatNumber(targetStars())}
            </span>
          </Show>
        </div>
      </Show>
    </button>
  );
}

export { GithubButton, githubButtonVariants };
export type { GithubButtonProps };
