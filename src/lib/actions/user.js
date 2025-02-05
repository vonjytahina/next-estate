import User from "../models/user.model";
import { connect } from "../mongodb/mongoose";

/**
 * Create or update a user in MongoDB when a Clerk event occurs.
 */
export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses
) => {
  try {
    await connect();
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_addresses[0].email_address,
        },
      },
      { upsert: true, new: true }
    );
    console.log(`✅ User ${id} created/updated.`);
    return user;
  } catch (error) {
    console.error("❌ Error in createOrUpdateUser:", error);
  }
};

/**
 * Delete a user from MongoDB when a Clerk user is deleted.
 */
export const deleteUser = async (id) => {
  try {
    await connect();
    const deletedUser = await User.findOneAndDelete({ clerkId: id });

    if (deletedUser) {
      console.log(`🗑️ User ${id} deleted.`);
    } else {
      console.log(`⚠️ User ${id} not found.`);
    }
  } catch (error) {
    console.error("❌ Error in deleteUser:", error);
  }
};
