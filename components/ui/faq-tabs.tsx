'use client';

import React, { useRef, useState } from 'react';
import { Plus } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  categories: Record<string, string>;
  faqData: Record<string, FAQItem[]>;
}

export const FAQ = ({
  title = "FAQs",
  subtitle = "Frequently Asked Questions",
  categories,
  faqData,
  className,
  ...props
}: FAQProps) => {
  const categoryKeys = Object.keys(categories);
  const [selectedCategory, setSelectedCategory] = useState(categoryKeys[0]);

  return (
    <section
      className={cn(
        "border-b border-border bg-background px-6 py-16 text-foreground sm:py-20",
        className
      )}
      {...props}
    >
      <FAQHeader title={title} subtitle={subtitle} />
      <FAQTabs
        categories={categories}
        selected={selectedCategory}
        setSelected={setSelectedCategory}
      />
      <FAQList
        categories={categories}
        faqData={faqData}
        selected={selectedCategory}
      />
    </section>
  );
};

const FAQHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="relative z-10">
    <span className="text-xs text-muted-foreground">
      {subtitle}
    </span>
    <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
  </div>
);

const FAQTabs = ({ categories, selected, setSelected }: { categories: Record<string, string>; selected: string; setSelected: (key: string) => void }) => {
  const categoryKeys = Object.keys(categories);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = categoryKeys.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setSelected(categoryKeys[next]);
    tabRefs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="FAQ categories"
      aria-orientation="horizontal"
      className="relative z-10 mt-8 flex flex-wrap items-center gap-4"
    >
      {categoryKeys.map((key, i) => {
        const isActive = key === selected;
        return (
          <button
            key={key}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            role="tab"
            id={`pulse-faq-tab-${key}`}
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            aria-controls={isActive ? `pulse-faq-panel-${key}` : undefined}
            onClick={() => setSelected(key)}
            onKeyDown={(e) => handleTabKeyDown(e, i)}
            className={cn(
              "relative whitespace-nowrap border px-3 py-1.5 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none",
              isActive
                ? "border-primary bg-transparent text-primary"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {categories[key]}
          </button>
        );
      })}
    </div>
  );
};

const FAQList = ({ categories, faqData, selected }: { categories: Record<string, string>; faqData: Record<string, FAQItem[]>; selected: string }) => (
  <div className="mt-10 max-w-3xl">
    {Object.entries(faqData).map(([category, questions]) => (
      <div
        key={category}
        role="tabpanel"
        id={`pulse-faq-panel-${category}`}
        aria-labelledby={`pulse-faq-tab-${category}`}
        hidden={selected !== category}
        className={cn(
          "space-y-4 transition-opacity duration-300 motion-reduce:transition-none",
          selected === category ? "block opacity-100" : "hidden opacity-0"
        )}
      >
        {questions.map((faq, index) => (
          <FAQItemComponent key={index} categoryKey={category} index={index} {...faq} />
        ))}
      </div>
    ))}
  </div>
);

const FAQItemComponent = ({ question, answer, categoryKey, index }: FAQItem & { categoryKey: string; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = `pulse-faq-answer-${categoryKey}-${index}`;

  return (
    <div
      className={cn(
        "border transition-colors duration-150 motion-reduce:transition-none",
        isOpen ? "bg-muted" : "bg-card"
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
      >
        <span
          className={cn(
            "text-lg font-medium transition-colors duration-150 motion-reduce:transition-none",
            isOpen ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {question}
        </span>
        <span
          className="transition-transform duration-200 motion-reduce:transition-none"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          <Plus
            aria-hidden="true"
            className={cn(
              "h-5 w-5 transition-colors duration-150 motion-reduce:transition-none",
              isOpen ? "text-foreground" : "text-muted-foreground"
            )}
          />
        </span>
      </button>
      <div
        id={answerId}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none px-4"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
};
