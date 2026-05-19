import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '@/pages/home/components/Navbar'
import Footer from '@/pages/home/components/Footer'
import ProjectModal from '@/pages/home/components/ProjectModal'
import { useLanguage } from '@/context/LanguageContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

// Photos Unsplash libres de droits
const articles = [
  {
    slug: 'digitalisation-pme-yaounde',
    category: 'Transformation Digitale',
    categoryEn: 'Digital Transformation',
    date: '15 Mai 2026',
    title: 'Comment digitaliser votre PME à Yaoundé en 2026',
    titleEn: 'How to digitize your SME in Yaoundé in 2026',
    excerpt: "La digitalisation n'est plus un luxe pour les entreprises camerounaises. Découvrez les étapes concrètes pour transformer votre activité grâce aux outils numériques adaptés au contexte local.",
    excerptEn: "Digitalization is no longer a luxury for Cameroonian businesses. Discover concrete steps to transform your activity with digital tools adapted to the local context.",
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    readTime: '5 min',
    content: `La transformation digitale est devenue incontournable pour les PME africaines. Voici les étapes clés pour réussir votre digitalisation à Yaoundé.

**1. Évaluez votre situation actuelle**
Avant de vous lancer, faites un audit de vos processus existants. Quels sont vos points de friction ? Où perdez-vous du temps et de l'argent ?

**2. Commencez par les fondamentaux**
Un site web professionnel, une présence sur les réseaux sociaux et un système de paiement mobile (MoMo, Orange Money) sont les bases indispensables.

**3. Automatisez vos processus répétitifs**
Les outils d'automatisation peuvent vous faire gagner des heures chaque semaine : facturation automatique, rappels clients, rapports quotidiens sur WhatsApp.

**4. Formez vos équipes**
La technologie ne sert à rien sans les compétences pour l'utiliser. Investissez dans la formation de vos collaborateurs.

**5. Mesurez et ajustez**
Utilisez les données pour prendre de meilleures décisions. Quels produits se vendent le mieux ? Quels clients reviennent ?

BLOOMAR ONE vous accompagne à chaque étape de cette transformation. Contactez-nous pour une consultation gratuite.`,
  },
  {
    slug: 'paiement-mobile-afrique',
    category: 'Finance & Tech',
    categoryEn: 'Finance & Tech',
    date: '10 Mai 2026',
    title: 'MoMo, Orange Money : intégrer les paiements mobiles dans votre business',
    titleEn: 'MoMo, Orange Money: integrating mobile payments into your business',
    excerpt: "Le paiement mobile est devenu incontournable en Afrique centrale. Voici comment intégrer MTN MoMo et Orange Money dans votre site web ou application.",
    excerptEn: "Mobile payment has become essential in Central Africa. Here's how to integrate MTN MoMo and Orange Money into your website or app.",
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    readTime: '4 min',
    content: `Le paiement mobile révolutionne les transactions commerciales en Afrique centrale. MTN MoMo et Orange Money comptent des millions d'utilisateurs au Cameroun.

**Pourquoi intégrer le paiement mobile ?**
- 70% des Camerounais utilisent le mobile money
- Réduction des impayés et des délais de paiement
- Meilleure expérience client
- Traçabilité complète des transactions

**Comment l'intégrer dans votre business ?**
BLOOMAR ONE intègre nativement ces solutions dans tous nos développements. Que ce soit pour un site e-commerce, une application mobile ou un logiciel de caisse, nous gérons l'intégration technique complète.

Contactez-nous pour en savoir plus.`,
  },
  {
    slug: 'levee-fonds-cameroun',
    category: 'Finance',
    categoryEn: 'Finance',
    date: '5 Mai 2026',
    title: 'Levée de fonds au Cameroun : les clés pour convaincre une banque',
    titleEn: 'Fundraising in Cameroon: keys to convincing a bank',
    excerpt: "Obtenir un crédit bancaire au Cameroun demande une préparation rigoureuse. Structuration comptable, dossier solide, garanties — voici ce que les banques regardent vraiment.",
    excerptEn: "Getting a bank loan in Cameroon requires rigorous preparation. Accounting structure, solid file, guarantees — here's what banks really look at.",
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    readTime: '6 min',
    content: `Obtenir un financement bancaire au Cameroun est possible avec la bonne préparation. Voici ce que les banques examinent en priorité.

**1. La structuration comptable**
Vos comptes doivent être clairs, à jour et certifiés. Une comptabilité désorganisée est le premier motif de refus.

**2. Le business plan**
Un document solide qui présente votre activité, vos projections financières et votre stratégie de remboursement.

**3. Les garanties**
Les banques camerounaises exigent généralement des garanties réelles (immobilier) ou personnelles.

**4. L'historique bancaire**
Un compte bien géré, sans incidents, renforce votre crédibilité.

BLOOMAR ONE vous accompagne dans la structuration de votre dossier de financement. Notre équipe maîtrise les exigences des banques locales.`,
  },
  {
    slug: 'site-web-pme-africaine',
    category: 'Web & Mobile',
    categoryEn: 'Web & Mobile',
    date: '28 Avril 2026',
    title: "Pourquoi votre PME africaine a besoin d'un site web en 2026",
    titleEn: 'Why your African SME needs a website in 2026',
    excerpt: "Un site web professionnel est votre meilleur commercial disponible 24h/24. Découvrez pourquoi et comment créer une présence en ligne efficace pour votre entreprise à Yaoundé.",
    excerptEn: "A professional website is your best salesperson available 24/7. Discover why and how to create an effective online presence for your business in Yaoundé.",
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    readTime: '4 min',
    content: `En 2026, ne pas avoir de site web, c'est comme ne pas avoir d'adresse. Voici pourquoi c'est indispensable pour votre PME.

**Visibilité 24h/24**
Votre site travaille pendant que vous dormez. Les clients peuvent vous trouver, découvrir vos services et vous contacter à toute heure.

**Crédibilité professionnelle**
Un site web professionnel inspire confiance. C'est souvent le premier critère que vos prospects vérifient avant de vous contacter.

**Référencement local**
Avec un bon SEO, votre entreprise apparaît en premier sur Google quand quelqu'un cherche vos services à Yaoundé.

**Génération de leads**
Un formulaire de contact bien placé peut vous apporter des dizaines de prospects chaque mois.

BLOOMAR ONE crée des sites web optimisés pour le marché camerounais, avec intégration MoMo et Orange Money.`,
  },
  {
    slug: 'analyse-donnees-entreprise',
    category: 'Data & Analytics',
    categoryEn: 'Data & Analytics',
    date: '20 Avril 2026',
    title: "L'analyse de données : l'arme secrète des entreprises performantes",
    titleEn: 'Data analysis: the secret weapon of high-performing companies',
    excerpt: "Vos données sont une mine d'or inexploitée. Modélisations, projections, détection des pertes — apprenez comment exploiter vos chiffres pour prendre de meilleures décisions.",
    excerptEn: "Your data is an untapped gold mine. Modeling, projections, loss detection — learn how to leverage your numbers to make better decisions.",
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    readTime: '5 min',
    content: `Les entreprises qui utilisent leurs données prennent de meilleures décisions et croissent plus vite. Voici comment exploiter vos chiffres.

**Quelles données analyser ?**
- Ventes par produit, par période, par client
- Coûts et marges par activité
- Flux de trésorerie et prévisions
- Performance de vos équipes

**Les bénéfices concrets**
- Détecter les produits non rentables
- Identifier vos meilleurs clients
- Anticiper les périodes creuses
- Optimiser vos stocks

**Comment démarrer ?**
BLOOMAR ONE vous aide à mettre en place des tableaux de bord simples et efficaces, adaptés à votre activité. Pas besoin d'être expert en data — nous traduisons les chiffres en décisions concrètes.`,
  },
  {
    slug: 'seo-local-yaounde',
    category: 'SEO & Marketing',
    categoryEn: 'SEO & Marketing',
    date: '15 Avril 2026',
    title: 'SEO local à Yaoundé : comment apparaître en premier sur Google',
    titleEn: 'Local SEO in Yaoundé: how to appear first on Google',
    excerpt: "Le référencement local est crucial pour attirer des clients à Yaoundé. Découvrez les techniques SEO adaptées au marché camerounais pour dominer les résultats de recherche locaux.",
    excerptEn: "Local SEO is crucial for attracting customers in Yaoundé. Discover SEO techniques adapted to the Cameroonian market to dominate local search results.",
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
    readTime: '7 min',
    content: `Apparaître en premier sur Google à Yaoundé peut transformer votre business. Voici les techniques qui fonctionnent vraiment.

**Google My Business**
Créez et optimisez votre fiche Google My Business. C'est gratuit et indispensable pour le SEO local.

**Mots-clés locaux**
Intégrez des mots-clés géolocalisés dans votre contenu : "agence digitale Yaoundé", "développeur web Cameroun", etc.

**Contenu de qualité**
Publiez régulièrement du contenu utile pour votre audience locale. Un blog actif améliore significativement votre référencement.

**Avis clients**
Les avis Google positifs boostent votre visibilité locale. Encouragez vos clients satisfaits à laisser un avis.

**Vitesse du site**
Un site rapide est mieux référencé. BLOOMAR ONE optimise tous nos sites pour la performance.`,
  },
]

