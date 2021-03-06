/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { inject, injectable } from 'tsyringe';
import IProductInvetoryDTO from '../dtos/IProductInvetoryDTO';
// import Product from '../infra/typeorm/entities/Product';
import IEntityRepository from '../repositories/IEntityRepository';
import ITransactionRepository from '../../transaction/repositories/IEntityRepository';

@injectable()
export default class CalculateInventoryService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IEntityRepository,

    @inject('TransactionRepository')
    private transactionRepository: ITransactionRepository,
  ) {}

  public async execute(
    storage_id: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IProductInvetoryDTO[]> {
    const resume: IProductInvetoryDTO[] = [];
    const products = await this.productRepository.findAll();

    for (const _prod of products) {
      let quantity = 0;
      const itemTransactions = await this.transactionRepository.findByProductInRange(
        {
          storage_id,
          product_id: _prod.id,
          startDate: startDate.toDateString(), // How receive date on this format and test transfer transaction
          endDate: endDate.toDateString(),
        },
      );

      itemTransactions.forEach(transaction => {
        // console.log(`produto: ${_prod.description}`);
        // console.log(transaction.product_id);

        if (transaction.type === 'in' && transaction.product_id === _prod.id) {
          quantity += parseInt(transaction.quantity, 10);
        } else if (
          transaction.type === 'out' &&
          transaction.product_id === _prod.id
        ) {
          quantity -= parseInt(transaction.quantity, 10);
        } else if (
          transaction.origin_id === storage_id &&
          transaction.product_id === _prod.id
        ) {
          quantity -= parseInt(transaction.quantity, 10);
        } else if (
          transaction.destination_id === storage_id &&
          transaction.product_id === _prod.id
        ) {
          quantity += parseInt(transaction.quantity, 10);
        }
      });

      resume.push({
        id: _prod.id,
        code: _prod.code,
        description: _prod.description,
        quantity,
      });
    }

    return resume;
  }
}
