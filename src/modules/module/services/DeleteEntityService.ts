import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IEntityRepository from '../repositories/IEntityRepository';

@injectable()
export default class DeleteEntityService {
  constructor(
    @inject('ModuleRepository')
    private entityRepository: IEntityRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const result = await this.entityRepository.findById(id);

    if (!result) {
      throw new AppError("There's no Module with given ID");
    }

    await this.entityRepository.delete(result);
  }
}
