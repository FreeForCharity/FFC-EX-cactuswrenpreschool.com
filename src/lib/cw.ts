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
  zip: '85635',
  mailing: 'P.O. Box 1112, Sierra Vista, AZ 85636',
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
  classroom3: `${IMG}/457f82_b604686ee7b14498ab022fcde6f601ad.jpg`,
  classroom4: `${IMG}/457f82_f0b4774b183e403e9a6071f6a807b086.png`,
  classroom5: `${IMG}/457f82_97b8617813e3466ba819681e0255cac2.png`,
  classroomWide: `${IMG}/f61af8_6458afc5e68c443f99b27457361df8b0.png`,
  outdoor: `${IMG}/nsplsh_334d75306951674c51746f_d_6000_4000_s_4_2.jpg`,
} as const

/** Photos that make up the gallery / virtual tour. */
export const galleryPhotos = [
  img.classroom2,
  img.classroom1,
  img.classroom3,
  img.classroomWide,
  img.classroom4,
  img.classroom5,
  img.outdoor,
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
    name: 'Taylor Brennan',
    role: 'Director',
    photo: `${IMG}/457f82_c3894fac51384a90a7c86e275eaa45b9.jpg`,
    bio: 'Taylor is very excited for her first year as director of Cactus Wren Preschool. After her daughter attended last year, Taylor fell in love with the school. Her background in early childhood education and office management will enable her to keep the legacy of Cactus Wren alive for years to come.',
  },
  {
    name: 'Shannon Lenzmeier',
    role: 'President',
    photo: `${IMG}/457f82_74863b5c0dc14e1698d1f0a8af4ab4c2.jpg`,
    bio: "Shannon is thrilled to serve as Cactus Wren's Board President! Her family has loved being part of the school - her oldest attended for two years, and her youngest is now in her second year. As a home health physical therapist, she enjoys the flexibility to stay involved in classroom activities and school events. She is excited to help support a welcoming, engaging environment for all Cactus Wren families.",
  },
  {
    name: 'Emilie Carlotto',
    role: 'Vice President',
    photo: `${IMG}/457f82_493981616705483989062ef09c2de3d4.jpg`,
    bio: "Emilie's family has resided in Sierra Vista for over eight years. Her son is currently in his second year at Cactus Wren. After several years in education, Emilie became a stay at home mom. She is looking forward to organizing fun and engaging events for our little ones and their families!",
  },
  {
    name: 'Erika Mark',
    role: 'Secretary',
    photo: `${IMG}/457f82_e8bb5f2f60164118977b9118aa57cd16.jpg`,
    bio: "Erika looks forward to being part of Cactus Wren Preschool for her daughter's second year at the school. She is the owner and artist behind Lumenrose Jewelry. She and her family have truly appreciated the play-based nature of the school and as Board Secretary Erika is happy to support the school's mission.",
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
    name: 'Patsy Romero',
    role: 'Pre-School Teacher',
    photo: `${IMG}/457f82_0f33b821fdfe4591936e33e5479d39e9.jpg`,
    email: 'misspatsycw@gmail.com',
    bio: 'Patsy is the lead teacher for the preschool class.',
  },
  {
    name: 'Elizabeth (Lizzy) Merkley',
    role: 'Pre-School Aide',
    photo: `${IMG}/457f82_3b02992dcdec4cc488673777585836f2.jpg`,
    bio: 'Lizzy is the aide for the preschool class.',
  },
  {
    name: 'Rosa Ramsey',
    role: 'Pre-K Teacher',
    photo: `${IMG}/457f82_9f39ddb9b511452db720f3191aafb841.jpg`,
    email: 'missrosacw@gmail.com',
    bio: 'Rosa is the lead teacher for the Pre-K class.',
  },
  {
    name: 'Liz Davis',
    role: 'Pre-K Aide',
    photo: `${IMG}/457f82_06a26223343c4ce6ac839a47ba5f3112.jpg`,
    bio: 'Liz is the aide for the Pre-K class.',
  },
]

const DOC = '/documents'

/** Locally-hosted PDF documents (pulled from Wix). */
export const docs = {
  applicationForm: `${DOC}/application-form.pdf`,
  enrollmentPacket: `${DOC}/enrollment-packet.pdf`,
  calendarDownload: `${DOC}/school-calendar-download.pdf`,
  orientationManual: `${DOC}/orientation-manual-2025-2026.pdf`,
  handSanitizer: `${DOC}/hand-sanitizer-permission.pdf`,
  emergencyInfo: `${DOC}/emergency-information-form.pdf`,
  byLaws: `${DOC}/by-laws-2025-2026.pdf`,
  schoolCalendar: `${DOC}/school-calendar-2025-2026.pdf`,
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
