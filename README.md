# Aditya Nautiyal Portfolio

Stylish personal e-portfolio built with HTML, CSS, and JavaScript.

## Local Run

1. Open terminal in this folder.
2. Run:

```bash
python -m http.server 5500
```

3. Open `http://localhost:5500/`.

## Add Your Image

1. Create folder `assets` in project root.
2. Add your profile photo as:

```text
assets/aditya-profile.jpg
```

## Public Assignment And Video For Visitors

If you want all visitors to see assignment and video, add:

```text
assets/assignment.pdf
assets/self-intro.mp4
```

## Owner-Only Upload Controls

Upload options are hidden from public users.

- Owner controls are visible only on localhost (`http://localhost:5500`).
- On GitHub Pages/live public URL, upload controls are always hidden.

## Publish On GitHub Pages

1. Create a new GitHub repository (for example: `E-Portfolio`).
2. Push this project to `main` branch:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/E-Portfolio.git
git push -u origin main
```

3. On GitHub: `Settings` -> `Pages` -> `Build and deployment`.
4. Set:
   - `Source`: Deploy from a branch
   - `Branch`: `main`
   - `Folder`: `/ (root)`
5. Save and wait 1-2 minutes.
6. Your live URL will be:

```text
https://YOUR_USERNAME.github.io/E-Portfolio/
```
