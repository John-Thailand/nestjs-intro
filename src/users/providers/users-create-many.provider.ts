import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];

    // Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    // Connect Query Runner to datasource
    await queryRunner.connect();

    // Start Transaction
    await queryRunner.startTransaction();

    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // If successful commit
      await queryRunner.commitTransaction();
    } catch (error) {
      // If fail rollback
      await queryRunner.rollbackTransaction();
    } finally {
      // Release connection
      await queryRunner.release();
    }

    return newUsers;
  }
}
