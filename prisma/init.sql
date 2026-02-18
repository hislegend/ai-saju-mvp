PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "phone" TEXT,
  "passwordHash" TEXT,
  "kakaoId" TEXT,
  "marketingOptIn" BOOLEAN NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX IF NOT EXISTS "User_kakaoId_key" ON "User"("kakaoId");

CREATE TABLE IF NOT EXISTS "Profile" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT,
  "name" TEXT NOT NULL,
  "gender" TEXT NOT NULL,
  "calendarType" TEXT NOT NULL,
  "birthDate" DATETIME NOT NULL,
  "birthTime" TEXT,
  "timeUnknown" BOOLEAN NOT NULL DEFAULT 0,
  "isPrimary" BOOLEAN NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Profile_userId_idx" ON "Profile"("userId");

CREATE TABLE IF NOT EXISTS "MbtiProfile" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT,
  "profileId" TEXT,
  "mbtiType" TEXT NOT NULL,
  "confidence" REAL NOT NULL,
  "source" TEXT NOT NULL,
  "answers" JSON,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MbtiProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "MbtiProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "MbtiProfile_userId_idx" ON "MbtiProfile"("userId");
CREATE INDEX IF NOT EXISTS "MbtiProfile_profileId_idx" ON "MbtiProfile"("profileId");

CREATE TABLE IF NOT EXISTS "Reading" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT,
  "profileId" TEXT NOT NULL,
  "mbtiProfileId" TEXT,
  "mode" TEXT NOT NULL,
  "productSlug" TEXT,
  "status" TEXT NOT NULL DEFAULT 'CREATED',
  "marketingConsent" BOOLEAN NOT NULL DEFAULT 0,
  "sourceUtm" JSON,
  "resultVersion" INTEGER NOT NULL DEFAULT 1,
  "previewText" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Reading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "Reading_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Reading_mbtiProfileId_fkey" FOREIGN KEY ("mbtiProfileId") REFERENCES "MbtiProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Reading_userId_idx" ON "Reading"("userId");
CREATE INDEX IF NOT EXISTS "Reading_profileId_idx" ON "Reading"("profileId");
CREATE INDEX IF NOT EXISTS "Reading_status_idx" ON "Reading"("status");

CREATE TABLE IF NOT EXISTS "ReadingSection" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "readingId" TEXT NOT NULL,
  "sectionType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "displayOrder" INTEGER NOT NULL,
  CONSTRAINT "ReadingSection_readingId_fkey" FOREIGN KEY ("readingId") REFERENCES "Reading"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "ReadingSection_readingId_idx" ON "ReadingSection"("readingId");

CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "readingId" TEXT NOT NULL,
  "userId" TEXT,
  "orderNumber" TEXT NOT NULL,
  "paymentMethod" TEXT NOT NULL,
  "couponCode" TEXT,
  "amount" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "paymentUrl" TEXT,
  "clientSecret" TEXT,
  "pgTransactionId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Order_readingId_fkey" FOREIGN KEY ("readingId") REFERENCES "Reading"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE INDEX IF NOT EXISTS "Order_readingId_idx" ON "Order"("readingId");
CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");

CREATE TABLE IF NOT EXISTS "Coupon" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "phone" TEXT,
  "discountAmount" INTEGER NOT NULL DEFAULT 0,
  "expiresAt" DATETIME,
  "maxUses" INTEGER NOT NULL DEFAULT 1,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "Coupon_code_key" ON "Coupon"("code");

CREATE TABLE IF NOT EXISTS "CouponRedeem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "couponId" TEXT,
  "readingId" TEXT,
  "code" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "redeemed" BOOLEAN NOT NULL DEFAULT 1,
  "redeemedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" DATETIME,
  "meta" JSON,
  CONSTRAINT "CouponRedeem_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "CouponRedeem_readingId_fkey" FOREIGN KEY ("readingId") REFERENCES "Reading"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "CouponRedeem_couponId_idx" ON "CouponRedeem"("couponId");
CREATE INDEX IF NOT EXISTS "CouponRedeem_readingId_idx" ON "CouponRedeem"("readingId");
CREATE UNIQUE INDEX IF NOT EXISTS "CouponRedeem_code_phone_key" ON "CouponRedeem"("code", "phone");

CREATE TABLE IF NOT EXISTS "EventLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT,
  "readingId" TEXT,
  "eventName" TEXT NOT NULL,
  "utm" JSON,
  "device" JSON,
  "metadata" JSON,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EventLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "EventLog_readingId_fkey" FOREIGN KEY ("readingId") REFERENCES "Reading"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "EventLog_eventName_idx" ON "EventLog"("eventName");
CREATE INDEX IF NOT EXISTS "EventLog_userId_idx" ON "EventLog"("userId");
CREATE INDEX IF NOT EXISTS "EventLog_readingId_idx" ON "EventLog"("readingId");
