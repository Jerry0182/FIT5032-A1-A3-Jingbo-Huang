<script setup>
import { ref, onMounted } from 'vue'
import EmailSender from './EmailSender.vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Export functionality
const isExporting = ref(false)

const healthTopics = ref([
  {
    id: 1,
    title: 'Heart Health',
    description: 'Learn about cardiovascular health, risk factors, and prevention strategies.',
    icon: '❤️',
    articles: [
      {
        id: 1,
        title: 'The Silent Killer: Understanding High Blood Pressure in Men',
        author: 'Dr. Michael Chen',
        date: 'December 15, 2024',
        readTime: '5 min read',
        summary: 'High blood pressure affects millions of men worldwide, often without symptoms. Learn the warning signs and prevention strategies.',
        content: 'High blood pressure, or hypertension, is often called the "silent killer" because it typically has no symptoms until it causes serious health problems. For men, the risk increases significantly after age 45. Recent studies show that nearly half of all adults in the United States have high blood pressure, but many don\'t know it.\n\nKey risk factors include smoking, excessive alcohol consumption, stress, and a sedentary lifestyle. The good news is that lifestyle changes can significantly reduce your risk. Regular exercise, a heart-healthy diet rich in fruits and vegetables, and stress management techniques can all help maintain healthy blood pressure levels.\n\nMen should have their blood pressure checked at least once every two years, or more frequently if they have risk factors. Early detection and treatment can prevent serious complications like heart disease, stroke, and kidney problems.'
      },
      {
        id: 2,
        title: 'Cholesterol Management: Beyond the Numbers',
        author: 'Dr. Sarah Williams',
        date: 'December 10, 2024',
        readTime: '7 min read',
        summary: 'Understanding cholesterol levels and implementing effective management strategies for better heart health.',
        content: 'Cholesterol management goes beyond simply knowing your numbers. While total cholesterol levels are important, understanding the different types of cholesterol and their roles in heart health is crucial for men over 40.\n\nLDL (low-density lipoprotein) cholesterol, often called "bad" cholesterol, can build up in artery walls and increase the risk of heart disease. HDL (high-density lipoprotein) cholesterol, known as "good" cholesterol, helps remove LDL from the bloodstream.\n\nDietary changes play a significant role in cholesterol management. Incorporating omega-3 fatty acids from fish, soluble fiber from oats and beans, and plant sterols can help lower LDL cholesterol. Regular exercise, particularly aerobic activities, can raise HDL cholesterol levels.\n\nFor some men, lifestyle changes alone may not be enough, and medication may be necessary. Statins are the most commonly prescribed cholesterol-lowering medications and have been shown to significantly reduce the risk of heart attacks and strokes.'
      },
      {
        id: 3,
        title: 'Exercise Your Way to a Healthier Heart',
        author: 'Dr. James Rodriguez',
        date: 'December 8, 2024',
        readTime: '6 min read',
        summary: 'Discover the best exercises for cardiovascular health and how to create an effective heart-healthy workout routine.',
        content: 'Regular exercise is one of the most effective ways to maintain heart health and reduce the risk of cardiovascular disease. For men, incorporating both aerobic and strength training exercises can provide comprehensive cardiovascular benefits.\n\nAerobic exercises, such as brisk walking, running, cycling, and swimming, strengthen the heart muscle and improve circulation. The American Heart Association recommends at least 150 minutes of moderate-intensity aerobic activity per week.\n\nStrength training, while primarily associated with muscle building, also benefits heart health by improving blood sugar control and reducing blood pressure. Aim for at least two sessions per week targeting all major muscle groups.\n\nHigh-intensity interval training (HIIT) has gained popularity for its efficiency and cardiovascular benefits. Short bursts of intense exercise followed by recovery periods can improve heart function and endurance in less time than traditional steady-state cardio.\n\nRemember to start gradually, especially if you\'ve been inactive, and consult with your healthcare provider before beginning any new exercise program.'
      }
    ]
  },
  {
    id: 2,
    title: 'Mental Wellness',
    description: 'Resources for maintaining mental health and managing stress.',
    icon: '🧠',
    articles: [
      {
        id: 1,
        title: 'Breaking the Silence: Men\'s Mental Health in 2024',
        author: 'Dr. Robert Thompson',
        date: 'December 12, 2024',
        readTime: '8 min read',
        summary: 'Exploring the unique challenges men face with mental health and practical strategies for maintaining emotional wellbeing.',
        content: 'Mental health awareness has grown significantly in recent years, but men still face unique challenges when it comes to seeking help and maintaining emotional wellbeing. Traditional societal expectations often discourage men from expressing vulnerability or seeking support for mental health issues.\n\nDepression and anxiety are among the most common mental health conditions affecting men, with symptoms often manifesting differently than in women. Men may experience irritability, anger, or physical symptoms rather than traditional signs of sadness.\n\nWork-related stress, relationship challenges, and financial pressures are common triggers for mental health issues in men. The COVID-19 pandemic has further highlighted the importance of mental health support and coping strategies.\n\nBuilding a strong support network, practicing stress management techniques, and maintaining regular routines can significantly improve mental wellbeing. Mindfulness meditation, regular exercise, and adequate sleep are particularly beneficial for men\'s mental health.\n\nIt\'s important to remember that seeking professional help is a sign of strength, not weakness. Therapy, counseling, and medication can be highly effective treatments for mental health conditions.'
      },
      {
        id: 2,
        title: 'Stress Management for the Modern Man',
        author: 'Dr. Lisa Chen',
        date: 'December 7, 2024',
        readTime: '6 min read',
        summary: 'Practical techniques for managing daily stress and building resilience in today\'s fast-paced world.',
        content: 'Modern life presents numerous stressors that can impact men\'s health and wellbeing. From work demands to family responsibilities, finding effective stress management strategies is crucial for maintaining both physical and mental health.\n\nChronic stress can lead to serious health problems, including heart disease, high blood pressure, diabetes, and mental health issues. Recognizing the signs of stress is the first step in managing it effectively.\n\nDeep breathing exercises, progressive muscle relaxation, and mindfulness meditation are proven techniques for reducing stress in the moment. These practices can be done anywhere and require no special equipment.\n\nPhysical activity is one of the most effective stress relievers. Regular exercise releases endorphins, natural mood elevators that help combat stress and anxiety. Even a 20-minute walk can significantly improve your mood and reduce stress levels.\n\nTime management and setting boundaries are also crucial for stress management. Learning to say no, delegating tasks, and prioritizing self-care can help prevent burnout and maintain work-life balance.'
      },
      {
        id: 3,
        title: 'Sleep and Mental Health: The Connection You Can\'t Ignore',
        author: 'Dr. Mark Stevens',
        date: 'December 5, 2024',
        readTime: '5 min read',
        summary: 'Understanding the vital link between quality sleep and mental health, with practical tips for better rest.',
        content: 'Sleep and mental health are intimately connected, with poor sleep quality often exacerbating mental health issues and vice versa. For men, maintaining good sleep hygiene is essential for overall wellbeing and cognitive function.\n\nAdults need 7-9 hours of quality sleep each night, but many men fall short of this recommendation. Sleep deprivation can lead to irritability, poor concentration, and increased risk of depression and anxiety.\n\nCreating a consistent sleep schedule, even on weekends, helps regulate your body\'s internal clock. Going to bed and waking up at the same time each day improves sleep quality and duration.\n\nYour sleep environment plays a crucial role in sleep quality. Keep your bedroom cool, dark, and quiet. Remove electronic devices that emit blue light, which can interfere with melatonin production and disrupt sleep patterns.\n\nCaffeine and alcohol consumption can significantly impact sleep quality. Limit caffeine intake to the morning hours and avoid alcohol close to bedtime, as it can disrupt REM sleep cycles.\n\nIf you consistently struggle with sleep despite good sleep hygiene practices, consider consulting a healthcare provider. Sleep disorders like sleep apnea are common in men and can significantly impact both sleep quality and overall health.'
      }
    ]
  },
  {
    id: 3,
    title: 'Physical Fitness',
    description: 'Exercise routines and fitness tips for men of all ages.',
    icon: '💪',
    articles: [
      {
        id: 1,
        title: 'Strength Training Fundamentals for Men Over 40',
        author: 'Dr. Alex Martinez',
        date: 'December 14, 2024',
        readTime: '9 min read',
        summary: 'Essential strength training principles and adaptations for men entering their fourth decade and beyond.',
        content: 'Strength training becomes increasingly important as men age, helping to combat muscle loss, maintain bone density, and improve overall quality of life. After age 40, men naturally begin to lose muscle mass at a rate of about 1% per year, making resistance training crucial for maintaining strength and mobility.\n\nCompound exercises that work multiple muscle groups simultaneously are particularly effective for men over 40. Squats, deadlifts, bench presses, and pull-ups provide maximum benefit with efficient time investment.\n\nRecovery becomes more important with age. Allowing adequate rest between workouts and focusing on proper form over heavy weights can prevent injuries and ensure long-term progress.\n\nProgressive overload remains the key principle for building strength, but the approach may need to be modified. Instead of constantly increasing weight, focus on improving technique, increasing repetitions, or reducing rest periods between sets.\n\nNutrition plays a crucial role in supporting strength training goals. Adequate protein intake, typically 1.2-2.0 grams per kilogram of body weight, helps support muscle repair and growth. Hydration and proper meal timing around workouts can also enhance performance and recovery.'
      },
      {
        id: 2,
        title: 'Cardio vs. Strength: Finding the Right Balance',
        author: 'Dr. Jennifer Lee',
        date: 'December 11, 2024',
        readTime: '7 min read',
        summary: 'Understanding how to effectively combine cardiovascular and strength training for optimal health and fitness.',
        content: 'The debate between cardiovascular exercise and strength training often leads men to choose one over the other, but the most effective approach combines both types of training. Each provides unique benefits that complement the other.\n\nCardiovascular exercise improves heart health, increases endurance, and helps with weight management. Activities like running, cycling, swimming, and rowing strengthen the heart and lungs while burning calories.\n\nStrength training builds muscle mass, increases bone density, and improves functional capacity. As men age, maintaining muscle mass becomes increasingly important for overall health and independence.\n\nThe key is finding the right balance based on your goals and schedule. A general guideline is to include both types of training throughout the week, with at least 150 minutes of moderate-intensity cardio and two strength training sessions.\n\nTiming your workouts can optimize results. Some research suggests that doing cardio after strength training may be more effective for fat loss, while doing cardio first may improve cardiovascular performance but potentially compromise strength gains.\n\nListen to your body and adjust your training based on recovery, energy levels, and progress toward your specific goals. Consistency is more important than perfection.'
      },
      {
        id: 3,
        title: 'Injury Prevention: Staying Active Safely',
        author: 'Dr. Kevin Park',
        date: 'December 9, 2024',
        readTime: '6 min read',
        summary: 'Essential strategies for preventing exercise-related injuries and maintaining long-term fitness goals.',
        content: 'Injury prevention is crucial for maintaining consistent exercise habits and achieving long-term fitness goals. Men often push themselves too hard too quickly, leading to overuse injuries and setbacks.\n\nProper warm-up and cool-down routines are essential for injury prevention. Dynamic warm-ups prepare your muscles and joints for activity, while static stretching during cool-down helps maintain flexibility and reduce muscle soreness.\n\nGradual progression is key to avoiding overuse injuries. Increase exercise intensity, duration, or frequency by no more than 10% per week to allow your body time to adapt.\n\nCross-training can help prevent overuse injuries by varying the stress placed on different muscle groups and joints. Incorporate different types of activities into your routine to maintain overall fitness while reducing repetitive strain.\n\nListen to your body and recognize the difference between good pain (muscle fatigue) and bad pain (sharp, persistent pain). If you experience pain that doesn\'t improve with rest, consult a healthcare professional.\n\nProper equipment and footwear are important for injury prevention, especially for activities like running or weightlifting. Replace worn-out shoes regularly and ensure your equipment is appropriate for your skill level and goals.'
      }
    ]
  },
  {
    id: 5,
    title: 'Preventive Care',
    description: 'Regular health screenings and preventive measures.',
    icon: '🩺',
    articles: [
      {
        id: 1,
        title: 'Annual Checkups: More Than Just Routine',
        author: 'Dr. Patricia Brown',
        date: 'December 16, 2024',
        readTime: '6 min read',
        summary: 'Understanding the importance of regular health screenings and what men should expect during annual checkups.',
        content: 'Annual health checkups are crucial for men of all ages, serving as opportunities to detect potential health issues early and establish baseline measurements for future comparisons. Many men avoid these appointments, but they can literally be lifesaving.\n\nDuring an annual checkup, your healthcare provider will typically measure vital signs including blood pressure, heart rate, and weight. These measurements help track changes over time and identify potential health concerns.\n\nBlood tests are often included in annual checkups, checking cholesterol levels, blood sugar, and organ function. These tests can detect conditions like diabetes, high cholesterol, and kidney problems before symptoms appear.\n\nAge-appropriate screenings become increasingly important as men age. Prostate cancer screening, colon cancer screening, and cardiovascular assessments should be discussed with your healthcare provider based on your age, family history, and risk factors.\n\nMental health discussions are also becoming more common during annual checkups. Don\'t hesitate to discuss stress, anxiety, or depression with your healthcare provider, as these conditions can significantly impact overall health.\n\nUse your annual checkup as an opportunity to discuss lifestyle factors like diet, exercise, and sleep habits. Your healthcare provider can offer personalized advice and help you set realistic health goals.\n\nRemember that prevention is always better than treatment. Regular checkups can identify health issues in their early stages when they\'re most treatable, potentially saving your life.'
      },
      {
        id: 2,
        title: 'Cancer Screenings: Early Detection Saves Lives',
        author: 'Dr. Michael Johnson',
        date: 'December 11, 2024',
        readTime: '7 min read',
        summary: 'Essential cancer screenings for men and the importance of early detection in successful treatment.',
        content: 'Cancer screenings are among the most important preventive health measures for men, with early detection significantly improving treatment outcomes and survival rates. Understanding which screenings are recommended and when to have them is crucial for maintaining health.\n\nProstate cancer is the most common cancer in men, and screening typically begins at age 50, or earlier for those with risk factors like family history or African American ethnicity. The PSA (prostate-specific antigen) test and digital rectal exam are the primary screening methods.\n\nColorectal cancer screening is recommended starting at age 45 for average-risk men. Colonoscopy is considered the gold standard, but other options like stool-based tests may be appropriate depending on individual circumstances.\n\nLung cancer screening is recommended for current and former heavy smokers aged 50-80. Low-dose CT scans can detect lung cancer in its early stages when treatment is most effective.\n\nSkin cancer screening should be performed regularly, especially for men with fair skin, a history of sunburns, or family history of skin cancer. Monthly self-exams and annual professional skin checks can detect suspicious moles or lesions.\n\nTesticular cancer is most common in younger men (ages 15-35) and monthly self-exams are recommended. Any lumps, swelling, or changes in the testicles should be evaluated by a healthcare provider immediately.\n\nDon\'t wait for symptoms to appear before getting screened. Many cancers are most treatable when detected early, before symptoms develop.'
      },
      {
        id: 3,
        title: 'Vaccination Schedule: Protecting Yourself at Every Age',
        author: 'Dr. Amanda Davis',
        date: 'December 8, 2024',
        readTime: '5 min read',
        summary: 'Essential vaccinations for men and the importance of staying up-to-date with immunizations throughout life.',
        content: 'Vaccinations aren\'t just for children – they\'re important for men of all ages to protect against serious diseases and maintain overall health. Staying up-to-date with recommended vaccinations is a crucial part of preventive healthcare.\n\nThe flu vaccine is recommended annually for all adults, particularly important for men with chronic health conditions or weakened immune systems. Influenza can cause serious complications, including pneumonia and hospitalization.\n\nCOVID-19 vaccines and boosters continue to be important for protecting against severe illness and complications. Stay informed about current recommendations and booster schedules.\n\nTdap (tetanus, diphtheria, pertussis) vaccination should be updated every 10 years, with a one-time Tdap booster recommended for adults who haven\'t received one. Tetanus can be life-threatening and is easily preventable with vaccination.\n\nShingles vaccination is recommended for men aged 50 and older, even if they\'ve had shingles before. The newer shingles vaccine is highly effective at preventing this painful condition and its complications.\n\nPneumococcal vaccines are recommended for men aged 65 and older, as well as younger men with certain chronic health conditions. These vaccines protect against pneumonia and other serious infections.\n\nHepatitis A and B vaccinations may be recommended based on lifestyle factors, travel plans, or occupational exposure. These vaccines can prevent serious liver disease and liver cancer.\n\nConsult with your healthcare provider about which vaccinations are appropriate for your age, health status, and lifestyle. Keep a record of your vaccinations and bring it to medical appointments.'
      }
    ]
  },
  {
    id: 6,
    title: 'Men\'s Health Issues',
    description: 'Specific health concerns and conditions affecting men.',
    icon: '👨‍⚕️',
    articles: [
      {
        id: 1,
        title: 'Prostate Health: What Every Man Should Know',
        author: 'Dr. Robert Anderson',
        date: 'December 15, 2024',
        readTime: '8 min read',
        summary: 'Comprehensive guide to prostate health, including common conditions and prevention strategies.',
        content: 'Prostate health is a crucial aspect of men\'s health that often doesn\'t receive enough attention until problems arise. Understanding prostate health and common conditions can help men take proactive steps to maintain their wellbeing.\n\nBenign Prostatic Hyperplasia (BPH) is a common condition affecting men over 50, causing urinary symptoms like frequent urination, weak stream, and incomplete emptying. While not cancerous, BPH can significantly impact quality of life.\n\nProstate cancer is the most common cancer in men, but when detected early, it\'s highly treatable. Risk factors include age, family history, and race, with African American men having higher risk.\n\nProstate cancer screening involves the PSA blood test and digital rectal exam. The decision to screen should be made in consultation with your healthcare provider, considering individual risk factors and preferences.\n\nLifestyle factors can impact prostate health. Regular exercise, maintaining a healthy weight, and eating a diet rich in fruits, vegetables, and healthy fats may help reduce prostate cancer risk.\n\nSome studies suggest that certain nutrients like lycopene (found in tomatoes), selenium, and vitamin E may benefit prostate health, though more research is needed to confirm these benefits.\n\nDon\'t ignore urinary symptoms or changes in sexual function. Early intervention for prostate conditions often leads to better outcomes and can prevent complications.\n\nRegular communication with your healthcare provider about prostate health is important, especially as you age. Don\'t be embarrassed to discuss symptoms or concerns – your healthcare provider is there to help.'
      },
      {
        id: 2,
        title: 'Testosterone and Men\'s Health: The Complete Picture',
        author: 'Dr. Steven Miller',
        date: 'December 12, 2024',
        readTime: '7 min read',
        summary: 'Understanding testosterone\'s role in men\'s health and when treatment might be appropriate.',
        content: 'Testosterone plays a crucial role in men\'s health, affecting everything from muscle mass and bone density to mood and energy levels. Understanding testosterone and its natural decline with age can help men make informed decisions about their health.\n\nTestosterone levels naturally begin to decline around age 30, typically at a rate of about 1% per year. This gradual decline is normal, but some men experience more significant drops that can impact their quality of life.\n\nLow testosterone (hypogonadism) can cause symptoms like fatigue, decreased muscle mass, increased body fat, low libido, and mood changes. However, these symptoms can also be caused by other health conditions, so proper evaluation is important.\n\nTestosterone replacement therapy (TRT) can be effective for men with clinically low testosterone levels and symptoms, but it\'s not appropriate for everyone. TRT carries potential risks and side effects that must be carefully considered.\n\nLifestyle factors can naturally support testosterone production. Regular exercise, particularly strength training, adequate sleep, stress management, and maintaining a healthy weight can all help optimize testosterone levels.\n\nDiet also plays a role in testosterone production. Adequate protein intake, healthy fats, and sufficient zinc and vitamin D can support natural testosterone production.\n\nBefore considering testosterone therapy, it\'s important to have a thorough evaluation including blood tests and discussion of symptoms with a qualified healthcare provider. Testosterone therapy should be carefully monitored for safety and effectiveness.'
      },
      {
        id: 3,
        title: 'Hair Loss in Men: Understanding the Causes and Options',
        author: 'Dr. Lisa Thompson',
        date: 'December 9, 2024',
        readTime: '6 min read',
        summary: 'Comprehensive look at male pattern baldness and available treatment options for hair loss.',
        content: 'Hair loss is a common concern for men, affecting up to 50% of men by age 50. While often considered a cosmetic issue, hair loss can significantly impact self-esteem and confidence. Understanding the causes and available treatments can help men make informed decisions.\n\nMale pattern baldness (androgenetic alopecia) is the most common cause of hair loss in men, affecting about 80% of cases. It\'s primarily genetic and related to the hormone dihydrotestosterone (DHT), which causes hair follicles to shrink over time.\n\nOther causes of hair loss include stress, nutritional deficiencies, certain medications, medical conditions, and harsh hair treatments. Identifying the underlying cause is important for determining the most appropriate treatment.\n\nTreatment options for male pattern baldness include medications like finasteride (Propecia) and minoxidil (Rogaine), which can slow or stop hair loss and potentially promote regrowth in some men.\n\nHair transplant surgery has become increasingly sophisticated and can provide natural-looking results for men with sufficient donor hair. However, it\'s important to have realistic expectations and choose a qualified surgeon.\n\nLifestyle factors like managing stress, eating a balanced diet, and avoiding harsh hair treatments can help maintain existing hair health, though they won\'t reverse genetic hair loss.\n\nEarly intervention is often most effective. Starting treatment when hair loss first begins can provide better results than waiting until significant loss has occurred.\n\nRemember that hair loss is common and doesn\'t define your worth or attractiveness. Many men choose to embrace their hair loss, while others pursue treatment options. The choice is personal and should be based on your own preferences and goals.'
      }
    ]
  }
])

