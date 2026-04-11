/**
 * mock-data.ts
 *
 * Development mock data for all content types.
 * Used in page components before real Supabase queries are wired up.
 *
 * USAGE:
 *   import { mockBlogs, mockEvents, mockReadingList, mockPartners } from '@/lib/mock-data'
 *
 * REPLACE:
 *   When a content phase is complete, delete the import and replace with
 *   the real Supabase server query in the page/Server Action.
 *
 * IMAGES:
 *   Cover images use Unsplash source URLs (free, no key needed).
 *   Replace with real Supabase Storage URLs once uploads are wired up.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MockBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string           // HTML string
  cover_url: string         // Unsplash URL (dev only — real data uses cover_path)
  published: boolean
  published_at: string      // ISO date string
  created_at: string
  updated_at: string
}

export interface MockEvent {
  id: string
  title: string
  slug: string
  description: string       // HTML string
  cover_url: string
  location: string
  event_date: string        // ISO date string
  published: boolean
  created_at: string
  updated_at: string
}

export interface MockReadingListItem {
  id: string
  title: string
  author: string
  description: string       // HTML string
  cover_url: string
  external_url: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface MockPartner {
  id: string
  name: string
  logo_url: string          // Unsplash or placeholder URL (dev only)
  description: string
  website_url: string
  sort_order: number
  published: boolean
  created_at: string
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const mockBlogs: MockBlogPost[] = [
  {
    id: '11111111-0000-0000-0000-000000000001',
    title: 'Building Critical Thinking in the Modern Classroom',
    slug: 'building-critical-thinking-modern-classroom',
    excerpt:
      'How educators can foster deeper analytical skills through project-based learning, Socratic discussion, and real-world problem solving.',
    content: `
      <h2>Why Critical Thinking Matters More Than Ever</h2>
      <p>In an era of information overload, the ability to evaluate sources, detect bias, and reason through complex problems has never been more important. Yet many traditional curricula still prioritize rote memorisation over genuine analytical development.</p>
      <h2>Project-Based Learning as a Foundation</h2>
      <p>When students work on extended projects that mirror real-world challenges, they naturally develop the habits of mind associated with strong critical thinking. They learn to ask better questions, revise their assumptions, and communicate their reasoning clearly.</p>
      <h2>The Role of Socratic Discussion</h2>
      <p>Structured dialogue — where the teacher acts as a facilitator rather than a lecturer — creates space for students to challenge each other's ideas respectfully. This mirrors the kind of collaborative thinking required in professional environments.</p>
      <blockquote>The goal is not to produce students who can answer questions, but students who can question answers.</blockquote>
      <h2>Getting Started</h2>
      <p>Small changes can make a significant difference. Replacing a weekly quiz with a short structured debate, or ending each lesson with an open question rather than a summary, shifts the classroom dynamic in meaningful ways.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    published: true,
    published_at: '2025-03-10T09:00:00Z',
    created_at: '2025-03-08T14:00:00Z',
    updated_at: '2025-03-10T09:00:00Z',
  },
  {
    id: '11111111-0000-0000-0000-000000000002',
    title: 'The Case for Interdisciplinary Education',
    slug: 'case-for-interdisciplinary-education',
    excerpt:
      'Why breaking down the walls between subjects produces more capable, adaptable graduates — and how schools can make the shift.',
    content: `
      <h2>Subject Silos and Their Costs</h2>
      <p>The traditional subject-by-subject approach to education made sense when knowledge was more compartmentalised. Today, the most interesting problems — climate change, public health, technology ethics — sit firmly at the intersection of multiple disciplines.</p>
      <h2>What Interdisciplinary Learning Looks Like</h2>
      <p>It doesn't require dismantling the entire curriculum. A history class that incorporates data analysis, or a science unit that asks students to write a persuasive essay, begins to build the connective tissue between domains.</p>
      <h2>Evidence from Research</h2>
      <p>Studies consistently show that students who engage in interdisciplinary projects demonstrate stronger transfer of learning — the ability to apply knowledge from one context to another unfamiliar situation.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    published: true,
    published_at: '2025-02-20T10:00:00Z',
    created_at: '2025-02-18T11:00:00Z',
    updated_at: '2025-02-20T10:00:00Z',
  },
  {
    id: '11111111-0000-0000-0000-000000000003',
    title: 'Rethinking Assessment: Beyond the Grade',
    slug: 'rethinking-assessment-beyond-the-grade',
    excerpt:
      'A look at portfolio-based, narrative, and competency assessments — and what they reveal that letter grades never could.',
    content: `
      <h2>The Limits of Traditional Grading</h2>
      <p>A letter grade is a compression of a student's entire learning journey into a single symbol. It tells us very little about what the student actually understands, where they struggled, or how they grew over time.</p>
      <h2>Portfolio Assessment</h2>
      <p>When students maintain curated portfolios of their work — including drafts, reflections, and revisions — assessment becomes a conversation rather than a verdict. Both students and teachers gain a richer picture of learning.</p>
      <h2>Competency-Based Progression</h2>
      <p>Rather than advancing by age or time-in-seat, competency-based models allow students to move forward once they've demonstrated genuine mastery. This respects individual learning paces and eliminates the anxiety of high-stakes single-point assessment.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    published: true,
    published_at: '2025-01-15T08:30:00Z',
    created_at: '2025-01-13T09:00:00Z',
    updated_at: '2025-01-15T08:30:00Z',
  },
  {
    id: '11111111-0000-0000-0000-000000000004',
    title: 'Technology in Education: Tool or Distraction?',
    slug: 'technology-education-tool-or-distraction',
    excerpt:
      'An honest look at when screens help learning and when they get in the way — and how schools can draw the line intentionally.',
    content: `
      <h2>The Promise and the Problem</h2>
      <p>Educational technology carries enormous promise: personalised pacing, instant access to global knowledge, collaboration across classrooms on different continents. It also carries significant risks: distraction, passive consumption, and a widening digital equity gap.</p>
      <h2>What the Research Actually Says</h2>
      <p>The evidence is genuinely mixed. Screen-based reading tends to produce shallower comprehension than print. Coding and simulation tools, on the other hand, show strong learning gains in specific contexts.</p>
      <h2>A Framework for Intentional Use</h2>
      <p>The most effective schools treat technology as one tool among many, chosen deliberately for specific learning goals rather than adopted wholesale because it is new. The question is never "should we use technology?" but "does this tool serve this learning objective better than the alternative?"</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80',
    published: false,
    published_at: '',
    created_at: '2025-04-01T12:00:00Z',
    updated_at: '2025-04-01T12:00:00Z',
  },
  {
    id: '11111111-0000-0000-0000-000000000005',
    title: 'Educator Wellbeing: The Foundation of Student Success',
    slug: 'educator-wellbeing-foundation-student-success',
    excerpt:
      'You cannot pour from an empty cup. How supporting teacher mental health directly improves classroom outcomes.',
    content: `
      <h2>The Burnout Crisis in Education</h2>
      <p>Teaching has always been demanding. Over the past decade, teacher burnout rates have climbed sharply, driven by increased administrative burden, reduced autonomy, and the emotional weight of supporting students through increasingly complex challenges.</p>
      <h2>The Ripple Effect on Students</h2>
      <p>Research is clear: teacher wellbeing is one of the strongest predictors of student outcomes. When educators are supported, rested, and professionally fulfilled, they bring a quality of presence to the classroom that cannot be replicated by any curriculum or technology.</p>
      <h2>What Schools Can Do</h2>
      <p>Structural changes — protected planning time, reduced administrative load, peer mentorship, and genuine input into school decisions — have shown measurable effects on retention and job satisfaction. These are not luxury items. They are investments in student outcomes.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=800&q=80',
    published: true,
    published_at: '2025-03-28T07:00:00Z',
    created_at: '2025-03-25T10:00:00Z',
    updated_at: '2025-03-28T07:00:00Z',
  },
]

// ─── Events ───────────────────────────────────────────────────────────────────

export const mockEvents: MockEvent[] = [
  {
    id: '22222222-0000-0000-0000-000000000001',
    title: 'Annual Education Leadership Summit',
    slug: 'annual-education-leadership-summit-2025',
    description: `
      <h2>About the Summit</h2>
      <p>Join educators, school leaders, and policy makers from across the region for our flagship annual gathering. This year's theme is <strong>Learning for an Uncertain Future</strong> — exploring how schools can build adaptability, resilience, and purpose into their programmes.</p>
      <h2>What to Expect</h2>
      <p>Two full days of keynote sessions, workshops, and facilitated dialogue. Participants will leave with a concrete action plan tailored to their institutional context.</p>
      <h2>Who Should Attend</h2>
      <p>Principals, heads of department, curriculum leads, and anyone shaping the strategic direction of a school or educational organisation.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    location: 'The Grand Convention Centre, Toronto',
    event_date: '2025-06-14T09:00:00Z',
    published: true,
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-15T14:00:00Z',
  },
  {
    id: '22222222-0000-0000-0000-000000000002',
    title: 'Workshop: Designing for Inclusion',
    slug: 'workshop-designing-for-inclusion-2025',
    description: `
      <h2>Overview</h2>
      <p>A hands-on, half-day workshop for classroom teachers focused on practical strategies for Universal Design for Learning (UDL). Participants will audit an existing lesson plan and redesign it with multiple means of engagement, representation, and expression.</p>
      <h2>Facilitator</h2>
      <p>Led by Dr. Amara Osei, specialist in inclusive curriculum design and author of <em>Every Learner, Every Room</em>.</p>
      <h2>Materials</h2>
      <p>All materials provided. Bring a lesson plan you currently use — we'll work with real content from your classroom.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    location: 'Institute Learning Centre, Room 204',
    event_date: '2025-05-08T13:00:00Z',
    published: true,
    created_at: '2025-03-10T09:00:00Z',
    updated_at: '2025-03-10T09:00:00Z',
  },
  {
    id: '22222222-0000-0000-0000-000000000003',
    title: 'Panel: The Future of Public Education Funding',
    slug: 'panel-future-public-education-funding',
    description: `
      <h2>About the Panel</h2>
      <p>An evening panel discussion bringing together education economists, school board trustees, and teachers' federation representatives to examine the structural challenges facing public education funding.</p>
      <h2>Questions We'll Explore</h2>
      <p>How do we fund schools equitably across wealthy and under-resourced communities? What does evidence say about the relationship between per-pupil spending and outcomes? How can schools do more with constrained budgets without burning out staff?</p>
      <h2>Format</h2>
      <p>45-minute panel, followed by 30 minutes of audience Q&A. Light refreshments provided.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    location: 'Virtual — Zoom Webinar',
    event_date: '2025-04-24T18:30:00Z',
    published: true,
    created_at: '2025-03-20T11:00:00Z',
    updated_at: '2025-03-20T11:00:00Z',
  },
  {
    id: '22222222-0000-0000-0000-000000000004',
    title: 'Reading Circle: Pedagogy of the Oppressed',
    slug: 'reading-circle-pedagogy-of-the-oppressed',
    description: `
      <h2>Monthly Reading Circle</h2>
      <p>This month's reading circle will work through Paulo Freire's foundational text, <em>Pedagogy of the Oppressed</em>. We'll focus on Chapters 1 and 2, exploring Freire's critique of the "banking model" of education and his vision of dialogue as a tool for liberation.</p>
      <p>No prior familiarity with Freire required. All educators welcome.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    location: 'Institute Library, 3rd Floor',
    event_date: '2025-05-01T17:00:00Z',
    published: true,
    created_at: '2025-04-01T08:00:00Z',
    updated_at: '2025-04-01T08:00:00Z',
  },
  {
    id: '22222222-0000-0000-0000-000000000005',
    title: 'Summer Institute: Curriculum Redesign Intensive',
    slug: 'summer-institute-curriculum-redesign-2025',
    description: `
      <h2>About the Intensive</h2>
      <p>A five-day immersive programme for curriculum leads and department heads. Participants will work in small cross-school teams to redesign a unit of study using backwards design, assessment-first planning, and equity-centred principles.</p>
      <h2>Outcomes</h2>
      <p>Each team leaves with a complete, peer-reviewed unit ready for classroom implementation in September.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80',
    location: 'Lakeside Conference Retreat, Muskoka',
    event_date: '2025-07-21T08:00:00Z',
    published: false,
    created_at: '2025-04-05T09:00:00Z',
    updated_at: '2025-04-05T09:00:00Z',
  },
]

// ─── Reading List ─────────────────────────────────────────────────────────────

export const mockReadingList: MockReadingListItem[] = [
  {
    id: '33333333-0000-0000-0000-000000000001',
    title: 'Pedagogy of the Oppressed',
    author: 'Paulo Freire',
    description: `
      <p>One of the most influential works in education philosophy of the 20th century. Freire argues that true education is not the transfer of information from teacher to student — the "banking model" — but a collaborative act of critical inquiry. Essential reading for anyone who wants to understand the relationship between education and power.</p>
      <p><strong>Best for:</strong> Educators interested in social justice, curriculum philosophy, and the ethics of teaching.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
    external_url: 'https://www.goodreads.com/book/show/72657.Pedagogy_of_the_Oppressed',
    published: true,
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z',
  },
  {
    id: '33333333-0000-0000-0000-000000000002',
    title: 'The Courage to Teach',
    author: 'Parker J. Palmer',
    description: `
      <p>Parker Palmer makes a compelling case that good teaching comes from the identity and integrity of the teacher — not merely from technique or methodology. A deeply humane book that speaks honestly about the fear, loneliness, and joy of being an educator.</p>
      <p><strong>Best for:</strong> Teachers at any stage of their career, especially those experiencing burnout or questioning their purpose.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    external_url: 'https://www.goodreads.com/book/show/77867.The_Courage_to_Teach',
    published: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: '33333333-0000-0000-0000-000000000003',
    title: 'Educated',
    author: 'Tara Westover',
    description: `
      <p>Though not an education theory text, Westover's memoir is one of the most powerful accounts of what access to education can mean for an individual life. A reminder of what is at stake in every classroom, and why equity in education is a moral imperative.</p>
      <p><strong>Best for:</strong> Anyone in education who wants to reconnect with the deeper purpose of the work.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
    external_url: 'https://www.goodreads.com/book/show/35133922-educated',
    published: true,
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-01T10:00:00Z',
  },
  {
    id: '33333333-0000-0000-0000-000000000004',
    title: 'Visible Learning',
    author: 'John Hattie',
    description: `
      <p>Hattie synthesises over 800 meta-analyses covering millions of students to identify the factors that have the greatest influence on student achievement. A data-driven counterpoint to education fads — some of what we assume works (learning styles, discovery learning) has weak evidence; some of what is overlooked (feedback, teacher-student relationships) is transformative.</p>
      <p><strong>Best for:</strong> School leaders and curriculum designers who want evidence-based grounding for strategic decisions.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
    external_url: 'https://www.goodreads.com/book/show/6059751-visible-learning',
    published: true,
    created_at: '2025-02-10T10:00:00Z',
    updated_at: '2025-02-10T10:00:00Z',
  },
  {
    id: '33333333-0000-0000-0000-000000000005',
    title: 'How People Learn',
    author: 'National Academies of Sciences, Engineering, and Medicine',
    description: `
      <p>The definitive synthesis of cognitive science research as applied to education. Covers how prior knowledge shapes learning, the importance of metacognition, the role of motivation, and how learning environments need to be structured to support transfer. Dense but rewarding.</p>
      <p><strong>Best for:</strong> Educators who want a rigorous scientific foundation for their instructional decisions. Available free online.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&q=80',
    external_url: 'https://nap.nationalacademies.org/catalog/24783/how-people-learn-ii',
    published: true,
    created_at: '2025-03-01T10:00:00Z',
    updated_at: '2025-03-01T10:00:00Z',
  },
  {
    id: '33333333-0000-0000-0000-000000000006',
    title: 'Mindset: The New Psychology of Success',
    author: 'Carol S. Dweck',
    description: `
      <p>Dweck's research on fixed vs. growth mindsets has reshaped how educators think about praise, effort, and the messages we send students about their capabilities. Accessible and practical, with clear implications for classroom culture and feedback practices.</p>
      <p><strong>Best for:</strong> Teachers at all levels, and parents. Widely cited — worth reading the original rather than the summaries.</p>
    `.trim(),
    cover_url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80',
    external_url: 'https://www.goodreads.com/book/show/40745.Mindset',
    published: false,
    created_at: '2025-04-01T10:00:00Z',
    updated_at: '2025-04-01T10:00:00Z',
  },
]

// ─── Partners ─────────────────────────────────────────────────────────────────

export const mockPartners: MockPartner[] = [
  {
    id: '44444444-0000-0000-0000-000000000001',
    name: 'The Learning Foundation',
    logo_url: 'https://placehold.co/200x80/374d4f/ffffff?text=TLF',
    description:
      'A national charitable foundation dedicated to closing the equity gap in K–12 education through research, advocacy, and direct school grants.',
    website_url: 'https://example.com/learning-foundation',
    sort_order: 1,
    published: true,
    created_at: '2024-09-01T10:00:00Z',
  },
  {
    id: '44444444-0000-0000-0000-000000000002',
    name: 'Bright Futures Initiative',
    logo_url: 'https://placehold.co/200x80/374d4f/ffffff?text=BFI',
    description:
      'A cross-sector initiative connecting schools with local businesses and community organisations to expand experiential learning opportunities for students.',
    website_url: 'https://example.com/bright-futures',
    sort_order: 2,
    published: true,
    created_at: '2024-09-15T10:00:00Z',
  },
  {
    id: '44444444-0000-0000-0000-000000000003',
    name: 'Ontario Teachers\' Federation',
    logo_url: 'https://placehold.co/200x80/374d4f/ffffff?text=OTF',
    description:
      'The provincial federation representing over 160,000 teachers across Ontario, committed to professional development and the advancement of public education.',
    website_url: 'https://example.com/otf',
    sort_order: 3,
    published: true,
    created_at: '2024-10-01T10:00:00Z',
  },
  {
    id: '44444444-0000-0000-0000-000000000004',
    name: 'EdTech Collaborative',
    logo_url: 'https://placehold.co/200x80/374d4f/ffffff?text=ETC',
    description:
      'A non-profit collaborative of educators and technologists working to ensure digital tools in schools are evidence-based, equitable, and teacher-informed.',
    website_url: 'https://example.com/edtech-collaborative',
    sort_order: 4,
    published: true,
    created_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '44444444-0000-0000-0000-000000000005',
    name: 'University of Toronto — OISE',
    logo_url: 'https://placehold.co/200x80/374d4f/ffffff?text=OISE',
    description:
      'The Ontario Institute for Studies in Education — one of Canada\'s leading graduate schools of education and a key research partner for evidence-based practice.',
    website_url: 'https://example.com/oise',
    sort_order: 5,
    published: true,
    created_at: '2024-11-15T10:00:00Z',
  },
  {
    id: '44444444-0000-0000-0000-000000000006',
    name: 'Community Schools Network',
    logo_url: 'https://placehold.co/200x80/374d4f/ffffff?text=CSN',
    description:
      'A grassroots network of community schools across Ontario advocating for wraparound support models that address the social determinants of educational outcomes.',
    website_url: 'https://example.com/community-schools',
    sort_order: 6,
    published: false,
    created_at: '2025-01-10T10:00:00Z',
  },
]

// ─── Page Content (mock — editable sections per page) ────────────────────────

export interface MockPageContent {
  id: string
  page: string      // 'home' | 'about' | 'mission'
  section: string   // e.g. 'hero', 'intro', 'cta'
  content: string   // HTML string from Tiptap
  updated_at: string
}

export const mockPageContent: MockPageContent[] = [
  // ── Home page ──────────────────────────────────────────────────────────────
  {
    id: 'pc-home-hero',
    page: 'home',
    section: 'hero',
    content: `<h1>Advancing Education Through Research & Practice</h1><p>We are a leading institute dedicated to transforming how educators teach and students learn — bridging the gap between academic research and classroom reality.</p>`,
    updated_at: '2025-03-01T10:00:00Z',
  },
  {
    id: 'pc-home-intro',
    page: 'home',
    section: 'intro',
    content: `<h2>Who We Are</h2><p>Founded by educators for educators, the Institute has spent over two decades developing evidence-based frameworks, training programmes, and policy recommendations that shape schools across the country.</p><p>Our work is grounded in a simple belief: every student deserves a teacher who has been given the time, resources, and support to do their best work.</p>`,
    updated_at: '2025-03-01T10:00:00Z',
  },
  {
    id: 'pc-home-cta',
    page: 'home',
    section: 'cta',
    content: `<h2>Get Involved</h2><p>Whether you are an educator looking to grow, a school leader seeking strategic support, or an organisation interested in partnership — we want to hear from you.</p>`,
    updated_at: '2025-03-01T10:00:00Z',
  },

  // ── About page ─────────────────────────────────────────────────────────────
  {
    id: 'pc-about-intro',
    page: 'about',
    section: 'intro',
    content: `<h1>About the Institute</h1><p>We are an independent, non-partisan educational research and professional development organisation. Our work spans curriculum design, teacher professional learning, leadership coaching, and education policy analysis.</p>`,
    updated_at: '2025-02-15T10:00:00Z',
  },
  {
    id: 'pc-about-mission',
    page: 'about',
    section: 'mission',
    content: `<h2>Our Mission</h2><p>To equip educators with the knowledge, skills, and confidence to create learning environments where every student can thrive — regardless of background, ability, or circumstance.</p>`,
    updated_at: '2025-02-15T10:00:00Z',
  },
  {
    id: 'pc-about-team',
    page: 'about',
    section: 'team',
    content: `<h2>Our Team</h2><p>Our team includes former classroom teachers, school administrators, curriculum specialists, and researchers — all united by a deep commitment to the craft of education.</p><p>We work with schools and systems across Canada, bringing a grounded, practical perspective to every engagement.</p>`,
    updated_at: '2025-02-15T10:00:00Z',
  },
  {
    id: 'pc-about-history',
    page: 'about',
    section: 'history',
    content: `<h2>Our History</h2><p>The Institute was founded in 2001 by a small group of educators frustrated with the disconnect between education research and classroom practice. What began as a study group has grown into a nationally recognised organisation working with hundreds of schools each year.</p>`,
    updated_at: '2025-02-15T10:00:00Z',
  },

  // ── Mission page ───────────────────────────────────────────────────────────
  {
    id: 'pc-mission-statement',
    page: 'mission',
    section: 'statement',
    content: `<h1>Our Mission</h1><p>To advance educational equity and excellence by connecting research to practice, supporting educator professional growth, and advocating for conditions in which all students can succeed.</p>`,
    updated_at: '2025-01-20T10:00:00Z',
  },
  {
    id: 'pc-mission-values',
    page: 'mission',
    section: 'values',
    content: `<h2>Our Values</h2><p><strong>Equity</strong> — We believe educational opportunity should not be determined by postal code, income, or background.</p><p><strong>Evidence</strong> — Our programmes and recommendations are grounded in the best available research, not ideology or trend.</p><p><strong>Collaboration</strong> — The best thinking happens in community. We work alongside educators, not above them.</p><p><strong>Courage</strong> — Improving education requires honest conversation about what isn't working. We are committed to saying hard things with care.</p>`,
    updated_at: '2025-01-20T10:00:00Z',
  },
  {
    id: 'pc-mission-approach',
    page: 'mission',
    section: 'approach',
    content: `<h2>Our Approach</h2><p>We do not believe in one-size-fits-all solutions. Every school community has a unique context, culture, and set of strengths. Our role is to bring rigorous thinking and proven frameworks to that context — then step back and support educators in doing what they do best.</p>`,
    updated_at: '2025-01-20T10:00:00Z',
  },
]

// Helper: get all sections for a specific page
export function getMockPageContent(page: string): MockPageContent[] {
  return mockPageContent.filter(item => item.page === page)
}

// Helper: get a single section
export function getMockSection(page: string, section: string): MockPageContent | undefined {
  return mockPageContent.find(item => item.page === page && item.section === section)
}



export const mockDashboardStats = {
  blogs: {
    total: mockBlogs.length,
    published: mockBlogs.filter(b => b.published).length,
    drafts: mockBlogs.filter(b => !b.published).length,
  },
  events: {
    total: mockEvents.length,
    published: mockEvents.filter(e => e.published).length,
    upcoming: mockEvents.filter(e => e.published && new Date(e.event_date) > new Date()).length,
  },
  readingList: {
    total: mockReadingList.length,
    published: mockReadingList.filter(r => r.published).length,
  },
  partners: {
    total: mockPartners.length,
    active: mockPartners.filter(p => p.published).length,
  },
}

// ─── Recent Activity (mock — last 5 items across all types) ──────────────────

export const mockRecentActivity = [
  { type: 'blog'         as const, title: mockBlogs[4].title,        date: mockBlogs[4].updated_at,        href: `/admin/blogs/${mockBlogs[4].id}` },
  { type: 'event'        as const, title: mockEvents[3].title,       date: mockEvents[3].updated_at,       href: `/admin/events/${mockEvents[3].id}` },
  { type: 'blog'         as const, title: mockBlogs[0].title,        date: mockBlogs[0].updated_at,        href: `/admin/blogs/${mockBlogs[0].id}` },
  { type: 'reading_list' as const, title: mockReadingList[4].title,  date: mockReadingList[4].updated_at,  href: `/admin/reading-list/${mockReadingList[4].id}` },
  { type: 'event'        as const, title: mockEvents[0].title,       date: mockEvents[0].updated_at,       href: `/admin/events/${mockEvents[0].id}` },
]
