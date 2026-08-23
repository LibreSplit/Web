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

import { GitHubIcon } from "@/assets/icons/GitHubIcon";
import { cn, prefersReducedMotion } from "@/lib/utils";

const githubButtonVariants = cva(
  "backface-visibility-hidden group relative inline-flex transform-gpu cursor-pointer items-center justify-center overflow-hidden font-medium whitespace-nowrap ring-offset-background transition-transform duration-200 ease-out will-change-transform hover:scale-105 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-60 motion-reduce:transform-none motion-reduce:transition-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-gray-700 bg-zinc-950 text-white hover:bg-zinc-900 dark:border-gray-300 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-50",
        outline:
          "border border-input bg-background text-accent-foreground hover:bg-accent",
      },
      size: {
        default:
          "h-8.5 gap-2 rounded-md px-3 text-[0.8125rem] leading-none [&_svg]:size-4",
        sm: "h-7 gap-1.5 rounded-md px-2.5 text-xs leading-none [&_svg]:size-3.5",
        lg: "h-10 gap-2.5 rounded-md px-4 text-sm leading-none [&_svg]:size-5",
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
    Omit<
      ComponentProps<"a">,
      "class" | "href" | "onClick" | "onKeyDown" | "ref"
    >,
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
  /** Whether to show Github icon */
  showGithubIcon?: boolean;
  /** Whether to show star icon */
  showStarIcon?: boolean;
  /** Whether to show separator */
  separator?: boolean;
  /** Whether stars should be filled */
  filled?: boolean;
  /** Repository URL for actual Github integration */
  repoUrl: string;
  /** Button text label */
  label?: string;
  /** Class for the visible button label */
  labelClass?: string;
  /** Use in-view detection to trigger animation */
  useInViewTrigger?: boolean;
  /** In-view options */
  inViewOptions?: UseInViewOptions;
  /** Click event handler */
  onClick?: JSX.EventHandler<HTMLAnchorElement, MouseEvent>;
  /** Keydown event handler */
  onKeyDown?: JSX.EventHandler<HTMLAnchorElement, KeyboardEvent>;
  /** Custom element ref */
  ref?: HTMLAnchorElement | ((element: HTMLAnchorElement) => void);
}

function GithubButton(receivedProps: GithubButtonProps) {
  const props = mergeProps(
    {
      initialStars: 0,
      starsClass: "",
      fixedWidth: true,
      animationDuration: 2,
      animationDelay: 0,
      variant: "default" as const,
      size: "default" as const,
      showGithubIcon: true,
      showStarIcon: true,
      roundStars: false,
      separator: false,
      filled: false,
      label: "",
      labelClass: "",
      useInViewTrigger: false,
      inViewOptions: { once: true } as UseInViewOptions,
      target: "_blank",
      rel: "noopener noreferrer",
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
    "class",
    "variant",
    "size",
    "showGithubIcon",
    "showStarIcon",
    "roundStars",
    "separator",
    "filled",
    "repoUrl",
    "label",
    "labelClass",
    "useInViewTrigger",
    "inViewOptions",
    "ref",
  ]);

  const [currentStars, setCurrentStars] = createSignal(local.initialStars);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [starProgress, setStarProgress] = createSignal(0);
  const [hasAnimated, setHasAnimated] = createSignal(false);
  const [isInView, setIsInView] = createSignal(false);
  let buttonRef: HTMLAnchorElement | undefined;
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

  const canAnimate = () =>
    local.stars &&
    (local.stars.state === "ready" || local.stars.state === "refreshing");

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

    if (prefersReducedMotion()) {
      setCurrentStars(targetStars());
      setStarProgress(100);
      setHasAnimated(true);
      return;
    }

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

  const setButtonRef = (element: HTMLAnchorElement) => {
    buttonRef = element;
    if (typeof local.ref === "function") local.ref(element);
  };

  return (
    <a
      ref={(element) => setButtonRef(element)}
      href={local.repoUrl}
      class={cn(
        githubButtonVariants({
          variant: local.variant,
          size: local.size,
          class: local.class,
        }),
        local.separator && "ps-0",
      )}
      aria-label={`Star ${local.label} on GitHub`}
      {...buttonProps}
    >
      <Show when={local.showGithubIcon}>
        <div
          class={cn(
            "relative flex h-full items-center justify-center",
            local.separator && "w-9 border-e border-input bg-muted/60",
          )}
        >
          <GitHubIcon />
        </div>
      </Show>

      <Show when={local.label}>
        {(label) => <span class={local.labelClass}>{label()}</span>}
      </Show>

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
    </a>
  );
}

export { GithubButton, githubButtonVariants };
export type { GithubButtonProps };
