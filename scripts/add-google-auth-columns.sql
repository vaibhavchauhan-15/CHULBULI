-- Add Google OAuth columns to User table if they don't exist
-- Run this manually if migrations fail

DO $$ 
BEGIN
    -- Add provider column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'User' AND column_name = 'provider') THEN
        ALTER TABLE "User" ADD COLUMN "provider" varchar(50) DEFAULT 'email' NOT NULL;
        RAISE NOTICE 'Added provider column';
    ELSE
        RAISE NOTICE 'provider column already exists';
    END IF;

    -- Add googleId column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'User' AND column_name = 'googleId') THEN
        ALTER TABLE "User" ADD COLUMN "googleId" text;
        RAISE NOTICE 'Added googleId column';
    ELSE
        RAISE NOTICE 'googleId column already exists';
    END IF;

    -- Add photoUrl column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'User' AND column_name = 'photoUrl') THEN
        ALTER TABLE "User" ADD COLUMN "photoUrl" text;
        RAISE NOTICE 'Added photoUrl column';
    ELSE
        RAISE NOTICE 'photoUrl column already exists';
    END IF;

    -- Make password nullable if it isn't already
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'User' AND column_name = 'password' AND is_nullable = 'NO') THEN
        ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
        RAISE NOTICE 'Made password column nullable';
    ELSE
        RAISE NOTICE 'password column is already nullable';
    END IF;

END $$;

-- Add unique constraint on googleId if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint 
                   WHERE conname = 'User_googleId_unique') THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_googleId_unique" UNIQUE("googleId");
        RAISE NOTICE 'Added unique constraint on googleId';
    ELSE
        RAISE NOTICE 'Unique constraint on googleId already exists';
    END IF;
END $$;

-- Add indexes if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes 
                   WHERE indexname = 'User_googleId_idx') THEN
        CREATE INDEX "User_googleId_idx" ON "User" USING btree ("googleId");
        RAISE NOTICE 'Created index on googleId';
    ELSE
        RAISE NOTICE 'Index on googleId already exists';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes 
                   WHERE indexname = 'User_provider_idx') THEN
        CREATE INDEX "User_provider_idx" ON "User" USING btree ("provider");
        RAISE NOTICE 'Created index on provider';
    ELSE
        RAISE NOTICE 'Index on provider already exists';
    END IF;
END $$;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;
