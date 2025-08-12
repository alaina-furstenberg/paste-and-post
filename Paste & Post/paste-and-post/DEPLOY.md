# Deploy Paste & Post to Vercel

## Quick Deployment Steps

1. **Go to [vercel.com](https://vercel.com)** and sign up with GitHub

2. **Click "New Project"**

3. **Import from Git Repository:**
   - Click "Import Git Repository" 
   - Select this folder: `/Users/afurstenberg/Desktop/Paste & Post/paste-and-post`
   - Or upload the folder directly

4. **Configure Environment Variables:**
   - In project settings, add:
   - `GROQ_API_KEY` = `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`

5. **Deploy:**
   - Click "Deploy"
   - You'll get a permanent URL like: `https://paste-and-post-xxx.vercel.app`

## Alternative: Use GitHub

1. **Push to GitHub:**
   ```bash
   # Create a new repo on GitHub first, then:
   git remote add origin https://github.com/yourusername/paste-and-post.git
   git push -u origin master
   ```

2. **Connect Vercel to GitHub repo** for automatic deployments

## Test the Deployment

Once deployed, test with:
- URL: `test`
- Goal: `Sell something`

You should see the mock restaurant data and AI-generated caption!

---

**Current Status:** Ready to deploy - all code is built and tested locally.