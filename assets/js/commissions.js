// commissions.js
// Commission service definitions and decision tree

window.commissionsData = {
  policy: {
    pricing: "All commissions are taken at my discretion for free",
    freeTimeline: "Free commissions take about 3 months on average",
    priority: "$20 payment guarantees completion in less than a week",
    payment: "Payments can be made through any method on the donate page"
  },

  services: {
    "discord-bot": {
      name: "Discord Bot",
      icon: "🤖",
      description: "Custom Discord bots with advanced features and integrations",
      questions: [
        {
          id: "bot-purpose",
          type: "select",
          label: "What's the main purpose of your bot?",
          options: ["Moderation", "Music", "Economy", "Custom Commands", "Utility", "Fun/Games", "Other"]
        },
        {
          id: "features",
          type: "textarea",
          label: "Describe the features you need",
          placeholder: "e.g., Auto-moderation, leveling system, custom commands"
        },
        {
          id: "hosting",
          type: "select",
          label: "Do you need hosting provided?",
          options: ["Yes, please provide hosting", "No, I'll handle hosting", "Not sure yet"]
        },
        {
          id: "database",
          type: "select",
          label: "Does your bot need a database?",
          options: ["Yes", "No", "Not sure"]
        },
        {
          id: "api-integrations",
          type: "multiselect",
          label: "Select any API integrations needed",
          options: ["Twitch", "YouTube", "Spotify", "Twitter/X", "OpenAI", "Other", "None"]
        }
      ]
    },

    "vtuber-model": {
      name: "VTuber Model",
      icon: "👾",
      description: "3D VRM models and PNGTuber designs for content creators",
      questions: [
        {
          id: "model-type",
          type: "select",
          label: "What type of model do you need?",
          options: ["3D VRM Model", "PNGTuber", "Both", "Other"]
        },
        {
          id: "character-concept",
          type: "textarea",
          label: "Describe your character concept",
          placeholder: "Name, appearance, personality, species, theme, etc."
        },
        {
          id: "art-style",
          type: "select",
          label: "Preferred art style",
          options: ["Anime", "Semi-realistic", "Chibi", "Cartoon", "Stylized", "Other"]
        },
        {
          id: "reference-images",
          type: "textarea",
          label: "Reference image URLs (optional)",
          placeholder: "Paste image URLs here, one per line"
        },
        {
          id: "intended-use",
          type: "multiselect",
          label: "Where will you use this model?",
          options: ["Twitch", "YouTube", "VRChat", "Discord", "TikTok", "Other"]
        }
      ]
    },

    "3d-print": {
      name: "3D Printing",
      icon: "🖨️",
      description: "Custom 3D printed objects and designs",
      questions: [
        {
          id: "print-type",
          type: "select",
          label: "What do you need printed?",
          options: ["Custom Design (I have files)", "Design from Scratch", "Modification of Existing Design", "Multiple Items"]
        },
        {
          id: "description",
          type: "textarea",
          label: "Describe what you want printed",
          placeholder: "Include dimensions, purpose, and any specific requirements"
        },
        {
          id: "material-preference",
          type: "select",
          label: "Material preference",
          options: ["PLA (standard)", "PETG (durable)", "TPU (flexible)", "No preference", "Other"]
        },
        {
          id: "color",
          type: "text",
          label: "Preferred color",
          placeholder: "e.g., Black, White, Red"
        },
        {
          id: "shipping-address",
          type: "textarea",
          label: "Shipping Address",
          placeholder: "Full mailing address for delivery"
        }
      ]
    },

    "code-help": {
      name: "Code Help",
      icon: "💻",
      description: "Programming assistance, debugging, and code reviews",
      questions: [
        {
          id: "help-type",
          type: "select",
          label: "What kind of help do you need?",
          options: ["Bug Fixing", "Code Review", "Feature Implementation", "Optimization", "Learning/Tutorial", "Other"]
        },
        {
          id: "language",
          type: "select",
          label: "Programming language",
          options: ["Python", "JavaScript", "HTML/CSS", "PHP", "C/C++", "C#", "Java", "Other"]
        },
        {
          id: "problem-description",
          type: "textarea",
          label: "Describe your problem or what you need help with",
          placeholder: "Be as specific as possible"
        },
        {
          id: "code-repo",
          type: "text",
          label: "GitHub/Code repository link (optional)",
          placeholder: "https://github.com/..."
        },
        {
          id: "urgency",
          type: "select",
          label: "How urgent is this?",
          options: ["Not urgent", "Moderately urgent", "Urgent", "Critical"]
        }
      ]
    },

    "web-development": {
      name: "Web Development",
      icon: "🌐",
      description: "Websites, web applications, and frontend/backend development",
      questions: [
        {
          id: "project-type",
          type: "select",
          label: "What type of website do you need?",
          options: ["Personal Portfolio", "Business Website", "E-commerce", "Blog", "Web Application", "Landing Page", "Other"]
        },
        {
          id: "description",
          type: "textarea",
          label: "Describe your project",
          placeholder: "Purpose, features, target audience, etc."
        },
        {
          id: "design-preference",
          type: "select",
          label: "Do you have a design?",
          options: ["Yes, I have mockups/designs", "No, I need design help", "I have a reference site", "No preference"]
        },
        {
          id: "features",
          type: "multiselect",
          label: "Features needed",
          options: ["Contact Form", "User Authentication", "Database", "Payment Processing", "Blog/CMS", "API Integration", "Other"]
        },
        {
          id: "hosting",
          type: "select",
          label: "Do you need hosting setup?",
          options: ["Yes", "No", "Not sure"]
        }
      ]
    },

    "other": {
      name: "Other",
      icon: "📋",
      description: "Custom requests or projects not listed above",
      questions: [
        {
          id: "service-description",
          type: "textarea",
          label: "What kind of service are you requesting?",
          placeholder: "Describe what you need in detail"
        },
        {
          id: "project-scope",
          type: "textarea",
          label: "Project scope and requirements",
          placeholder: "What needs to be done? Any specific requirements?"
        },
        {
          id: "similar-work",
          type: "text",
          label: "Link to similar work or examples (optional)",
          placeholder: "https://..."
        }
      ]
    }
  }
};
