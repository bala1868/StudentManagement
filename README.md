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
📦 Docker Image Pull & Run

This project is available as a Docker image on Docker Hub.

🔹 Pull the Docker Image
docker pull balapersonal/student-portal:latest

🔹 Run the Container
docker run -d -p 8080:80 --name student-portal balapersonal/student-portal:latest

🔹 Access the Application

Open your browser and go to:

http://localhost:8080

🛠 Requirements

Docker installed on your system

Internet connection (for pulling the image)

📌 Notes

Port 8080 on your machine is mapped to port 80 inside the container

You can stop the container using:

docker stop student-portal


Remove container:

docker rm student-portal

⭐ Docker Hub Repository

🔗 [https://hub.docker.com/r/balapersonal/student-portal]((https://hub.docker.com/r/balapersonal/student-portal))

