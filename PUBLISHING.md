# Beginner guide: publish your first GitHub repository and portfolio website

You **do not** need a pre-existing repository. The project folder already includes the website and two example automation projects.

## Option A — GitHub website (no terminal)

1. Download and **unzip** the `neha-sdet-portfolio.zip` package onto your computer.
2. Sign in to [github.com](https://github.com). Open the **+** menu in the upper right and choose **New repository**. You can also visit [github.com/new](https://github.com/new).
3. Repository name: **`neha-sdet-portfolio`**. Choose **Public** so recruiters can open it. Do **not** check the boxes for creating a README, license, or `.gitignore`—those files are already in the downloaded project.
4. Click **Create repository**. On your empty repository page, choose **uploading an existing file** (or **Add file → Upload files**).
5. In Finder / File Explorer, open the *unzipped* `neha-sdet-portfolio` folder. Drag **all the contents**, including the `examples/`, `demo-app/`, and `.github/` folders, into the GitHub upload area. **Do not** upload only the `.zip` file.
   - **Mac tip:** Press `Command + Shift + .` in Finder to show hidden files and folders such as `.github`, `.gitignore`, and `.nojekyll`.
   - If your browser doesn't preserve folder structure when dragging, use **Option B (GitHub Desktop)** instead; a clean folder tree is important.
6. In the commit message, write: `Initial SDET portfolio with UI and API automation examples`. Choose **Commit changes** / **Propose changes**, depending on the GitHub interface.
7. Verify that the new repository shows `index.html`, `README.md`, `demo-app/`, and `examples/` at the top level. Your source link is now `https://github.com/YOUR_USERNAME/neha-sdet-portfolio`.

## Option B — GitHub Desktop (easiest reliable folder upload)

If browser upload is difficult, download [GitHub Desktop](https://desktop.github.com/) and sign in.

1. Unzip the project folder on your computer.
2. In GitHub Desktop choose **File → Add local repository → Choose...** and select the *unzipped* project folder.
3. When told it is not a repository, choose **Create a Repository**. Use `neha-sdet-portfolio` for the name and leave the project files intact.
4. Commit your files with a message like `Initial SDET portfolio`.
5. Choose **Publish repository**, uncheck **Keep this code private**, and publish.
6. If you already created an empty GitHub repository with the same name using Option A, don't create a duplicate. Use one method, not both.

## Turn on your live website (GitHub Pages)

1. Open your GitHub repository in the browser.
2. Choose **Settings → Pages** from the repository menu.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Under **Branch**, select **main**, folder **/(root)**, and click **Save**.
5. Allow a few minutes for deployment. Your website address will be:

   `https://YOUR_USERNAME.github.io/neha-sdet-portfolio/`

If you do not see `main`, check that you committed to the default branch and inspect your repo's **Code** tab.

## Personalize the links

The portfolio will be usable as a website immediately, but its GitHub, LinkedIn and email buttons need your details.

1. In your GitHub repository open `index.html` and choose the pencil **Edit** icon.
2. Scroll near the very bottom to the `PUBLIC_PROFILE` section:

   ```js
   const PUBLIC_PROFILE = {
     githubUsername: "YOUR_GITHUB_USERNAME",
     linkedinUrl: "", // example: https://www.linkedin.com/in/your-name/
     email: "" // example: yourname@example.com (optional)
   };
   ```
3. Replace `YOUR_GITHUB_USERNAME` with **your exact GitHub username** (not the full URL).
4. Add your actual LinkedIn URL and an email you are comfortable displaying publicly. If you prefer not to publish your email, leave it empty.
5. Click **Commit changes**. The website will update automatically once GitHub Pages republishes it.

## What to paste into job applications

- **GitHub URL:** `https://github.com/YOUR_USERNAME/neha-sdet-portfolio`
- **Portfolio / Website:** `https://YOUR_USERNAME.github.io/neha-sdet-portfolio/`

After making the repository public, test both links in a private/incognito browser to confirm recruiters can access them without signing in.

## Check automation status

Open the repository **Actions** tab. On every push, the workflow runs API smoke tests and Playwright browser tests on GitHub-hosted machines. See the `examples/` READMEs for detailed instructions to run locally.

## Privacy and authenticity checks before publishing

- This project contains **sample code** against **fake accounts**, not client source.
- Review your public details in `index.html` and `README.md` before making the repository Public.
- Never upload resumes containing private phone numbers/home addresses unless you intentionally want them available to anyone.
- Never upload work credentials, client code, internal documents, private URLs, customer records, or real test credentials.
- If a job application asks for a *GitHub profile* instead of a repository, use `https://github.com/YOUR_USERNAME`.
