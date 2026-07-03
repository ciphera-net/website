'use client';

import React, { useState } from 'react';
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
        faqData={faqData}
        selected={selectedCategory}
      />
    </section>
  );
};

const FAQHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="relative z-10">
    <span className="font-mono text-xs text-muted-foreground">
      {subtitle}
    </span>
    <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
  </div>
);

const FAQTabs = ({ categories, selected, setSelected }: { categories: Record<string, string>; selected: string; setSelected: (key: string) => void }) => (
  <div className="relative z-10 mt-8 flex flex-wrap items-center gap-4">
    {Object.entries(categories).map(([key, label]) => (
      <button
        key={key}
        onClick={() => setSelected(key)}
        className={cn(
          "relative whitespace-nowrap border px-3 py-1.5 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none",
          selected === key
            ? "border-primary bg-transparent text-primary"
            : "border-border bg-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
      </button>
    ))}
  </div>
);

const FAQList = ({ faqData, selected }: { faqData: Record<string, FAQItem[]>; selected: string }) => (
  <div className="mt-10 max-w-3xl">
    {Object.entries(faqData).map(([category, questions]) => (
      <div
        key={category}
        className={cn(
          "space-y-4 transition-opacity duration-300 motion-reduce:transition-none",
          selected === category ? "block opacity-100" : "hidden opacity-0"
        )}
      >
        {questions.map((faq, index) => (
          <FAQItemComponent key={index} {...faq} />
        ))}
      </div>
    ))}
  </div>
);

const FAQItemComponent = ({ question, answer }: FAQItem) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "border transition-colors duration-150 motion-reduce:transition-none",
        isOpen ? "bg-muted" : "bg-card"
      )}
    >
      <button
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
            className={cn(
              "h-5 w-5 transition-colors duration-150 motion-reduce:transition-none",
              isOpen ? "text-foreground" : "text-muted-foreground"
            )}
          />
        </span>
      </button>
      <div
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
