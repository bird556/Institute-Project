interface Props {
  submitterName: string
  submissionTitle: string
  submissionType: 'Research Call' | 'Research Note' | 'Analytical Commentary'
  adminNote: string
}

/**
 * Email sent to the submitter when the admin rejects their submission.
 * Includes the admin note as the rejection reason.
 * TODO: Wire up to Resend in rejectSubmission() action when Supabase is active.
 */
export default function SubmissionRejected({ submitterName, submissionTitle, submissionType, adminNote }: Props) {
  return (
    <div style={{ fontFamily: 'Georgia, serif', maxWidth: 600, margin: '0 auto', color: '#1a1a1a' }}>
      <div style={{ background: '#374d4f', padding: '24px 32px' }}>
        <h1 style={{ color: '#ffffff', fontFamily: 'Georgia, serif', fontSize: 24, margin: 0 }}>
          Update on Your Submission
        </h1>
      </div>

      <div style={{ padding: '32px', background: '#f7f8f8' }}>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          Dear {submitterName},
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          Thank you for submitting your {submissionType},&nbsp;
          <strong>&ldquo;{submissionTitle}&rdquo;</strong>, to our quarterly newsletter.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          After careful consideration, our editorial team has decided not to include this submission in an upcoming edition.
        </p>

        {adminNote && (
          <div style={{ background: '#ffffff', border: '1px solid #dde1e1', borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7878', marginBottom: 8 }}>
              Editorial Feedback
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, color: '#374d4f' }}>
              {adminNote}
            </p>
          </div>
        )}

        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 0 }}>
          We encourage you to consider revising your work and submitting to a future edition.
          Thank you again for your contribution to the scholarly conversation.
        </p>
      </div>

      <div style={{ padding: '24px 32px', background: '#374d4f', textAlign: 'center' }}>
        <p style={{ color: '#ffffff', fontSize: 12, margin: 0, opacity: 0.7 }}>
          © Institute Name. You are receiving this email regarding your newsletter submission.
        </p>
      </div>
    </div>
  )
}
