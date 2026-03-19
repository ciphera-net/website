import { cn } from "@/lib/utils";
import {
  LockKey,
  Eye,
  Globe,
  ShieldCheck,
  Code,
  CloudCheck,
  EnvelopeSimple,
  Robot,
} from "@phosphor-icons/react/dist/ssr";

const features = [
  {
    title: "Zero-Knowledge Encryption",
    description:
      "Your data is encrypted on your device before it ever reaches our servers. We can't see it, even if we wanted to.",
    icon: <LockKey size={24} />,
  },
  {
    title: "Privacy by Design",
    description:
      "Every product is built from the ground up with privacy as the default, not an afterthought.",
    icon: <Eye size={24} />,
  },
  {
    title: "Swiss Infrastructure",
    description:
      "All services run on Swiss servers, protected by some of the strongest data privacy laws in the world.",
    icon: <Globe size={24} />,
  },
  {
    title: "End-to-End Encrypted",
    description:
      "AES-256-GCM encryption ensures your files, messages, and data are protected in transit and at rest.",
    icon: <ShieldCheck size={24} />,
  },
  {
    title: "Open Source",
    description:
      "Our code is publicly auditable on GitHub. Transparency builds trust — verify our claims yourself.",
    icon: <Code size={24} />,
  },
  {
    title: "Self-Hostable",
    description:
      "Run Ciphera on your own infrastructure for complete control over your data and privacy.",
    icon: <CloudCheck size={24} />,
  },
  {
    title: "Secure Email Relay",
    description:
      "Send transactional emails through encrypted infrastructure without exposing user data.",
    icon: <EnvelopeSimple size={24} />,
  },
  {
    title: "Bot Protection",
    description:
      "Privacy-respecting captcha that blocks bots without tracking your users or selling their data.",
    icon: <Robot size={24} />,
  },
];

export function FeaturesSectionWithHoverEffects() {
  return (
    <section className="py-16 px-4">
      <div className="text-center mb-4 max-w-2xl mx-auto">
        <span className="text-sm font-medium text-brand-orange mb-4 block">Why Ciphera</span>
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-4">Built different</h2>
        <p className="text-neutral-400 text-lg">
          Privacy isn&apos;t a feature we bolt on — it&apos;s the foundation everything runs on.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
      <div className="text-center mt-8">
        <a
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-orange hover:text-brand-orange-hover transition-colors"
        >
          See how these come together
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l border-neutral-800",
        index < 4 && "lg:border-b border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-700 group-hover/feature:bg-brand-orange transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
