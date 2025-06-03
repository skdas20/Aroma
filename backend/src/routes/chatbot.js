const express = require('express');
const router = express.Router();
const perfumes = require('../data/perfumes');

// Enhanced chatbot with perfume quiz and recommendations
router.post('/chat', async (req, res) => {
  try {
    const { message, isQuiz = false, userPreferences = {} } = req.body;
    const lowerMessage = message.toLowerCase();
    
    let response = "I'd be happy to help you find the perfect fragrance! What type of scent are you looking for?";
    let suggestions = [];
    let quizQuestion = null;

    // Enhanced AI-like responses with perfume expertise
    if (isQuiz) {
      // Handle quiz flow
      const quizFlow = handlePerfumeQuiz(message, userPreferences);
      return res.json(quizFlow);
    }

    // Smart fragrance recommendations based on advanced keywords
    if (lowerMessage.includes('men') || lowerMessage.includes('masculine') || lowerMessage.includes('him')) {
      response = "Excellent choice! Men's fragrances offer bold, sophisticated profiles. Here are my top recommendations based on current trends:";
      suggestions = perfumes.filter(p => p.category === 'Men').slice(0, 3);
    } else if (lowerMessage.includes('women') || lowerMessage.includes('feminine') || lowerMessage.includes('her')) {
      response = "Wonderful! Women's fragrances are all about elegance and allure. These are my curated bestsellers:";
      suggestions = perfumes.filter(p => p.category === 'Women').slice(0, 3);
    } else if (lowerMessage.includes('quiz') || lowerMessage.includes('recommend') || lowerMessage.includes('help me choose')) {
      response = "I'd love to help you discover your signature scent! Let me ask you a few questions to find your perfect match.";
      quizQuestion = {
        question: "What's your preferred scent family?",
        options: ["Fresh & Citrusy", "Floral & Romantic", "Woody & Warm", "Oriental & Spicy"],
        step: 1
      };
    } else if (lowerMessage.includes('fresh') || lowerMessage.includes('citrus') || lowerMessage.includes('light') || lowerMessage.includes('summer')) {
      response = "Perfect for warm weather! Fresh and citrusy fragrances are invigorating and perfect for daily wear:";
      suggestions = perfumes.filter(p => 
        p.notes.top.some(note => 
          ['citrus', 'lemon', 'bergamot', 'grapefruit', 'mint', 'fresh'].some(fresh => 
            note.toLowerCase().includes(fresh)
          )
        )
      ).slice(0, 3);
    } else if (lowerMessage.includes('romantic') || lowerMessage.includes('date') || lowerMessage.includes('evening') || lowerMessage.includes('special')) {
      response = "For romantic occasions, you'll want something captivating and memorable. These sophisticated fragrances are perfect:";
      suggestions = perfumes.filter(p => p.rating >= 4.7).slice(0, 3);
    } else if (lowerMessage.includes('office') || lowerMessage.includes('work') || lowerMessage.includes('professional')) {
      response = "For professional settings, you'll want something elegant but not overwhelming. These are perfect for the workplace:";
      suggestions = perfumes.filter(p => p.price >= 80 && p.rating >= 4.5).slice(0, 3);
    } else if (lowerMessage.includes('winter') || lowerMessage.includes('cold') || lowerMessage.includes('warm') || lowerMessage.includes('cozy')) {
      response = "Winter calls for warm, enveloping fragrances. These rich scents are perfect for cooler weather:";
      suggestions = perfumes.filter(p => 
        p.notes.base.some(note => 
          ['vanilla', 'amber', 'musk', 'cedar', 'sandalwood'].some(warm => 
            note.toLowerCase().includes(warm)
          )
        )
      ).slice(0, 3);
    } else if (lowerMessage.includes('price') || lowerMessage.includes('budget') || lowerMessage.includes('affordable')) {
      response = "Great value doesn't mean compromising on quality! Here are exceptional fragrances under $70:";
      suggestions = perfumes.filter(p => p.price < 70).slice(0, 3);
    } else if (lowerMessage.includes('luxury') || lowerMessage.includes('expensive') || lowerMessage.includes('premium')) {
      response = "For the ultimate luxury experience, these premium fragrances represent the pinnacle of perfumery:";
      suggestions = perfumes.filter(p => p.price >= 150).slice(0, 3);
    } else if (lowerMessage.includes('long lasting') || lowerMessage.includes('strong') || lowerMessage.includes('projection')) {
      response = "Looking for staying power? These fragrances are known for their excellent longevity and projection:";
      suggestions = perfumes.filter(p => p.rating >= 4.6).slice(0, 3);
    }

    // If no suggestions found, provide general recommendations
    if (suggestions.length === 0 && !quizQuestion) {
      suggestions = perfumes.sort((a, b) => b.rating - a.rating).slice(0, 3);
      response = "Based on our bestsellers and customer favorites, here are some exceptional fragrances I'd recommend:";
    }

    res.json({
      success: true,
      response,
      suggestions,
      quizQuestion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Chatbot error',
      error: error.message
    });
  }
});

