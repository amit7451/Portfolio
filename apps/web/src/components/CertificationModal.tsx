'use client';

import React, { useEffect, useState } from 'react';

interface CertificationData {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  validationNumber?: string;
  verifyUrl?: string;
  image: string;
  pdfDownload?: string;
  description: string;
  overview: string;
  keySkills: string[];
  achievements: string[];
}

const CERTIFICATIONS: Record<string, CertificationData> = {
  'cs50-python': {
    id: 'cs50-python',
    title: "CS50's Introduction to Programming with Python",
    badge: 'Programming & CS',
    badgeColor: '#e63946',
    issuer: 'Harvard University / edX',
    issueDate: 'Year 2025',
    verifyUrl: 'https://cs50.harvard.edu/certificates/',
    image: '/3d/AboutRoom/images/cs50p.webp',
    description:
      'Official Harvard University certification covering Python fundamentals, software engineering principles, algorithms, and practical application development.',
    overview:
      "CS50P is Harvard University's introductory course dedicated to programming with Python. It teaches students how to write clean, efficient, and well-tested code using real-world problem sets in data analysis, string manipulation, web APIs, and object-oriented programming.",
    keySkills: [
      'Python 3 Syntax & Logic',
      'Functions & Scope',
      'Conditionals & Loops',
      'Exceptions & Error Handling',
      'Regular Expressions (RegEx)',
      'Object-Oriented Programming (OOP)',
      'File Input / Output',
      'Unit Testing with PyTest',
    ],
    achievements: [
      'Successfully completed all 9 rigorous Harvard CS50 problem sets with 100% test coverage.',
      'Designed and executed an independent open-source capstone final project in Python.',
      'Mastered automated testing using pytest and test-driven development methodologies.',
      'Demonstrated expertise in algorithmic problem solving and clean software architecture.',
    ],
  },

  'aws-cloud-practitioner': {
    id: 'aws-cloud-practitioner',
    title: 'AWS Certified Cloud Practitioner',
    badge: 'Cloud Infrastructure',
    badgeColor: '#ff9900',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: 'November 28, 2025',
    expirationDate: 'November 28, 2028',
    validationNumber: '21a6e45d5c1f409e9el9765a25bea119',
    verifyUrl: 'https://aws.amazon.com/verification',
    image: '/3d/AboutRoom/images/awscloud.webp',
    description:
      'Official AWS industry certification validating overall understanding of the AWS Cloud platform, core services, security, architecture, pricing, and support models.',
    overview:
      'The AWS Certified Cloud Practitioner validates overall understanding of the AWS Cloud platform, covering foundational cloud concepts, security, compliance, core AWS services (EC2, S3, RDS, DynamoDB, VPC), billing, pricing models, and cloud architectural best practices.',
    keySkills: [
      'AWS Cloud Computing Concepts',
      'Global Cloud Infrastructure',
      'AWS Security & Shared Responsibility Model',
      'Identity & Access Management (IAM)',
      'EC2, Lambda, S3, RDS, VPC',
      'Cloud Financial Management & Cost Optimization',
      'AWS Well-Architected Framework',
      'Cloud Monitoring with CloudWatch',
    ],
    achievements: [
      'Passed the official Amazon Web Services Cloud Practitioner certification exam.',
      'Demonstrated architectural knowledge of cloud security, IAM policies, and infrastructure isolation.',
      'Validated understanding of cloud financial management, billing metrics, and cost optimization.',
    ],
  },

  'aws-ml-associate': {
    id: 'aws-ml-associate',
    title: 'AWS Certified Machine Learning Engineer - Associate',
    badge: 'Machine Learning & AI',
    badgeColor: '#ec4899',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: 'May 13, 2026',
    expirationDate: 'May 13, 2029',
    validationNumber: '4f39eba719154a409e5e19e278bdcc4b',
    verifyUrl: 'https://aws.amazon.com/verification',
    image: '/3d/AboutRoom/images/awsmlassociate.webp',
    description:
      'Advanced technical certification proving expertise in building, training, tuning, and deploying scalable Machine Learning solutions using AWS AI/ML infrastructure.',
    overview:
      'The AWS Certified Machine Learning Engineer - Associate certification validates technical proficiency in designing, implementing, deploying, and maintaining Machine Learning (ML) solutions on AWS. It covers data engineering, feature selection, Amazon SageMaker model training, MLOps, model monitoring, and security.',
    keySkills: [
      'Machine Learning Pipeline Design',
      'Data Engineering & Prep for ML',
      'Amazon SageMaker Model Building',
      'Exploratory Data Analysis (EDA)',
      'Hyperparameter Tuning & Optimization',
      'MLOps & Automated Model Deployment',
      'Model Monitoring & Drift Detection',
      'AI/ML Security & Access Control',
    ],
    achievements: [
      'Achieved official AWS Machine Learning Engineer - Associate credentials.',
      'Demonstrated expertise in building end-to-end ML pipelines on Amazon SageMaker.',
      'Validated skills in hyperparameter tuning, model evaluation metrics, and scalable MLOps.',
      'Mastered feature engineering, data transformation, and cloud ML security compliance.',
    ],
  },

  'ai-for-everyone': {
    id: 'ai-for-everyone',
    title: 'AI For Everyone — DeepLearning.AI',
    badge: 'Artificial Intelligence',
    badgeColor: '#00d9ff',
    issuer: 'DeepLearning.AI / Coursera',
    issueDate: 'July 19, 2025',
    verifyUrl: 'https://coursera.org/verify/',
    image: '/3d/AboutRoom/images/ai.webp',
    description:
      'Specialized AI certification taught by Andrew Ng, focusing on Machine Learning concepts, AI strategy, project workflow, and ethical AI implementation.',
    overview:
      'AI For Everyone is a foundational AI certification created by Andrew Ng and DeepLearning.AI. It provides deep insight into what AI can and cannot do, how machine learning and deep learning models work under the hood, how to structure AI projects, build data strategies, and navigate AI ethics and societal impacts.',
    keySkills: [
      'Artificial Intelligence Concepts',
      'Machine Learning & Deep Learning Basics',
      'Neural Networks Overview',
      'AI Project Lifecycle & Workflow',
      'Technical Feasibility Assessment',
      'Data Strategy & Pipeline Design',
      'AI Ethics, Bias, & Governance',
    ],
    achievements: [
      'Completed DeepLearning.AI certification under world-renowned AI pioneer Andrew Ng.',
      'Gained strategic understanding of AI capabilities, project scoping, and data strategy.',
      'Evaluated technical feasibility and societal implications of generative and predictive AI.',
    ],
  },
};

