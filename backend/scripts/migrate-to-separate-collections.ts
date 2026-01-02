import "dotenv/config";
import { connectDatabase } from "../src/config/database";
import { File } from "../src/models/File";
import { Permission } from "../src/models/Permission";
import { Star } from "../src/models/Star";
import { User } from "../src/models/User";

interface OldFileDocument {
  _id: any;
  permissions?: Array<{ userId: any; level: string }>;
  starredBy?: any[];
  [key: string]: any;
}

const migratePermissions = async () => {
  console.log("Starting permission migration...");
  const files = (await File.find({}).lean()) as OldFileDocument[];
  let migrated = 0;
  let skipped = 0;

  for (const file of files) {
    if (!file.permissions || file.permissions.length === 0) {
      continue;
    }

    for (const perm of file.permissions) {
      try {
        await Permission.findOneAndUpdate(
          {
            fileId: file._id,
            userId: perm.userId,
          },
          {
            fileId: file._id,
            userId: perm.userId,
            level: perm.level,
          },
          {
            upsert: true,
            new: true,
          },
        );
        migrated++;
      } catch (error: any) {
        if (error.code === 11000) {
          skipped++;
        } else {
          console.error(
            `Error migrating permission for file ${file._id}:`,
            error,
          );
        }
      }
    }
  }

  console.log(
    `Permission migration complete: ${migrated} migrated, ${skipped} skipped (duplicates)`,
  );
};

const migrateStars = async () => {
  console.log("Starting star migration...");
  const files = (await File.find({}).lean()) as OldFileDocument[];
  let migrated = 0;
  let skipped = 0;

  for (const file of files) {
    if (!file.starredBy || file.starredBy.length === 0) {
      continue;
    }

    for (const userId of file.starredBy) {
      try {
        await Star.findOneAndUpdate(
          {
            fileId: file._id,
            userId: userId,
          },
          {
            fileId: file._id,
            userId: userId,
          },
          {
            upsert: true,
            new: true,
          },
        );
        migrated++;
      } catch (error: any) {
        if (error.code === 11000) {
          skipped++;
        } else {
          console.error(`Error migrating star for file ${file._id}:`, error);
        }
      }
    }
  }

  console.log(
    `Star migration complete: ${migrated} migrated, ${skipped} skipped (duplicates)`,
  );
};

const updateFileCounts = async () => {
  console.log("Updating file counts...");
  const files = await File.find({});
  let updated = 0;

  for (const file of files) {
    const starCount = await Star.countDocuments({ fileId: file._id });
    const shareCount = await Permission.countDocuments({ fileId: file._id });

    file.starCount = starCount;
    file.shareCount = shareCount;
    await file.save();
    updated++;
  }

  console.log(`File counts updated: ${updated} files`);
};

const updateUserStorage = async () => {
  console.log("Updating user storage...");
  const users = await User.find({});
  let updated = 0;

  for (const user of users) {
    const result = await File.aggregate([
      {
        $match: {
          owner: user._id,
          deleted: { $ne: true },
        },
      },
      {
        $group: {
          _id: null,
          totalSize: { $sum: "$size" },
        },
      },
    ]);

    const storageUsed = result.length > 0 ? result[0].totalSize : 0;
    user.storageUsed = storageUsed;
    await user.save();
    updated++;
  }

  console.log(`User storage updated: ${updated} users`);
};

const addMimeTypes = async () => {
  console.log("Adding mimeTypes to files...");
  const { getContentType } = await import("../src/services/s3Service");
  const files = await File.find({ mimeType: { $exists: false } });
  let updated = 0;

  for (const file of files) {
    file.mimeType = getContentType(file.originalName);
    await file.save();
    updated++;
  }

  console.log(`MimeTypes added: ${updated} files`);
};

const main = async () => {
  try {
    console.log("Connecting to database...");
    await connectDatabase();

    console.log("Starting migration...\n");

    await migratePermissions();
    await migrateStars();
    await addMimeTypes();
    await updateFileCounts();
    await updateUserStorage();

    console.log("\nMigration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

export { main };
