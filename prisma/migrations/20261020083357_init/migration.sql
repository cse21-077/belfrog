-- CreateEnum
CREATE TYPE "RateCategory" AS ENUM ('GLAMPING', 'EXCURSION', 'BOAT', 'TRANSFER', 'HELICOPTER', 'SPECIAL');

-- CreateEnum
CREATE TYPE "RateUnit" AS ENUM ('PER_NIGHT', 'PER_PERSON', 'PER_TRIP', 'COMPLIMENTARY', 'ON_REQUEST');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('BWP', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BookingSource" AS ENUM ('WEB', 'AIRBNB', 'BOOKINGCOM', 'MANUAL');

-- CreateEnum
CREATE TYPE "BlockSource" AS ENUM ('AIRBNB', 'BOOKINGCOM', 'MANUAL');

-- CreateTable
CREATE TABLE "tents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "localName" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 2,
    "price_per_night" INTEGER,
    "blurb" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rates" (
    "id" TEXT NOT NULL,
    "category" "RateCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "details" TEXT NOT NULL DEFAULT '',
    "min_pax" INTEGER,
    "max_pax" INTEGER,
    "unit" "RateUnit" NOT NULL DEFAULT 'PER_PERSON',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_prices" (
    "id" TEXT NOT NULL,
    "rate_id" TEXT NOT NULL,
    "amount" INTEGER,
    "currency" "Currency" NOT NULL DEFAULT 'BWP',
    "label" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "rate_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "rating" INTEGER NOT NULL DEFAULT 5,
    "text" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'AIRBNB',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "guest_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "check_in" DATE NOT NULL,
    "check_out" DATE NOT NULL,
    "guests" INTEGER NOT NULL DEFAULT 2,
    "tent_id" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "source" "BookingSource" NOT NULL DEFAULT 'WEB',
    "notes" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked_dates" (
    "id" TEXT NOT NULL,
    "start" DATE NOT NULL,
    "end" DATE NOT NULL,
    "source" "BlockSource" NOT NULL DEFAULT 'MANUAL',
    "summary" TEXT NOT NULL DEFAULT '',
    "external_id" TEXT,
    "booking_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blocked_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rate_prices_rate_id_idx" ON "rate_prices"("rate_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_code_key" ON "bookings"("code");

-- CreateIndex
CREATE INDEX "bookings_check_in_check_out_idx" ON "bookings"("check_in", "check_out");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "blocked_dates_start_end_idx" ON "blocked_dates"("start", "end");

-- CreateIndex
CREATE UNIQUE INDEX "blocked_dates_source_external_id_key" ON "blocked_dates"("source", "external_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions"("token_hash");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- AddForeignKey
ALTER TABLE "rate_prices" ADD CONSTRAINT "rate_prices_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "rates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tent_id_fkey" FOREIGN KEY ("tent_id") REFERENCES "tents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_dates" ADD CONSTRAINT "blocked_dates_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
