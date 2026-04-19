# Prithbiraj Panda – Personal Portfolio

![Dockerized](https://img.shields.io/badge/docker-ready-blue?logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-black?logo=express&logoColor=white)
![React](https://img.shields.io/badge/react-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/mongodb-47A248?logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/cloudinary-3448C5?logo=cloudinary&logoColor=white)
![Mailchimp](https://img.shields.io/badge/mailchimp-FFE01B?logo=mailchimp&logoColor=black)

🚀 **Live Demo:** [prithbidesigns.com](https://prithbidesigns.com/)

A dynamic portfolio showcasing **Full Stack Development**, **UI/UX Design**, **Motion Graphics**, and **Affiliate Marketing** projects by me, **Prithbiraj Panda**.  
Built with **Docker, Node.js/Express, MongoDB, React.js, Cloudinary**, and integrated with **Mailchimp** for email marketing.  
Explore innovative web solutions, engaging user experiences, and impactful branding work — all crafted to drive results.

---

## 🔹 Features
- Full Stack Development with **Node.js + Express.js**
- **React.js** frontend for fast, interactive UI
- **MongoDB** backend for scalable data management
- **Cloudinary** for media storage and transformations
- **Mailchimp** integration for email campaigns
- **Admin panel** for portfolio content management
- **Dockerized** for deployment & scalability
- Fully responsive design for all devices
- SEO-friendly structure & optimized performance

---

## 📌 Tech Stack
**Frontend:** React.js, HTML5, CSS3, JavaScript (ES6)  
**Backend:** Node.js, Express.js, MongoDB  
**Email & Marketing:** SMTP, Mailchimp API  
**DevOps & Deployment:** Docker, Nginx  
**Media & Optimization:** Cloudinary  
**Version Control:** Git & GitHub

---

## 📂 Project Structure
```

backend/
├── assets/                # Static backend assets (images, files, etc.)
├── models/                # MongoDB Mongoose models
├── routes/                # Express.js API routes
├── utils/                 # Utility functions/helpers
├── .dockerignore          # Docker ignore file for backend
├── .env                   # Backend environment variables (not committed)
├── .gitignore             # Git ignore file
├── Dockerfile             # Backend Docker build file
├── package.json           # Backend dependencies & scripts
├── server.js              # Backend entry point

frontend/
├── public/                 # Public static files for React
├── src/                    # React components, pages, styles, logic
├── build/                  # Production build output
├── .env                    # Frontend environment variables (not committed)
├── package.json            # Frontend dependencies & scripts

````

---

## 🛠 Environment Variables

This project uses environment variables for API keys and configuration.  
**Never commit `.env` files** — they are ignored by `.gitignore`.  
Use `.env.example` as a safe template.

### Backend `.env.example`
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio
PORT=5000

EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
EMAIL_HOST=smtp.your-email-provider.com
EMAIL_PORT=465

ADMIN_EMAIL=admin@example.com

MAILCHIMP_API_KEY=your-mailchimp-api-key
MAILCHIMP_SERVER_PREFIX=usX
MAILCHIMP_LIST_ID=your-list-id

ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your-hashed-password

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
````

### Frontend `.env.example`

```bash
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_SITE_LOGO_URL=https://res.cloudinary.com/your-cloud-name/image/upload/v123/profile/logo.png
REACT_APP_SUBSCRIBE_BANNER_URL=https://res.cloudinary.com/your-cloud-name/image/upload/v123/email/subscribe-banner.png
REACT_APP_UNSUBSCRIBE_BANNER_URL=https://res.cloudinary.com/your-cloud-name/image/upload/v123/email/unsubscribe-banner.png
```

**Setup:**

```bash
# Backend
cp .env.example .env

# Frontend
cd client
cp .env.example .env
```

---

## 🚀 Getting Started

```bash
# Clone this repository
git clone https://github.com/prithbidesigns/portfolio.git

# Navigate to the project directory
cd portfolio

# Install dependencies for frontend & backend
cd frontend && npm install
cd ../backend && npm install

# Start Docker containers
docker-compose up --build
```

---

## 📞 Contact Me

📧 **Email:** [connect@prithbidesigns.com](mailto:connect@prithbidesigns.co)
🌐 **Website:** [prithbidesigns.com](https://prithbidesigns.com/)
💼 **LinkedIn:** [linkedin.com/in/prithbidesigns](https://www.linkedin.com/in/prithbidesigns/)

---

⭐ **If you like this project, give it a star on GitHub!**

```

---

This README is **ready for public GitHub upload** — safe for open-sourcing, easy to read for devs, and SEO-friendly for discovery.  

I can also make you a **GitHub repo one-line description** that perfectly matches this README so your repo looks complete when listed in search.
```
