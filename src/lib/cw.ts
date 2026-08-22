/**
 * Cactus Wren Preschool content model.
 *
 * Central source of truth for navigation, contact details, locally-hosted
 * media, staff/board, and document links. Migrated from the Wix site so the
 * GitHub Pages build is fully self-contained.
 *
 * Image paths are repo-root absolute (`/images/cw/...`). Wrap them with
 * `assetPath()` at render time so GitHub Pages subpath deploys resolve.
 */

/**
 * The mailing address, defined once as its display lines.
 *
 * Both forms are needed — the footer and the scholarship page stack it over
 * two lines, while prose renders it inline — and before this they were three
 * separate hardcoded copies that had already drifted on `PO Box` vs
 * `P.O. Box`. Deriving the one-line form from the lines keeps a single source.
 */
const MAILING_LINES = ['P.O. Box 1112', 'Sierra Vista, AZ 85636'] as const

export const contact = {
  director: 'Taylor Brennan',
  directorEmail: 'directorcactuswrenpreschool@gmail.com',
  email: 'cactuswrenpreschool@gmail.com',
  phone: '(520) 222-9485',
  phoneHref: 'tel:+15202229485',
  venue: 'Thunder Mountain Church',
  street: '4300 E Golden Acres Dr.',
  city: 'Sierra Vista',
  state: 'AZ',
  // The ADHS child-care licence in public/documents/dhs-license.pdf confirms
  // this street address as Sierra Vista, AZ 85650.
  zip: '85650',
  mailingLines: MAILING_LINES,
  mailing: MAILING_LINES.join(', '),
  facebook: 'https://www.facebook.com/cactuswrenpreschool',
} as const

/** Primary navigation, mirroring the live site menu order. */
export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Enrollment 2026-2027', href: '/enrollment' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Curriculum', href: '/curriculum' },
  { label: 'Class Schedules', href: '/class-schedules' },
  { label: 'Tuition', href: '/tuition' },
  { label: 'Scholarships', href: '/scholarship-information' },
  { label: 'Photo Gallery', href: '/photo-gallery' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Volunteering', href: '/volunteering' },
  { label: 'Health Policy', href: '/health-policy' },
  { label: 'Employment', href: '/employment' },
  { label: 'Documents & Links', href: '/documents-links' },
  // School Supply Lists had no link anywhere on the site — not in this array,
  // not in the footer, and not from any page. It was reachable only by typing
  // the URL, which is the worst possible state for a page families look for
  // every August. Placed next to Calendar as the other seasonal reference.
  { label: 'School Supply Lists', href: '/school-supply-lists' },
  { label: 'Contact', href: '/contact' },
] as const

const IMG = '/images/cw'

