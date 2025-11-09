import { Injectable, NotFoundException, Logger, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { RequestStatus, RequestType } from './entities/request.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createRequestDto: CreateRequestDto, createdById: string) {
    console.log('🔍 [DEBUG] Iniciando creación de solicitud...');
    try {
       if (!Object.values(RequestType).includes(createRequestDto.type as any)) {
        throw new BadRequestException('Tipo de solicitud inválido');
      }
      // Verificar que el usuario asignado existe
      const assignedUser = await this.prisma.user.findUnique({
        where: { id: createRequestDto.assignedToId },
      });

      if (!assignedUser) {
        throw new NotFoundException('Usuario asignado no encontrado');
      }

      // Verificar que no se está asignando a sí mismo
      if (createdById === createRequestDto.assignedToId) {
        throw new ForbiddenException('No puedes asignar la solicitud a ti mismo');
      }

      const request = await this.prisma.request.create({
        data: {
          ...createRequestDto,  
          createdById,
          status: RequestStatus.PENDING,
        },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true }
          },
          assignedTo: {
            select: { id: true, name: true, email: true }
          },
        },
      });


      this.logger.log(`Request created: ${request.id} by user: ${createdById}`);

      // Notificar al aprobador
      await this.notificationsService.notifyNewRequest(request);

      this.notificationsService.logNotification(
        `New request notification sent for: ${request.id}`,
        { requestId: request.id, assignedTo: request.assignedTo.email }
      );

      return request;
    } catch (error) {
      this.logger.error('Error creating request:', error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.request.findMany({
      include: {
        createdBy: { 
          select: { id: true, name: true, email: true } 
        },
        assignedTo: { 
          select: { id: true, name: true, email: true } 
        },
        history: {
          include: {
            changedBy: { 
              select: { id: true, name: true, email: true } 
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        createdBy: { 
          select: { id: true, name: true, email: true } 
        },
        assignedTo: { 
          select: { id: true, name: true, email: true } 
        },
        history: {
          include: {
            changedBy: { 
              select: { id: true, name: true, email: true } 
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    return request;
  }

  async findByUser(userId: string) {
    return this.prisma.request.findMany({
      where: {
        OR: [
          { createdById: userId },
          { assignedToId: userId },
        ],
      },
      include: {
        createdBy: { 
          select: { id: true, name: true, email: true } 
        },
        assignedTo: { 
          select: { id: true, name: true, email: true } 
        },
        history: {
          include: {
            changedBy: { 
              select: { id: true, name: true, email: true } 
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPendingForApprover(approverId: string) {
    return this.prisma.request.findMany({
      where: {
        assignedToId: approverId,
        status: 'PENDING',
      },
      include: {
        createdBy: { 
          select: { id: true, name: true, email: true } 
        },
        assignedTo: {
        select: { id: true, name: true, email: true }
      },
        history: {
          include: {
            changedBy: { 
              select: { id: true, name: true, email: true } 
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    id: string,
    updateRequestStatusDto: UpdateRequestStatusDto,
    changedById: string,
  ) {
    try {
      const request = await this.prisma.request.findUnique({
        where: { id },
        include: {
          createdBy: true,
          assignedTo: true,
        },
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      // Verificar que el usuario tiene permisos para aprobar/rechazar
      if (request.assignedToId !== changedById) {
        throw new ForbiddenException('No tienes permisos para actualizar esta solicitud');
      }

      // Verificar que la solicitud está pendiente
      if (request.status !== RequestStatus.PENDING) {
        throw new ForbiddenException('Solo se pueden actualizar solicitudes pendientes');
      }

      // Usar transacción para asegurar consistencia
      const updatedRequest = await this.prisma.$transaction(async (tx) => {
        // Crear entrada en el histórico
        await tx.requestHistory.create({
          data: {
            requestId: id,
            status: updateRequestStatusDto.status,
            comments: updateRequestStatusDto.comments,
            changedById,
          },
        });

        // Actualizar estado de la solicitud
        return tx.request.update({
          where: { id },
          data: {
            status: updateRequestStatusDto.status,
          },
          include: {
            createdBy: {
              select: { id: true, name: true, email: true }
            },
            assignedTo: {
              select: { id: true, name: true, email: true }
            },
            history: {
              include: {
                changedBy: { 
                  select: { id: true, name: true, email: true } 
                },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        });
      });

      this.logger.log(`Request status updated: ${id} to ${updateRequestStatusDto.status} by user: ${changedById}`);

      // Notificar al solicitante
      await this.notificationsService.notifyStatusUpdate(updatedRequest);
      this.notificationsService.logNotification(
        `Status update notification sent for: ${id}`,
        { 
          requestId: id, 
          newStatus: updateRequestStatusDto.status,
          notifiedUser: updatedRequest.createdBy.email 
        }
      );

      return updatedRequest;
    } catch (error) {
      this.logger.error('Error updating request status:', error);
      throw error;
    }
  }

  async getRequestStats(userId: string) {
    const [total, pending, approved, rejected] = await Promise.all([
      this.prisma.request.count({
        where: { OR: [{ createdById: userId }, { assignedToId: userId }] }
      }),
      this.prisma.request.count({
        where: { 
          OR: [{ createdById: userId }, { assignedToId: userId }],
          status: RequestStatus.PENDING 
        }
      }),
      this.prisma.request.count({
        where: { 
          OR: [{ createdById: userId }, { assignedToId: userId }],
          status: RequestStatus.APPROVED 
        }
      }),
      this.prisma.request.count({
        where: { 
          OR: [{ createdById: userId }, { assignedToId: userId }],
          status: RequestStatus.REJECTED 
        }
      }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }

  async getUsersForAssignment(currentUserId: string) {
    return this.prisma.user.findMany({
      where: {
        id: {
          not: currentUserId // Excluir al usuario actual
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc'
      }
    });
  }
}