interface Props {
  submitterName: string
  submissionTitle: string
  submissionType: 'Research Call' | 'Research Note' | 'Analytical Commentary'
}

/**
 * Email sent to the submitter immediately after they submit.
 * Rendered server-side and sent via Resend.
 * TODO: Wire up to Resend in submitToNewsletter() action when Supabase is active.
 */
export default function SubmissionConfirmation({ submitterName, submissionTitle, submissionType }: Props) {
  return (
    <div style={{ fontFamily: 'Georgia, serif', maxWidth: 600, margin: '0 auto', color: '#1a1a1a' }}>
      <div style={{ background: '#374d4f', padding: '24px 32px' }}>
        <h1 style={{ color: '#ffffff', fontFamily: 'Georgia, serif', fontSize: 24, margin: 0 }}>
          Submission Received
        </h1>
      </div>

      <div style={{ padding: '32px', background: '#f7f8f8' }}>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          Dear {submitterName},
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          Thank you for submitting your {submissionType} to our quarterly newsletter.
          Your submission, <strong>&ldquo;{submissionTitle}&rdquo;</strong>, has been received and is now under editorial review.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          We will notify you by email once our editorial team has reviewed your submission.
          The review process typically takes 2–4 weeks.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 0 }}>
          If you have any questions, please don&apos;t hesitate to reach out.
        </p>
      </div>

      <div style={{ padding: '24px 32px', background: '#374d4f', textAlign: 'center' }}>
        <p style={{ color: '#ffffff', fontSize: 12, margin: 0, opacity: 0.7 }}>
          © Institute Name. You are receiving this email because you submitted a contribution to our newsletter.
        </p>
      </div>
    </div>
  )
}
