import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    InjectRepository,
} from '@nestjs/typeorm';

import {
    Repository,
    Brackets,
} from 'typeorm';

import {
    Message,
} from './entities/message.entity';

import {
    CreateMessageDto,
} from './dto/create-message.dto';

import {
    UpdateMessageDto,
} from './dto/update-message.dto';

@Injectable()
export class MessagesService {

    constructor(
        @InjectRepository(Message)
        private readonly messageRepository:
            Repository<Message>,
    ) { }


    // ============================================================
    // PRIVATE
    // FIND MESSAGE OR FAIL
    // ============================================================

    private async findMessageOrFail(
        id: number,
    ): Promise<Message> {

        const message =
            await this.messageRepository.findOne({
                where: {
                    id,
                },
            });

        if (!message) {
            throw new NotFoundException(
                'Message not found',
            );
        }

        return message;
    }


    // ============================================================
    // GET ALL MESSAGES
    // ============================================================

    async findAll() {

        const messages =
            await this.messageRepository.find({
                order: {
                    created_at: 'ASC',
                },
            });

        return {
            success: true,

            message:
                'Messages retrieved successfully.',

            data: messages,
        };
    }


    // ============================================================
    // GET MESSAGE BY ID
    // ============================================================

    async findOne(
        id: number,
    ) {

        const message =
            await this.findMessageOrFail(id);

        return {
            success: true,

            message:
                'Message retrieved successfully.',

            data: message,
        };
    }


    // ============================================================
    // SEND MESSAGE
    // ============================================================

    async create(
        dto: CreateMessageDto,
    ) {

        const message =
            this.messageRepository.create({
                sender_id: dto.sender_id,
                receiver_id: dto.receiver_id,
                message: dto.message,
                is_read: false,
            });

        const saved =
            await this.messageRepository.save(
                message,
            );

        return {
            success: true,

            message:
                'Message sent successfully.',

            data: saved,
        };
    }


    // ============================================================
    // GET CONVERSATION
    //
    // User A -> User B
    // User B -> User A
    //
    // Example:
    // /messages/conversation/8/2
    // ============================================================

    async getConversation(
        user1Id: number,
        user2Id: number,
    ) {

        const messages =
            await this.messageRepository
                .createQueryBuilder('message')

                .where(
                    new Brackets((qb) => {

                        qb.where(
                            'message.sender_id = :user1Id',
                        )
                            .andWhere(
                                'message.receiver_id = :user2Id',
                            );

                        qb.orWhere(
                            'message.sender_id = :user2Id',
                        )
                            .andWhere(
                                'message.receiver_id = :user1Id',
                            );
                    }),
                )

                .setParameters({
                    user1Id,
                    user2Id,
                })

                .orderBy(
                    'message.created_at',
                    'ASC',
                )

                .getMany();

        return {
            success: true,

            message:
                'Conversation retrieved successfully.',

            data: messages,
        };
    }


    // ============================================================
    // GET SENT MESSAGES
    // ============================================================

    async findBySenderId(
        senderId: number,
    ) {

        const messages =
            await this.messageRepository.find({
                where: {
                    sender_id: senderId,
                },

                order: {
                    created_at: 'DESC',
                },
            });

        return {
            success: true,

            message:
                'Sent messages retrieved successfully.',

            data: messages,
        };
    }


    // ============================================================
    // GET RECEIVED MESSAGES
    // ============================================================

    async findByReceiverId(
        receiverId: number,
    ) {

        const messages =
            await this.messageRepository.find({
                where: {
                    receiver_id: receiverId,
                },

                order: {
                    created_at: 'DESC',
                },
            });

        return {
            success: true,

            message:
                'Received messages retrieved successfully.',

            data: messages,
        };
    }

    // ============================================================
    // GET TOTAL UNREAD MESSAGE COUNT
    // ============================================================

    async getUnreadCount(
        receiverId: number,
    ) {

        const count =
            await this.messageRepository.count({
                where: {
                    receiver_id: receiverId,
                    is_read: false,
                },
            });

        return {
            success: true,

            message:
                'Unread message count retrieved successfully.',

            data: {
                unread_count: count,
            },
        };
    }


    // ============================================================
    // GET UNREAD MESSAGES
    // ============================================================

    async findUnread(
        receiverId: number,
    ) {

        const messages =
            await this.messageRepository.find({
                where: {
                    receiver_id: receiverId,
                    is_read: false,
                },

                order: {
                    created_at: 'ASC',
                },
            });

        return {
            success: true,

            message:
                'Unread messages retrieved successfully.',

            data: messages,
        };
    }


    // ============================================================
    // MARK MESSAGE AS READ
    // ============================================================

    // ============================================================
    // MARK MESSAGE AS READ
    // ============================================================

    async markAsRead(
        id: number,
        receiverId: number,
    ) {

        const message =
            await this.findMessageOrFail(id);

        // Make sure only the receiver can mark it as read
        if (message.receiver_id !== receiverId) {
            throw new NotFoundException(
                'Message does not belong to this receiver.',
            );
        }

        // Only change unread -> read
        if (!message.is_read) {
            message.is_read = true;
        }

        const updated =
            await this.messageRepository.save(
                message,
            );

        return {
            success: true,

            message:
                'Message marked as read.',

            data: updated,
        };
    }


    // ============================================================
    // MARK ALL MESSAGES FROM USER AS READ
    // ============================================================

    async markConversationAsRead(
        receiverId: number,
        senderId: number,
    ) {

        await this.messageRepository
            .createQueryBuilder()
            .update(Message)
            .set({
                is_read: true,
            })
            .where(
                'receiver_id = :receiverId',
            )
            .andWhere(
                'sender_id = :senderId',
            )
            .andWhere(
                'is_read = :isRead',
            )
            .setParameters({
                receiverId,
                senderId,
                isRead: false,
            })
            .execute();

        return {
            success: true,

            message:
                'Conversation messages marked as read.',
        };
    }


    // ============================================================
    // UPDATE MESSAGE
    // ============================================================

    async update(
        id: number,
        dto: UpdateMessageDto,
    ) {

        const message =
            await this.findMessageOrFail(id);

        if (dto.message !== undefined) {
            message.message = dto.message;
        }

        if (dto.is_read !== undefined) {
            message.is_read = dto.is_read;
        }

        const updated =
            await this.messageRepository.save(
                message,
            );

        return {
            success: true,

            message:
                'Message updated successfully.',

            data: updated,
        };
    }


    // ============================================================
    // DELETE MESSAGE
    // ============================================================

    async remove(
        id: number,
    ) {

        const message =
            await this.findMessageOrFail(id);

        await this.messageRepository.remove(
            message,
        );

        return {
            success: true,

            message:
                'Message deleted successfully.',
        };
    }
}