const ALL_CATEGORIES_FR = ['Tous', 'Transformation Digitale', 'Finance & Tech', 'Finance', 'Web & Mobile', 'Data & Analytics', 'SEO & Marketing']
const ALL_CATEGORIES_EN = ['All', 'Digital Transformation', 'Finance & Tech', 'Finance', 'Web & Mobile', 'Data & Analytics', 'SEO & Marketing']

export default function BlogPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null)
  const { lang } = useLanguage()

  const isFr = lang === 'fr'
  const categories = isFr ? ALL_CATEGORIES_FR : ALL_CATEGORIES_EN

  const filtered = (activeCategory === 'Tous' || activeCategory === 'All')
    ? articles
    : articles.filter(a => (isFr ? a.category : a.categoryEn) === activeCategory)

  // Vue article complet
  if (selectedArticle) {
    return (
      <>
        <Navbar onOpenModal={() => setModalOpen(true)} />
        <main style={{ paddingTop: 80 }}>
          <article style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(16px,5vw,24px)' }}>
            <button onClick={() => setSelectedArticle(null)}
              className="btn-outline cursor-pointer text-sm mb-8"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i className="ri-arrow-left-line" />
              {isFr ? 'Retour au blog' : 'Back to blog'}
            </button>

            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px', borderRadius: 999, background: 'rgba(139,47,201,0.08)', color: '#8B2FC9' }}>
                {isFr ? selectedArticle.category : selectedArticle.categoryEn}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: 16 }}>
              {isFr ? selectedArticle.title : selectedArticle.titleEn}
            </h1>

            <div style={{ display: 'flex', gap: 16, marginBottom: 32, fontSize: '0.8rem', color: '#9CA3AF' }}>
              <span>{selectedArticle.date}</span>
              <span>·</span>
              <span>{selectedArticle.readTime} {isFr ? 'de lecture' : 'read'}</span>
            </div>

            <img src={selectedArticle.image} alt={selectedArticle.title}
              style={{ width: '100%', height: 'clamp(200px,35vw,400px)', objectFit: 'cover', borderRadius: 16, marginBottom: 40 }}
              loading="lazy" />

            <div style={{ fontSize: 'clamp(0.9rem,1.6vw,1rem)', lineHeight: 1.85, color: '#374151' }}>
              {selectedArticle.content.split('\n\n').map((para, i) => {
                if (para.startsWith('**') && para.endsWith('**')) {
                  return <h3 key={i} style={{ fontWeight: 700, fontSize: 'clamp(1rem,2vw,1.125rem)', color: '#111827', margin: '28px 0 10px' }}>{para.replace(/\*\*/g, '')}</h3>
                }
                if (para.startsWith('- ')) {
                  return (
                    <ul key={i} style={{ paddingLeft: 20, marginBottom: 16 }}>
                      {para.split('\n').map((item, j) => (
                        <li key={j} style={{ marginBottom: 6, color: '#374151' }}>{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  )
                }
                return <p key={i} style={{ marginBottom: 16, color: '#374151' }}>{para}</p>
              })}
            </div>

            <div style={{ marginTop: 48, padding: 28, background: 'linear-gradient(135deg,rgba(139,47,201,0.06),rgba(26,156,176,0.06))', borderRadius: 16, border: '1px solid rgba(139,47,201,0.15)', textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: 8 }}>
                {isFr ? 'Besoin d\'aide pour votre projet ?' : 'Need help with your project?'}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: 20 }}>
                {isFr ? 'BLOOMAR ONE vous accompagne. Consultation gratuite, sans engagement.' : 'BLOOMAR ONE supports you. Free consultation, no commitment.'}
              </p>
              <button onClick={() => setModalOpen(true)} className="btn-grad cursor-pointer">
                {isFr ? 'Démarrer un projet →' : 'Start a project →'}
              </button>
            </div>
          </article>
        </main>
        <Footer />
        <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    )
  }

  return (
    <>
      <Navbar onOpenModal={() => setModalOpen(true)} />
      <main style={{ paddingTop: 80 }}>

        {/* HERO */}
        <section style={{ padding: 'clamp(48px,8vw,80px) clamp(16px,5vw,40px)', background: '#fff' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B2FC9', marginBottom: 16 }}>
              {isFr ? 'BLOG & ACTUALITÉS' : 'BLOG & NEWS'}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: 'clamp(1.8rem,5vw,3.2rem)', fontWeight: 800, lineHeight: 1.1, color: '#111827', marginBottom: 16 }}>
              {isFr ? 'Conseils & actualités pour ' : 'Tips & news for '}
              <span className="text-grad">{isFr ? 'votre business' : 'your business'}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: 'clamp(0.875rem,1.5vw,1rem)', color: '#6B7280', maxWidth: 560, lineHeight: 1.7 }}>
              {isFr
                ? "Finance, digital, technologie — nos experts partagent leurs conseils pour aider les entrepreneurs de Yaoundé et d'Afrique à faire grandir leur activité."
                : "Finance, digital, technology — our experts share their advice to help entrepreneurs in Yaoundé and Africa grow their business."}
            </motion.p>
          </div>
        </section>

        {/* FILTRES */}
        <section style={{ padding: '0 clamp(16px,5vw,40px) 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="cursor-pointer"
                style={{
                  fontSize: '0.75rem', fontWeight: 600, padding: '6px 16px', borderRadius: 999,
                  background: activeCategory === cat ? 'linear-gradient(135deg,#8B2FC9,#1A9CB0)' : '#F3F4F6',
                  color: activeCategory === cat ? '#fff' : '#6B7280',
                  border: 'none', transition: 'all 0.2s',
                }}>
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ARTICLES */}
        <section style={{ padding: 'clamp(24px,4vw,40px) clamp(16px,5vw,40px)', background: '#F9FAFB' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 'clamp(14px,2vw,24px)' }}>
            {filtered.map((article, i) => (
              <motion.article key={article.slug} {...fadeUp(i * 0.07)}
                onClick={() => setSelectedArticle(article)}
                style={{
                  background: '#fff', borderRadius: 16, overflow: 'hidden',
                  border: '1px solid #E5E7EB', cursor: 'pointer',
                  transition: 'transform 0.25s, border-color 0.25s',
                }}
                whileHover={{ y: -4, borderColor: 'rgba(139,47,201,0.3)' }}>

                {/* Image */}
                <div style={{ height: 'clamp(160px,20vw,200px)', overflow: 'hidden' }}>
                  <img src={article.image} alt={isFr ? article.title : article.titleEn}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    loading="lazy" />
                </div>

                {/* Content */}
                <div style={{ padding: 'clamp(14px,2vw,20px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: 'rgba(139,47,201,0.08)', color: '#8B2FC9' }}>
                      {isFr ? article.category : article.categoryEn}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{article.readTime} {isFr ? 'de lecture' : 'read'}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 'clamp(0.875rem,1.5vw,1rem)', color: '#111827', lineHeight: 1.4, marginBottom: 8 }}>
                    {isFr ? article.title : article.titleEn}
                  </h3>
                  <p style={{ fontSize: 'clamp(0.78rem,1.3vw,0.85rem)', lineHeight: 1.65, color: '#6B7280', marginBottom: 16 }}>
                    {isFr ? article.excerpt : article.excerptEn}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{article.date}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      {isFr ? 'Lire la suite' : 'Read more'}
                      <i className="ri-arrow-right-line" style={{ fontSize: '0.75rem' }} />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section style={{ padding: 'clamp(48px,8vw,80px) clamp(16px,5vw,40px)', background: '#fff' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
            <motion.div {...fadeUp()}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B2FC9', marginBottom: 12 }}>
                {isFr ? 'NEWSLETTER' : 'NEWSLETTER'}
              </p>
              <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, color: '#111827', marginBottom: 12 }}>
                {isFr ? 'Restez informé des dernières actualités' : 'Stay informed of the latest news'}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: 28 }}>
                {isFr ? 'Conseils business, actualités tech et offres exclusives — directement dans votre WhatsApp.' : 'Business tips, tech news and exclusive offers — directly in your WhatsApp.'}
              </p>
              <a href="https://wa.me/237652209175?text=Bonjour%20BLOOMAR%20ONE%2C%20je%20souhaite%20recevoir%20vos%20actualit%C3%A9s"
                target="_blank" rel="noopener noreferrer" className="btn-grad cursor-pointer">
                <i className="ri-whatsapp-line" />
                {isFr ? 'Rejoindre la communauté WhatsApp' : 'Join the WhatsApp community'}
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
