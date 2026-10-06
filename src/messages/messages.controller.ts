import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import {
    MessagesService,
} from './messages.service';

import {
    CreateMessageDto,
} from './dto/create-message.dto';

import {
    UpdateMessageDto,
} from './dto/update-message.dto';

import {
    JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';


@ApiTags('Messages')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {

    constructor(
        private readonly messagesService:
            MessagesService,
    ) { }


    // ============================================================
    // GET ALL MESSAGES
    // ============================================================

    @Get()
    @ApiOperation({
        summary: 'Get all messages',
    })
    @ApiResponse({
        status: 200,
        description: 'Messages retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findAll() {

        return this.messagesService.findAll();
    }


    // ============================================================
    // GET CONVERSATION
    //
    // GET /messages/conversation/8/2
    // ============================================================

    @Get('conversation/:user1Id/:user2Id')
    @ApiOperation({
        summary: 'Get conversation between two users',
    })
    @ApiResponse({
        status: 200,
        description: 'Conversation retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    getConversation(
        @Param('user1Id', ParseIntPipe)
        user1Id: number,

        @Param('user2Id', ParseIntPipe)
        user2Id: number,
    ) {

        return this.messagesService.getConversation(
            user1Id,
            user2Id,
        );
    }


    // ============================================================
    // GET SENT MESSAGES
    //
    // GET /messages/sender/8
    // ============================================================

    @Get('sender/:senderId')
    @ApiOperation({
        summary: 'Get messages sent by user',
    })
    @ApiResponse({
        status: 200,
        description: 'Sent messages retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findBySenderId(
        @Param('senderId', ParseIntPipe)
        senderId: number,
    ) {

        return this.messagesService.findBySenderId(
            senderId,
        );
    }


    // ============================================================
    // GET RECEIVED MESSAGES
    //
    // GET /messages/receiver/8
    // ============================================================

    @Get('receiver/:receiverId')
    @ApiOperation({
        summary: 'Get messages received by user',
    })
    @ApiResponse({
        status: 200,
        description: 'Received messages retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findByReceiverId(
        @Param('receiverId', ParseIntPipe)
        receiverId: number,
    ) {

        return this.messagesService.findByReceiverId(
            receiverId,
        );
    }


    // ============================================================
    // GET UNREAD MESSAGES
    //
    // GET /messages/unread/8
    // ============================================================

    @Get('unread/:receiverId')
    @ApiOperation({
        summary: 'Get unread messages',
    })
    @ApiResponse({
        status: 200,
        description: 'Unread messages retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    findUnread(
        @Param('receiverId', ParseIntPipe)
        receiverId: number,
    ) {

        return this.messagesService.findUnread(
            receiverId,
        );
    }


    // ============================================================
    // GET UNREAD COUNT
    //
    // GET /messages/unread/count/8
    // ============================================================

    @Get('unread/count/:receiverId')
    @ApiOperation({
        summary: 'Get unread message count',
    })
    @ApiResponse({
        status: 200,
        description: 'Unread message count retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getUnreadCount(
        @Param(
            'receiverId',
            ParseIntPipe,
        )
        receiverId: number,
    ) {

        return this.messagesService.getUnreadCount(
            receiverId,
        );
    }


    // ============================================================
    // GET MESSAGE BY ID
    //
    // GET /messages/1
    // ============================================================

    @Get(':id')
    @ApiOperation({
        summary: 'Get message by ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Message retrieved successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Message not found',
    })
    findOne(
        @Param('id', ParseIntPipe)
        id: number,
    ) {

        return this.messagesService.findOne(id);
    }


    // ============================================================
    // CREATE / SEND MESSAGE
    //
    // POST /messages
    // ============================================================

    @Post()
    @ApiOperation({
        summary: 'Send a message',
    })
    @ApiResponse({
        status: 201,
        description: 'Message sent successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid message data',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    create(
        @Body()
        dto: CreateMessageDto,
    ) {

        return this.messagesService.create(dto);
    }


    // ============================================================
    // MARK CONVERSATION AS READ
    //
    // PATCH /messages/conversation/8/2/read
    //
    // receiver = 8
    // sender   = 2
    // ============================================================

    @Patch('conversation/:receiverId/:senderId/read')
    @ApiOperation({
        summary: 'Mark conversation as read',
    })
    @ApiResponse({
        status: 200,
        description: 'Conversation marked as read',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    markConversationAsRead(
        @Param('receiverId', ParseIntPipe)
        receiverId: number,

        @Param('senderId', ParseIntPipe)
        senderId: number,
    ) {

        return this.messagesService.markConversationAsRead(
            receiverId,
            senderId,
        );
    }


    // ============================================================
    // MARK ONE MESSAGE AS READ
    //
    // PATCH /messages/1/read/8
    // ============================================================

    @Patch(':id/read/:receiverId')
    @ApiOperation({
        summary: 'Mark one message as read',
    })
    @ApiResponse({
        status: 200,
        description: 'Message marked as read',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Message not found',
    })
    async markAsRead(
        @Param('id', ParseIntPipe)
        id: number,

        @Param('receiverId', ParseIntPipe)
        receiverId: number,
    ) {

        return this.messagesService.markAsRead(
            id,
            receiverId,
        );
    }


    // ============================================================
    // UPDATE MESSAGE
    //
    // PATCH /messages/1
    // ============================================================

    @Patch(':id')
    @ApiOperation({
        summary: 'Update message',
    })
    @ApiResponse({
        status: 200,
        description: 'Message updated successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Message not found',
    })
    update(
        @Param('id', ParseIntPipe)
        id: number,

        @Body()
        dto: UpdateMessageDto,
    ) {

        return this.messagesService.update(
            id,
            dto,
        );
    }


    // ============================================================
    // DELETE MESSAGE
    //
    // DELETE /messages/1
    // ============================================================

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete message',
    })
    @ApiResponse({
        status: 200,
        description: 'Message deleted successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Message not found',
    })
    remove(
        @Param('id', ParseIntPipe)
        id: number,
    ) {

        return this.messagesService.remove(id);
    }
}