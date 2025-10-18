import emailjs from '@emailjs/browser'

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_eb1d0iv'
const EMAILJS_TEMPLATE_ID = 'template_42an91c'
const EMAILJS_PUBLIC_KEY = '1U6m7-TUFRxv4HcfP'

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY)

// Health info articles for random selection
const healthArticles = [
  {
    id: 1,
    title: "The Importance of Regular Exercise",
    content: "Regular exercise is crucial for maintaining good health. It helps improve cardiovascular health, strengthens muscles, and boosts mental well-being. Aim for at least 150 minutes of moderate-intensity exercise per week.",
    category: "Fitness"
  },
  {
    id: 2,
    title: "Nutrition Tips for Men's Health",
    content: "A balanced diet rich in fruits, vegetables, lean proteins, and whole grains is essential for men's health. Stay hydrated, limit processed foods, and consider supplements if needed.",
    category: "Nutrition"
  },
  {
    id: 3,
    title: "Mental Health and Stress Management",
    content: "Mental health is just as important as physical health. Practice stress management techniques like meditation, deep breathing, and regular sleep patterns.",
    category: "Mental Health"
  },
  {
    id: 4,
    title: "Preventive Health Screenings",
    content: "Regular health screenings can help detect potential health issues early. Schedule annual check-ups, blood pressure monitoring, and age-appropriate screenings.",
    category: "Prevention"
  },
  {
    id: 5,
    title: "Sleep and Recovery",
    content: "Quality sleep is essential for recovery and overall health. Aim for 7-9 hours of sleep per night and maintain a consistent sleep schedule.",
    category: "Recovery"
  }
]

// Get random health article
export function getRandomHealthArticle() {
  const randomIndex = Math.floor(Math.random() * healthArticles.length)
  return healthArticles[randomIndex]
}

// Generate PDF content from article
export function generateArticlePDF(article) {
  const pdfContent = `
    <html>
      <head>
        <title>${article.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
          .category { color: #7f8c8d; font-style: italic; }
          .content { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>${article.title}</h1>
        <p class="category">Category: ${article.category}</p>
        <div class="content">
          <p>${article.content}</p>
        </div>
        <hr>
        <p><em>Shared from Men's Health Platform</em></p>
      </body>
    </html>
  `
  return pdfContent
}

// Send email with health article
export async function sendHealthArticleEmail(recipientEmail, senderName = 'Anonymous') {
  try {
    // Get random article
    const article = getRandomHealthArticle()
    
    // Email template parameters
    const templateParams = {
      to_email: recipientEmail,
      from_name: senderName,
      article_title: article.title,
      article_content: article.content,
      article_category: article.category,
      article_id: article.id
    }
    
    // Send email
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )
    
    console.log('Email sent successfully:', result)
    return { success: true, message: 'Health article sent successfully!' }
    
  } catch (error) {
    console.error('Email sending failed:', error)
    return { 
      success: false, 
      message: 'Failed to send email. Please try again later.' 
    }
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  try {
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: 'test@example.com',
        from_name: 'Test User',
        article_title: 'Test Article',
        article_content: 'This is a test email.',
        article_category: 'Test'
      }
    )
    return { success: true, message: 'Email configuration is working!' }
  } catch (error) {
    return { success: false, message: 'Email configuration failed: ' + error.message }
  }
}
