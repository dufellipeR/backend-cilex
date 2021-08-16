import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateUserService from '@modules/user/services/CreateUserService';
import ListUsersService from '@modules/user/services/ListUsersService';
import CreateUserPendingService from '@modules/user/services/CreateUserPendingService';

export default class UsersController {
  public async createPendingUser(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { name, email, password, isAdmin, pendingUser_id } = req.body;

    const createUser = container.resolve(CreateUserPendingService);

    const user = await createUser.execute({
      name,
      email,
      password,
      isAdmin,
      pendingUser_id,
    });

    return res.json(classToClass(user));
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password, isAdmin } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
      isAdmin,
    });

    return res.json(classToClass(user));
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const listUser = container.resolve(ListUsersService);

    const users = await listUser.execute();

    return res.json(classToClass(users));
  }
}
