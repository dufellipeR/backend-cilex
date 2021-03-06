import { inject, injectable } from 'tsyringe';
import Company from '../infra/typeorm/entities/Company';
import ICompanyRepository from '../repositories/ICompanyRepository';

@injectable()
export default class ListCompanyService {
  constructor(
    @inject('CompanyRepository')
    private companyRepository: ICompanyRepository,
  ) {}

  public async execute(
    isMatriz?: boolean,
    matriz_id?: string,
  ): Promise<Company[]> {
    let result;

    if (matriz_id) {
      result = await this.companyRepository.findByMatriz(matriz_id);
    } else {
      result = await this.companyRepository.findAll();
    }

    if (isMatriz) {
      result = await this.companyRepository.findIsMatriz();
    } else {
      result = await this.companyRepository.findAll();
    }

    return result;
  }
}
