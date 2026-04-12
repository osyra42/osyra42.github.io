---
type: source
created: 2026-04-12
sources: [all_about_ai.html]
tags: [ai, artificial-intelligence, research, machine-learning, llm]
---
# All About AI - Research Document

## Overview
Comprehensive chronological examination of artificial intelligence covering milestones, applications, and practical engagement. Written by KastienDev (osyra42) as a research document.

## Executive Summary
AI's journey from theoretical mid-20th century concepts to 21st century transformative force. Key phases:
1. Alan Turing's theoretical groundwork
2. Dartmouth Conference formalizes AI field
3. Early symbolic reasoning and expert systems
4. AI winters (periods of reduced funding)
5. 1990s resurgence via GPUs and big data
6. Deep Learning Revolution (2010s)
7. Transformer architecture and LLMs
8. Current era of generative AI

## Historical Timeline

### 1940s-1970s: Dawn of AI

#### Alan Turing and Turing Test (1950)
- Paper: "Computing Machinery and Intelligence"
- Turing Test: machine exhibiting behavior indistinguishable from human
- Three participants: judge, machine, human
- Evaluates creativity, empathy, natural language, relevance
- Limitations: focuses on NLP, not all intelligence facets
- Variations: Marcus Test (video understanding), Lovelace Test (original ideas)

#### Dartmouth Conference (1956)
- Summer 1956, Dartmouth College
- Founders: John McCarthy, Marvin Minsky, Claude Shannon, Nathaniel Rochester
- McCarthy coined "artificial intelligence"
- Proposal: "every aspect of learning...can be so precisely described that a machine can be made to simulate it"
- Established AI as academic discipline

#### Symbolic AI and Expert Systems
- **Symbolic AI (1950s-60s)**: Logic-based, explicit rules
  - Example: "IF sneezing AND itchy eyes THEN allergy"
  - Limited data requirements
  
- **Expert Systems**: Mimic human expertise
  - **Dendral (1965)**: First expert system, chemical compound analysis
  - **MYCIN (1970s)**: Medical diagnosis, backward chaining
  - **PXDES/CaDet**: Cancer diagnosis
  - **R1/XCON**: Computer configuration
  - Limitations: No common sense, couldn't scale

#### Perceptron and Early Neural Networks
- **McCulloch & Pitts (1943)**: Binary artificial neuron
- **Hebbian Learning (late 1940s)**: Neural plasticity
- **Perceptron (Rosenblatt, 1957/58)**:
  - First implemented neural network
  - Binary classification
  - Limitations: Can't handle non-linear data (XOR problem)
- **Minsky & Papert (1969)**: "Perceptrons" book highlighted limitations
  - Led to "decade-long decline in connectionist research funding"

### 1970s-1990s: AI Winters and Resurgence

#### AI Winters
- **First Winter (1974-1980s)**:
  - ALPAC report (machine translation failure)
  - Lighthill Report (1973): Criticized lack of applications
  - High expectations not met
  
- **Second Winter (late 1980s-mid 1990s)**:
  - Expert systems limitations
  - Mansfield Amendment redirected DARPA funding
  - Loss of confidence in field

#### Revival Factors (1990s)
- **Increased Computational Power**:
  - GPUs for parallel processing
  - 10x faster training than CPUs
  - 80-188GB VRAM for large models
  
- **Big Data**:
  - Volume, velocity, variety
  - Essential for deep learning
  - Prevents overfitting

#### Neural Network Advances
- **Multi-layer Perceptrons (MLPs)**: Hidden layers, non-linear activation
- **Backpropagation** (Rumelhart et al., 1986): Error gradient propagation
- **RNNs** (Jordan 1986, Elman 1990): Sequential data processing
- **LSTM** (Hochreiter & Schmidhuber, 1995): Gating mechanism for long-term dependencies

#### Statistical Learning
- **SVMs** (Vapnik, 1992): Optimal hyperplane separation, kernel trick
- **Decision Trees & Ensemble Methods**: Random Forests, bagging, boosting

### 2000s-Present: Deep Learning Revolution

#### Catalysts
- **GPUs**: Parallel processing, 10x+ speedup
- **Big Data**: ImageNet (14M images), GPT-3 (hundreds of billions of words)

#### Computer Vision Breakthrough
- **AlexNet (2012)**:
  - Geoffrey Hinton, Alex Krizhevsky, Ilya Sutskever
  - ImageNet: 15.3% error (10.8% better than competitor)
  - Innovations: ReLU activation, dropout, data augmentation, GPU parallelism

#### Transformer Architecture (2017)
- Paper: "Attention Is All You Need" (Vaswani et al.)
- Self-attention mechanism
- Advantages over RNNs:
  - Parallelization
  - Long-range dependencies
  - Scalability
- Foundation for modern LLMs

### Major LLM Developers

#### OpenAI
- **GPT-1 (2018)**: Transformer-based text generation
- **GPT-2 (2019)**: 1.5B parameters
- **GPT-3 (2020)**: 175B parameters, few-shot learning
- **GPT-4 (2024)**: Improved performance and context
- **GPT-4o**: Real-time voice/vision
- **o-series**: Deep reasoning (o3, o4-mini)
- **DALL-E**: Text-to-image generation
- **Whisper**: Speech-to-text

#### Anthropic
- Focus: Safety, steerability, reliability
- **Claude 3** (Opus, Sonnet, Haiku):
  - 200K token context (~160K words)
  - Image analysis
  - Text generation and summarization
- Research: Interpretability, alignment, model welfare

#### Mistral AI
- European company, efficient models
- **Magistral**: Reasoning-focused, multi-step chain-of-thought
- **Models**: Mistral 7B, Mixtral 8x7B, Mistral Small/Large
- Up to 128K tokens, open-source options

#### Diffusion Models
- Inspired by thermodynamics
- Forward process: Add noise to data
- Reverse process: Remove noise to generate
- Applications: Image/video generation (Sora, Stable Diffusion, Imagen), computational biology (AlphaFold 3)

#### OpenRouter
- Unified API for multiple LLM providers
- Model routing and failover
- OpenAI-compatible SDK
- Transparent pricing

## Practical AI Usage

### Cloud-Based APIs
- **Access**: Create account, get API key
- **Security**: Store keys as environment variables
- **Python SDKs**: Official libraries from providers

### Local AI with Ollama
- Open-source platform for local LLM deployment
- Benefits: Privacy, offline use, customization
- Installation: Download from official site
- Models: llama3.2, mistral, deepseek-r1, qwen, etc.
- CLI: `ollama run mistral`
- Local API: http://localhost:11434
- GUIs: Ollama WebUI, LM Studio, OpenWebUI

### Python Libraries
- **TensorFlow**: Google's ML platform
- **PyTorch**: Facebook's deep learning library
- **Scikit-learn**: Traditional ML algorithms
- **Keras**: High-level neural network API

### Online Platforms
- **Hugging Face**: Pre-trained models hub
- **Google Colab/Kaggle**: Free GPU notebooks

## Conclusion
AI evolution: theoretical concepts → symbolic AI → expert systems → AI winters → neural networks → deep learning → Transformers → LLMs → generative AI. Current era characterized by unprecedented accessibility via open-source tools, APIs, and user-friendly platforms.

## Related Concepts
- [[Machine Learning]]
- [[Deep Learning]]
- [[Neural Networks]]
- [[Large Language Models]]
- [[Generative AI]]
- [[Transformer Architecture]]

## Last Updated
2026.02.19
