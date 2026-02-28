import BonusCalculator from './components/BonusCalculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <BonusCalculator />
    </main>
  );
}
```

Then press **Command + S** to save.

---

**STEP 4: Redeploy**

Go back to your terminal and type these one at a time:
```
git add .
```
```
git commit -m "fix page.tsx"
```
```
git push origin main
```
```
vercel --prod
