import mongoose from 'mongoose';

// Connect to the mongoDB
export const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () =>
      console.log('Database Connected')
    );

    await mongoose.connect(`${process.env.URI_DATABASE}`);
  } catch (error) {
    console.log(error);
  }
};
