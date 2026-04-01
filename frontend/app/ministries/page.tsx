import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = { title: 'Ministries' };

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
      <section className="gradient-hero" style={{ paddingTop: '140px', paddingBottom: '5rem', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label" style={{ justifyContent: 'center' }}>What We Do</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Our <span className="text-gradient-gold">Ministries</span>
          </h1>
          <p style={{ color: 'var(--cream-dim)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
            Every ministry at Grace of Christ is a pathway for believers to discover their calling, serve their community, and grow in faith.
          </p>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="section" style={{ background: 'var(--midnight)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {ministries.map((m) => (
              <div key={m.title} className="glass card-hover" style={{ padding: '2.25rem', borderRadius: '20px' }}>
                <div style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>{m.icon}</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--cream)', marginBottom: '0.75rem' }}>{m.title}</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--cream-dim)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{m.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {m.activities.map(a => (
                    <span key={a} style={{ fontSize: '0.72rem', padding: '0.3rem 0.75rem', borderRadius: 9999, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold)', letterSpacing: '0.03em' }}>{a}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--deep-navy), var(--purple-deep))', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Get <span className="text-gradient-gold">Involved</span>
          </h2>
          <p style={{ color: 'var(--cream-dim)', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            Every member is a minister. Contact us to find out how you can serve and make a difference in our church and community.
          </p>
          <a href="/contact" className="btn btn-gold">Join a Ministry</a>
        </div>
      </section>

      <Footer />
    </>
  );
}