/** Locally-hosted images (originals pulled from Wix, optimized for the web). */
export const img = {
  logo: `${IMG}/457f82_3784e74a64c145ebbdce5b4f5e641170.png`,
  apple: `${IMG}/3389ae34131144cfc69d12885ed76564.jpg`,
  handprint: `${IMG}/457f82_0ffd0cbc6283424aaed1c7661d64e5e6.png`,
  helpingHand: `${IMG}/529bc4da043298ba0bca51499b57a6a6.png`,
  procareLogo: `${IMG}/b64214_6dd35b1b5988470ea7b56bc50c3ab6e1.png`,
  appStore: `${IMG}/457f82_b14ea238fdf74510ae5b14c0d598395f.jpg`,
  googlePlay: `${IMG}/457f82_ad9915123e6f428eb49177767a3490cc.jpg`,
  covidBanner: `${IMG}/457f82_2f15e17a747748609061b0d4c10afd54.jpg`,
  littleDoctor: `${IMG}/4970301561b245eda395bf8bd605bb4e.jpg`,
  teacherBanner: `${IMG}/457f82_973beb377d494df1b6266fc85204844a.jpg`,
  // Developmental icons (curriculum / home)
  devSocial: `${IMG}/457f82_c4a3de4fd6bd47a9853a65efe780975d.jpg`,
  devEmotional: `${IMG}/457f82_ba7453bf75e34f6db0b932a5374aca37.png`,
  devCognitive: `${IMG}/457f82_f3622433586d4724b08c6ddabc8f46aa.png`,
  devPhysical: `${IMG}/457f82_29d0887a96f64747af54c838865527f2.jpg`,
  // Candid classroom / school photos
  classroom1: `${IMG}/f61af8_af68d50a36d549c69e1afba4beac982d.jpg`,
  classroom2: `${IMG}/457f82_e1db24bde443448da938fd818e613f1f.jpg`,
  programPreK: `${IMG}/gallery-2026-02.png`,
  classroom4: `${IMG}/457f82_f0b4774b183e403e9a6071f6a807b086.png`,
  classroom5: `${IMG}/457f82_97b8617813e3466ba819681e0255cac2.png`,
  classroomWide: `${IMG}/f61af8_6458afc5e68c443f99b27457361df8b0.png`,
  outdoor: `${IMG}/nsplsh_334d75306951674c51746f_d_6000_4000_s_4_2.jpg`,
  // Hero slideshow photos (genuine school photos from the Photo Gallery)
  heroScience: `${IMG}/457f82_84c1d1756edc4f1da26530e549004ba9.jpg`,
  heroRug: `${IMG}/457f82_6a92f12db598447086b8884ae4f18847.jpg`,
} as const

/** Photos that make up the gallery / virtual tour. */
export const galleryPhotos = [
  `${IMG}/gallery-2026-01.png`,
  `${IMG}/gallery-2026-02.png`,
  `${IMG}/gallery-2026-03.png`,
  `${IMG}/gallery-2026-04.png`,
  `${IMG}/gallery-2026-05.png`,
  `${IMG}/gallery-2026-06.png`,
  `${IMG}/gallery-2026-07.png`,
  `${IMG}/gallery-2026-08.png`,
  `${IMG}/gallery-2026-09.png`,
  img.classroom2,
  img.classroom1,
  img.classroomWide,
  img.classroom4,
  img.outdoor,
  // Additional genuine school photos migrated from the live Wix Photo Gallery & School Tour page.
  `${IMG}/457f82_c922c27aef7e4b8a9629df9c84b0ab42.png`,
  `${IMG}/457f82_84c1d1756edc4f1da26530e549004ba9.jpg`,
  `${IMG}/457f82_a2414b9a00d8450caea1e45756368feb.jpg`,
  `${IMG}/457f82_6a92f12db598447086b8884ae4f18847.jpg`,
  `${IMG}/457f82_152743dc2d2e4d6e8cf685f2500fe8f9.jpg`,
  `${IMG}/457f82_36b59e23431f43d5a0f5b78d5f731cfc.jpg`,
  `${IMG}/457f82_01244fa6000d4fa898621d7307b65c15.jpg`,
  `${IMG}/457f82_1335ea57dd3f48fe9af7c3748e38ef7e.jpg`,
  `${IMG}/457f82_6a751391f6284b0a8b49e45f43da8ca0.jpg`,
  `${IMG}/457f82_e9314e65905d4affbef85e52fd4ca540.jpg`,
  `${IMG}/457f82_063ad0ffecf64c07a4a11547f9049741.png`,
  `${IMG}/457f82_cbb93b9e1fe64476b560040029a55cea.jpg`,
]

export type Person = {
  name: string
  role: string
  photo?: string
  email?: string
  bio?: string
}

