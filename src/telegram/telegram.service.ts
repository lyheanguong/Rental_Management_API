import {
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common';

import TelegramBot from 'node-telegram-bot-api';

import { UserService } from '../users/users.service';

@Injectable()
export class TelegramService
    implements OnModuleInit {

    private readonly logger =
        new Logger(
            TelegramService.name,
        );

    // ==========================================
    // TELEGRAM BOT
    // ==========================================

    private bot?: TelegramBot;

    constructor(
        private readonly usersService:
            UserService,
    ) { }

    // ==========================================
    // START TELEGRAM BOT
    // ==========================================

    onModuleInit(): void {

        const token =
            process.env.TELEGRAM_BOT_TOKEN;

        // ==========================================
        // CHECK TOKEN
        // ==========================================

        if (!token) {

            this.logger.error(
                'TELEGRAM_BOT_TOKEN is not configured.',
            );

            return;
        }

        // ==========================================
        // CREATE BOT
        // ==========================================

        const bot =
            new TelegramBot(
                token,
                {
                    polling: true,
                },
            );

        this.bot = bot;

        this.logger.log(
            'Telegram bot started.',
        );

        // ==========================================
        // POLLING ERROR
        // ==========================================

        bot.on(
            'polling_error',
            (error) => {

                this.logger.error(
                    'Telegram polling error:',
                    error.message,
                );

            },
        );

        // ==========================================
        // /START COMMAND
        //
        // Example:
        //
        // /start user_4
        // /start user_10
        // /start user_25
        //
        // ==========================================

        bot.onText(
            /^\/start(?:\s+(.+))?$/,
            async (
                msg,
                match,
            ) => {

                try {

                    // ==================================
                    // TELEGRAM DATA
                    // ==================================

                    const chatId =
                        msg.chat.id;

                    const telegramId =
                        msg.from?.id;

                    const username =
                        msg.from?.username || '';

                    const firstName =
                        msg.from?.first_name || '';

                    const connectionToken =
                        match?.[1];

                    // ==================================
                    // LOG
                    // ==================================

                    this.logger.log(
                        `Telegram ID: ${telegramId}`,
                    );

                    this.logger.log(
                        `Telegram username: ${username}`,
                    );

                    this.logger.log(
                        `Connection token: ${connectionToken}`,
                    );

                    // ==================================
                    // CHECK TELEGRAM ID
                    // ==================================

                    if (!telegramId) {

                        await bot.sendMessage(
                            chatId,
                            'Unable to detect your Telegram account.',
                        );

                        return;
                    }

                    // ==================================
                    // CHECK CONNECTION TOKEN
                    // ==================================

                    if (!connectionToken) {

                        await bot.sendMessage(
                            chatId,
                            'Invalid RentEasy connection link.',
                        );

                        return;
                    }

                    // ==================================
                    // CHECK TOKEN FORMAT
                    //
                    // user_4
                    // user_10
                    // user_25
                    //
                    // ==================================

                    if (
                        !connectionToken.startsWith(
                            'user_',
                        )
                    ) {

                        await bot.sendMessage(
                            chatId,
                            'Invalid RentEasy connection token.',
                        );

                        return;
                    }

                    // ==================================
                    // GET USER ID
                    // ==================================

                    const userId =
                        Number(
                            connectionToken.replace(
                                'user_',
                                '',
                            ),
                        );

                    // ==================================
                    // VALIDATE USER ID
                    // ==================================

                    if (
                        !Number.isInteger(
                            userId,
                        ) ||
                        userId <= 0
                    ) {

                        await bot.sendMessage(
                            chatId,
                            'Invalid RentEasy user ID.',
                        );

                        return;
                    }

                    // ==================================
                    // FIND RENT EASY USER
                    // ==================================

                    const user =
                        await this.usersService.findOne(
                            userId,
                        );

                    if (!user) {

                        await bot.sendMessage(
                            chatId,
                            'RentEasy user account was not found.',
                        );

                        return;
                    }

                    // ==================================
                    // SAVE TELEGRAM ID
                    // ==================================

                    await this.usersService.updateTelegramId(
                        userId,
                        String(telegramId),
                    );

                    // ==================================
                    // SUCCESS LOG
                    // ==================================

                    this.logger.log(
                        `User ${userId} connected Telegram ID ${telegramId}`,
                    );

                    // ==================================
                    // SUCCESS MESSAGE
                    // ==================================

                    await bot.sendMessage(
                        chatId,

                        `Hello ${firstName}! 👋\n\n` +

                        `Welcome to RentEasy.\n\n` +

                        `Telegram account connected successfully. ✅\n\n` +

                        `Telegram ID: ${telegramId}`,
                    );

                } catch (error) {

                    this.logger.error(
                        'Failed to connect Telegram account',

                        error instanceof Error
                            ? error.stack
                            : String(error),
                    );

                    try {

                        await bot.sendMessage(
                            msg.chat.id,
                            'Sorry, we could not connect your Telegram account. Please try again.',
                        );

                    } catch {

                        // Ignore Telegram send error

                    }
                }
            },
        );
    }

    // ==========================================
    // GET TELEGRAM CONNECT URL
    // ==========================================

    async getConnectUrl(
        userId: number,
    ) {

        // ==========================================
        // CHECK USER
        // ==========================================

        const user =
            await this.usersService.findOne(
                userId,
            );

        if (!user) {

            throw new Error(
                'User not found.',
            );
        }

        // ==========================================
        // BOT USERNAME
        // ==========================================

        const botUsername =
            process.env.TELEGRAM_BOT_USERNAME;

        if (!botUsername) {

            throw new Error(
                'TELEGRAM_BOT_USERNAME is not configured.',
            );
        }

        // ==========================================
        // CONNECTION TOKEN
        // ==========================================

        const connectionToken =
            `user_${userId}`;

        // ==========================================
        // TELEGRAM URL
        // ==========================================

        const url =
            `https://t.me/${botUsername}?start=${connectionToken}`;

        // ==========================================
        // LOG
        // ==========================================

        this.logger.log(
            `Generated Telegram connection URL for user ${userId}`,
        );

        return {

            success: true,

            message:
                'Telegram connection URL generated successfully.',

            url,

        };
    }

    // ==========================================
    // GET CONNECTION STATUS
    // ==========================================

    async getConnectionStatus(
        userId: number,
    ) {

        // ==========================================
        // GET USER
        // ==========================================

        const user =
            await this.usersService.findOne(
                userId,
            );

        // ==========================================
        // USER NOT FOUND
        // ==========================================

        if (!user) {

            return {

                success: false,

                connected: false,

                message:
                    'User not found.',

            };
        }

        // ==========================================
        // GET TELEGRAM ID
        // ==========================================

        const telegramId =
            user.data?.telegram_id ??
            user.data.telegram_id ??
            null;

        // ==========================================
        // CHECK CONNECTION
        // ==========================================

        const connected =
            !!telegramId;

        // ==========================================
        // RESPONSE
        // ==========================================

        return {

            success: true,

            connected,

            telegram_id:
                telegramId,

        };
    }

    // ==========================================
    // SEND PAYMENT CREATED NOTIFICATION
    // ==========================================

    async sendPaymentCreatedNotification(

        telegramId: string,

        payment: {

            invoice_number?:
            string | null;

            amount?:
            number;

            payment_month?:
            Date | string;

            status?:
            string;

            due_date?:
            Date | string | null;

            property_title?:
            string;

            contract_id?:
            number;

            payment_id?:
            number;

            tenant_id?:
            number;

            property_id?:
            number;

            owner_id?:
            number;

            rent_amount?:
            number;

            electric_amount?:
            number;

            water_amount?:
            number;

            management_fee?:
            number;

            parking_fee?:
            number;

            other_charges?:
            number;

            discount?:
            number;

            subtotal?:
            number;

            total_amount?:
            number;

            notes?:
            string | null;

        },

    ): Promise<boolean> {

        // ==========================================
        // CHECK BOT
        // ==========================================

        if (!this.bot) {

            this.logger.warn(
                'Telegram bot is not initialized.',
            );

            return false;
        }

        // ==========================================
        // CHECK TELEGRAM ID
        // ==========================================

        if (!telegramId) {

            this.logger.warn(
                'Telegram ID is missing.',
            );

            return false;
        }

        // ==========================================
        // FORMAT DATE
        // ==========================================

        const formatDate = (
            date?: Date | string | null,
        ): string => {

            if (!date) {

                return '-';
            }

            const d =
                new Date(date);

            if (
                Number.isNaN(
                    d.getTime(),
                )
            ) {

                return '-';
            }

            return d.toLocaleDateString(
                'en-GB',
                {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'Asia/Phnom_Penh',
                },
            );
        };

        // ==========================================
        // FORMAT MONEY
        // ==========================================

        const formatMoney = (
            amount?: number,
        ): string => {

            return Number(
                amount || 0,
            ).toFixed(2);
        };

        // ==========================================
        // MESSAGE
        // ==========================================

        const charges: Array<[string, number]> = [
            ["Rent", Number(payment.rent_amount ?? payment.amount ?? 0)],
            ["Electric", Number(payment.electric_amount ?? 0)],
            ["Water", Number(payment.water_amount ?? 0)],
            ["Management Fee", Number(payment.management_fee ?? 0)],
            ["Parking", Number(payment.parking_fee ?? 0)],
            ["Other Charges", Number(payment.other_charges ?? 0)],
        ];

        const chargeLines = charges
            .filter(([, value]) => value > 0)
            .map(([label, value]) => `▫️ ${label}: *$${formatMoney(value)}*`)
            .join("\n");

        const discountAmount = Number(payment.discount ?? 0);

        const discountLine =
            discountAmount > 0
                ? `➖ Discount: *-$${formatMoney(discountAmount)}*\n`
                : "";

        const message =
            `🧾 *NEW INVOICE CREATED*\n` +
            `───────────────────────\n\n` +

            `*${payment.invoice_number || `PAY-${payment.payment_id}`}*\n` +
            `Payment #${payment.payment_id || "-"}  •  Contract #${payment.contract_id || "-"}\n\n` +

            `🏠 ${payment.property_title || `Property #${payment.property_id || "-"}`}\n` +
            `👤 Tenant #${payment.tenant_id || "-"}   👨‍💼 Owner #${payment.owner_id || "-"}\n\n` +

            `*Charges*\n` +
            `${chargeLines}\n` +
            `${discountLine}` +
            `───────────────────────\n\n` +

            `💵 Subtotal: $${formatMoney(Number(payment.subtotal ?? payment.amount ?? 0))}\n` +
            `💰 *TOTAL: $${formatMoney(Number(payment.total_amount ?? payment.amount ?? 0))}*\n\n` +

            `📅 For: ${formatDate(payment.payment_month)}\n` +
            `⏰ Due: ${formatDate(payment.due_date)}\n` +
            `📌 Status: *${(payment.status || "PENDING").toUpperCase()}*\n\n` +

            `───────────────────────\n` +
            `🏠 [RentEasy Rental Management System](http://localhost:5173/)`;

        try {

            await this.bot.sendMessage(

                telegramId,

                message,

                {
                    parse_mode: 'Markdown',
                },

            );

            this.logger.log(
                `Invoice ${payment.invoice_number} notification sent to Telegram ID ${telegramId}`,
            );

            return true;

        } catch (error) {

            this.logger.error(
                'Failed to send invoice Telegram notification',

                error instanceof Error
                    ? error.stack
                    : String(error),
            );

            return false;
        }
    }
}