// Perfume Quiz Handler
function handlePerfumeQuiz(answer, preferences = {}) {
  const step = preferences.step || 1;
  let nextQuestion = null;
  let finalRecommendations = [];
  let response = "";

  switch (step) {
    case 1: // Scent family preference
      preferences.scentFamily = answer;
      response = "Great choice! Now, when do you typically wear fragrance?";
      nextQuestion = {
        question: "When do you typically wear fragrance?",
        options: ["Daily/Work", "Special Occasions", "Evening/Dates", "All Times"],
        step: 2
      };
      break;

    case 2: // Usage occasion
      preferences.occasion = answer;
      response = "Perfect! What's your experience level with fragrances?";
      nextQuestion = {
        question: "What's your experience level with fragrances?",
        options: ["Beginner", "Intermediate", "Expert", "Collector"],
        step: 3
      };
      break;

    case 3: // Experience level
      preferences.experience = answer;
      response = "Excellent! Finally, what's your preferred price range?";
      nextQuestion = {
        question: "What's your preferred price range?",
        options: ["Under $50", "$50-$100", "$100-$200", "$200+"],
        step: 4
      };
      break;

    case 4: // Final recommendations
      preferences.budget = answer;
      finalRecommendations = generatePersonalizedRecommendations(preferences);
      response = "Based on your preferences, I've found the perfect fragrances for you! Here are my personalized recommendations:";
      break;
  }

  return {
    success: true,
    response,
    suggestions: finalRecommendations,
    quizQuestion: nextQuestion,
    isQuizComplete: step === 4
  };
}

// Generate personalized recommendations based on quiz answers
function generatePersonalizedRecommendations(preferences) {
  let filtered = [...perfumes];
  
  // Filter by scent family
  if (preferences.scentFamily?.includes('Fresh')) {
    filtered = filtered.filter(p => 
      p.notes.top.some(note => 
        ['citrus', 'lemon', 'bergamot', 'mint'].some(fresh => 
          note.toLowerCase().includes(fresh)
        )
      )
    );
  } else if (preferences.scentFamily?.includes('Floral')) {
    filtered = filtered.filter(p => 
      p.notes.heart.some(note => 
        ['rose', 'jasmine', 'lily', 'peony'].some(floral => 
          note.toLowerCase().includes(floral)
        )
      )
    );
  } else if (preferences.scentFamily?.includes('Woody')) {
    filtered = filtered.filter(p => 
      p.notes.base.some(note => 
        ['cedar', 'sandalwood', 'vetiver', 'oak'].some(woody => 
          note.toLowerCase().includes(woody)
        )
      )
    );
  }

  // Filter by budget
  if (preferences.budget?.includes('Under $50')) {
    filtered = filtered.filter(p => p.price < 50);
  } else if (preferences.budget?.includes('$50-$100')) {
    filtered = filtered.filter(p => p.price >= 50 && p.price <= 100);
  } else if (preferences.budget?.includes('$100-$200')) {
    filtered = filtered.filter(p => p.price >= 100 && p.price <= 200);
  } else if (preferences.budget?.includes('$200+')) {
    filtered = filtered.filter(p => p.price > 200);
  }

  // Sort by rating and return top 3
  return filtered.sort((a, b) => b.rating - a.rating).slice(0, 3);
}

module.exports = router;