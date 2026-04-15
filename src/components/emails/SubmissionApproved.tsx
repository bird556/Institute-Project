interface Props {
  submitterName: string
  submissionTitle: string
  submissionType: 'Research Call' | 'Research Note' | 'Analytical Commentary'
}

/**
 * Email sent to the submitter when the admin approves their submission.
 * TODO: Wire up to Resend in approveSubmission() action when Supabase is active.
 */
export default function SubmissionApproved({ submitterName, submissionTitle, submissionType }: Props) {
  return (
    <div style={{ fontFamily: 'Georgia, serif', maxWidth: 600, margin: '0 auto', color: '#1a1a1a' }}>
      <div style={{ background: '#374d4f', padding: '24px 32px' }}>
        <h1 style={{ color: '#ffffff', fontFamily: 'Georgia, serif', fontSize: 24, margin: 0 }}>
          Your Submission Has Been Approved
        </h1>
      </div>

      <div style={{ padding: '32px', background: '#f7f8f8' }}>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          Dear {submitterName},
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          We are pleased to inform you that your {submissionType},&nbsp;
          <strong>&ldquo;{submissionTitle}&rdquo;</strong>, has been approved for inclusion in our quarterly newsletter.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          Our editorial team may make minor formatting and style edits before publication.
          You will be notified when the edition in which your submission appears is published.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 0 }}>
          Thank you for your valuable contribution to the scholarly community.
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
