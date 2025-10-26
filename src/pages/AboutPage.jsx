import "../styles/pagesStyles/About.css"
import { useNavigate } from "react-router-dom";
export default function About() {
  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Products" },
    { number: "50+", label: "Brands" },
    { number: "99%", label: "Satisfaction Rate" }
  ];
  const navigate = useNavigate();
  const handleOnclick = () =>{
    navigate("/shop");
  }
  const values = [
    {
      icon: "🎯",
      title: "Quality First",
      description: "We curate only the finest products that meet our rigorous quality standards."
    },
    {
      icon: "💚",
      title: "Sustainability",
      description: "Committed to eco-friendly practices and sustainable fashion choices."
    },
    {
      icon: "🤝",
      title: "Customer Focus",
      description: "Your satisfaction is our priority. We're here to help every step of the way."
    },
    {
      icon: "✨",
      title: "Innovation",
      description: "Constantly evolving to bring you the latest trends and technology."
    }
  ];

  const team = [
    {
      name: "Michael Chen",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Award-winning designer passionate about innovation"
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Experience",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Dedicated to creating memorable shopping experiences"
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">Our Story</h1>
          <p className="hero-subtitle">Redefining fashion, one piece at a time</p>
          <div className="hero-line"></div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section mission-section">
        <div className="container">
          <div className="mission-content">
            <h2 className="section-title">Who We Are</h2>
            <div className="content-divider"></div>
            <p className="section-text">
              Founded in 2020, we started with a simple mission: to make high-quality, 
              stylish clothing accessible to everyone. What began as a small boutique 
              has grown into a thriving online destination for fashion enthusiasts worldwide.
            </p>
            <p className="section-text">
              We believe that fashion is more than just clothing—it's a form of 
              self-expression, confidence, and creativity. Every piece we offer is 
              carefully selected to help you tell your unique story.
            </p>
            <div className="mission-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🌟</span>
                <span>Premium Quality</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🚚</span>
                <span>Fast Shipping</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🔒</span>
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section values-section">
        <div className="container">
          <h2 className="section-title centered">Our Values</h2>
          <div className="content-divider centered"></div>
          <p className="section-subtitle centered">
            The principles that guide everything we do
          </p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section team-section">
        <div className="container">
          <h2 className="section-title centered">Meet Our Team</h2>
          <div className="content-divider centered"></div>
          <p className="section-subtitle centered">
            Passionate individuals dedicated to your style
          </p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image-wrapper">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="team-image"
                  />
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Style Journey?</h2>
            <p className="cta-text">
              Join thousands of satisfied customers and discover your perfect look today
            </p>
            <button onClick={handleOnclick} className="cta-button">
              Shop Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}