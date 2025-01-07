-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
