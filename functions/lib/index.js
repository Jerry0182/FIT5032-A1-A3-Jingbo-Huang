"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHealthEmail = exports.getHealthHistory = exports.calculateHealthScore = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios_1 = require("axios");
// Initialize Firebase Admin SDK
admin.initializeApp();
// Helper function to set CORS headers
function setCorsHeaders(res) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
// Health assessment calculation Cloud Function
exports.calculateHealthScore = functions.https.onRequest(async (req, res) => {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    try {
        const { personalInfo, healthHistory, lifestyle, goals } = req.body;
        if (!personalInfo || !healthHistory || !lifestyle || !goals) {
            res.status(400).json({ error: 'Missing required assessment data.' });
            return;
        }
        // Calculate health score
        let score = 100;
        // Adjust based on age
        const age = parseInt(personalInfo.age) || 30;
        if (age > 50)
            score -= 10;
        else if (age > 40)
            score -= 5;
        // Adjust based on BMI
        const height = parseFloat(personalInfo.height) || 170;
        const weight = parseFloat(personalInfo.weight) || 70;
        const bmi = weight / Math.pow(height / 100, 2);
        if (bmi < 18.5 || bmi > 25)
            score -= 15;
        // Adjust based on activity level
        const activityLevel = personalInfo.activityLevel;
        if (activityLevel === 'sedentary')
            score -= 20;
        else if (activityLevel === 'light')
            score -= 10;
        else if (activityLevel === 'very-active')
            score += 10;
        // Adjust based on chronic conditions
        const chronicConditions = healthHistory.chronicConditions || [];
        if (chronicConditions.length > 0 && !chronicConditions.includes('None')) {
            score -= chronicConditions.length * 5;
        }
        // Adjust based on lifestyle
        const exerciseFreq = lifestyle.exerciseFrequency;
        const sleepHours = parseInt(lifestyle.sleepHours) || 7;
        const dietQuality = lifestyle.dietQuality;
        const stressLevel = lifestyle.stressLevel;
        if (exerciseFreq === 'Never')
            score -= 15;
        else if (exerciseFreq === 'Rarely')
            score -= 10;
        else if (exerciseFreq === '3-4 times per week')
            score += 5;
        else if (exerciseFreq === 'Daily')
            score += 10;
        if (sleepHours < 6 || sleepHours > 9)
            score -= 10;
        else if (sleepHours >= 7 && sleepHours <= 8)
            score += 5;
        if (dietQuality === 'Poor (fast food, processed foods)')
            score -= 15;
        else if (dietQuality === 'Average (mixed healthy and unhealthy)')
            score -= 5;
        else if (dietQuality === 'Excellent (well-balanced, nutritious)')
            score += 10;
        if (stressLevel === 'Very High' || stressLevel === 'High')
            score -= 10;
        else if (stressLevel === 'Very Low' || stressLevel === 'Low')
            score += 5;
        // Ensure score is within reasonable range
        score = Math.max(0, Math.min(100, score));
        // Generate personalized recommendations
        const recommendations = [];
        if (score < 40) {
            recommendations.push('Consider consulting a healthcare professional for a comprehensive health check');
            recommendations.push('Consider developing a comprehensive health improvement plan');
        }
        else if (score < 60) {
            recommendations.push('Consider improving lifestyle habits and increasing exercise frequency');
            recommendations.push('Consider adjusting diet structure and reducing processed foods');
        }
        else if (score < 80) {
            recommendations.push('Continue maintaining good lifestyle habits');
            recommendations.push('Consider further optimizing exercise intensity and nutritional balance');
        }
        else {
            recommendations.push('Congratulations! Your health status is excellent');
            recommendations.push('Continue maintaining your current healthy lifestyle');
        }
        // Store assessment results to Firestore
        const db = admin.firestore();
        const assessmentData = {
            userId: 'test-user',
            score,
            recommendations,
            personalInfo,
            healthHistory,
            lifestyle,
            goals,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };
        await db.collection('healthAssessments').add(assessmentData);
        res.status(200).json({
            score,
            recommendations,
            status: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Improvement'
        });
    }
    catch (error) {
        console.error('Error calculating health score:', error);
        res.status(500).json({
            error: `Failed to calculate health score: ${error.message}`
        });
    }
});
// Get user health assessment history
exports.getHealthHistory = functions.https.onRequest(async (req, res) => {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    try {
        const db = admin.firestore();
        const userId = 'test-user'; // Use default for testing
        const snapshot = await db.collection('healthAssessments')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .get();
        const assessments = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json({ assessments });
    }
    catch (error) {
        console.error('Error getting health history:', error);
        res.status(500).json({
            error: `Failed to get health history: ${error.message}`
        });
    }
});
// Email sending Cloud Function - using EmailJS API
exports.sendHealthEmail = functions.https.onRequest(async (req, res) => {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    try {
        const { recipientEmail, senderName, articleContent } = req.body;
        if (!recipientEmail || !articleContent) {
            res.status(400).json({
                error: 'Missing required parameters: recipientEmail or articleContent.'
            });
            return;
        }
        // Use EmailJS API to send email
        const emailjsConfig = functions.config().emailjs;
        const response = await axios_1.default.post('https://api.emailjs.com/api/v1.0/email/send', {
            service_id: (emailjsConfig === null || emailjsConfig === void 0 ? void 0 : emailjsConfig.service_id) || 'service_eb1d0iv',
            template_id: (emailjsConfig === null || emailjsConfig === void 0 ? void 0 : emailjsConfig.template_id) || 'template_42an91c',
            user_id: (emailjsConfig === null || emailjsConfig === void 0 ? void 0 : emailjsConfig.user_id) || '1U6m7-TUFRxv4HcfP',
            template_params: {
                to_email: recipientEmail,
                from_name: senderName || 'Anonymous',
                article_title: articleContent.title,
                article_content: articleContent.content,
                article_category: articleContent.category,
                article_id: articleContent.id
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200) {
            res.status(200).json({
                success: true,
                message: 'Health article sent successfully!'
            });
        }
        else {
            res.status(500).json({
                error: `EmailJS API error: ${response.status} - ${response.data}`
            });
        }
    }
    catch (error) {
        console.error('Error sending email via EmailJS API:', error.message);
        res.status(500).json({
            error: `Failed to send email: ${error.message}`
        });
    }
});
//# sourceMappingURL=index.js.map