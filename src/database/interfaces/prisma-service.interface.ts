import { UserBalanceDto } from '../dto/user.dto';
import { User, Prisma } from '@prisma/client';

export default interface IPrismaService {
  createUser: (currencyRate: UserBalanceDto) => Promise<User>;
  getAllUsers: () => Promise<User[]>;
  deleteAllUsers: () => Promise<Prisma.BatchPayload>;
  updateUserById: (id: number, userInfo: UserBalanceDto) => Promise<User>;
}
