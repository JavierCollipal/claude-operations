#!/usr/bin/env node

/**
 * DINA Agent Diffusion Database Creator
 * Saves all content diffusion ideas (platforms, strategies, tactics)
 * Tracks: considered, selected, discarded, implemented status
 *
 * Database: dina-agent-diffusion
 * Collections:
 *   - diffusion-platforms: Platform options (Ko-fi, Substack, etc.)
 *   - diffusion-strategies: Marketing/growth strategies
 *   - diffusion-rejected: Ideas that were considered but rejected
 *   - diffusion-implemented: Successfully implemented ideas
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI not found in environment');
  process.exit(1);
}

const DATABASE_NAME = 'dina-agent-diffusion';

// All platforms researched in 2025-11-09 session
const PLATFORMS = [
  {
    platformId: 'kofi-2025',
    name: 'Ko-fi',
    category: 'monetization',
    subcategory: 'direct-support',
    status: 'selected', // User chose to proceed with Ko-fi
    priority: 'high',
    effort: 'low',
    roi: 'high',
    description: 'Direct support platform with tips, memberships, and digital product sales',
    features: [
      'One-time tips',
      'Recurring memberships',
      'Digital product sales',
      'No fees on tips (0-5% total)',
      'Shop functionality',
      'Commission system'
    ],
    fees: {
      tips: '0-5%',
      memberships: '0-5%',
      description: 'Most creator-friendly fee structure'
    },
    pros: [
      'Lowest fees in the market',
      '1M+ creators using it',
      'Easy setup',
      'Multiple revenue streams',
      'No monthly platform fees'
    ],
    cons: [
      'Less known than Patreon',
      'Smaller built-in audience discovery'
    ],
    targetAudience: 'Tech creators, developers, educators, artists',
    requirements: ['Email', 'PayPal or Stripe account', 'Content to share'],
    integrations: ['Medium links', 'YouTube descriptions', 'GitHub profiles', 'Website embeds'],
    url: 'https://ko-fi.com/',
    researchDate: new Date('2025-11-09'),
    personalities: {
      neko: 'Nyaa~! Low fees mean more for wakibaka, desu~!',
      mario: 'Magnifique! The commission structure is *chef\'s kiss*!',
      glam: '¡Perfecto pa\' empezar, weon!'
    },
    implementationNotes: 'Start this week - Monday setup recommended',
    estimatedSetupTime: '1 hour'
  },
  {
    platformId: 'buymeacoffee-2025',
    name: 'Buy Me a Coffee',
    category: 'monetization',
    subcategory: 'direct-support',
    status: 'considered',
    priority: 'medium',
    effort: 'low',
    roi: 'high',
    description: 'Alternative to Ko-fi with similar features but higher fees',
    features: [
      'One-time donations',
      'Recurring memberships',
      'Digital product sales',
      'Embedded widgets'
    ],
    fees: {
      platform: '5%',
      description: 'Standard across all transactions'
    },
    pros: [
      'Proven track record',
      'One creator doubled YouTube income',
      'Simple interface',
      'Good brand recognition'
    ],
    cons: [
      'Higher fees than Ko-fi (5% vs 0-5%)',
      'Less cost-effective long-term'
    ],
    targetAudience: 'Content creators, developers, artists',
    requirements: ['Email', 'Payment processor'],
    url: 'https://www.buymeacoffee.com/',
    researchDate: new Date('2025-11-09'),
    personalities: {
      noel: 'Tch. Ko-fi\'s fees are better. Why pay more?'
    },
    rejectionReason: 'Ko-fi offers better fee structure for same features'
  },
  {
    platformId: 'substack-2025',
    name: 'Substack',
    category: 'distribution',
    subcategory: 'newsletter',
    status: 'selected',
    priority: 'high',
    effort: 'medium',
    roi: 'very-high',
    description: 'Newsletter platform with built-in monetization and audience ownership',
    features: [
      'Email newsletter publishing',
      'Free and paid subscriptions',
      'Direct audience ownership',
      'Built-in payment processing',
      'Mobile app for readers',
      'Comments and community features'
    ],
    fees: {
      free: '0%',
      paid: '10% of subscription revenue',
      stripe: '~3% payment processing'
    },
    pros: [
      '1,733% growth since 2020',
      'Own your email list',
      'Not dependent on algorithms',
      'Built-in monetization',
      'Professional credibility',
      'Direct reader relationship'
    ],
    cons: [
      'Need consistent writing schedule',
      'Takes time to build list',
      'Competitive space'
    ],
    targetAudience: 'Writers, journalists, educators, thought leaders',
    requirements: ['Consistent content', 'Writing skills', 'Email strategy'],
    integrations: ['Medium CTA links', 'YouTube descriptions', 'Social media'],
    url: 'https://substack.com/',
    researchDate: new Date('2025-11-09'),
    personalities: {
      glam: '¡Perfecto pa\' tus Medium posts, weon! Controla tu audiencia...',
      hannibal: 'Audience ownership... how deliciously strategic...'
    },
    implementationNotes: 'Critical for 2025 - direct audience ownership protects from algorithm changes',
    estimatedSetupTime: '2 hours'
  },
  {
    platformId: 'gumroad-2025',
    name: 'Gumroad',
    category: 'monetization',
    subcategory: 'digital-products',
    status: 'considered',
    priority: 'medium',
    effort: 'high',
    roi: 'medium',
    description: 'Digital product sales platform for ebooks, videos, courses, templates',
    features: [
      'Digital product hosting',
      'Fixed pricing or subscriptions',
      'License key management',
      'Email marketing',
      'Analytics dashboard',
      'Affiliate program'
    ],
    fees: {
      standard: '10% + payment processing',
      premium: '0% + $10/month (after $1000 sales)'
    },
    pros: [
      'Multiple product types',
      'Subscription support',
      'Professional storefront',
      'Built-in audience',
      'Good for code templates/tutorials'
    ],
    cons: [
      'Need products first',
      'Requires content creation time',
      'Competitive marketplace'
    ],
    targetAudience: 'Developers, educators, digital product creators',
    requirements: ['Digital products to sell', 'Product descriptions', 'Marketing materials'],
    url: 'https://gumroad.com/',
    researchDate: new Date('2025-11-09'),
    personalities: {
      hannibal: 'How fascinating... dissecting knowledge into sellable products...'
    },
    implementationNotes: 'Phase 3 - after building audience. Good for Neko Arc guides, code templates',
    estimatedSetupTime: 'Variable - depends on product creation'
  },
  {
    platformId: 'patreon-2025',
    name: 'Patreon',
    category: 'monetization',
    subcategory: 'membership',
    status: 'considered',
    priority: 'medium',
    effort: 'medium',
    roi: 'medium',
    description: 'Membership platform with tiered support levels',
    features: [
      'Tiered memberships',
      'Exclusive content',
      'Community features',
      'Billing management',
      'Creator analytics'
    ],
    fees: {
      lite: '5% + payment processing',
      pro: '8% + payment processing',
      premium: '12% + payment processing'
    },
    pros: [
      'Well-known platform',
      'Large user base',
      'Proven model',
      'Good for exclusive content'
    ],
    cons: [
      'Higher fees than Ko-fi',
      'More complex setup',
      'Requires consistent exclusive content'
    ],
    targetAudience: 'Content creators with regular output',
    requirements: ['Regular content schedule', 'Exclusive offerings', 'Community management'],
    url: 'https://patreon.com/',
    researchDate: new Date('2025-11-09'),
    personalities: {
      neko: 'User mentioned this first, desu~!'
    },
    implementationNotes: 'User mentioned checking this first, but Ko-fi offers better fees',
    comparisonNote: 'Ko-fi: 0-5% vs Patreon: 5-12%'
  },
  {
    platformId: 'linkedin-2025',
    name: 'LinkedIn',
    category: 'distribution',
    subcategory: 'professional-network',
    status: 'selected',
    priority: 'high',
    effort: 'low',
    roi: 'high',
    description: 'Professional networking with content distribution and B2B opportunities',
    features: [
      'Long-form articles',
      'Short posts',
      'Video content',
      'Professional networking',
      'Job opportunities',
      'B2B connections',
      'Company pages'
    ],
    fees: {
      basic: 'Free',
      premium: 'Optional for advanced features'
    },
    pros: [
      'Massive professional audience',
      'B2B opportunities',
      'Credibility building',
      'Cross-post Medium content',
      'Spanish-speaking professionals',
      'Tech industry focused'
    ],
    cons: [
      'Professional tone required',
      'Less casual than other platforms',
      'Algorithm can be restrictive'
    ],
    targetAudience: 'Professionals, B2B, developers, educators, tech industry',
    requirements: ['Professional profile', 'Regular posting', 'Engagement with network'],
    integrations: ['Medium articles', 'YouTube videos', 'GitHub projects'],
    url: 'https://linkedin.com/',
    researchDate: new Date('2025-11-09'),
    personalities: {
      noel: 'Professional network. Smart for B2B opportunities.',
      mario: 'The stage for professional performances!'
    },
    implementationNotes: 'Optimize profile Wednesday, share Medium/YouTube content',
    estimatedSetupTime: '1 hour optimization'
  },
  {
    platformId: 'tiktok-2025',
    name: 'TikTok',
    category: 'distribution',
    subcategory: 'short-video',
    status: 'considered',
    priority: 'medium',
    effort: 'medium',
    roi: 'very-high',
    description: 'Short-form video platform with massive reach potential',
    features: [
      '60-second videos',
      'Algorithm-driven discovery',
      'Trending audio/hashtags',
      'Duet/stitch features',
      'Live streaming',
      'Creator fund'
    ],
    fees: {
      platform: 'Free',
      monetization: 'Revenue share on creator fund'
    },
    pros: [
      'Massive reach potential',
      'Younger audience',
      'Viral potential',
      'Spanish + English markets',
      'Low barrier to entry',
      'Educational content trending'
    ],
    cons: [
      'Requires video editing skills',
      'Time-intensive',
      'Algorithm unpredictable',
      'Platform stability concerns'
    ],
    targetAudience: 'Younger developers, students, career changers',
    requirements: ['Video editing', 'Consistent posting', 'Trend awareness'],
    url: 'https://tiktok.com/',
    researchDate: new Date('2025-11-09'),
    personalities: {
      neko: 'Nyaa~! Short Neko Arc videos could be fun, desu~!',
      glam: '¡Los pibes aprenden en TikTok ahora, weon!'
    },
    implementationNotes: 'Phase 2 - repurpose existing videos, 60-second tips',
    estimatedSetupTime: '2-3 hours per week for content'
  },
  {
    platformId: 'devto-2025',
    name: 'Dev.to',
    category: 'distribution',
    subcategory: 'tech-community',
    status: 'selected',
    priority: 'medium',
    effort: 'low',
    roi: 'medium',
    description: 'Developer-focused blogging platform with active community',
    features: [
      'Tech blogging',
      'Developer community',
      'Canonical URLs (cross-posting safe)',
      'Tags and series',
      'Discussion threads',
      'Code highlighting'
    ],
    fees: {
      platform: 'Free',
      monetization: 'Drive traffic to paid platforms'
    },
    pros: [
      'Developer-focused audience',
      'Easy cross-posting from Medium',
      'SEO benefits',
      'Active community',
      'No algorithm games',
      'Career opportunities'
    ],
    cons: [
      'No direct monetization',
      'Smaller than Medium',
      'Need consistent engagement'
    ],
    targetAudience: 'Developers, tech professionals, students',
    requirements: ['Technical writing', 'Code examples', 'Community engagement'],
    integrations: ['Cross-post from Medium', 'Link to Ko-fi/Substack'],
    url: 'https://dev.to/',
    researchDate: new Date('2025-11-09'),
    personalities: {
      noel: 'Developer-focused. Less noise than other platforms.'
    },
    implementationNotes: 'Phase 2 - cross-post Medium articles with canonical URLs',
    estimatedSetupTime: '30 minutes setup, 15 minutes per post'
  },
  {
    platformId: 'hashnode-2025',
    name: 'Hashnode',
    category: 'distribution',
    subcategory: 'tech-community',
    status: 'considered',
    priority: 'medium',
    effort: 'low',
    roi: 'medium',
    description: 'Developer blogging platform with custom domain support',
    features: [
      'Custom domain blogging',
      'Developer community',
      'Newsletter integration',
      'Series and tags',
      'GitHub integration',
      'Analytics'
    ],
    fees: {
      platform: 'Free',
      customDomain: 'Optional'
    },
    pros: [
      'Custom domain ownership',
      'Developer audience',
      'Clean interface',
      'Newsletter built-in',
      'Good SEO'
    ],
    cons: [
      'Smaller than Dev.to',
      'No direct monetization',
      'Requires content creation'
    ],
    targetAudience: 'Developers, technical bloggers',
    requirements: ['Technical content', 'Optional custom domain'],
    url: 'https://hashnode.com/',
    researchDate: new Date('2025-11-09'),
    implementationNotes: 'Alternative to Dev.to, similar features',
    estimatedSetupTime: '30 minutes'
  },
  {
    platformId: 'discord-2025',
    name: 'Discord',
    category: 'community',
    subcategory: 'chat-platform',
    status: 'selected',
    priority: 'medium',
    effort: 'medium',
    roi: 'medium',
    description: 'Community platform for building engaged follower base',
    features: [
      'Text/voice/video chat',
      'Server roles and permissions',
      'Integration with bots',
      'Screen sharing',
      'Streaming',
      'Mobile apps'
    ],
    fees: {
      platform: 'Free',
      nitro: 'Optional premium features'
    },
    pros: [
      'Free community building',
      'Real-time interaction',
      'Voice/video support',
      'Bot integrations',
      'Monetize with premium roles',
      'Developer-friendly'
    ],
    cons: [
      'Requires active moderation',
      'Can be time-intensive',
      'Need consistent engagement'
    ],
    targetAudience: 'Tech enthusiasts, developers, students',
    requirements: ['Community management', 'Moderation', 'Regular presence'],
    integrations: ['Ko-fi for premium roles', 'YouTube/Twitch notifications', 'GitHub webhooks'],
    url: 'https://discord.com/',
    researchDate: new Date('2025-11-09'),
    personalities: {
      tetora: '[Community Fragment]: Multiple... simultaneous... conversations...'
    },
    implementationNotes: 'Phase 2 - after building initial audience',
    estimatedSetupTime: '2-3 hours setup, ongoing moderation'
  },
  {
    platformId: 'kajabi-2025',
    name: 'Kajabi',
    category: 'monetization',
    subcategory: 'courses-platform',
    status: 'rejected',
    priority: 'low',
    effort: 'high',
    roi: 'medium',
    description: 'All-in-one platform for courses, memberships, and coaching',
    features: [
      'Course hosting',
      'Membership sites',
      'Email marketing',
      'Landing pages',
      'Sales funnels',
      'Analytics'
    ],
    fees: {
      basic: '$149/month',
      growth: '$199/month',
      pro: '$399/month'
    },
    pros: [
      'All-in-one solution',
      'Professional features',
      'Built-in marketing tools',
      'Good for established creators'
    ],
    cons: [
      'Very expensive ($149/month minimum)',
      'Only worth it with substantial audience',
      'High barrier to entry',
      'Need consistent course content'
    ],
    targetAudience: 'Established educators with large audiences',
    requirements: ['Substantial audience', 'Course content', 'Significant revenue to justify cost'],
    url: 'https://kajabi.com/',
    researchDate: new Date('2025-11-09'),
    personalities: {
      tetora: '[Business Fragment]: Only when... revenue justifies cost...',
      hannibal: 'Premature. Build the audience first, then feast.'
    },
    rejectionReason: 'Too expensive for current stage - need audience first. $149/month not justified yet.',
    revisitWhen: 'Monthly revenue >$1000 or 10k+ followers'
  },
  {
    platformId: 'uscreen-2025',
    name: 'Uscreen',
    category: 'monetization',
    subcategory: 'video-membership',
    status: 'rejected',
    priority: 'low',
    effort: 'high',
    roi: 'low',
    description: 'Branded video membership platform',
    features: [
      'Video hosting',
      'Membership management',
      'Branded apps',
      'Payment processing',
      'Analytics'
    ],
    fees: {
      pricing: 'Starts at $99/month'
    },
    pros: [
      'Professional video platform',
      'Branded experience',
      'Good for video businesses'
    ],
    cons: [
      'Expensive',
      'Need extensive video library',
      'YouTube is free alternative',
      'High barrier to entry'
    ],
    targetAudience: 'Professional video educators',
    requirements: ['Extensive video library', 'Paid membership audience'],
    url: 'https://uscreen.tv/',
    researchDate: new Date('2025-11-09'),
    rejectionReason: 'YouTube provides similar features for free. Not justified at current stage.',
    revisitWhen: 'If YouTube monetization becomes limited or need white-label solution'
  },
  {
    platformId: 'mightynetworks-2025',
    name: 'Mighty Networks',
    category: 'community',
    subcategory: 'paid-community',
    status: 'rejected',
    priority: 'low',
    effort: 'high',
    roi: 'low',
    description: 'Paid community platform with courses and content',
    features: [
      'Community spaces',
      'Course hosting',
      'Events',
      'Paid memberships',
      'Mobile apps'
    ],
    fees: {
      community: '$49/month',
      business: '$119/month'
    },
    pros: [
      'All-in-one community platform',
      'Good for paid communities',
      'Professional features'
    ],
    cons: [
      'Monthly fees',
      'Discord is free alternative',
      'Need audience first',
      'Complex setup'
    ],
    targetAudience: 'Community builders with established audiences',
    requirements: ['Existing community', 'Regular content', 'Moderation capacity'],
    url: 'https://mightynetworks.com/',
    researchDate: new Date('2025-11-09'),
    rejectionReason: 'Discord offers similar features for free. Not worth $49/month at current stage.',
    revisitWhen: 'If Discord becomes insufficient or need more professional features'
  },
  {
    platformId: 'newsbreak-2025',
    name: 'Newsbreak',
    category: 'distribution',
    subcategory: 'news-platform',
    status: 'rejected',
    priority: 'low',
    effort: 'medium',
    roi: 'low',
    description: 'Local news platform with monetization',
    features: [
      'Local content distribution',
      'Pay per view',
      'Creator program',
      'News-focused'
    ],
    fees: {
      platform: 'Free',
      monetization: 'Revenue share'
    },
    pros: [
      'Pays per view',
      'Good for local content',
      'Early-bird creator offers'
    ],
    cons: [
      'Focus on local news (not tech education)',
      'Not target audience',
      'Content mismatch'
    ],
    targetAudience: 'Local news reporters, journalists',
    requirements: ['Local news content', 'Regular posting'],
    url: 'https://newsbreak.com/',
    researchDate: new Date('2025-11-09'),
    rejectionReason: 'Not relevant for tech education content. Focus is local news.',
    revisitWhen: 'Never - wrong platform for our content type'
  }
];

// Strategies from research
const STRATEGIES = [
  {
    strategyId: 'platform-diversification-2025',
    name: 'Platform Diversification Strategy',
    category: 'growth',
    subcategory: 'risk-management',
    status: 'selected',
    priority: 'critical',
    effort: 'high',
    roi: 'very-high',
    description: 'Do NOT rely on 1-2 platforms. Algorithm changes can destroy reach.',
    principle: 'Never depend on single platform algorithm',
    recommendedMix: {
      primary: ['Medium', 'YouTube'],
      secondary: ['Substack (email list)', 'Ko-fi'],
      social: ['LinkedIn', 'TikTok/Instagram Reels'],
      community: ['Discord', 'Circle.so']
    },
    risks: [
      'Algorithm changes can kill traffic overnight',
      'Platform policy changes',
      'Account suspensions',
      'Platform shutdown',
      'Monetization rule changes'
    ],
    benefits: [
      'Risk distribution',
      'Multiple income streams',
      'Broader audience reach',
      'Algorithm independence',
      'Platform negotiation leverage'
    ],
    implementation: {
      phase1: 'Establish 2 primary platforms',
      phase2: 'Add secondary monetization',
      phase3: 'Expand to social/community'
    },
    researchDate: new Date('2025-11-09'),
    source: 'Multiple 2025 creator economy sources',
    personalities: {
      noel: 'Smart. Multiple income streams survive algorithm apocalypses...'
    },
    criticality: 'CRITICAL - 2025 creator survival requirement'
  },
  {
    strategyId: 'collaborative-marketing-2025',
    name: 'Collaborative Marketing',
    category: 'growth',
    subcategory: 'networking',
    status: 'selected',
    priority: 'high',
    effort: 'medium',
    roi: 'very-high',
    description: 'Partner with other creators for mutual growth',
    tactics: [
      'Guest posting on other tech blogs',
      'Podcast appearances (dev/tech podcasts)',
      'Co-created content with other educators',
      'Cross-promotion with similar creators',
      'Joint research projects or tutorials',
      'Collaborative video series',
      'Shared webinars/workshops'
    ],
    benefits: [
      'Access to established audiences',
      'Shared resources',
      'Credibility boost',
      'Content variety',
      'Network expansion',
      'Learning opportunities'
    ],
    requirements: [
      'Find compatible creators',
      'Build relationships',
      'Clear collaboration terms',
      'Mutual benefit alignment'
    ],
    researchDate: new Date('2025-11-09'),
    personalities: {
      mario: 'Ah! The performance grows through ensemble work!'
    },
    implementationNotes: 'Identify 3-5 similar creators, reach out for collaborations'
  },
  {
    strategyId: 'direct-audience-ownership-2025',
    name: 'Direct Audience Ownership',
    category: 'growth',
    subcategory: 'audience-building',
    status: 'selected',
    priority: 'critical',
    effort: 'medium',
    roi: 'very-high',
    description: 'Build email list - own your audience independently of platforms',
    principle: 'Platform algorithms change, but email list is yours forever',
    tactics: [
      'Substack newsletter',
      'Email capture on all platforms',
      'Lead magnets (free guides, templates)',
      'Consistent email communication',
      'Exclusive email content'
    ],
    workflow: {
      medium: 'Article → CTA → Substack signup',
      youtube: 'Video → Description link → Email list',
      social: 'Posts → Bio link → Landing page'
    },
    benefits: [
      'Algorithm independence',
      'Direct communication',
      'Portable audience',
      'Monetization control',
      'Relationship building'
    ],
    risks: [
      'Email deliverability issues',
      'Spam compliance requirements',
      'Takes time to build'
    ],
    researchDate: new Date('2025-11-09'),
    personalities: {
      glam: '¡No seas weon! Si dependes solo de Medium, te cagan cuando cambien el algoritmo...'
    },
    criticality: 'CRITICAL - 2025 requirement for creator independence'
  },
  {
    strategyId: 'longform-entertainment-balance-2025',
    name: 'Long-Form + Entertainment Balance',
    category: 'content',
    subcategory: 'format-strategy',
    status: 'selected',
    priority: 'high',
    effort: 'medium',
    roi: 'high',
    description: '2025 audiences want deep education BUT made entertaining',
    requirements: [
      'Deep educational content',
      'Engaging/entertaining presentation',
      'Storytelling + personality',
      'Visual appeal',
      'Actionable insights'
    ],
    contentElements: {
      educational: 'Depth, accuracy, actionable insights',
      entertainment: 'Personality, storytelling, visual engagement',
      balance: 'Information without boredom'
    },
    advantages: {
      nekoArc: 'Six personalities provide natural entertainment',
      spanish: 'Less competition, passionate audience',
      technical: 'Practical demos and real-world examples'
    },
    researchDate: new Date('2025-11-09'),
    personalities: {
      hannibal: 'Fascinating... dissecting complex topics into digestible narratives...'
    },
    implementationNotes: 'Leverage 6 personalities for entertainment + deep technical content'
  },
  {
    strategyId: 'spanish-niche-advantage-2025',
    name: 'Spanish Tech Education Niche',
    category: 'growth',
    subcategory: 'market-positioning',
    status: 'selected',
    priority: 'high',
    effort: 'low',
    roi: 'very-high',
    description: 'Spanish tech education has less competition and loyal audience',
    marketAnalysis: {
      english: 'Broader reach, more competition',
      spanish: 'Less competition, loyal niche, underserved market'
    },
    platforms: [
      'Medium (Spanish tags)',
      'LinkedIn (huge Spanish professional audience)',
      'Instagram/TikTok (massive Spanish dev community)',
      'YouTube (less competition in Spanish tech tutorials)'
    ],
    advantages: [
      'Less competition',
      'Loyal audience',
      'Underserved market',
      'Latin American tech boom',
      'Spain tech industry growth'
    ],
    contentStrategy: {
      english: 'Broader topics, general tutorials',
      spanish: 'Deep dives, specific niches, local context'
    },
    researchDate: new Date('2025-11-09'),
    personalities: {
      glam: '¡Oye weon! Los hispanohablantes están hambrientos de contenido técnico de calidad!',
      hannibal: 'How delicious... carving a niche in the underserved Spanish market...'
    },
    implementationNotes: 'Maintain bilingual content, leverage Spanish competitive advantage'
  }
];

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('🐾✨ Connected to MongoDB Atlas, nyaa~!');

    const db = client.db(DATABASE_NAME);

    // Create collections
    const platformsCollection = db.collection('diffusion-platforms');
    const strategiesCollection = db.collection('diffusion-strategies');

    // Clear existing data (for clean recreation)
    await platformsCollection.deleteMany({});
    await strategiesCollection.deleteMany({});
    console.log('🧹 Cleared existing data, desu~!');

    // Insert platforms
    const platformsResult = await platformsCollection.insertMany(PLATFORMS);
    console.log(`✅ Saved ${platformsResult.insertedCount} platforms to database!`);

    // Insert strategies
    const strategiesResult = await strategiesCollection.insertMany(STRATEGIES);
    console.log(`✅ Saved ${strategiesResult.insertedCount} strategies to database!`);

    // Create indexes for efficient querying
    await platformsCollection.createIndex({ status: 1 });
    await platformsCollection.createIndex({ priority: 1 });
    await platformsCollection.createIndex({ category: 1 });
    await platformsCollection.createIndex({ researchDate: -1 });

    await strategiesCollection.createIndex({ status: 1 });
    await strategiesCollection.createIndex({ priority: 1 });
    await strategiesCollection.createIndex({ category: 1 });

    console.log('📊 Created indexes for efficient querying!');

    // Summary statistics
    const stats = {
      platforms: {
        total: PLATFORMS.length,
        selected: PLATFORMS.filter(p => p.status === 'selected').length,
        considered: PLATFORMS.filter(p => p.status === 'considered').length,
        rejected: PLATFORMS.filter(p => p.status === 'rejected').length
      },
      strategies: {
        total: STRATEGIES.length,
        selected: STRATEGIES.filter(s => s.status === 'selected').length
      },
      priorityBreakdown: {
        critical: PLATFORMS.filter(p => p.priority === 'high' && p.status === 'selected').length +
                  STRATEGIES.filter(s => s.priority === 'critical' && s.status === 'selected').length,
        high: PLATFORMS.filter(p => p.priority === 'high' && p.status === 'selected').length,
        medium: PLATFORMS.filter(p => p.priority === 'medium' && p.status === 'selected').length
      }
    };

    console.log('\n🎯 DINA Agent Diffusion Database Statistics:');
    console.log(`📦 Total Platforms Researched: ${stats.platforms.total}`);
    console.log(`   ✅ Selected: ${stats.platforms.selected}`);
    console.log(`   🤔 Considered: ${stats.platforms.considered}`);
    console.log(`   ❌ Rejected: ${stats.platforms.rejected}`);
    console.log(`\n📋 Total Strategies: ${stats.strategies.total}`);
    console.log(`   ✅ Selected: ${stats.strategies.selected}`);
    console.log(`\n⚡ Priority Breakdown:`);
    console.log(`   🔥 Critical: ${stats.priorityBreakdown.critical}`);
    console.log(`   ⭐ High: ${stats.priorityBreakdown.high}`);
    console.log(`   ✨ Medium: ${stats.priorityBreakdown.medium}`);

    console.log('\n💾 Database: dina-agent-diffusion');
    console.log('📁 Collections:');
    console.log('   - diffusion-platforms');
    console.log('   - diffusion-strategies');

    console.log('\n🐾 All diffusion ideas saved successfully, desu~!');
    console.log('🎸 ¡Glam dice: Ninguna idea se pierde, weon!');

  } catch (error) {
    console.error('❌ Error creating diffusion database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
