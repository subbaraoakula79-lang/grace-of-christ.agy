'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ministries = [
  {
    icon: '🙏', title: 'Prayer Ministry',
    desc: 'The heartbeat of our church. We believe in the power of corporate and personal prayer. Daily intercession, weekly prayer meetings, and 24-hour prayer chains.',
    activities: ['Daily Morning Prayer', 'Intercessory Groups', 'Prayer Chains', 'Fasting & Prayer Weeks'],
  },
  {
    icon: '🎵', title: 'Worship Ministry',
    desc: 'Creating an atmosphere where God is glorified and hearts are transformed through anointed music and praise in both Telugu and English.',
    activities: ['Sunday Worship Team', 'Choir Ministry', 'Instrumental Training', 'Songwriting'],
  },
  {
    icon: '🌱', title: 'Youth Ministry',
    desc: 'Raising a generation of bold, faith-filled young people. Youth services, mentorship, camps, and leadership development programs.',
    activities: ['Youth Sunday', 'Youth Camps', 'Mentorship Program', 'Leadership Training'],
  },
  {
    icon: '👩', title: "Women's Ministry",
    desc: 'Empowering women to walk in their God-given identity, gifts, and calling through fellowship, Bible study, and community service.',
    activities: ["Women's Bible Studies", "Mothers' Fellowship", 'Community Outreach', 'Counseling'],
  },
  {
    icon: '👨‍👩‍👧‍👦', title: 'Family Ministry',
    desc: 'Supporting and strengthening families with marriage enrichment, parenting workshops, and family counseling rooted in biblical values.',
    activities: ['Marriage Seminars', 'Parenting Classes', 'Family Counseling', 'Holiday Programs'],
  },
  {
    icon: '👶', title: "Children's Ministry",
    desc: "Planting seeds of faith in the hearts of children through engaging Sunday school, Vacation Bible School, and kids' worship programs.",
    activities: ['Sunday School', 'Vacation Bible School', "Kids' Worship", 'Bible Competitions'],
  },
  {
    icon: '🤝', title: 'Outreach Ministry',
    desc: 'Going beyond the church walls to preach the Gospel, serve the poor, and bring hope to the unreached in Kakinada and surrounding villages.',
    activities: ['Village Missions', 'Street Evangelism', 'Feeding Programs', 'Medical Camps'],
  },
  {
    icon: '📖', title: 'Bible Study Ministry',
    desc: 'Deepening roots in the Word of God through weekly home cell groups, topical series, and one-on-one discipleship.',
    activities: ['Cell Groups', 'Home Bible Studies', 'New Believers Class', 'Discipleship'],
  },
];

export default function MinistriesPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="page-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-label">What We Do</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
              Our <span className="accent-text">Ministries</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
              Every ministry at Grace of Christ is a pathway for believers to discover their calling, serve their community, and grow in faith.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="section" style={{ background: 'var(--space-mid)', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {ministries.map((m, idx) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="spatial-card"
                style={{ padding: '2.5rem 2.25rem', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div style={{ fontSize: '2.8rem', marginBottom: '1.2rem' }}>{m.icon}</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{m.title}</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.75rem' }}>{m.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {m.activities.map(a => (
                    <span
                      key={a}
                      className="spatial-glass"
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.35rem 0.85rem',
                        borderRadius: 9999,
                        border: '1px solid rgba(16, 185, 129, 0.18)',
                        color: 'var(--violet)',
                        fontWeight: 600,
                        letterSpacing: '0.03em'
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="section" style={{ background: 'var(--space)', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.05), transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="spatial-glass-mid"
            style={{ padding: '4rem 2.5rem', border: '1px solid rgba(16, 185, 129, 0.15)', maxWidth: '800px', margin: '0 auto' }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '1rem' }}>
              Get <span className="accent-text">Involved</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Every member is a minister. Contact us to find out how you can serve and make a difference in our church and community.
            </p>
            <Link href="/contact" className="btn-spatial btn-primary">Join a Ministry</Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