/** Board of Directors, in the order shown on the live About Us page. */
export const board: Person[] = [
  {
    name: 'Shannon Lenzmeier',
    role: 'President',
    photo: `${IMG}/457f82_74863b5c0dc14e1698d1f0a8af4ab4c2.jpg`,
    bio: "Shannon is thrilled to serve as Cactus Wren's Board President! Her family has loved being part of the school - both of her children attended Cactus Wren from 2022-2026. As a home health physical therapist, she enjoys the flexibility to stay involved in classroom activities and school events. She is excited to help support a welcoming, engaging environment for all Cactus Wren families.",
  },
  {
    name: 'Chelsea Orozco',
    role: 'Vice President',
    photo: `${IMG}/chelsea-orozco-headshot.jpg`,
    bio: 'Chelsea is excited to serve as Vice President of Cactus Wren. She is a stay-at-home mom to two daughters, one of whom attended Cactus Wren last year and is returning this year. Watching her daughter learn, grow, and build friendships has given Chelsea a deep appreciation for the school’s caring community. She looks forward to supporting its teachers, families, and students while helping create a positive and nurturing environment for every child.',
  },
  {
    name: 'Stephanie Cespedes',
    role: 'Social Media Manager',
    photo: `${IMG}/457f82_2adefcf8ba164f5394c9125b87a3aad8.jpg`,
    bio: "Stephanie is a long time resident of Sierra Vista and former public school teacher. She owns Rustic Rise Sourdough Co., a micro bakery that allows her to be home for her youngest who attends Cactus Wren. Her oldest also attended Cactus for two years. She's excited for all the new changes to the preschool and is committed to keeping you informed.",
  },
  {
    name: 'Brian Lenzmeier',
    role: 'Financial Director',
    photo: `${IMG}/457f82_3774360f46be49f793702e9a35f7e404.jpg`,
    bio: 'Brian has been a part of the Cactus Wren community for three years and currently serves as our Financial Director. He is an active duty Army officer and enjoys giving back to the community by coaching youth sports. Brian and his family look forward to making Sierra Vista their permanent home when he retires from the Army.',
  },
  {
    name: 'Emily Marinaro',
    role: 'Fundraising Coordinator',
    photo: `${IMG}/457f82_5e46c8b80d694554978c3e5b27d40fbe.jpg`,
    bio: "Emily joins the Cactus Wren Board as the Fundraising Coordinator. Emily works at Charles Schwab as a Business Risk Analyst verifying account conformity with regulations. She holds Series 7 and 66 investment licenses and has been in the financial services industry for 12 years. Emily earned her bachelor's degree in Finance from the University of Nevada, Las Vegas. Emily and her husband, Jason, have one child in attendance this year.",
  },
]

/** Teaching staff, in the order shown on the live About Us page. */
export const staff: Person[] = [
  {
    name: 'Taylor Brennan',
    role: 'Director',
    photo: `${IMG}/457f82_c3894fac51384a90a7c86e275eaa45b9.jpg`,
    bio: 'Taylor is very excited for her second year as Director of Cactus Wren. After her daughter attended last year, Taylor fell in love with the school. Her background in early childhood education and office management will enable her to keep the legacy of Cactus Wren alive for years to come.',
  },
  {
    name: 'Patsy Romero',
    role: 'Pre-K Teacher',
    photo: `${IMG}/patsy-romero-headshot.jpg`,
    email: 'misspatsycw@gmail.com',
    bio: 'Patsy first joined Cactus Wren as a parent when her sons attended from 2004 to 2008. She returned as a teacher’s aide in 2022 and soon became a lead teacher. Patsy holds an associate’s degree in early childhood development and homeschooled her sons for 13 years. She is excited to support Cactus Wren’s Pre-K learners with a teaching approach centered on curiosity, individualized learning, care, and respect.',
  },
  {
    name: 'Elizabeth (Lizzy) Merkley',
    role: 'Pre-K Aide (1st semester)',
    photo: `${IMG}/elizabeth-merkley-headshot.jpg`,
    bio: 'Elizabeth (“Ms. Lizzy”) Merkley is thrilled to join the Cactus Wren staff. She holds a bachelor’s degree in social work and has experience in Applied Behavior Analysis, supporting children with autism at home and school. She is passionate about play-based learning and helping children grow socially. Outside the classroom, she enjoys hiking, traveling, and spending time with family. Her eight-year-old son previously attended Cactus Wren, and her daughter, Catherine, is currently in the Pre-K class.',
  },
  {
    name: 'Liz Davis',
    role: 'Pre-K Aide (2nd semester)',
    photo: `${IMG}/liz-davis-headshot.jpg`,
    bio: 'Liz comes from a culinary background and worked in home health care for four years. She is a mother of two daughters. One recently graduated from Cactus Wren, and her youngest will attend this school year. She has been an active volunteer for the school for two years and is thrilled to continue working side by side with Patsy after returning from the birth of her son.',
  },
  {
    name: 'Carly Vieira',
    role: 'Preschool Teacher',
    photo: `${IMG}/carly-vieira-headshot.jpg`,
    bio: 'Carly is excited to join Cactus Wren as the Preschool Teacher. She has experience in early childhood education, homeschooling, and leading STEM clubs for children ages 3–8. She is passionate about creating a warm, supportive classroom where every child can learn and thrive. Carly is a mother of two, and her youngest is beginning her first year at Cactus Wren.',
  },
  {
    name: 'Linzy Collister',
    role: 'Preschool Aide',
    photo: `${IMG}/linzy-collister-headshot.jpg`,
    bio: 'Linzy is delighted to return to Cactus Wren after serving as an aide and substitute in 2023. She has a background in hospice home health care and has dreamed of becoming a teacher since fourth grade. Outside the classroom, she enjoys traveling, trying new foods, and collecting nature’s treasures (like a crow). She and her husband are recent empty nesters who share their home with four cats and two dogs.',
  },
]

