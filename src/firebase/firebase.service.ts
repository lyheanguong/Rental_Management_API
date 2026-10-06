import {
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common';

import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import {
    getMessaging,
    Messaging,
} from 'firebase-admin/messaging';

import { join } from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private readonly logger = new Logger(FirebaseService.name);

    private firebaseApp!: App;
    private messaging!: Messaging;

    onModuleInit() {
        try {
            const apps = getApps();

            if (apps.length > 0) {
                this.firebaseApp = apps[0];
            } else {
                const serviceAccountPath = join(
                    process.cwd(),
                    'firebase',
                    'serviceAccountKey.json',
                );

                this.firebaseApp = initializeApp({
                    credential: cert(serviceAccountPath),
                });
            }

            this.messaging = getMessaging(this.firebaseApp);

            this.logger.log(
                'Firebase Admin initialized successfully',
            );
        } catch (error) {
            this.logger.error(
                'Failed to initialize Firebase Admin',
                error,
            );
        }
    }

    async sendNotification(
        fcmToken: string,
        title: string,
        body: string,
        data?: Record<string, string>,
    ) {
        if (!fcmToken) {
            this.logger.warn('FCM token is missing');
            return null;
        }

        try {
            const message = {
                token: fcmToken,

                notification: {
                    title,
                    body,
                },

                data: data ?? {},
            };

            const response = await this.messaging.send(message);

            this.logger.log(
                `FCM notification sent successfully: ${response}`,
            );

            return response;
        } catch (error) {
            this.logger.error(
                'Failed to send FCM notification',
                error,
            );

            throw error;
        }
    }
}