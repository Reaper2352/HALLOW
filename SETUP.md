# How to run HALLOW (no coding)

You do **not** need Docker.
You do **not** need Node.
You do **not** need TanStack.
VS Code is optional. A web browser is enough.

## Easiest way (no VS Code)

1. Go to https://github.com/Reaper2352/HALLOW
2. Green **Code** button → **Download ZIP**
3. Unzip it (Windows: right-click → Extract All)
4. Open the folder
5. Double-click `index.html`
6. It opens in Chrome / Edge / Firefox

That is the whole setup.

## If you want it in VS Code

1. Install VS Code if you do not have it
2. File → Open Folder
3. Choose the HALLOW folder
4. Find `index.html` in the left file list
5. Right-click it → **Reveal in File Explorer** → double-click it
   or install the extension **Live Server** by Ritwick Dey, then right-click `index.html` → **Open with Live Server**

Live Server is nicer (page refreshes). It is still not required.

## Optional: Git (only if you want updates with one command)

Install Git from https://git-scm.com then:

```
git clone https://github.com/Reaper2352/HALLOW.git
cd HALLOW
```

Later updates:

```
cd HALLOW
git pull origin main
```

Then open `index.html` again.

## What you should see

A black screen that says **Come back every night.**
Buttons along the top: CYCLE OPS NOTES HOLD HOUSE BOARD WIRE CODEX LOG

If you see a blank white page, you opened the wrong file. Open `index.html` inside the HALLOW folder, not a random README.

## Nightly loop (the training)

1. CYCLE → CHECK IN (once per day)
2. HOLD → STILL 1:00
3. HOUSE → extract one map
4. WIRE → read whatever just unlocked
5. Close the lid

Miss a calendar day and the streak resets. Engineer Leona's control rank is computed from streak + holds + extracts. It only goes up if you come back.