export default function CertificationModal() {
  const [activeCertId, setActiveCertId] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<{ certId: string }>;
      if (customEvent.detail && customEvent.detail.certId) {
        setActiveCertId(customEvent.detail.certId);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCertId(null);
      }
    };

    window.addEventListener('openCertModal', handleOpenModal);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('openCertModal', handleOpenModal);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!activeCertId || !CERTIFICATIONS[activeCertId]) return null;

  const cert = CERTIFICATIONS[activeCertId];

  const handleClose = () => {
    setActiveCertId(null);
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(3, 4, 8, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto',
        animation: 'certModalFadeIn 0.2s ease-out forwards',
      }}
    >
      <style>{`
        @keyframes certModalFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#0a0d14',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 217, 255, 0.15)',
          color: '#ffffff',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top Accent Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${cert.badgeColor}, #00d9ff)`,
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
        />

        {/* Close & Return Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <button
            onClick={handleClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#00d9ff',
              background: 'rgba(0, 217, 255, 0.08)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '30px',
              padding: '0.5rem 1.2rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ← Return to 3D Portfolio
          </button>

          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Badge & Title */}
        <div style={{ marginBottom: '1.8rem' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: `${cert.badgeColor}22`,
              color: cert.badgeColor,
              border: `1px solid ${cert.badgeColor}44`,
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '0.8rem',
              textTransform: 'uppercase',
            }}
          >
            {cert.badge}
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.2,
              background: 'linear-gradient(135deg, #ffffff 40%, #a0aab5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {cert.title}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.6rem', lineHeight: 1.5 }}>
            {cert.description}
          </p>
        </div>

        {/* Metadata Card Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '1rem 1.2rem',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Issuer
            </div>
            <div style={{ fontSize: '0.95rem', color: '#f1f5f9', fontWeight: 600, marginTop: '2px' }}>
              {cert.issuer}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Issue Date
            </div>
            <div style={{ fontSize: '0.95rem', color: '#f1f5f9', fontWeight: 600, marginTop: '2px' }}>
              {cert.issueDate}
            </div>
          </div>

          {cert.expirationDate && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Expiration Date
              </div>
              <div style={{ fontSize: '0.95rem', color: '#f1f5f9', fontWeight: 600, marginTop: '2px' }}>
                {cert.expirationDate}
              </div>
            </div>
          )}

          {cert.validationNumber && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Validation ID
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#00d9ff',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  marginTop: '2px',
                  wordBreak: 'break-all',
                }}
              >
                {cert.validationNumber}
              </div>
            </div>
          )}
        </div>

        {/* Certificate Image Preview */}
        <div
          style={{
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
            marginBottom: '2rem',
            backgroundColor: '#07080c',
          }}
        >
          <img
            src={cert.image}
            alt={cert.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '500px',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>

        {/* Action Buttons Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {cert.verifyUrl && (
            <a
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                backgroundColor: cert.badgeColor,
                color: '#ffffff',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.95rem',
                boxShadow: `0 4px 15px ${cert.badgeColor}44`,
              }}
            >
              ✓ Verify Credential
            </a>
          )}

          {cert.pdfDownload && (
            <a
              href={cert.pdfDownload}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.95rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              📄 Download Official PDF
            </a>
          )}
        </div>

        {/* Overview & Key Skills */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              padding: '1.4rem',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <h4 style={{ color: '#00d9ff', fontSize: '1.1rem', marginTop: 0, marginBottom: '0.8rem' }}>
              🎓 Course Overview
            </h4>
            <p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              {cert.overview}
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              padding: '1.4rem',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <h4 style={{ color: '#38bdf8', fontSize: '1.1rem', marginTop: 0, marginBottom: '0.8rem' }}>
              🛠️ Skills & Competencies Validated
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {cert.keySkills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#7dd3fc',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            padding: '1.4rem',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <h4 style={{ color: '#4ade80', fontSize: '1.1rem', marginTop: 0, marginBottom: '0.8rem' }}>
            🏆 Key Achievements
          </h4>
          <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.95rem' }}>
            {cert.achievements.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
