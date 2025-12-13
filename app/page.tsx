import Image from "next/image";

const LINKS = {
  templates:
    "https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
  learning:
    "https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
  deploy:
    "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
  docs: "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
} as const;

const BUTTONS = [
  {
    href: LINKS.deploy,
    label: "Deploy Now",
    variant: "primary" as const,
    icon: { src: "/vercel.svg", alt: "Vercel logomark" },
  },
  {
    href: LINKS.docs,
    label: "Documentation",
    variant: "secondary" as const,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white py-32 px-16 dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href={LINKS.templates}
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href={LINKS.learning}
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          {BUTTONS.map((button) => (
            <a
              key={button.href}
              href={button.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 transition-colors md:w-[158px] ${
                button.variant === "primary"
                  ? "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
                  : "border border-solid border-black/8 hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              }`}
            >
              {button.icon && (
                <Image
                  className="dark:invert"
                  src={button.icon.src}
                  alt={button.icon.alt}
                  width={16}
                  height={16}
                />
              )}
              {button.label}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
