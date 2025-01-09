/*
  Warnings:

  - The primary key for the `Goal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `GoalCompletion` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "desiredWeeklyFrequency" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Goal" ("createdAt", "desiredWeeklyFrequency", "id", "imageUrl", "title") SELECT "createdAt", "desiredWeeklyFrequency", "id", "imageUrl", "title" FROM "Goal";
DROP TABLE "Goal";
ALTER TABLE "new_Goal" RENAME TO "Goal";
CREATE TABLE "new_GoalCompletion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goalId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GoalCompletion_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GoalCompletion" ("createdAt", "goalId", "id") SELECT "createdAt", "goalId", "id" FROM "GoalCompletion";
DROP TABLE "GoalCompletion";
ALTER TABLE "new_GoalCompletion" RENAME TO "GoalCompletion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