const selectedTopic = ref(null)
const showEmailModal = ref(false)

const selectTopic = (topic) => {
  selectedTopic.value = topic
}

const backToTopics = () => {
  selectedTopic.value = null
}

const openEmailModal = () => {
  showEmailModal.value = true
}

const closeEmailModal = () => {
  showEmailModal.value = false
}

// Export function
const exportAllArticlesToPDF = async () => {
  isExporting.value = true
  
  try {
    // Get all articles from all topics
    const allArticles = []
    healthTopics.value.forEach(topic => {
      topic.articles.forEach(article => {
        allArticles.push(article)
      })
    })
    
    // Create a temporary div with the content
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '-9999px'
    tempDiv.style.width = '800px'
    tempDiv.style.padding = '20px'
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.fontFamily = 'Arial, sans-serif'
    tempDiv.style.fontSize = '14px'
    tempDiv.style.lineHeight = '1.6'
    
    // Generate HTML content
    const htmlContent = generatePDFContent(allArticles)
    tempDiv.innerHTML = htmlContent
    
    // Add to DOM temporarily
    document.body.appendChild(tempDiv)
    
    // Convert to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })
    
    // Remove temp div
    document.body.removeChild(tempDiv)
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // Download PDF
    const fileName = `health-articles-${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
    
    alert(`Successfully exported all ${allArticles.length} articles to PDF!`)
    
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to export articles. Please try again.')
  } finally {
    isExporting.value = false
  }
}

const generatePDFContent = (articles) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #3498db; padding-bottom: 20px;">
        <h1 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 28px;">Men's Health Platform</h1>
        <h2 style="color: #7f8c8d; margin: 0 0 10px 0; font-size: 20px; font-weight: normal;">Health Articles Export</h2>
        <p style="color: #95a5a6; margin: 0; font-size: 14px;">Generated on ${currentDate}</p>
      </div>
      
      ${articles.map((article, index) => `
        <div style="margin-bottom: 40px; page-break-inside: avoid;">
          <h3 style="color: #2c3e50; font-size: 20px; margin: 0 0 10px 0; border-left: 4px solid #3498db; padding-left: 15px;">
            ${index + 1}. ${article.title}
          </h3>
          <div style="color: #7f8c8d; font-size: 12px; margin-bottom: 15px; background: #f8f9fa; padding: 8px 12px; border-radius: 4px;">
            <strong>Author:</strong> ${article.author} | 
            <strong>Date:</strong> ${article.date} | 
            <strong>Read Time:</strong> ${article.readTime}
          </div>
          <div style="color: #34495e; font-style: italic; margin-bottom: 15px; padding: 10px; background: #ecf0f1; border-radius: 4px;">
            <strong>Summary:</strong> ${article.summary}
          </div>
          <div style="color: #2c3e50; line-height: 1.8;">
            ${article.content.replace(/\n\n/g, '</p><p style="margin: 15px 0;">').replace(/\n/g, '<br>')}
          </div>
        </div>
      `).join('')}
      
      <div style="margin-top: 50px; text-align: center; border-top: 2px solid #ecf0f1; padding-top: 20px;">
        <p style="color: #7f8c8d; font-size: 12px; margin: 0;">
          Exported from Men's Health Platform - ${articles.length} article(s) | ${currentDate}
        </p>
      </div>
    </div>
  `
}
</script>

<template>
  <div class="health-info-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <!-- Header -->
          <div class="page-header">
            <h1 class="display-4 fw-bold text-white mb-3">Health Information</h1>
            <p class="lead text-white-50 mb-4">Comprehensive health resources and educational content</p>
            <div class="d-flex gap-3">
              <button class="btn btn-primary btn-lg" @click="openEmailModal">
                📧 Share Health Articles
              </button>
              <button 
                class="btn btn-success btn-lg" 
                :disabled="isExporting"
                @click="exportAllArticlesToPDF"
              >
                <span v-if="isExporting" class="spinner-border spinner-border-sm me-2"></span>
                {{ isExporting ? 'Exporting...' : '📄 Export All Articles' }}
              </button>
            </div>
          </div>

          <!-- Health Topics Grid -->
          <div v-if="!selectedTopic" class="health-topics-grid">
            <div class="row">
              <div 
                v-for="topic in healthTopics" 
                :key="topic.id"
                class="col-md-6 col-lg-4 mb-4"
              >
                <div class="health-card" @click="selectTopic(topic)">
                  <div class="card-icon">{{ topic.icon }}</div>
                  <h5 class="card-title">{{ topic.title }}</h5>
                  <p class="card-description">{{ topic.description }}</p>
                  <div class="card-arrow">→</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Topic Detail View -->
          <div v-else class="topic-detail">
            <div class="detail-header">
              <button class="back-btn" @click="backToTopics">
                ← Back to Topics
              </button>
              <h2 class="topic-title">
                <span class="topic-icon">{{ selectedTopic.icon }}</span>
                {{ selectedTopic.title }}
              </h2>
              <p class="topic-description">{{ selectedTopic.description }}</p>
            </div>

            <div class="articles-section">
              <h4 class="section-title">Latest Articles</h4>
              <div class="articles-grid">
                <article 
                  v-for="article in selectedTopic.articles" 
                  :key="article.id"
                  class="article-card"
                >
                  <div class="article-header">
                    <h5 class="article-title">{{ article.title }}</h5>
                    <div class="article-meta">
                      <span class="article-author">By {{ article.author }}</span>
                      <span class="article-date">{{ article.date }}</span>
                      <span class="article-read-time">{{ article.readTime }}</span>
                    </div>
                  </div>
                  <div class="article-summary">
                    {{ article.summary }}
                  </div>
                  <div class="article-content-full">
                    <div class="article-text">
                      {{ article.content.split('\n').map(paragraph => paragraph.trim()).filter(paragraph => paragraph).join('\n\n') }}
                    </div>
                  </div>
                </article>
              </div>
            </div>

          </div>

          <!-- Quick Tips Section -->
          <div class="quick-tips">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">💡 Daily Health Tips</h5>
                <div class="tips-grid">
                  <div class="tip-item">
                    <strong>Stay Hydrated:</strong> Drink at least 8 glasses of water daily
                  </div>
                  <div class="tip-item">
                    <strong>Regular Exercise:</strong> Aim for 30 minutes of physical activity
                  </div>
                  <div class="tip-item">
                    <strong>Quality Sleep:</strong> Get 7-9 hours of sleep each night
                  </div>
                  <div class="tip-item">
                    <strong>Balanced Diet:</strong> Include fruits, vegetables, and lean proteins
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Email Sender Modal -->
    <EmailSender 
      :show-modal="showEmailModal" 
      @close="closeEmailModal"
    />

  </div>
</template>

<style scoped>
.health-info-page {
  margin-top: 60px;
  padding: 2rem 0;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.health-topics-grid {
  margin-bottom: 2rem;
}

.health-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.health-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card-description {
  color: #7f8c8d;
  flex-grow: 1;
  margin-bottom: 1rem;
}

.card-arrow {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: bold;
}

/* Topic Detail Styles */
.topic-detail {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.detail-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
}

.back-btn {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background: #34495e;
}

.topic-title {
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.topic-icon {
  font-size: 2rem;
}

.topic-description {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.section-title {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.articles-section {
  margin-bottom: 2rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.article-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.article-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #e9ecef;
}

.article-title {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #6c757d;
  flex-wrap: wrap;
}

.article-author {
  font-weight: 600;
  color: #2c3e50;
}

.article-date {
  color: #6c757d;
}

.article-read-time {
  color: #6c757d;
  font-style: italic;
}

.article-summary {
  padding: 0 1.5rem;
  font-size: 0.95rem;
  color: #495057;
  font-style: italic;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.article-content-full {
  padding: 0 1.5rem 1.5rem;
}

.article-text {
  color: #2c3e50;
  line-height: 1.7;
  font-size: 0.95rem;
  white-space: pre-line;
}

.article-text p {
  margin-bottom: 1rem;
}


.quick-tips {
  margin-top: 2rem;
}

.quick-tips .card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.quick-tips .card-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.tip-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #2c3e50;
}

.tip-item strong {
  color: #2c3e50;
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .health-info-page {
    margin-top: 66px;
    padding: 1rem 0;
  }
  
  .display-4 {
    font-size: 2rem;
  }
  
  .health-card {
    padding: 1.5rem;
  }
  
  .card-icon {
    font-size: 2.5rem;
  }
  
  .topic-detail {
    padding: 1.5rem;
  }
  
  .resource-cards {
    grid-template-columns: 1fr;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .article-item {
    flex-direction: column;
    text-align: center;
  }
  
  .article-number {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}

</style>
