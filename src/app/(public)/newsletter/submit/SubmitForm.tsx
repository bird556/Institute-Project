'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitToNewsletter } from '@/actions/newsletter';
import type { SubmissionType } from '@/types';

type Tab = SubmissionType;

const TABS: { type: Tab; label: string; description: string }[] = [
  {
    type: 'research_call',
    label: 'Research Call',
    description:
      'For scholars inviting contributions to a research project or publication.',
  },
  {
    type: 'research_note',
    label: 'Research Note',
    description:
      'A practitioner reflection, short study, or evidence-based observation.',
  },
  {
    type: 'commentary',
    label: 'Analytical Commentary',
    description:
      'A critical analysis of a policy, trend, or issue in education.',
  },
];

const ABSTRACT_MAX: Record<Tab, number> = {
  research_call: 500,
  research_note: 300,
  commentary: 300,
};

interface FormState {
  name: string;
  email: string;
  role: string;
  institution: string;
  title: string;
  abstract: string;
  content: string;
  deadline: string;
  contactEmail: string;
}

const EMPTY: FormState = {
  name: '',
  email: '',
  role: '',
  institution: '',
  title: '',
  abstract: '',
  content: '',
  deadline: '',
  contactEmail: '',
};

export default function SubmitForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('research_call');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const maxAbstract = ABSTRACT_MAX[activeTab];
  const isDirty = Object.values(form).some((v) => v.trim() !== '');

  // Warn browser on refresh / tab close when form has content
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  function handleBackClick() {
    if (isDirty) {
      setLeaveOpen(true);
    } else {
      router.push('/newsletter');
    }
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    if (!form.name.trim()) {
      toast.error('Name is required.');
      return false;
    }
    if (!form.email.trim()) {
      toast.error('Email is required.');
      return false;
    }
    if (!form.title.trim()) {
      toast.error('Title is required.');
      return false;
    }
    if (!form.abstract.trim()) {
      toast.error('Abstract is required.');
      return false;
    }
    if (!form.content.trim()) {
      toast.error('Please provide a full description or text.');
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const result = await submitToNewsletter({
      type: activeTab,
      title: form.title,
      abstract: form.abstract,
      content: form.content,
      submitter_name: form.name,
      submitter_email: form.email,
      submitter_role: form.role || undefined,
      institution: form.institution || undefined,
      ...(activeTab === 'research_call' && {
        deadline: form.deadline || undefined,
        contact_email: form.contactEmail || undefined,
      }),
    });

    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error ?? 'Submission failed. Please try again.');
      return;
    }

    setSuccess(true);
  }

  // ── Success state ───────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-10 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mx-auto">
          <svg
            className="h-6 w-6 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)] dark:text-white">
          Submission Received
        </h2>
        <p className="text-[var(--color-text-muted)]">
          Thank you — your submission has been received and is under review.
          We&apos;ll be in touch.
        </p>
        <div className="flex gap-3 justify-center pt-2 flex-wrap">
          <Button
            onClick={() => {
              setForm(EMPTY);
              setSuccess(false);
            }}
            variant="outline"
            className="cursor-pointer"
          >
            Submit Another
          </Button>
          <Button
            onClick={() => router.push('/newsletter')}
            className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white"
          >
            Back to Newsletter
          </Button>
        </div>
      </div>
    );
  }

  // ── Form state ──────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-8">
        {/* Back button */}
        <button
          type="button"
          onClick={handleBackClick}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] dark:text-white hover:text-[var(--color-brand-teal)] transition-colors cursor-pointer"
        >
          ← Back to Newsletter
        </button>

        {/* Tab selector */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.type}
              type="button"
              onClick={() => {
                setActiveTab(tab.type);
                setForm(EMPTY);
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                activeTab === tab.type
                  ? 'bg-[var(--color-brand-teal)] text-white border-transparent'
                  : 'border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-text-muted)] hover:border-[var(--color-brand-teal)] hover:text-[var(--color-brand-teal)] dark:hover:text-[var(--color-brand-teal-light)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab description */}
        <p className="text-sm text-[var(--color-text-muted)]">
          {TABS.find((t) => t.type === activeTab)?.description}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Submitter info */}
          <fieldset className="space-y-4">
            <legend className="text-xs uppercase tracking-wide font-medium text-[var(--color-text-muted)]">
              Your Information
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name *" id="name">
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Dr. Jane Smith"
                  required
                />
              </Field>
              <Field label="Email Address *" id="email">
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="jane@example.com"
                  required
                />
              </Field>
              <Field label="Role / Title" id="role">
                <Input
                  id="role"
                  value={form.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  placeholder="e.g. Associate Professor"
                />
              </Field>
              <Field label="Institution" id="institution">
                <Input
                  id="institution"
                  value={form.institution}
                  onChange={(e) => handleChange('institution', e.target.value)}
                  placeholder="e.g. University of Toronto"
                />
              </Field>
            </div>
          </fieldset>

          {/* Submission content */}
          <fieldset className="space-y-4">
            <legend className="text-xs uppercase tracking-wide font-medium text-[var(--color-text-muted)]">
              Submission
            </legend>

            <Field label="Title *" id="title">
              <Input
                id="title"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Title of your submission"
                required
              />
            </Field>

            <Field
              label={`Abstract * (max ${maxAbstract} characters)`}
              id="abstract"
              hint={`${form.abstract.length}/${maxAbstract}`}
            >
              <textarea
                id="abstract"
                value={form.abstract}
                onChange={(e) => {
                  if (e.target.value.length <= maxAbstract)
                    handleChange('abstract', e.target.value);
                }}
                placeholder="A brief summary of your submission…"
                rows={4}
                required
                className="w-full rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] placeholder:text-[var(--color-text-muted)]"
              />
            </Field>

            <Field
              label={
                activeTab === 'research_call'
                  ? 'Full Description *'
                  : activeTab === 'research_note'
                    ? 'Full Note *'
                    : 'Commentary *'
              }
              id="content"
            >
              <textarea
                id="content"
                value={form.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Full text of your submission…"
                rows={10}
                required
                className="w-full rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] placeholder:text-[var(--color-text-muted)]"
              />
            </Field>

            {/* Research call extras */}
            {activeTab === 'research_call' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Submission Deadline" id="deadline">
                  <Input
                    id="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                  />
                </Field>
                <Field label="Contact Email for Responses" id="contact-email">
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) =>
                      handleChange('contactEmail', e.target.value)
                    }
                    placeholder="contact@example.com"
                  />
                </Field>
              </div>
            )}
          </fieldset>

          <p className="text-xs text-[var(--color-text-muted)]">
            By submitting, you agree that your contribution may be published in
            our quarterly newsletter subject to editorial review.
          </p>

          <Button
            type="submit"
            disabled={submitting}
            className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white px-8"
          >
            {submitting ? 'Submitting…' : 'Submit Contribution'}
          </Button>
        </form>
      </div>

      {/* Leave confirmation dialog */}
      {leaveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-6 space-y-4 shadow-xl">
            <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)] dark:text-white">
              Leave this page?
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              You have unsaved content in your form. If you leave now, your work
              will be lost.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setLeaveOpen(false)}
                className="cursor-pointer"
              >
                Stay
              </Button>
              <Button
                onClick={() => router.push('/newsletter')}
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
              >
                Leave anyway
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  id,
  hint,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className="text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec]"
        >
          {label}
        </Label>
        {hint && (
          <span className="text-xs text-[var(--color-text-muted)]">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}
