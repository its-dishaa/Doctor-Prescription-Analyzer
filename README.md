Agilens — Doctor Prescription Analyzer

AI-powered extraction of diagnostic investigations from handwritten and printed doctor prescriptions.

Agilens is a web application that uses Google's Gemini Vision model to identify diagnostic investigations from prescription images and present them in a structured, readable format.

The project aims to reduce manual effort in interpreting prescriptions and organizing diagnostic test information.

✨ Features

AI-Powered Extraction: Identifies diagnostic investigations from prescription images using Gemini Vision.

Handwritten & Printed Prescriptions: Processes different types of prescription images.

Standardized Test Names: Displays the original investigation name alongside its standardized name.

Confidence Scores: Provides a confidence score for each extracted investigation.

Prescription History: Allows users to access previous analysis results.

Analytics Dashboard: Provides an overview of prescription analysis activity.

AI Assistant: Includes a chatbot for relevant questions.

Modern Interface: Offers a user-friendly interface built with React.

REST API: Uses FastAPI for backend processing and communication.

🛠️ Tech Stack

Component

Technology

Frontend

React, Vite

Backend

Python, FastAPI

AI Model

Google Gemini Vision

Database

SQLite

Image Processing

OpenCV

API Communication

REST API

Deployment

Render

🔄 How It Works

Upload a prescription image.

The backend processes the uploaded image.

Gemini Vision extracts the diagnostic investigations.

Each investigation is returned with its raw name, standardized name, and confidence score.

The results are displayed in the web interface.

Analysis results can be accessed through prescription history.


🎯 Project Objectives

Reduce manual effort in identifying diagnostic investigations.

Convert unstructured prescription images into structured information.

Improve the readability and organization of extracted test names.

Explore the practical application of vision-language models in healthcare information extraction.

⚠️ Limitations and Disclaimer

Agilens is an experimental AI-assisted information extraction tool. Results may vary depending on handwriting quality, image resolution, medical abbreviations, and model limitations.

Confidence scores do not guarantee correctness.

Extracted information should be reviewed by a qualified healthcare professional.

The application does not diagnose medical conditions or replace professional medical judgment.

Patient information should be handled with appropriate privacy and security safeguards.

🚀 Future Improvements

Evaluate extraction performance using precision, recall, and F1-score.

Improve extraction of unclear handwriting and medical abbreviations.

Strengthen error handling and application reliability.

Improve persistent data storage and monitoring.

Expand automated testing and evaluation.

👩‍💻 Author

Disha Sahay

GitHub: @its-dishaa

Exploring the intersection of computer vision, generative AI, and healthcare information extraction.