const DOC = '/documents'

/** Locally-hosted PDF documents (pulled from Wix). */
export const docs = {
  applicationForm: `${DOC}/application-form.pdf`,
  enrollmentPacket: `${DOC}/enrollment-packet.pdf`,
  calendarDownload: `${DOC}/school-calendar-2026-2027.pdf`,
  orientationManual: `${DOC}/orientation-manual-2025-2026.pdf`,
  handSanitizer: `${DOC}/hand-sanitizer-permission.pdf`,
  emergencyInfo: `${DOC}/emergency-information-form.pdf`,
  byLaws: `${DOC}/by-laws-2025-2026.pdf`,
  schoolCalendar: `${DOC}/school-calendar-2026-2027.pdf`,
  parentHandbook: `${DOC}/parent-handbook-2026-2027.pdf`,
  tuitionSchedule: `${DOC}/tuition-schedule-2025-2026.pdf`,
  dhsLicense: `${DOC}/dhs-license.pdf`,
  adultParticipation: `${DOC}/adult-participation-contract-photo-consent.pdf`,
  byLawsAgreement: `${DOC}/by-laws-parent-orientation-agreement.pdf`,
  religiousExemption: `${DOC}/religious-belief-exemption-form.pdf`,
  employmentApplication: `${DOC}/employment-application.pdf`,
  azEarlyLearning: `${DOC}/az-early-learning-standards.pdf`,
  boardContact: `${DOC}/board-member-contact-information.pdf`,
  dpsFingerprintApplication: `${DOC}/az-dps-fingerprint-card-application.pdf`,
  tbSelfScreening: `${DOC}/tb-self-screening-form.pdf`,
  tbVerification: `${DOC}/tb-verification-form.pdf`,
  fingerprintCard: `${DOC}/az-fingerprint-card-application.pdf`,
} as const

/** External links referenced across the site. */
export const links = {
  qualityFirst: 'https://qualityfirstaz.com/',
  desEligibility: 'https://www.azccrr.com/child-care-eligibility-and-assistance.html',
  desApplication:
    'https://des.az.gov/services/child-and-family/child-care/how-apply-for-child-care-assistance',
  azEarlyLearningSite: 'https://www.azed.gov/ece/',
  learningDynamics: 'https://4weekstoread.com/',
  dpsFingerprint: 'https://www.azdps.gov/services/public/fingerprint',
  procare: 'https://www.procaresoftware.com/capabilities/child-care-mobile-app/',
  procareAppStore: 'https://apps.apple.com/us/app/procare-childcare-app/id1309822135',
  procareGooglePlay: 'https://play.google.com/store/apps/details?id=com.kinderlime.dev',
} as const
