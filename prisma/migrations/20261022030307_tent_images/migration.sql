-- CreateTable
CREATE TABLE "tent_images" (
    "id" TEXT NOT NULL,
    "tent_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tent_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tent_images_tent_id_idx" ON "tent_images"("tent_id");

-- AddForeignKey
ALTER TABLE "tent_images" ADD CONSTRAINT "tent_images_tent_id_fkey" FOREIGN KEY ("tent_id") REFERENCES "tents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
