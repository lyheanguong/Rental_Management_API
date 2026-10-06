import { Module } from "@nestjs/common";

import { TelegramController } from "./telegram.controller";
import { TelegramService } from "./telegram.service";

import { UserModule } from "../users/users.module";

@Module({
    imports: [
        UserModule,
    ],

    controllers: [
        TelegramController,
    ],

    providers: [
        TelegramService,
    ],

    exports: [
        TelegramService,
    ],
})
export class TelegramModule { }