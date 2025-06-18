import mongoose from 'mongoose';

// Connect to the mongoDB
export const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () =>
      console.log('Database Connected')
    );

    await mongoose.connect(`${process.env.URI_DATABASE}/chat-app`);
  } catch (error) {
    console.log(error);
  }
};
