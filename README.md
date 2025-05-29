# 🚀 Project Pal

**Project Pal** is your AI-powered cofounder — an app that helps you generate genuinely unique and startup-worthy project ideas using cutting-edge LLM tools. Whether you're hacking on a weekend prototype or planning your next big venture, Project Pal gives you smart, structured inspiration you can actually build on.

## 🧠 Features

- ✨ **Unique Idea Generation**: No more generic prompts — get fresh, original project ideas.
- 🧩 **Feature Breakdown**: Instantly see potential features for each idea.
- 🛠️ **Suggested Tech Stack**: Get tools and frameworks tailored to the idea's needs.
- 🔍 **Competitor Research** *(coming soon)*: Spot gaps in the market with AI-assisted research.
- 📊 **Structured JSON Output**: Perfect for devs who want to plug idea data into apps or databases.

## 🛠 Tech Stack

| Layer        | Tech Used                                                   |
|--------------|-------------------------------------------------------------|
| Frontend     | [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/) |
| Backend      | [FastAPI](https://fastapi.tiangolo.com/), [LangChain](https://www.langchain.com/), [LangGraph](https://www.langgraph.dev/) |
| AI & LLMs    | OpenAI API                                                  |
| Hosting      | Frontend: Vercel · Backend: Render                          |

## 🚧 How It Works

1. **User inputs a vague or raw idea** (e.g., "an AI tool for students").
2. **LangChain + LangGraph pipeline** breaks down the input, enriches it with context, filters for originality, and expands it into:
   - Features
   - Tech suggestions
   - Target users
   - JSON schema of idea
3. The result is returned to the frontend and rendered as a clean, interactive card.

## 📦 Running Locally

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/project-pal.git
   cd project-pal
