# Setup Notes - Surveillance-Watcher

## ✅ Completed Setup Steps

1. ✅ Repository cloned from `https://github.com/Joie199/Surveillance-Watcher`
2. ✅ Dependencies installed (npm packages)
3. ✅ Development branch created (`development`)

## ⚠️ Known Issue: better-sqlite3 Native Module

The `better-sqlite3` package requires native compilation and needs **Windows SDK version 10.0.26100.0** which is not currently installed on this system.

### Error Message
```
error MSB8036: The Windows SDK version 10.0.26100.0 was not found.
```

### Solutions

#### Option 1: Install Windows SDK 10.0.26100.0 (Recommended)
1. Open Visual Studio Installer
2. Modify your Visual Studio 2022 installation
3. Under "Individual components", search for "Windows 10 SDK (10.0.26100.0)"
4. Install it
5. Run: `npm rebuild better-sqlite3`

#### Option 2: Use Prebuilt Binaries
Try installing with a specific Node.js version that has prebuilt binaries:
```bash
npm install better-sqlite3@latest --build-from-source=false
```

#### Option 3: Use Alternative SQLite Package (Temporary)
If you need to proceed without better-sqlite3, you could temporarily use `sql.js` or another SQLite package, but this would require code changes.

### Current Status
- ✅ All other dependencies installed successfully
- ⚠️ `better-sqlite3` needs to be built after installing Windows SDK
- ⏳ Database setup (`npm run db:push` and `npm run db:seed`) cannot proceed until better-sqlite3 is working

## Next Steps After Resolving better-sqlite3

1. **Set up database:**
   ```bash
   npm run db:push    # Create database tables
   npm run db:seed    # Seed with sample data
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Main app: http://localhost:5000
   - Map page: http://localhost:5000/map
   - Entities: http://localhost:5000/entities

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Express server
- `shared/` - Shared TypeScript types and schemas
- `script/` - Database seed and build scripts
- `database.sqlite` - SQLite database file (will be created after db:push)

## Git Branch

Currently on: `development` branch
- Created for active development work
- Can push to remote when ready: `git push -u origin development`







