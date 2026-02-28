import BonusCalculator from './components/BonusCalculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <BonusCalculator />
    </main>
  );
}
```

---

**PART 5: Test It On Your Computer**

Go back to your Terminal and type:
```
npm run dev
```
Then open your web browser and go to **http://localhost:3000** — you should see your bonus calculator! 🎉

---

**PART 6: Put It On The Internet**

Now we'll send it to GitHub (your storage locker) and then to Vercel (your storefront).

**1.** In your terminal, type these one at a time, hitting Enter after each:
```
git init
git add .
git commit -m "my bonus calculator"
