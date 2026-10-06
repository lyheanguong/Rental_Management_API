import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
} from "@nestjs/common";

import { TelegramService } from "./telegram.service";

@Controller("telegram")
export class TelegramController {

    constructor(
        private readonly telegramService:
            TelegramService
    ) { }

    // ==========================================
    // GET TELEGRAM CONNECT URL
    //
    // GET /telegram/connect/4
    //
    // Returns:
    // {
    //   "url": "https://t.me/YourBot?start=user_4"
    // }
    // ==========================================

    @Get("connect/:userId")
    getConnectUrl(
        @Param(
            "userId",
            ParseIntPipe
        )
        userId: number
    ) {

        return this.telegramService
            .getConnectUrl(userId);
    }

    // ==========================================
    // GET TELEGRAM CONNECTION STATUS
    //
    // GET /telegram/status/4
    //
    // Used by frontend to check whether
    // Telegram has been connected.
    // ==========================================

    @Get("status/:userId")
    getConnectionStatus(
        @Param(
            "userId",
            ParseIntPipe
        )
        userId: number
    ) {

        return this.telegramService
            .getConnectionStatus(userId);
    }

}