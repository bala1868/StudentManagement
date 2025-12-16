# Student Management

A simple static student management website built with HTML, CSS, and JavaScript.

---

## Features ✅

- Responsive multi-page site: Home, Add Student, Records, Contact
- Client-side student data storage using `students.json`
- Image upload support for student profiles (`Images/` + `image-upload.js`)
- Interactive UI components (carousel, counters, toast notifications)
- Clean, modular CSS in `css/` and JavaScript in `js/`
- Accessible and semantic HTML templates in `html/`
- Sample data and examples to get started quickly

---

## Screenshots 📸

Add screenshots to `Images/` and reference them here using Markdown image links.

<!-- Example placeholders: update file names to actual screenshots -->
<img width="1358" height="660" alt="image" src="https://github.com/user-attachments/assets/afcae33d-1b2e-453c-ad69-2b21fa5300e2" />
<img width="710" height="623" alt="image" src="https://github.com/user-attachments/assets/70100301-b646-4bea-a0a9-e17574663dba" />


---



## Development 🔧

- Edit pages in `html/`, styles in `css/`, and scripts in `js/`.
- Add or update example student records in `students.json` if needed.
- Use browser DevTools to inspect and debug UI or scripts.

---
Got it 👍
You want the **README instructions written clearly for other users** (not you), so anyone can **pull and run your Docker image easily**.

Here is a **user-friendly, public README section** 👇
You can **copy–paste this directly**.

---

## 🚀 Run This Project Using Docker

You can run this application easily without setting up the source code by using the pre-built Docker image.

---

### 🔹 Step 1: Install Docker

Make sure Docker is installed on your system.

👉 Download Docker: [https://www.docker.com/get-started](https://www.docker.com/get-started)

---

### 🔹 Step 2: Pull the Docker Image

```bash
docker pull balapersonal/student-portal:latest
```

---

### 🔹 Step 3: Run the Application

```bash
docker run -d -p 8080:80 --name student-portal balapersonal/student-portal:latest
```

---

### 🔹 Step 4: Access the Application

Open your browser and visit:

```
http://localhost:8080
```

---

## 🛑 Stop & Remove Container

```bash
docker stop student-portal
docker rm student-portal
```

---

## 📌 Useful Commands

Check running containers:

```bash
docker ps
```

Check all containers:

```bash
docker ps -a
```

---

## 📦 Docker Hub Image

The Docker image is hosted on Docker Hub:
🔗 [https://hub.docker.com/r/balapersonal/student-portal](https://hub.docker.com/r/balapersonal/student-portal)

---

## 🧑‍💻 Who Is This For?

* Students
* Recruiters
* Developers
* Anyone who wants to test the project quickly

No environment setup required — just Docker 👍

---



