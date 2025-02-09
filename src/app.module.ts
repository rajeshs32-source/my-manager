import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AdminModule } from './apis/admin/admin.module';
import { RouterModule } from '@nestjs/core';
import mongoose from 'mongoose';

mongoose.set('debug', true);
mongoose.set('strictQuery', false);
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (): Promise<MongooseModuleOptions> => {
        const uri =
          'mongodb+srv://rajesh23:Gm4eg27uVTVoZBXz@workshopcluster.twtcs.mongodb.net/?retryWrites=true&w=majority&appName=WorkshopCluster';
        mongoose.connection.on('connected', () => {
          console.log('MongoDB Connected successfully');
        });
        mongoose.connection.on('error', (error) => {
          console.error('MongoDB connection error:', error);
        });
        mongoose.connection.on('disconnected', () => {
          console.warn('MongoDB disconnected');
        });
        return { uri };
      },
    }),
    AdminModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
